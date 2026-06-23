'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const AVATARS = [
  { id: 'av1', emoji: '🤵', name: 'Journalist', bg: 'linear-gradient(135deg, #6366f1, #a855f7)' },
  { id: 'av2', emoji: '🧑‍💻', name: 'Tech Analyst', bg: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
  { id: 'av3', emoji: '🕵️‍♂️', name: 'Investigative Reporter', bg: 'linear-gradient(135deg, #10b981, #059669)' },
  { id: 'av4', emoji: '👩‍🚀', name: 'Global Correspondent', bg: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
  { id: 'av5', emoji: '👩‍🎨', name: 'Media Designer', bg: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  { id: 'av6', emoji: '🦉', name: 'Night Editor', bg: 'linear-gradient(135deg, #64748b, #475569)' }
];

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [otpEmail, setOtpEmail] = useState(null);
  const [otpName, setOtpName] = useState(null);
  
  // Modals state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // OTP Notification banner state
  const [activeNotification, setActiveNotification] = useState(null); // { message, code }

  // Load user session from server-side database on mount
  useEffect(() => {
    setMounted(true);
    const savedEmail = localStorage.getItem('axiom-user-email');
    if (savedEmail) {
      // Fetch user profile and bookmarks from server
      const loadSession = async () => {
        try {
          const profileRes = await fetch(`/api/user/settings?email=${encodeURIComponent(savedEmail)}`);
          const bookmarksRes = await fetch(`/api/user/bookmarks?email=${encodeURIComponent(savedEmail)}`);
          
          if (profileRes.ok && bookmarksRes.ok) {
            const profileData = await profileRes.json();
            const bookmarksData = await bookmarksRes.json();
            
            setUser(profileData.user);
            setBookmarks(bookmarksData.bookmarks || []);
          } else {
            // Clear invalid session
            localStorage.removeItem('axiom-user-email');
          }
        } catch (error) {
          console.error('Error loading server session on mount:', error);
        }
      };
      loadSession();
    }
  }, []);

  // Step 1: Sign Up / Sign In request - triggers server OTP generation & email sending
  const loginRequest = async (email, name = '') => {
    setOtpEmail(email);
    if (name) {
      setOtpName(name);
    }

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });

      if (!res.ok) throw new Error('Failed to generate OTP');
      const data = await res.json();

      if (data.sent) {
        // Real email sent successfully
        setActiveNotification({
          message: `✉️ Verification code sent to ${email}. Check your Gmail inbox!`,
          code: null
        });
      } else {
        // Fallback: display simulated code on screen
        setActiveNotification({
          message: `✉️ Official Axiom News: Your verification code is ${data.code}`,
          code: data.code
        });
      }

      // Auto-clear notification after 15 seconds
      setTimeout(() => {
        setActiveNotification(null);
      }, 15000);

      return true;
    } catch (err) {
      console.error('Error in loginRequest:', err);
      return false;
    }
  };

  // Step 2: Verify OTP code via Server-side authentication
  const verifyOtp = async (code) => {
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, code, name: otpName })
      });

      if (!res.ok) {
        return false;
      }

      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setBookmarks(data.bookmarks || []);
        localStorage.setItem('axiom-user-email', data.user.email);
        
        setOtpEmail(null);
        setOtpName(null);
        setActiveNotification(null);
        setShowAuthModal(false);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error in verifyOtp:', err);
      return false;
    }
  };

  // Log out
  const logout = () => {
    setUser(null);
    setBookmarks([]);
    localStorage.removeItem('axiom-user-email');
    setShowSettingsModal(false);
  };

  // Update user profile/settings
  const updateSettings = async (updates) => {
    if (!user) return;
    try {
      // Merge updates with current settings to prevent partial overwrites
      const payload = {
        email: user.email,
        name: updates.name !== undefined ? updates.name : user.name,
        avatarId: updates.avatarId !== undefined ? updates.avatarId : user.avatarId,
        settings: {
          ...user.settings,
          ...(updates.settings || {})
        }
      };

      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error('Error in updateSettings:', err);
    }
  };

  // Bookmarking functions
  const addBookmark = async (article) => {
    if (!user) return;
    try {
      const res = await fetch('/api/user/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, action: 'add', article })
      });

      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.bookmarks);
      }
    } catch (err) {
      console.error('Error in addBookmark:', err);
    }
  };

  const removeBookmark = async (articleId) => {
    if (!user) return;
    try {
      const res = await fetch('/api/user/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, action: 'remove', articleId })
      });

      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.bookmarks);
      }
    } catch (err) {
      console.error('Error in removeBookmark:', err);
    }
  };

  const isBookmarked = (articleId) => {
    return bookmarks.some(b => b.id === articleId);
  };

  const clearBookmarks = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/user/bookmarks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });

      if (res.ok) {
        setBookmarks([]);
      }
    } catch (err) {
      console.error('Error in clearBookmarks:', err);
    }
  };

  const closeNotification = () => {
    setActiveNotification(null);
  };

  return (
    <UserContext.Provider value={{
      user,
      bookmarks,
      mounted,
      showAuthModal,
      setShowAuthModal,
      showSettingsModal,
      setShowSettingsModal,
      activeNotification,
      closeNotification,
      loginRequest,
      verifyOtp,
      logout,
      updateSettings,
      addBookmark,
      removeBookmark,
      isBookmarked,
      clearBookmarks
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

