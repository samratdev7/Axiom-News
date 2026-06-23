import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_FILE = path.join(process.cwd(), 'src/data/db.json');

export function getGravatarUrl(email) {
  const hash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=120`;
}

function ensureDbExists() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: {}, bookmarks: {}, otps: {} }, null, 2), 'utf-8');
  }
}

export function readDb() {
  ensureDbExists();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON DB, resetting...', error);
    const initial = { users: {}, bookmarks: {}, otps: {} };
    writeDb(initial);
    return initial;
  }
}

export function writeDb(data) {
  ensureDbExists();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// User CRUD
export function getUser(email) {
  const db = readDb();
  return db.users[email.toLowerCase()] || null;
}

export function saveUser(email, name, avatarId, settings, avatarUrl = undefined) {
  const db = readDb();
  const lowerEmail = email.toLowerCase();
  const existingUser = db.users[lowerEmail] || {};
  
  // Resolve profile image URL based on avatar type selected
  let finalAvatarUrl = avatarUrl;
  const targetAvatarId = avatarId || existingUser.avatarId || 'gravatar';
  
  if (targetAvatarId === 'gravatar') {
    finalAvatarUrl = getGravatarUrl(email);
  } else if (targetAvatarId !== 'custom') {
    // If it's a preset emoji avatar (av1 - av6), wipe the custom image URL
    finalAvatarUrl = null;
  } else if (finalAvatarUrl === undefined) {
    // Custom photo URL update fallback
    finalAvatarUrl = existingUser.avatarUrl !== undefined ? existingUser.avatarUrl : getGravatarUrl(email);
  }
  
  db.users[lowerEmail] = {
    email: lowerEmail,
    name: name || existingUser.name || lowerEmail.split('@')[0],
    avatarId: targetAvatarId,
    avatarUrl: finalAvatarUrl,
    settings: {
      ...(existingUser.settings || { defaultCountry: '', defaultFeedMode: 'detailed', notifications: true }),
      ...(settings || {})
    }
  };
  writeDb(db);
  return db.users[lowerEmail];
}


export function deleteUser(email) {
  const db = readDb();
  const lowerEmail = email.toLowerCase();
  delete db.users[lowerEmail];
  delete db.bookmarks[lowerEmail];
  delete db.otps[lowerEmail];
  writeDb(db);
}

// Bookmarks CRUD
export function getUserBookmarks(email) {
  const db = readDb();
  return db.bookmarks[email.toLowerCase()] || [];
}

export function addBookmark(email, article) {
  const db = readDb();
  const lowerEmail = email.toLowerCase();
  if (!db.bookmarks[lowerEmail]) {
    db.bookmarks[lowerEmail] = [];
  }
  
  // Prevent duplicates
  if (!db.bookmarks[lowerEmail].some(b => b.id === article.id)) {
    db.bookmarks[lowerEmail].unshift(article);
    writeDb(db);
  }
  return db.bookmarks[lowerEmail];
}

export function removeBookmark(email, articleId) {
  const db = readDb();
  const lowerEmail = email.toLowerCase();
  if (db.bookmarks[lowerEmail]) {
    db.bookmarks[lowerEmail] = db.bookmarks[lowerEmail].filter(b => b.id !== articleId);
    writeDb(db);
  }
  return db.bookmarks[lowerEmail] || [];
}

export function clearBookmarks(email) {
  const db = readDb();
  const lowerEmail = email.toLowerCase();
  db.bookmarks[lowerEmail] = [];
  writeDb(db);
  return [];
}

// OTP CRUD
export function saveOtp(email, code) {
  const db = readDb();
  const lowerEmail = email.toLowerCase();
  
  // Set expiration to 10 minutes from now
  const expiresAt = Date.now() + 10 * 60 * 1000;
  
  db.otps[lowerEmail] = {
    code,
    expiresAt
  };
  writeDb(db);
}

export function verifyOtp(email, code) {
  const db = readDb();
  const lowerEmail = email.toLowerCase();
  const otpRecord = db.otps[lowerEmail];
  
  if (!otpRecord) return false;
  
  // Check code matching and expiration
  const isMatch = otpRecord.code === code;
  const isExpired = Date.now() > otpRecord.expiresAt;
  
  if (isMatch && !isExpired) {
    // Clear OTP on success
    delete db.otps[lowerEmail];
    writeDb(db);
    return true;
  }
  
  return false;
}
