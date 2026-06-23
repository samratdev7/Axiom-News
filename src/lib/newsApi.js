// News API client
// Uses GNews.io as primary (works in production, 100 req/day free)
// Falls back to country-specific mock data when API is unavailable

import { getCountryByCode } from './countries';

const GNEWS_BASE = 'https://gnews.io/api/v4';

/**
 * Fetch news articles from the API proxy route
 */
export async function fetchNews({ country = '', category = 'top', page = 1, language = 'en' } = {}) {
  const params = new URLSearchParams();
  if (country) params.set('country', country);
  if (category && category !== 'top') params.set('category', category);
  if (language) params.set('lang', language);
  params.set('page', page.toString());

  const res = await fetch(`/api/news?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`News API error: ${res.status}`);
  }
  return res.json();
}

/**
 * Transform GNews API response to our internal format
 */
export function transformGNewsArticle(article, category = 'top') {
  return {
    id: btoa(article.url).slice(0, 20),
    title: article.title || 'Untitled',
    description: article.description || '',
    content: article.content || '',
    imageUrl: article.image || null,
    source: article.source?.name || 'Unknown',
    sourceUrl: article.source?.url || '',
    publishedAt: article.publishedAt || new Date().toISOString(),
    url: article.url || '#',
    category: category,
  };
}

// Placeholder images from picsum for different categories
const categoryImages = {
  world: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=450&fit=crop',
  ],
  politics: [
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=800&h=450&fit=crop',
  ],
  technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop',
  ],
  business: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
  ],
  science: [
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=450&fit=crop',
  ],
  sports: [
    'https://images.unsplash.com/photo-1461896836934-bd45ea8be968?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=450&fit=crop',
  ],
  health: [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&h=450&fit=crop',
  ],
  entertainment: [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=450&fit=crop',
  ],
};

function getImage(category, index) {
  const images = categoryImages[category] || categoryImages.world;
  return images[index % images.length];
}

// Country-specific news headlines
const countryNews = {
  us: [
    { title: 'White House Announces New Infrastructure Investment Plan', source: 'AP News', cat: 'politics', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=450&fit=crop' },
    { title: 'Wall Street Rallies as Tech Stocks Surge to Record Highs', source: 'Bloomberg', cat: 'business', image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=450&fit=crop' },
    { title: 'NASA Confirms New Artemis Mission Timeline for Lunar Return', source: 'NASA', cat: 'science', image: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=800&h=450&fit=crop' },
    { title: 'Supreme Court Issues Landmark Ruling on Digital Privacy Rights', source: 'Reuters', cat: 'politics', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=450&fit=crop' },
    { title: 'Silicon Valley Startups Race to Deploy Next-Gen AI Models', source: 'TechCrunch', cat: 'technology', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=450&fit=crop' },
    { title: 'NFL Season Preview: Teams to Watch in the Upcoming Season', source: 'ESPN', cat: 'sports', image: 'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=800&h=450&fit=crop' },
    { title: 'CDC Updates Guidelines on Respiratory Illness Prevention', source: 'CDC', cat: 'health', image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&h=450&fit=crop' },
    { title: 'Hollywood Studios Announce Slate of Major Film Releases', source: 'Variety', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=450&fit=crop' },
    { title: 'Federal Reserve Signals Policy Shift Amid Economic Growth', source: 'CNBC', cat: 'business', image: 'https://images.unsplash.com/photo-1502920514313-52581002a659?w=800&h=450&fit=crop' },
    { title: 'Major Wildfire Threatens Communities in Western States', source: 'CNN', cat: 'world', image: 'https://images.unsplash.com/photo-1508873696983-2df519f0397e?w=800&h=450&fit=crop' },
  ],
  gb: [
    { title: 'Parliament Debates New Economic Reform Package', source: 'BBC', cat: 'politics', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?w=800&h=450&fit=crop' },
    { title: 'London Stock Exchange Sees Record Trading Volume', source: 'Financial Times', cat: 'business', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop' },
    { title: 'Premier League Transfer Window: Major Signings Confirmed', source: 'Sky Sports', cat: 'sports', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=450&fit=crop' },
    { title: 'NHS Launches Revolutionary Gene Therapy Program', source: 'The Guardian', cat: 'health', image: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800&h=450&fit=crop' },
    { title: 'UK Tech Sector Grows Despite Global Market Uncertainty', source: 'The Telegraph', cat: 'technology', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=450&fit=crop' },
    { title: 'Royal Family Announces New Charitable Foundation', source: 'BBC', cat: 'world', image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&h=450&fit=crop' },
    { title: 'British Scientists Make Breakthrough in Fusion Energy', source: 'Nature', cat: 'science', image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&h=450&fit=crop' },
    { title: 'West End Shows Break Box Office Records This Season', source: 'The Stage', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1503095391757-f1fc01850d74?w=800&h=450&fit=crop' },
    { title: 'UK Housing Market Shows Signs of Recovery', source: 'The Times', cat: 'business', image: 'https://images.unsplash.com/photo-1543872084-c7bd3822856f?w=800&h=450&fit=crop' },
    { title: 'Brexit Trade Agreements Yield Positive Results', source: 'Reuters', cat: 'politics', image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&h=450&fit=crop' },
  ],
  in: [
    { title: 'India Launches Ambitious Space Station Program', source: 'ISRO', cat: 'science', image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&h=450&fit=crop' },
    { title: 'Sensex Crosses Historic Milestone as Markets Rally', source: 'Economic Times', cat: 'business', image: 'https://images.unsplash.com/photo-1598257006458-087169a1f08d?w=800&h=450&fit=crop' },
    { title: 'IPL Final Draws Record Viewership Numbers Worldwide', source: 'Cricbuzz', cat: 'sports', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=450&fit=crop' },
    { title: 'Government Unveils Digital India 3.0 Initiative', source: 'NDTV', cat: 'technology', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop' },
    { title: 'Monsoon Forecast Predicts Normal Rainfall This Season', source: 'IMD', cat: 'world', image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&h=450&fit=crop' },
    { title: 'Parliament Passes Major Healthcare Reform Bill', source: 'The Hindu', cat: 'politics', image: 'https://images.unsplash.com/photo-1588600878108-57c6118d8c6d?w=800&h=450&fit=crop' },
    { title: 'Bollywood Film Breaks Global Box Office Records', source: 'Hindustan Times', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1478720143033-6a972678aa30?w=800&h=450&fit=crop' },
    { title: 'India Becomes World Leader in Renewable Energy Capacity', source: 'Times of India', cat: 'science', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=450&fit=crop' },
    { title: 'AIIMS Develops Novel Treatment for Tropical Diseases', source: 'India Today', cat: 'health', image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=450&fit=crop' },
    { title: 'Startup Ecosystem Attracts Record Foreign Investment', source: 'Mint', cat: 'business', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop' },
  ],
  jp: [
    { title: 'Japan Unveils Next-Generation Bullet Train Technology', source: 'NHK', cat: 'technology', image: 'https://images.unsplash.com/photo-1542640244-7e672d6cef21?w=800&h=450&fit=crop' },
    { title: 'Tokyo Stock Exchange Hits Multi-Decade Highs', source: 'Nikkei', cat: 'business', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&h=450&fit=crop' },
    { title: 'Japan Space Agency Plans First Crewed Moon Mission', source: 'JAXA', cat: 'science', image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&h=450&fit=crop' },
    { title: 'New Anime Season Breaks Streaming Records Globally', source: 'Crunchyroll', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=450&fit=crop' },
    { title: 'Japan National Team Prepares for World Cup Qualifiers', source: 'Japan Times', cat: 'sports', image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800&h=450&fit=crop' },
    { title: 'Prime Minister Addresses Regional Security Concerns', source: 'Kyodo News', cat: 'politics', image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=450&fit=crop' },
    { title: 'Japanese Researchers Pioneer Quantum Computing Advance', source: 'Nature Japan', cat: 'science', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=450&fit=crop' },
    { title: 'Health Ministry Reports Declining Birth Rate Challenges', source: 'NHK', cat: 'health', image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&h=450&fit=crop' },
    { title: 'Major Earthquake Preparedness Drill Held Nationwide', source: 'Reuters', cat: 'world', image: 'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=800&h=450&fit=crop' },
    { title: 'Japanese Automakers Lead Global EV Sales Growth', source: 'Nikkei', cat: 'business', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=450&fit=crop' },
  ],
  de: [
    { title: 'Bundestag Approves Major Climate Protection Legislation', source: 'DW', cat: 'politics', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=450&fit=crop' },
    { title: 'German Manufacturing Sector Shows Strong Recovery Signs', source: 'Reuters', cat: 'business', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=450&fit=crop' },
    { title: 'Bundesliga Season Opens with Dramatic Matches', source: 'Kicker', cat: 'sports', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=450&fit=crop' },
    { title: 'German Scientists Lead European Quantum Research Project', source: 'Der Spiegel', cat: 'science', image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&h=450&fit=crop' },
    { title: 'Berlin Startup Scene Attracts Global Tech Talent', source: 'Handelsblatt', cat: 'technology', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=450&fit=crop' },
    { title: 'Germany Expands Universal Healthcare Coverage', source: 'DW', cat: 'health', image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=450&fit=crop' },
    { title: 'Berlin Film Festival Announces Record Submissions', source: 'Variety', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=450&fit=crop' },
    { title: 'Renewable Energy Powers Record Share of German Grid', source: 'Reuters', cat: 'science', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=450&fit=crop' },
    { title: 'EU Trade Deal Negotiations Enter Final Stage', source: 'FAZ', cat: 'politics', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=450&fit=crop' },
    { title: 'VW Unveils Revolutionary Electric Vehicle Platform', source: 'Auto Motor Sport', cat: 'technology', image: 'https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=800&h=450&fit=crop' },
  ],
  fr: [
    { title: 'Élysée Palace Announces Sweeping Education Reforms', source: 'Le Monde', cat: 'politics', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=450&fit=crop' },
    { title: 'Paris Fashion Week Showcases AI-Designed Collections', source: 'Vogue', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=450&fit=crop' },
    { title: 'French Nuclear Energy Program Sets New Efficiency Records', source: 'Le Figaro', cat: 'science', image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=450&fit=crop' },
    { title: 'Ligue 1 Kicks Off with Surprise Results in Opening Week', source: 'L\'Équipe', cat: 'sports', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=450&fit=crop' },
    { title: 'French Tech Companies Lead European AI Development', source: 'Les Echos', cat: 'technology', image: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=800&h=450&fit=crop' },
    { title: 'France Launches National Mental Health Initiative', source: 'France 24', cat: 'health', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=450&fit=crop' },
    { title: 'Cannes Film Festival Premieres Generate Global Buzz', source: 'AFP', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=450&fit=crop' },
    { title: 'French Wine Industry Adapts to Climate Change', source: 'Reuters', cat: 'business', image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&h=450&fit=crop' },
    { title: 'EU Defense Cooperation Deepens Under French Leadership', source: 'Le Monde', cat: 'politics', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=450&fit=crop' },
    { title: 'Paris Metro Expansion Transforms City Transportation', source: 'France Info', cat: 'world', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=450&fit=crop' },
  ],
};

// Default international news (used when no country is selected)
const internationalNews = [
  { title: 'Global Leaders Convene for Emergency Summit on Climate Crisis', source: 'Reuters', cat: 'world',
    desc: 'World leaders gather in Geneva for an unprecedented emergency summit addressing accelerating climate change impacts. The three-day conference aims to establish binding agreements on carbon emissions reduction.',
    content: 'In what experts are calling the most significant climate gathering since the Paris Agreement, leaders from over 150 nations have arrived in Geneva for emergency discussions on the accelerating climate crisis.', image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&h=450&fit=crop' },
  { title: 'Tech Giants Report Record AI Investment as Industry Transforms', source: 'Bloomberg', cat: 'technology',
    desc: 'Major technology companies announce unprecedented investment in artificial intelligence infrastructure, signaling a fundamental shift in the global tech landscape.',
    content: 'The world\'s largest technology companies have collectively committed over $200 billion to AI research and infrastructure in the latest quarter, marking the highest investment in a single technology sector in history.', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=450&fit=crop' },
  { title: 'Middle East Peace Negotiations Enter Critical Phase', source: 'Al Jazeera', cat: 'politics',
    desc: 'Diplomatic efforts in the Middle East reach a pivotal moment as key stakeholders agree to new framework for negotiations. International mediators express cautious optimism.',
    content: 'After months of behind-the-scenes diplomacy, Middle East peace negotiations have entered what diplomats describe as the most promising phase in years.', image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=450&fit=crop' },
  { title: 'Global Markets Surge on Positive Economic Data', source: 'Financial Times', cat: 'business',
    desc: 'Stock markets worldwide rally as new economic indicators suggest stronger-than-expected growth across major economies.',
    content: 'Global stock markets experienced a broad rally today as economic data from the United States, European Union, and Asian markets exceeded analyst expectations.', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop' },
  { title: 'Breakthrough in Renewable Energy Storage Could Revolutionize Grid', source: 'Nature', cat: 'science',
    desc: 'Scientists announce a major advancement in battery technology that could make renewable energy storage 10x more efficient.',
    content: 'A team of international researchers has unveiled a new battery technology that dramatically improves energy storage efficiency for renewable sources.', image: 'https://images.unsplash.com/photo-1548613053-220efc6202f9?w=800&h=450&fit=crop' },
  { title: 'International Sports Federation Announces Major Rule Changes', source: 'ESPN', cat: 'sports',
    desc: 'The international governing body for athletics announces sweeping rule changes that will reshape competitive sports.',
    content: 'In a landmark decision, the International Athletics Federation has announced comprehensive rule changes affecting competition formats and eligibility criteria.', image: 'https://images.unsplash.com/photo-1461896836934-bd45ea8be968?w=800&h=450&fit=crop' },
  { title: 'WHO Issues New Guidelines on Global Health Preparedness', source: 'WHO', cat: 'health',
    desc: 'The World Health Organization releases updated pandemic preparedness guidelines urging nations to strengthen healthcare infrastructure.',
    content: 'The WHO has released a comprehensive new set of guidelines aimed at improving global readiness for future health emergencies.', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop' },
  { title: 'Award Season Predictions: Critics Weigh In on Frontrunners', source: 'Variety', cat: 'entertainment',
    desc: 'Film critics and industry insiders share predictions for the upcoming awards season.',
    content: 'As the entertainment industry gears up for awards season, critics are making predictions for the year\'s top honors.', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&h=450&fit=crop' },
  { title: 'European Union Proposes Landmark Digital Regulations', source: 'BBC', cat: 'politics',
    desc: 'The EU unveils a comprehensive regulatory framework targeting digital platforms and AI governance.',
    content: 'The European Commission has proposed the most comprehensive digital regulation package in history.', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=450&fit=crop' },
  { title: 'Space Agency Reveals Plans for Lunar Base Construction', source: 'NASA', cat: 'science',
    desc: 'International space agencies announce detailed plans for constructing a permanent lunar base.',
    content: 'NASA, ESA, and JAXA have revealed comprehensive plans for building humanity\'s first permanent base on the Moon.', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop' },
];

const genericCountryNews = [
  { title: 'National Bank Announces New Interest Rate Policy to Combat Inflation', source: 'Finance Daily', cat: 'business', image: 'https://images.unsplash.com/photo-1601597111158-2fceff270190?w=800&h=450&fit=crop' },
  { title: 'Local Tech Startup Reaches Unicorn Status After New Funding Round', source: 'Tech Review', cat: 'technology', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=450&fit=crop' },
  { title: 'Government Unveils Ambitious Infrastructure Plan for Next Decade', source: 'The National Post', cat: 'politics', image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=800&h=450&fit=crop' },
  { title: 'Major Scientific Breakthrough at Leading Research University', source: 'Science Today', cat: 'science', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=450&fit=crop' },
  { title: 'National Team Secures Crucial Victory in Regional Qualifiers', source: 'Sports Network', cat: 'sports', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=450&fit=crop' },
  { title: 'Healthcare System Receives Significant Funding Boost for Modernization', source: 'Health Watch', cat: 'health', image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&h=450&fit=crop' },
  { title: 'Award-Winning Director Announces Next Film Project on Local History', source: 'Entertainment Weekly', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1478720143033-6a972678aa30?w=800&h=450&fit=crop' },
  { title: 'Stock Market Reaches Record High Amid Broad Economic Optimism', source: 'Business Journal', cat: 'business', image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=450&fit=crop' },
  { title: 'New Environmental Protection Laws Passed by Legislature', source: 'Green Earth', cat: 'world', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=450&fit=crop' },
  { title: 'Revolutionary Clean Energy Project Breaks Ground in Rural District', source: 'Energy News', cat: 'technology', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=450&fit=crop' },
  { title: 'Ministry of Education Proposes Sweeping Curriculum Changes', source: 'Daily Standard', cat: 'politics', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=450&fit=crop' },
  { title: 'Local Electric Vehicle Manufacturer Expands Export Operations', source: 'Auto Times', cat: 'business', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=450&fit=crop' },
  { title: 'Archaeological Team Discovers Ancient Settlement Ruins', source: 'Historical Society', cat: 'science', image: 'https://images.unsplash.com/photo-1503177119275-0aa32b31d468?w=800&h=450&fit=crop' },
  { title: 'Major Cyber Security Upgrade Planned for Public Infrastructure', source: 'Tech Daily', cat: 'technology', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop' },
  { title: 'National Athletics Federation Announces New Youth Training Program', source: 'Sports Network', cat: 'sports', image: 'https://images.unsplash.com/photo-1461896836934-bd45ea8be968?w=800&h=450&fit=crop' },
  { title: 'Renowned Chef Opens Innovative Farm-to-Table Restaurant', source: 'Food & Culture', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&h=450&fit=crop' },
  { title: 'Breakthrough Study Reveals New Insights into Regional Ecosystem', source: 'Nature Journal', cat: 'world', image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&h=450&fit=crop' },
  { title: 'Public Transportation Network Expansion Completed Ahead of Schedule', source: 'The National Post', cat: 'politics', image: 'https://images.unsplash.com/photo-1541410965313-d53b3c16ef17?w=800&h=450&fit=crop' },
  { title: 'Surge in Renewable Energy Investments Boosts Local Economy', source: 'Finance Daily', cat: 'business', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=450&fit=crop' },
  { title: 'New Public Health Initiative Targets Preventive Care', source: 'Health Watch', cat: 'health', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=450&fit=crop' },
  { title: 'Telecommunications Giant Launches Nationwide 5G Network', source: 'Tech Review', cat: 'technology', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=450&fit=crop' },
  { title: 'Local Film Festival Breaks Attendance Records This Year', source: 'Entertainment Weekly', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&h=450&fit=crop' },
  { title: 'Space Agency Successfully Launches Climate Monitoring Satellite', source: 'Science Today', cat: 'science', image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=450&fit=crop' },
  { title: 'Rising Star Athlete Signs Record-Breaking Endorsement Deal', source: 'Sports Network', cat: 'sports', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=450&fit=crop' },
  { title: 'Housing Market Shows Signs of Stabilization After Volatile Year', source: 'Business Journal', cat: 'business', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=450&fit=crop' },
  { title: 'Government Increases Funding for Arts and Cultural Programs', source: 'The National Post', cat: 'politics', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=450&fit=crop' },
  { title: 'Researchers Develop Novel Treatment for Prevalent Local Disease', source: 'Health Watch', cat: 'health', image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=450&fit=crop' },
  { title: 'Innovative Waste Management System Deployed in Capital', source: 'Green Earth', cat: 'world', image: 'https://images.unsplash.com/photo-1532996122724-e3d8c5f2b99d?w=800&h=450&fit=crop' },
  { title: 'AI Research Institute Partners with Local Universities', source: 'Tech Daily', cat: 'technology', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=450&fit=crop' },
  { title: 'Historic Cultural Monument Restored and Reopened to Public', source: 'Daily Standard', cat: 'world', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=450&fit=crop' },
];

// Translation databases
const countryNameTranslations = {
  de: { 'Germany': 'Deutschland', 'France': 'Frankreich', 'Japan': 'Japan', 'India': 'Indien', 'Canada': 'Kanada', 'Mexico': 'Mexiko', 'Spain': 'Spanien', 'Italy': 'Italien', 'Brazil': 'Brasilien', 'Russia': 'Russland', 'South Korea': 'Südkorea', 'China': 'China', 'United Kingdom': 'Vereinigtes Königreich', 'United States': 'Vereinigte Staaten' },
  fr: { 'Germany': 'Allemagne', 'France': 'France', 'Japan': 'Japon', 'India': 'Inde', 'Canada': 'Canada', 'Mexico': 'Mexique', 'Spain': 'Espagne', 'Italy': 'Italie', 'Brazil': 'Brésil', 'Russia': 'Russie', 'South Korea': 'Corée du Sud', 'China': 'Chine', 'United Kingdom': 'Royaume-Uni', 'United States': 'États-Unis' },
  es: { 'Germany': 'Alemania', 'France': 'Francia', 'Japan': 'Japón', 'India': 'India', 'Canada': 'Canadá', 'Mexico': 'México', 'Spain': 'España', 'Italy': 'Italia', 'Brazil': 'Brasil', 'Russia': 'Rusia', 'South Korea': 'Corea del Sur', 'China': 'China', 'United Kingdom': 'Reino Unido', 'United States': 'Estados Unidos' },
  ja: { 'Germany': 'ドイツ', 'France': 'フランス', 'Japan': '日本', 'India': 'インド', 'Canada': 'カナダ', 'Mexico': 'メキシコ', 'Spain': 'スペイン', 'Italy': 'イタリア', 'Brazil': 'ブラジル', 'Russia': 'ロシア', 'South Korea': '韓国', 'China': '中国', 'United Kingdom': 'イギリス', 'United States': 'アメリカ合衆国' },
  hi: { 'Germany': 'जर्मनी', 'France': 'फ्रांस', 'Japan': 'जापान', 'India': 'भारत', 'Canada': 'कनाडा', 'Mexico': 'मेक्सिको', 'Spain': 'स्पेन', 'Italy': 'इटली', 'Brazil': 'ब्राजील', 'Russia': 'रूस', 'South Korea': 'दक्षिण कोरिया', 'China': 'चीन', 'United Kingdom': 'यूनाइटेड किंगडम', 'United States': 'संयुक्त राज्य अमेरिका' }
};

const templateTranslations = {
  de: {
    descTemplate: (countryName, cat) => `Lokale Berichterstattung aus ${countryName} bezüglich der neuesten ${cat}-Entwicklungen.`,
    contentTemplate: (countryName, title) => `Live-Berichterstattung aus ${countryName}: ${title}. Diese Geschichte entwickelt sich derzeit weiter und weitere Aktualisierungen folgen, sobald die Behörden weitere Erklärungen abgeben.`
  },
  fr: {
    descTemplate: (countryName, cat) => `Couverture locale de ${countryName} concernant les derniers développements du secteur ${cat}.`,
    contentTemplate: (countryName, title) => `En direct de ${countryName} : ${title}. Cette affaire est en cours et d'autres mises à jour suivront à mesure que les autorités publieront de nouvelles déclarations.`
  },
  es: {
    descTemplate: (countryName, cat) => `Cobertura local de ${countryName} sobre los últimos acontecimientos de ${cat}.`,
    contentTemplate: (countryName, title) => `Reportando en vivo desde ${countryName}: ${title}. Esta historia se está desarrollando actualmente y habrá más actualizaciones a medida que los funcionarios emiten nuevas declaraciones.`
  },
  ja: {
    descTemplate: (countryName, cat) => `${countryName}における最新の${cat}に関する動向をお伝えします。`,
    contentTemplate: (countryName, title) => `${countryName}からの現地生中継：${title}。このニュースは現在も進展中であり、当局から詳細が発表され次第、追ってお知らせします。`
  },
  hi: {
    descTemplate: (countryName, cat) => `${countryName} की नवीनतम ${cat} गतिविधियों के बारे में।`,
    contentTemplate: (countryName, title) => `${countryName} से लाइव रिपोर्ट: ${title}। यह खबर अभी विकसित हो रही है और अधिकारियों द्वारा नए बयान जारी किए जाने के बाद और अपडेट जारी किए जाएंगे।`
  }
};

const translationDict = {
  de: {
    // US
    "White House Announces New Infrastructure Investment Plan": "Weißes Haus kündigt neuen Infrastruktur-Investitionsplan an",
    "Wall Street Rallies as Tech Stocks Surge to Record Highs": "Wall Street erholt sich, da Tech-Aktien auf Rekordhöhen steigen",
    "NASA Confirms New Artemis Mission Timeline for Lunar Return": "NASA bestätigt neuen Artemis-Missionszeitplan für Mondrückkehr",
    "Supreme Court Issues Landmark Ruling on Digital Privacy Rights": "Oberster Gerichtshof erlässt Grundsatzurteil zu digitalen Datenschutzrechten",
    "Silicon Valley Startups Race to Deploy Next-Gen AI Models": "Startups im Silicon Valley wetteifern um den Einsatz von KI-Modellen der nächsten Generation",
    "NFL Season Preview: Teams to Watch in the Upcoming Season": "NFL-Saisonvorschau: Teams, die man in der kommenden Saison im Auge behalten sollte",
    "CDC Updates Guidelines on Respiratory Illness Prevention": "CDC aktualisiert Richtlinien zur Vorbeugung von Atemwegserkrankungen",
    "Hollywood Studios Announce Slate of Major Film Releases": "Hollywood-Studios kündigen eine Reihe großer Filmveröffentlichungen an",
    "Federal Reserve Signals Policy Shift Amid Economic Growth": "Federal Reserve signalisiert Kurswechsel inmitten des Wirtschaftswachstums",
    "Major Wildfire Threatens Communities in Western States": "Großer Waldbrand bedroht Gemeinden in westlichen Bundesstaaten",
    // UK
    "Parliament Debates New Economic Reform Package": "Parlament debattiert über neues Wirtschaftsreformpaket",
    "London Stock Exchange Sees Record Trading Volume": "Londoner Börse verzeichnet Rekordhandelsvolumen",
    "Premier League Transfer Window: Major Signings Confirmed": "Premier League Transferfenster: Große Neuzugänge bestätigt",
    "NHS Launches Revolutionary Gene Therapy Program": "NHS startet revolutionäres Gentherapieprogramm",
    "UK Tech Sector Grows Despite Global Market Uncertainty": "Britischer Tech-Sektor wächst trotz globaler Marktunsicherheit",
    "Royal Family Announces New Charitable Foundation": "Königliche Familie kündigt neue Wohltätigkeitsstiftung an",
    "British Scientists Make Breakthrough in Fusion Energy": "Britische Wissenschaftler erzielen Durchbruch bei Fusionsenergie",
    "West End Shows Break Box Office Records This Season": "West-End-Shows brechen in dieser Saison Kassenrekorde",
    "UK Housing Market Shows Signs of Recovery": "Britischer Wohnungsmarkt zeigt Anzeichen einer Erholung",
    "Brexit Trade Agreements Yield Positive Results": "Brexit-Handelsabkommen bringen positive Ergebnisse",
    // India
    "India Launches Ambitious Space Station Program": "Indien startet ehrgeiziges Raumstationsprogramm",
    "Sensex Crosses Historic Milestone as Markets Rally": "Sensex überschreitet historischen Meilenstein bei Markterholung",
    "IPL Final Draws Record Viewership Numbers Worldwide": "IPL-Finale zieht weltweit Rekord-Zuschauerzahlen an",
    "Government Unveils Digital India 3.0 Initiative": "Regierung stellt Initiative Digital India 3.0 vor",
    "Monsoon Forecast Predicts Normal Rainfall This Season": "Monsunprognose sagt normale Regenfälle für diese Saison voraus",
    "Parliament Passes Major Healthcare Reform Bill": "Parlament verabschiedet wichtiges Gesetz zur Gesundheitsreform",
    "Bollywood Film Breaks Global Box Office Records": "Bollywood-Film bricht globale Kassenrekorde",
    "India Becomes World Leader in Renewable Energy Capacity": "Indien wird weltweit führend bei der Kapazität für erneuerbare Energien",
    "AIIMS Develops Novel Treatment for Tropical Diseases": "AIIMS entwickelt neuartige Behandlung für Tropenkrankheiten",
    "Startup Ecosystem Attracts Record Foreign Investment": "Startup-Ökosystem zieht Rekord-Auslandsinvestitionen an",
    // Japan
    "Japan Unveils Next-Generation Bullet Train Technology": "Japan stellt Shinkansen-Technologie der nächsten Generation vor",
    "Tokyo Stock Exchange Hits Multi-Decade Highs": "Tokioer Börse erreicht Mehrjahreshoch",
    "Japan Space Agency Plans First Crewed Moon Mission": "Japanische Weltraumbehörde plant erste bemannte Mondmission",
    "New Anime Season Breaks Streaming Records Globally": "Neue Anime-Saison bricht weltweit Streaming-Rekorde",
    "Japan National Team Prepares for World Cup Qualifiers": "Japanische Nationalmannschaft bereitet sich auf WM-Qualifikation vor",
    "Prime Minister Addresses Regional Security Concerns": "Premierminister spricht regionale Sicherheitsbedenken an",
    "Japanese Researchers Pioneer Quantum Computing Advance": "Japanische Forscher leisten Pionierarbeit bei der Quantencomputer-Entwicklung",
    "Health Ministry Reports Declining Birth Rate Challenges": "Gesundheitsministerium berichtet über Herausforderungen durch sinkende Geburtenrate",
    "Major Earthquake Preparedness Drill Held Nationwide": "Landesweit große Erdbeben-Vorsorgeübung durchgeführt",
    "Japanese Automakers Lead Global EV Sales Growth": "Japanische Automobilhersteller führen weltweites EV-Absatzwachstum an",
    // Germany
    "Bundestag Approves Major Climate Protection Legislation": "Bundestag beschließt wichtiges Klimaschutzgesetz",
    "German Manufacturing Sector Shows Strong Recovery Signs": "Deutsche Industrie zeigt starke Anzeichen einer Erholung",
    "Bundesliga Season Opens with Dramatic Matches": "Bundesliga-Saison startet mit dramatischen Spielen",
    "German Scientists Lead European Quantum Research Project": "Deutsche Wissenschaftler leiten europäisches Quantenforschungsprojekt",
    "Berlin Startup Scene Attracts Global Tech Talent": "Berliner Startup-Szene zieht globale Tech-Talente an",
    "Germany Expands Universal Healthcare Coverage": "Deutschland erweitert allgemeine Krankenversicherung",
    "Berlin Film Festival Announces Record Submissions": "Berlinale vermeldet Rekordeinreichungen",
    "Renewable Energy Powers Record Share of German Grid": "Erneuerbare Energien decken Rekordanteil des deutschen Stromnetzes",
    "EU Trade Deal Negotiations Enter Final Stage": "Verhandlungen über EU-Handelsabkommen gehen in die Endphase",
    "VW Unveils Revolutionary Electric Vehicle Platform": "VW stellt revolutionäre Plattform für Elektrofahrzeuge vor",
    // France
    "Élysée Palace Announces Sweeping Education Reforms": "Élysée-Palast kündigt weitreichende Bildungsreformen an",
    "Paris Fashion Week Showcases AI-Designed Collections": "Pariser Modewoche präsentiert KI-entworfenen Kollektionen",
    "French Nuclear Energy Program Sets New Efficiency Records": "Französisches Kernenergieprogramm stellt neue Effizienzrekorde auf",
    "Ligue 1 Kicks Off with Surprise Results in Opening Week": "Ligue 1 startet mit Überraschungsergebnissen in der Eröffnungswoche",
    "French Tech Companies Lead European AI Development": "Französische Tech-Unternehmen führend in europäischer KI-Entwicklung",
    "France Launches National Mental Health Initiative": "Frankreich startet nationale Initiative für psychische Gesundheit",
    "Cannes Film Festival Premieres Generate Global Buzz": "Premieren des Filmfestivals von Cannes erzeugen weltweites Aufsehen",
    "French Wine Industry Adapts to Climate Change": "Französische Weinindustrie passt sich dem Klimawandel an",
    "EU Defense Cooperation Deepens Under French Leadership": "Europäische Verteidigungskooperation vertieft sich unter französischer Führung",
    "Paris Metro Expansion Transforms City Transportation": "Ausbau der Pariser Metro verändert den städtischen Verkehr",
    // Generic
    "National Bank Announces New Interest Rate Policy to Combat Inflation": "Nationalbank kündigt neue Zinspolitik zur Bekämpfung der Inflation an",
    "Local Tech Startup Reaches Unicorn Status After New Funding Round": "Lokales Tech-Startup erreicht nach neuer Finanzierungsrunde Einhorn-Status",
    "Government Unveils Ambitious Infrastructure Plan for Next Decade": "Regierung stellt ehrgeizigen Infrastrukturplan für das nächste Jahrzehnt vor",
    "Major Scientific Breakthrough at Leading Research University": "Bedeutender wissenschaftlicher Durchbruch an führender Forschungsuniversität",
    "National Team Secures Crucial Victory in Regional Qualifiers": "Nationalmannschaft sichert sich entscheidenden Sieg in der regionalen Qualifikation",
    "Healthcare System Receives Significant Funding Boost for Modernization": "Gesundheitssystem erhält erheblichen Finanzierungsschub für die Modernisierung",
    "Award-Winning Director Announces Next Film Project on Local History": "Preisgekrönter Regisseur kündigt nächstes Filmprojekt zur lokalen Geschichte an",
    "Stock Market Reaches Record High Amid Broad Economic Optimism": "Aktienmarkt erreicht Rekordhoch inmitten breiten wirtschaftlichen Optimismus",
    "New Environmental Protection Laws Passed by Legislature": "Neue Umweltschutzgesetze vom Gesetzgeber verabschiedet",
    "Revolutionary Clean Energy Project Breaks Ground in Rural District": "Spatenstich für revolutionäres Projekt für saubere Energie im ländlichen Bezirk",
    "Ministry of Education Proposes Sweeping Curriculum Changes": "Bildungsministerium schlägt weitreichende Lehrplanänderungen vor",
    "Local Electric Vehicle Manufacturer Expands Export Operations": "Lokaler Elektrofahrzehwursteller baut Exportgeschäft aus",
    "Archaeological Team Discovers Ancient Settlement Ruins": "Archäologenteam entdeckt Ruinen einer antiken Siedlung",
    "Major Cyber Security Upgrade Planned for Public Infrastructure": "Großes Cybersicherheits-Upgrade für öffentliche Infrastruktur geplant",
    "National Athletics Federation Announces New Youth Training Program": "Nationaler Leichtathletikverband kündigt neues Jugendtrainingsprogramm an",
    "Renowned Chef Opens Innovative Farm-to-Table Restaurant": "Renommierter Küchenchef eröffnet innovatives Restaurant mit Konzept 'Vom Hof auf den Tisch'",
    "Breakthrough Study Reveals New Insights into Regional Ecosystem": "Wegweisende Studie liefert neue Erkenntnisse über regionales Ökosystem",
    "Public Transportation Network Expansion Completed Ahead of Schedule": "Ausbau des öffentlichen Nahverkehrsnetzes vorzeitig abgeschlossen",
    "Surge in Renewable Energy Investments Boosts Local Economy": "Anstieg der Investitionen in erneuerbare Energien kurbelt lokale Wirtschaft an",
    "New Public Health Initiative Targets Preventive Care": "Neue Initiative des öffentlichen Gesundheitswesens zielt auf Vorsorge ab",
    "Telecommunications Giant Launches Nationwide 5G Network": "Telekommunikationsriese startet landesweites 5G-Netz",
    "Local Film Festival Breaks Attendance Records This Year": "Lokales Filmfestival bricht in diesem Jahr Besucherrekorde",
    "Space Agency Successfully Launches Climate Monitoring Satellite": "Weltraumbehörde startet erfolgreich Klimabeobachtungssatelliten",
    "Rising Star Athlete Signs Record-Breaking Endorsement Deal": "Aufstrebender Sportler unterzeichnet rekordverdächtigen Werbevertrag",
    "Housing Market Shows Signs of Stabilization After Volatile Year": "Wohnungsmarkt zeigt nach turbulentem Jahr Anzeichen einer Stabilisierung",
    "Government Increases Funding for Arts and Cultural Programs": "Regierung erhöht Mittel für Kunst- und Kulturprogramme",
    "Researchers Develop Novel Treatment for Prevalent Local Disease": "Forscher entwickeln neuartige Behandlung für weit verbreitete lokale Krankheit",
    "Innovative Waste Management System Deployed in Capital": "Innovatives Abfallentsorgungssystem in der Hauptstadt im Einsatz",
    "AI Research Institute Partners with Local Universities": "Forschungsinstitut für KI kooperiert mit lokalen Universitäten",
    "Historic Cultural Monument Restored and Reopened to Public": "Historisches Kulturdenkmal restauriert und wieder für die Öffentlichkeit geöffnet",
    // International
    "Global Leaders Convene for Emergency Summit on Climate Crisis": "Weltpolitiker kommen zu Krisengipfel wegen Klimakrise zusammen",
    "Tech Giants Report Record AI Investment as Industry Transforms": "Tech-Riesen melden Rekordinvestitionen in KI angesichts des Branchenwandels",
    "Middle East Peace Negotiations Enter Critical Phase": "Friedensverhandlungen im Nahen Osten treten in eine kritische Phase ein",
    "Global Markets Surge on Positive Economic Data": "Globale Märkte legen aufgrund positiver Wirtschaftsdaten zu",
    "Breakthrough in Renewable Energy Storage Could Revolutionize Grid": "Durchbruch bei der Speicherung erneuerbarer Energien könnte das Stromnetz revolutionieren",
    "International Sports Federation Announces Major Rule Changes": "Internationaler Sportverband kündigt wichtige Regeländerungen an",
    "WHO Issues New Guidelines on Global Health Preparedness": "WHO veröffentlicht neue Richtlinien zur globalen Gesundheitsvorsorge",
    "Award Season Predictions: Critics Weigh In on Frontrunners": "Prognosen zur Preisverleihungssaison: Kritiker äußern sich zu den Favoriten",
    "European Union Proposes Landmark Digital Regulations": "Europäische Union schlägt wegweisende digitale Vorschriften vor",
    "Space Agency Reveals Plans for Lunar Base Construction": "Weltraumbehörde enthüllt Pläne für den Bau einer Mondbasis"
  },
  fr: {
    // US
    "White House Announces New Infrastructure Investment Plan": "La Maison Blanche annonce un nouveau plan d'investissement dans les infrastructures",
    "Wall Street Rallies as Tech Stocks Surge to Record Highs": "Wall Street se redresse alors que les valeurs technologiques atteignent des sommets historiques",
    "NASA Confirms New Artemis Mission Timeline for Lunar Return": "La NASA confirme le nouveau calendrier de la mission Artemis pour le retour sur la Lune",
    "Supreme Court Issues Landmark Ruling on Digital Privacy Rights": "La Cour suprême rend une décision historique sur les droits à la confidentialité numérique",
    "Silicon Valley Startups Race to Deploy Next-Gen AI Models": "Les startups de la Silicon Valley font la course pour déployer des modèles d'IA de nouvelle génération",
    "NFL Season Preview: Teams to Watch in the Upcoming Season": "Aperçu de la saison NFL : les équipes à suivre pour la saison à venir",
    "CDC Updates Guidelines on Respiratory Illness Prevention": "Le CDC met à jour ses directives sur la prévention des maladies respiratoires",
    "Hollywood Studios Announce Slate of Major Film Releases": "Les studios d'Hollywood annoncent une série de sorties de films majeurs",
    "Federal Reserve Signals Policy Shift Amid Economic Growth": "La Réserve fédérale signale un changement de politique face à la croissance économique",
    "Major Wildfire Threatens Communities in Western States": "Un incendie de forêt majeur menace les communautés des États de l'Ouest",
    // UK
    "Parliament Debates New Economic Reform Package": "Le Parlement débat d'un nouveau projet de réformes économiques",
    "London Stock Exchange Sees Record Trading Volume": "La Bourse de Londres enregistre un volume de transactions record",
    "Premier League Transfer Window: Major Signings Confirmed": "Mercato de la Premier League : transferts majeurs confirmés",
    "NHS Launches Revolutionary Gene Therapy Program": "Le NHS lance un programme révolutionnaire de thérapie génique",
    "UK Tech Sector Grows Despite Global Market Uncertainty": "Le secteur technologique britannique croît malgré l'incertitude du marché mondial",
    "Royal Family Announces New Charitable Foundation": "La famille royale annonce une nouvelle fondation caritative",
    "British Scientists Make Breakthrough in Fusion Energy": "Des scientifiques britanniques réalisent une percée dans l'énergie de fusion",
    "West End Shows Break Box Office Records This Season": "Les spectacles du West End battent des records de billetterie cette saison",
    "UK Housing Market Shows Signs of Recovery": "Le marché immobilier britannique montre des signes de reprise",
    "Brexit Trade Agreements Yield Positive Results": "Les accords commerciaux du Brexit donnent des résultats positifs",
    // India
    "India Launches Ambitious Space Station Program": "L'Inde lance un programme ambitieux de station spatiale",
    "Sensex Crosses Historic Milestone as Markets Rally": "Le Sensex franchit un cap historique alors que les marchés se redressent",
    "IPL Final Draws Record Viewership Numbers Worldwide": "La finale de l'IPL attire des records d'audience dans le monde entier",
    "Government Unveils Digital India 3.0 Initiative": "Le gouvernement dévoile l'initiative Digital India 3.0",
    "Monsoon Forecast Predicts Normal Rainfall This Season": "Les prévisions de mousson annoncent des précipitations normales cette saison",
    "Parliament Passes Major Healthcare Reform Bill": "Le Parlement adopte un projet de réforme majeur de la santé",
    "Bollywood Film Breaks Global Box Office Records": "Un film de Bollywood bat des records de box-office mondial",
    "India Becomes World Leader in Renewable Energy Capacity": "L'Inde devient le leader mondial des capacités en énergies renouvelables",
    "AIIMS Develops Novel Treatment for Tropical Diseases": "L'AIIMS développe un nouveau traitement contre les maladies tropicales",
    "Startup Ecosystem Attracts Record Foreign Investment": "L'écosystème des startups attire des investissements étrangers records",
    // Japan
    "Japan Unveils Next-Generation Bullet Train Technology": "Le Japon dévoile une technologie de train à grande vitesse de nouvelle génération",
    "Tokyo Stock Exchange Hits Multi-Decade Highs": "La Bourse de Tokyo atteint des sommets inégalés depuis plusieurs décennies",
    "Japan Space Agency Plans First Crewed Moon Mission": "L'Agence spatiale japonaise planifie sa première mission lunaire habitée",
    "New Anime Season Breaks Streaming Records Globally": "La nouvelle saison d'animés bat des records de diffusion mondiaux",
    "Japan National Team Prepares for World Cup Qualifiers": "La sélection japonaise se prépare pour les éliminatoires de la Coupe du Monde",
    "Prime Minister Addresses Regional Security Concerns": "Le Premier ministre aborde les préoccupations de sécurité régionale",
    "Japanese Researchers Pioneer Quantum Computing Advance": "Des chercheurs japonais ouvrent la voie dans le calcul quantique",
    "Health Ministry Reports Declining Birth Rate Challenges": "Le ministère de la Santé signale des défis face à la baisse de la natalité",
    "Major Earthquake Preparedness Drill Held Nationwide": "Un grand exercice de préparation aux séismes organisé à l'échelle nationale",
    "Japanese Automakers Lead Global EV Sales Growth": "Les constructeurs automobiles japonais en tête de la croissance mondiale des VE",
    // Germany
    "Bundestag Approves Major Climate Protection Legislation": "Le Bundestag approuve une législation majeure sur la protection du climat",
    "German Manufacturing Sector Shows Strong Recovery Signs": "Le secteur manufacturier allemand montre de solides signes de reprise",
    "Bundesliga Season Opens with Dramatic Matches": "La saison de Bundesliga s'ouvre sur des matches dramatiques",
    "German Scientists Lead European Quantum Research Project": "Des scientifiques allemands dirigent un projet européen de recherche quantique",
    "Berlin Startup Scene Attracts Global Tech Talent": "La scène des startups de Berlin attire des talents technologiques mondiaux",
    "Germany Expands Universal Healthcare Coverage": "L'Allemagne étend sa couverture universelle de soins de santé",
    "Berlin Film Festival Announces Record Submissions": "La Berlinale annonce un record de soumissions",
    "Renewable Energy Powers Record Share of German Grid": "Les énergies renouvelables alimentent une part record du réseau allemand",
    "EU Trade Deal Negotiations Enter Final Stage": "Les négociations de l'accord commercial de l'UE entrent dans leur phase finale",
    "VW Unveils Revolutionary Electric Vehicle Platform": "VW dévoile une plateforme de véhicule électrique révolutionnaire",
    // France
    "Élysée Palace Announces Sweeping Education Reforms": "L'Élysée annonce de vastes réformes de l'éducation",
    "Paris Fashion Week Showcases AI-Designed Collections": "La Fashion Week de Paris présente des collections conçues par l'IA",
    "French Nuclear Energy Program Sets New Efficiency Records": "Le programme nucléaire français établit de nouveaux records d'efficacité",
    "Ligue 1 Kicks Off with Surprise Results in Opening Week": "La Ligue 1 débute avec des résultats surprises lors de la première semaine",
    "French Tech Companies Lead European AI Development": "Les entreprises technologiques françaises en tête du développement de l'IA en Europe",
    "France Launches National Mental Health Initiative": "La France lance une initiative nationale sur la santé mentale",
    "Cannes Film Festival Premieres Generate Global Buzz": "Les premières du Festival de Cannes suscitent un engouement mondial",
    "French Wine Industry Adapts to Climate Change": "L'industrie viticole française s'adapte au changement climatique",
    "EU Defense Cooperation Deepens Under French Leadership": "La coopération européenne en matière de défense s'intensifie sous la direction de la France",
    "Paris Metro Expansion Transforms City Transportation": "L'extension du métro parisien transforme les transports urbains",
    // Generic
    "National Bank Announces New Interest Rate Policy to Combat Inflation": "La Banque Nationale annonce une nouvelle politique de taux d'intérêt pour lutter contre l'inflation",
    "Local Tech Startup Reaches Unicorn Status After New Funding Round": "Une startup tech locale atteint le statut de licorne après une nouvelle levée de fonds",
    "Government Unveils Ambitious Infrastructure Plan for Next Decade": "Le gouvernement dévoile un plan d'infrastructure ambitieux pour la prochaine décennie",
    "Major Scientific Breakthrough at Leading Research University": "Une percée scientifique majeure dans une université de recherche de premier plan",
    "National Team Secures Crucial Victory in Regional Qualifiers": "L'équipe nationale décroche une victoire cruciale lors des éliminatoires régionaux",
    "Healthcare System Receives Significant Funding Boost for Modernization": "Le système de santé bénéficie d'une injection de fonds importante pour sa modernisation",
    "Award-Winning Director Announces Next Film Project on Local History": "Le réalisateur primé annonce son prochain projet de film sur l'histoire locale",
    "Stock Market Reaches Record High Amid Broad Economic Optimism": "La bourse atteint un record historique dans un climat d'optimisme économique généralisé",
    "New Environmental Protection Laws Passed by Legislature": "De nouvelles lois de protection de l'environnement adoptées par la législature",
    "Revolutionary Clean Energy Project Breaks Ground in Rural District": "Lancement d'un projet d'énergie propre révolutionnaire dans un district rural",
    "Ministry of Education Proposes Sweeping Curriculum Changes": "Le ministère de l'Éducation propose de profonds changements de programmes",
    "Local Electric Vehicle Manufacturer Expands Export Operations": "Le fabricant local de véhicules électriques étend ses opérations d'exportation",
    "Archaeological Team Discovers Ancient Settlement Ruins": "Une équipe archéologique découvre les ruines d'une ancienne colonie",
    "Major Cyber Security Upgrade Planned for Public Infrastructure": "Mise à niveau majeure de la cybersécurité planifiée pour les infrastructures publiques",
    "National Athletics Federation Announces New Youth Training Program": "La Fédération nationale d'athlétisme annonce un nouveau programme d'entraînement pour les jeunes",
    "Renowned Chef Opens Innovative Farm-to-Table Restaurant": "Un chef de renom ouvre un restaurant innovant de la ferme à la table",
    "Breakthrough Study Reveals New Insights into Regional Ecosystem": "Une étude révolutionnaire révèle de nouvelles perspectives sur l'écosystème régional",
    "Public Transportation Network Expansion Completed Ahead of Schedule": "L'expansion du réseau de transport public achevée avant la date prévue",
    "Surge in Renewable Energy Investments Boosts Local Economy": "L'essor des investissements dans les énergies renouvelables stimule l'économie locale",
    "New Public Health Initiative Targets Preventive Care": "La nouvelle initiative de santé publique cible les soins préventifs",
    "Telecommunications Giant Launches Nationwide 5G Network": "Le géant des télécommunications déploie un réseau 5G à l'échelle nationale",
    "Local Film Festival Breaks Attendance Records This Year": "Le festival de cinéma local bat des records de fréquentation cette année",
    "Space Agency Successfully Launches Climate Monitoring Satellite": "L'agence spatiale lance avec succès un satellite de surveillance du climat",
    "Rising Star Athlete Signs Record-Breaking Endorsement Deal": "Un athlète en vue signe un contrat de sponsoring record",
    "Housing Market Shows Signs of Stabilization After Volatile Year": "Le marché immobilier montre des signes de stabilisation après une année volatile",
    "Government Increases Funding for Arts and Cultural Programs": "Le gouvernement augmente le financement des programmes artistiques et culturels",
    "Researchers Develop Novel Treatment for Prevalent Local Disease": "Des chercheurs développent un nouveau traitement pour une maladie locale répandue",
    "Innovative Waste Management System Deployed in Capital": "Déploiement d'un système innovant de gestion des déchets dans la capitale",
    "AI Research Institute Partners with Local Universities": "L'institut de recherche en IA s'associe à des universités locales",
    "Historic Cultural Monument Restored and Reopened to Public": "Monument culturel historique restauré et rouvert au public",
    // International
    "Global Leaders Convene for Emergency Summit on Climate Crisis": "Les dirigeants mondiaux se réunissent en sommet d'urgence sur la crise climatique",
    "Tech Giants Report Record AI Investment as Industry Transforms": "Les géants de la technologie annoncent des investissements records dans l'IA",
    "Middle East Peace Negotiations Enter Critical Phase": "Les négociations de paix au Moyen-Orient entrent dans une phase critique",
    "Global Markets Surge on Positive Economic Data": "Les marchés mondiaux progressent grâce à des données économiques positives",
    "Breakthrough in Renewable Energy Storage Could Revolutionize Grid": "Une percée dans le stockage des énergies renouvelables pourrait révolutionner le réseau",
    "International Sports Federation Announces Major Rule Changes": "La fédération sportive internationale annonce des changements de règles majeurs",
    "WHO Issues New Guidelines on Global Health Preparedness": "L'OMS publie de nouvelles directives sur la préparation sanitaire mondiale",
    "Award Season Predictions: Critics Weigh In on Frontrunners": "Prévisions de la saison des prix : les critiques se prononcent sur les favoris",
    "European Union Proposes Landmark Digital Regulations": "L'Union européenne propose des réglementations numériques historiques",
    "Space Agency Reveals Plans for Lunar Base Construction": "L'agence spatiale révèle des plans pour la construction d'une base lunaire"
  },
  es: {
    // US
    "White House Announces New Infrastructure Investment Plan": "La Casa Blanca anuncia un nuevo plan de inversión en infraestructura",
    "Wall Street Rallies as Tech Stocks Surge to Record Highs": "Wall Street se recupera mientras las acciones tecnológicas suben a máximos históricos",
    "NASA Confirms New Artemis Mission Timeline for Lunar Return": "La NASA confirma el nuevo cronograma de la misión Artemis para el regreso a la Luna",
    "Supreme Court Issues Landmark Ruling on Digital Privacy Rights": "El Tribunal Supremo emite un fallo histórico sobre los derechos de privacidad digital",
    "Silicon Valley Startups Race to Deploy Next-Gen AI Models": "Las empresas emergentes de Silicon Valley compiten por implementar modelos de IA de próxima generación",
    "NFL Season Preview: Teams to Watch in the Upcoming Season": "Avance de la temporada de la NFL: equipos a seguir en la próxima temporada",
    "CDC Updates Guidelines on Respiratory Illness Prevention": "El CDC actualiza las pautas para la prevención de enfermedades respiratorias",
    "Hollywood Studios Announce Slate of Major Film Releases": "Los estudios de Hollywood anuncian una serie de lanzamientos cinematográficos importantes",
    "Federal Reserve Signals Policy Shift Amid Economic Growth": "La Reserva Federal señala un cambio de política en medio del crecimiento económico",
    "Major Wildfire Threatens Communities in Western States": "Un gran incendio forestal amenaza comunidades en los estados occidentales",
    // UK
    "Parliament Debates New Economic Reform Package": "El Parlamento debate un nuevo paquete de reformas económicas",
    "London Stock Exchange Sees Record Trading Volume": "La Bolsa de Londres registra un volumen récord de transacciones",
    "Premier League Transfer Window: Major Signings Confirmed": "Mercato de fichajes de la Premier League: fichajes importantes confirmados",
    "NHS Launches Revolutionary Gene Therapy Program": "El NHS lanza un revolucionario programa de terapia génica",
    "UK Tech Sector Grows Despite Global Market Uncertainty": "El sector tecnológico del Reino Unido crece a pesar de la incertidumbre del mercado global",
    "Royal Family Announces New Charitable Foundation": "La Familia Real anuncia una nueva fundación benéfica",
    "British Scientists Make Breakthrough in Fusion Energy": "Científicos británicos logran un gran avance en energía de fusión",
    "West End Shows Break Box Office Records This Season": "Los espectáculos del West End baten récords de taquilla esta temporada",
    "UK Housing Market Shows Signs of Recovery": "El mercado de la vivienda en el Reino Unido muestra signos de recuperación",
    "Brexit Trade Agreements Yield Positive Results": "Los acuerdos comerciales del Brexit dan resultados positivos",
    // India
    "India Launches Ambitious Space Station Program": "La India lanza un ambicioso programa para su estación espacial",
    "Sensex Crosses Historic Milestone as Markets Rally": "El Sensex supera un hito histórico tras la recuperación de los mercados",
    "IPL Final Draws Record Viewership Numbers Worldwide": "La final de la IPL atrae cifras récord de audiencia en todo el mundo",
    "Government Unveils Digital India 3.0 Initiative": "El Gobierno presenta la iniciativa Digital India 3.0",
    "Monsoon Forecast Predicts Normal Rainfall This Season": "El pronóstico del monzón predice lluvias normales para esta temporada",
    "Parliament Passes Major Healthcare Reform Bill": "El Parlamento aprueba un proyecto de ley de reforma de la salud de gran alcance",
    "Bollywood Film Breaks Global Box Office Records": "Película de Bollywood bate récords de taquilla mundial",
    "India Becomes World Leader in Renewable Energy Capacity": "La India se convierte en líder mundial en capacidad de energía renovable",
    "AIIMS Develops Novel Treatment for Tropical Diseases": "El AIIMS desarrolla un nuevo tratamiento para enfermedades tropicales",
    "Startup Ecosystem Attracts Record Foreign Investment": "El ecosistema de startups atrae inversiones extranjeras récord",
    // Japan
    "Japan Unveils Next-Generation Bullet Train Technology": "Japón presenta la tecnología de tren bala de próxima generación",
    "Tokyo Stock Exchange Hits Multi-Decade Highs": "La Bolsa de Tokio alcanza máximos de varias décadas",
    "Japan Space Agency Plans First Crewed Moon Mission": "La Agencia Espacial de Japón planea la primera misión tripulada a la Luna",
    "New Anime Season Breaks Streaming Records Globally": "La nueva temporada de anime bate récords de transmisión en todo el mundo",
    "Japan National Team Prepares for World Cup Qualifiers": "La selección nacional de Japón se prepara para las eliminatorias del Mundial",
    "Prime Minister Addresses Regional Security Concerns": "El primer ministro aborda las preocupaciones de seguridad regional",
    "Japanese Researchers Pioneer Quantum Computing Advance": "Investigadores japoneses lideran avances en computación cuántica",
    "Health Ministry Reports Declining Birth Rate Challenges": "El Ministerio de Salud informa de los desafíos por la baja tasa de natalidad",
    "Major Earthquake Preparedness Drill Held Nationwide": "Se realiza un gran simulacro de preparación ante terremotos en todo el país",
    "Japanese Automakers Lead Global EV Sales Growth": "Los fabricantes de automóviles de Japón lideran el crecimiento de ventas de vehículos eléctricos",
    // Germany
    "Bundestag Approves Major Climate Protection Legislation": "El Bundestag aprueba una legislación clave para la protección del clima",
    "German Manufacturing Sector Shows Strong Recovery Signs": "El sector manufacturero alemán muestra sólidos signos de recuperación",
    "Bundesliga Season Opens with Dramatic Matches": "La temporada de la Bundesliga comienza con partidos dramáticos",
    "German Scientists Lead European Quantum Research Project": "Científicos alemanes lideran el proyecto europeo de investigación cuántica",
    "Berlin Startup Scene Attracts Global Tech Talent": "La escena de startups de Berlín atrae talento tecnológico global",
    "Germany Expands Universal Healthcare Coverage": "Alemania amplía la cobertura de salud universal",
    "Berlin Film Festival Announces Record Submissions": "La Berlinale anuncia un número récord de inscripciones",
    "Renewable Energy Powers Record Share of German Grid": "Las energías renovables cubren una cuota récord de la red alemana",
    "EU Trade Deal Negotiations Enter Final Stage": "Las negociaciones del acuerdo comercial de la UE entran en su fase final",
    "VW Unveils Revolutionary Electric Vehicle Platform": "VW presenta una revolucionaria plataforma para vehículos eléctricos",
    // France
    "Élysée Palace Announces Sweeping Education Reforms": "El Palacio del Elíseo anuncia reformas educativas integrales",
    "Paris Fashion Week Showcases AI-Designed Collections": "La Semana de la Moda de París presenta colecciones diseñadas por IA",
    "French Nuclear Energy Program Sets New Efficiency Records": "El programa de energía nuclear de Francia establece nuevos récords de eficiencia",
    "Ligue 1 Kicks Off with Surprise Results in Opening Week": "La Ligue 1 arranca con resultados sorpresa en la semana inaugural",
    "French Tech Companies Lead European AI Development": "Las empresas tecnológicas francesas lideran el desarrollo de la IA en Europa",
    "France Launches National Mental Health Initiative": "Francia lanza una iniciativa nacional de salud mental",
    "Cannes Film Festival Premieres Generate Global Buzz": "Los estrenos del Festival de Cannes generan gran expectativa mundial",
    "French Wine Industry Adapts to Climate Change": "La industria del vino de Francia se adapta al cambio climático",
    "EU Defense Cooperation Deepens Under French Leadership": "La cooperación en defensa de la UE se profundiza bajo el liderazgo de Francia",
    "Paris Metro Expansion Transforms City Transportation": "La expansión del metro de París transforma el transporte urbano",
    // Generic
    "National Bank Announces New Interest Rate Policy to Combat Inflation": "El Banco Nacional anuncia una nueva política de tipos de interés para combatir la inflación",
    "Local Tech Startup Reaches Unicorn Status After New Funding Round": "Una startup tecnológica local alcanza el estado de unicornio tras una nueva ronda de financiación",
    "Government Unveils Ambitious Infrastructure Plan for Next Decade": "El gobierno presenta un ambicioso plan de infraestructura para la próxima década",
    "Major Scientific Breakthrough at Leading Research University": "Gran avance científico en una universidad de investigación líder",
    "National Team Secures Crucial Victory in Regional Qualifiers": "La selección nacional consigue una victoria crucial en la clasificación regional",
    "Healthcare System Receives Significant Funding Boost for Modernization": "El sistema de salud recibe un importante impulso de financiación para la modernización",
    "Award-Winning Director Announces Next Film Project on Local History": "Director galardonado anuncia su próximo proyecto cinematográfico sobre historia local",
    "Stock Market Reaches Record High Amid Broad Economic Optimism": "La bolsa alcanza un máximo histórico en medio de un optimismo económico generalizado",
    "New Environmental Protection Laws Passed by Legislature": "La legislatura aprueba nuevas leyes de protección ambiental",
    "Revolutionary Clean Energy Project Breaks Ground in Rural District": "Proyecto revolucionario de energía limpia comienza en un distrito rural",
    "Ministry of Education Proposes Sweeping Curriculum Changes": "El Ministerio de Educación propone cambios curriculares radicales",
    "Local Electric Vehicle Manufacturer Expands Export Operations": "Fabricante local de vehículos eléctricos expande sus operaciones de exportación",
    "Archaeological Team Discovers Ancient Settlement Ruins": "Equipo arqueológico descubre ruinas de un asentamiento antiguo",
    "Major Cyber Security Upgrade Planned for Public Infrastructure": "Se planifica una gran actualización de ciberseguridad para la infraestructura pública",
    "National Athletics Federation Announces New Youth Training Program": "Federación Nacional de Atletismo anuncia un nuevo programa de entrenamiento juvenil",
    "Renowned Chef Opens Innovative Farm-to-Table Restaurant": "Renombrado chef abre un innovador restaurante de la granja a la mesa",
    "Breakthrough Study Reveals New Insights into Regional Ecosystem": "Estudio innovador revela nuevas perspectivas sobre el ecosistema regional",
    "Public Transportation Network Expansion Completed Ahead of Schedule": "Ampliación de la red de transporte público finalizada antes de lo previsto",
    "Surge in Renewable Energy Investments Boosts Local Economy": "El aumento de las inversiones en energías renovables impulsa la economía del país",
    "New Public Health Initiative Targets Preventive Care": "Nueva iniciativa de salud pública se centra en la atención preventiva",
    "Telecommunications Giant Launches Nationwide 5G Network": "Gigante de las telecomunicaciones lanza una red 5G nacional",
    "Local Film Festival Breaks Attendance Records This Year": "El festival de cine local rompe récords de asistencia este año",
    "Space Agency Successfully Launches Climate Monitoring Satellite": "La agencia espacial lanza con éxito un satélite de monitoreo climático",
    "Rising Star Athlete Signs Record-Breaking Endorsement Deal": "Atleta estrella firma un contrato de patrocinio sin precedentes",
    "Housing Market Shows Signs of Stabilization After Volatile Year": "El mercado inmobiliario muestra signos de estabilización tras un año volátil",
    "Government Increases Funding for Arts and Cultural Programs": "El gobierno aumenta los fondos para programas artísticos y culturales",
    "Researchers Develop Novel Treatment for Prevalent Local Disease": "Investigadores desarrollan un nuevo tratamiento para una enfermedad local prevalente",
    "Innovative Waste Management System Deployed in Capital": "Sistema innovador de gestión de residuos desplegado en la capital",
    "AI Research Institute Partners with Local Universities": "El instituto de investigación de IA se asocia con universidades locales",
    "Historic Cultural Monument Restored and Reopened to Public": "Monumento histórico cultural restaurado y reabierto al público",
    // International
    "Global Leaders Convene for Emergency Summit on Climate Crisis": "Líderes mundiales se reúnen en cumbre de emergencia sobre la crisis climática",
    "Tech Giants Report Record AI Investment as Industry Transforms": "Gigantes tecnológicos reportan inversiones récord en IA",
    "Middle East Peace Negotiations Enter Critical Phase": "Las negociaciones de paz en Oriente Medio entran en una fase crítica",
    "Global Markets Surge on Positive Economic Data": "Los mercados globales suben gracias a datos económicos positivos",
    "Breakthrough in Renewable Energy Storage Could Revolutionize Grid": "Avance en almacenamiento de energía renovable podría revolucionar la red",
    "International Sports Federation Announces Major Rule Changes": "Federación deportiva internacional anuncia cambios de reglas importantes",
    "WHO Issues New Guidelines on Global Health Preparedness": "La OMS emite nuevas directrices sobre preparación para la salud mundial",
    "Award Season Predictions: Critics Weigh In on Frontrunners": "Predicciones de la temporada de premios: críticos opinan sobre los favoritos",
    "European Union Proposes Landmark Digital Regulations": "La Unión Europea propone regulaciones digitales históricas",
    "Space Agency Reveals Plans for Lunar Base Construction": "Agencia espacial revela planes para la construcción de una base lunar"
  },
  ja: {
    // US
    "White House Announces New Infrastructure Investment Plan": "ホワイトハウスが新たなインフラ投資計画を発表",
    "Wall Street Rallies as Tech Stocks Surge to Record Highs": "ハイテク株の急騰でウォール街が反発、史上最高値を記録",
    "NASA Confirms New Artemis Mission Timeline for Lunar Return": "NASAが月面帰還に向けた新たなアルテミス計画のタイムラインを確認",
    "Supreme Court Issues Landmark Ruling on Digital Privacy Rights": "最高裁判所がデジタルプライバシーの権利に関する画期的な判決を下す",
    "Silicon Valley Startups Race to Deploy Next-Gen AI Models": "シリコンバレーのスタートアップが次世代AIモデルの展開を競う",
    "NFL Season Preview: Teams to Watch in the Upcoming Season": "NFLシーズンプレビュー：今シーズン注目のチーム",
    "CDC Updates Guidelines on Respiratory Illness Prevention": "CDCが呼吸器疾患予防に関するガイドラインを更新",
    "Hollywood Studios Announce Slate of Major Film Releases": "ハリウッドの映画スタジオが主要映画の公開計画を発表",
    "Federal Reserve Signals Policy Shift Amid Economic Growth": "連邦準備制度が経済成長のなかでの政策転換を示唆",
    "Major Wildfire Threatens Communities in Western States": "大規模な山火事が西部の州のコミュニティを脅かす",
    // UK
    "Parliament Debates New Economic Reform Package": "議会で新たな経済改革法案の審議が始まる",
    "London Stock Exchange Sees Record Trading Volume": "ロンドン証券取引所が記録的な取引量を記録",
    "Premier League Transfer Window: Major Signings Confirmed": "プレミアリーグ移籍市場：主要な契約が合意に達する",
    "NHS Launches Revolutionary Gene Therapy Program": "NHSが画期的な遺伝子治療プログラムを開始",
    "UK Tech Sector Grows Despite Global Market Uncertainty": "世界市場の不確実性のなかでも英国のテック部門が成長",
    "Royal Family Announces New Charitable Foundation": "王室が新たなチャリティ財団の設立を発表",
    "British Scientists Make Breakthrough in Fusion Energy": "英国 of 科学者が核融合エネルギーで画期的なブレイクスルーを達成",
    "West End Shows Break Box Office Records This Season": "今シーズンのウエストエンドの公演が興行収入記録を更新",
    "UK Housing Market Shows Signs of Recovery": "英国の住宅市場に回復の兆し",
    "Brexit Trade Agreements Yield Positive Results": "ブレグジット後の貿易協定が前向きな成果をもたらす",
    // India
    "India Launches Ambitious Space Station Program": "インドが野心的な宇宙ステーション計画を開始",
    "Sensex Crosses Historic Milestone as Markets Rally": "市場の反発のなか、センセックス指数が歴史的な節目を突破",
    "IPL Final Draws Record Viewership Numbers Worldwide": "IPL決勝が世界中で過去最高の視聴者数を記録",
    "Government Unveils Digital India 3.0 Initiative": "政府が「デジタル・インディア 3.0」イニシアチブを発表",
    "Monsoon Forecast Predicts Normal Rainfall This Season": "モンスーン予報により今シーズンは平年並みの降雨量を予測",
    "Parliament Passes Major Healthcare Reform Bill": "議会が主要な医療改革法案を可決",
    "Bollywood Film Breaks Global Box Office Records": "ボリウッド映画が世界興行収入記録を更新",
    "India Becomes World Leader in Renewable Energy Capacity": "インドが再生可能エネルギー設備容量で世界トップレベルに",
    "AIIMS Develops Novel Treatment for Tropical Diseases": "AIIMSが熱帯病に対する新規治療法を開発",
    "Startup Ecosystem Attracts Record Foreign Investment": "スタートアップのエコシステムが記録的な対内直接投資を引きつける",
    // Japan
    "Japan Unveils Next-Generation Bullet Train Technology": "日本が次世代新幹線技術を公開",
    "Tokyo Stock Exchange Hits Multi-Decade Highs": "東京証券取引所が数十年の最高値を更新",
    "Japan Space Agency Plans First Crewed Moon Mission": "宇宙航空研究開発機構（JAXA）が初の有人月面着陸ミッションを計画",
    "New Anime Season Breaks Streaming Records Globally": "新作アニメシーズンが世界中の配信記録を更新",
    "Japan National Team Prepares for World Cup Qualifiers": "日本代表がワールドカップ予選に向けて準備",
    "Prime Minister Addresses Regional Security Concerns": "首相が地域の安全保障懸念に対処",
    "Japanese Researchers Pioneer Quantum Computing Advance": "日本の研究者が量子コンピューティングの進展を先導",
    "Health Ministry Reports Declining Birth Rate Challenges": "厚生労働省が少子化の課題を報告",
    "Major Earthquake Preparedness Drill Held Nationwide": "全国で大規模な地震防災訓練が実施される",
    "Japanese Automakers Lead Global EV Sales Growth": "日本の自動車メーカーが世界のEV販売成長を牽引",
    // Germany
    "Bundestag Approves Major Climate Protection Legislation": "連邦議会が主要な気候保護法案を承認",
    "German Manufacturing Sector Shows Strong Recovery Signs": "ドイツの製造業部門に強い回復の兆し",
    "Bundesliga Season Opens with Dramatic Matches": "ブンデスリーガが開幕、劇的な試合でスタート",
    "German Scientists Lead European Quantum Research Project": "ドイツの科学者が欧州量子研究プロジェクトを率いる",
    "Berlin Startup Scene Attracts Global Tech Talent": "ベルリンのスタートアップ界が世界のテック人材を魅了",
    "Germany Expands Universal Healthcare Coverage": "ドイツが国民皆保険の適用範囲を拡大",
    "Berlin Film Festival Announces Record Submissions": "ベルリン国際映画祭が出品数の過去最高を記録と発表",
    "Renewable Energy Powers Record Share of German Grid": "再生可能エネルギーがドイツの電力網で過去最大の割合を占める",
    "EU Trade Deal Negotiations Enter Final Stage": "EUの貿易協定交渉が最終段階へ突入",
    "VW Unveils Revolutionary Electric Vehicle Platform": "VWが画期的なEV用プラットフォームを発表",
    // France
    "Élysée Palace Announces Sweeping Education Reforms": "エリゼ宮が全面的な教育改革を発表",
    "Paris Fashion Week Showcases AI-Designed Collections": "パリ・ファッションウィークでAIデザインによるコレクションが発表される",
    "French Nuclear Energy Program Sets New Efficiency Records": "フランスの原子力エネルギープログラムが効率の新たな記録を立証",
    "Ligue 1 Kicks Off with Surprise Results in Opening Week": "リーグ・アンが開幕、第1節からサプライズ結果に",
    "French Tech Companies Lead European AI Development": "フランスのテック企業が欧州のAI開発をリード",
    "France Launches National Mental Health Initiative": "フランスがメンタルヘルスに関する全国的な取り組みを開始",
    "Cannes Film Festival Premieres Generate Global Buzz": "カンヌ国際映画祭のプレミア作品が世界的な話題を呼ぶ",
    "French Wine Industry Adapts to Climate Change": "フランスのワイン産業が気候変動に適応する動き",
    "EU Defense Cooperation Deepens Under French Leadership": "フランスの主導でEUの防衛協力が深化",
    "Paris Metro Expansion Transforms City Transportation": "パリのメトロ拡張計画が都市交通を一新",
    // Generic
    "National Bank Announces New Interest Rate Policy to Combat Inflation": "中央銀行がインフレ抑制に向けた新たな金利政策を発表",
    "Local Tech Startup Reaches Unicorn Status After New Funding Round": "地元テック企業が新たな資金調達を経てユニコーン企業に",
    "Government Unveils Ambitious Infrastructure Plan for Next Decade": "政府が今後10年間の野心的なインフラ計画を発表",
    "Major Scientific Breakthrough at Leading Research University": "主要研究大学で重大な科学的ブレイクスルーを達成",
    "National Team Secures Crucial Victory in Regional Qualifiers": "代表チームが地域予選で重要な勝利を収める",
    "Healthcare System Receives Significant Funding Boost for Modernization": "医療システムが近代化に向けて多額の資金援助を受ける",
    "Award-Winning Director Announces Next Film Project on Local History": "受賞歴のある監督が郷土史をテーマにした次作映画を発表",
    "Stock Market Reaches Record High Amid Broad Economic Optimism": "経済の楽観視が広がるなか株価が過去最高値を記録",
    "New Environmental Protection Laws Passed by Legislature": "議会で新たな環境保護法が可決される",
    "Revolutionary Clean Energy Project Breaks Ground in Rural District": "地方で画期的なクリーンエネルギー事業の起工式",
    "Ministry of Education Proposes Sweeping Curriculum Changes": "教育省が教育課程の全面的な変更を提案",
    "Local Electric Vehicle Manufacturer Expands Export Operations": "地元の電気自動車メーカーが輸出事業を拡大",
    "Archaeological Team Discovers Ancient Settlement Ruins": "考古学チームが古代の集落遺跡を発見",
    "Major Cyber Security Upgrade Planned for Public Infrastructure": "公共インフラで大規模なサイバーセキュリティ向上を計画",
    "National Athletics Federation Announces New Youth Training Program": "陸上連盟が新たなユース育成プログラムを発表",
    "Renowned Chef Opens Innovative Farm-to-Table Restaurant": "有名シェフが革新的な「農場から食卓へ」レストランをオープン",
    "Breakthrough Study Reveals New Insights into Regional Ecosystem": "地域エコシステムに関する新たな知見を示す画期的な研究発表",
    "Public Transportation Network Expansion Completed Ahead of Schedule": "公共交通網の拡張計画が予定より前倒しで完了",
    "Surge in Renewable Energy Investments Boosts Local Economy": "再生可能エネルギー投資の急増により地元経済が活性化",
    "New Public Health Initiative Targets Preventive Care": "新たな公衆衛生計画が予防医療に焦点を当てる",
    "Telecommunications Giant Launches Nationwide 5G Network": "通信大手が全国的な5Gネットワークの展開を開始",
    "Local Film Festival Breaks Attendance Records This Year": "今年の地元映画祭で観客動員数の最高記録を更新",
    "Space Agency Successfully Launches Climate Monitoring Satellite": "宇宙機関が気候観測衛星の打ち上げに成功",
    "Rising Star Athlete Signs Record-Breaking Endorsement Deal": "注目の新星アスリートが史上最高額のスポンサー契約を結ぶ",
    "Housing Market Shows Signs of Stabilization After Volatile Year": "乱高下の1年を経て住宅市場に安定化の兆し",
    "Government Increases Funding for Arts and Cultural Programs": "政府が芸術・文化プログラムへの予算を増額",
    "Researchers Develop Novel Treatment for Prevalent Local Disease": "研究チームが地域に蔓延する疾患の新規治療法を開発",
    "Innovative Waste Management System Deployed in Capital": "首都で革新的な廃棄物管理システムが稼働開始",
    "AI Research Institute Partners with Local Universities": "AI研究所が地元の大学と提携関係を構築",
    "Historic Cultural Monument Restored and Reopened to Public": "歴史的文化財が修復を終えて一般公開を再開",
    // International
    "Global Leaders Convene for Emergency Summit on Climate Crisis": "世界の指導者が気候危機に関する緊急サミットに招集",
    "Tech Giants Report Record AI Investment as Industry Transforms": "業界の変革に伴いテック大手が過去最高のAI投資を発表",
    "Middle East Peace Negotiations Enter Critical Phase": "中東和平交渉が極めて重要な局面へ突入",
    "Global Markets Surge on Positive Economic Data": "前向きな経済データを受けて世界市場が急騰",
    "Breakthrough in Renewable Energy Storage Could Revolutionize Grid": "再生可能エネルギー貯蔵の画期的進歩が電力網に変革をもたらす可能性",
    "International Sports Federation Announces Major Rule Changes": "国際スポーツ連盟が主要なルール変更を発表",
    "WHO Issues New Guidelines on Global Health Preparedness": "WHOが世界規模の健康への備えに関する新ガイドラインを策定",
    "Award Season Predictions: Critics Weigh In on Frontrunners": "アワードシーズンの予測：批評家が有力候補を分析",
    "European Union Proposes Landmark Digital Regulations": "欧州連合が画期的なデジタル規制案を提出",
    "Space Agency Reveals Plans for Lunar Base Construction": "宇宙機関が月面基地建設の詳細計画を公開"
  },
  hi: {
    // US
    "White House Announces New Infrastructure Investment Plan": "व्हाइट हाउस ने नई बुनियादी ढांचा निवेश योजना की घोषणा की",
    "Wall Street Rallies as Tech Stocks Surge to Record Highs": "तकनीकी शेयरों में उछाल से वॉल स्ट्रीट में तेजी, रिकॉर्ड ऊंचाई को छुआ",
    "NASA Confirms New Artemis Mission Timeline for Lunar Return": "नासा ने चंद्रमा पर वापसी के लिए नए आर्टेमिस मिशन समयरेखा की पुष्टि की",
    "Supreme Court Issues Landmark Ruling on Digital Privacy Rights": "सुप्रीम कोर्ट ने डिजिटल गोपनीयता अधिकारों पर ऐतिहासिक फैसला सुनाया",
    "Silicon Valley Startups Race to Deploy Next-Gen AI Models": "सिलिकॉन वैली के स्टार्टअप्स अगली पीढ़ी के एआई मॉडल तैनात करने की रेस में",
    "NFL Season Preview: Teams to Watch in the Upcoming Season": "एनएफएल सीजन पूर्वावलोकन: आगामी सत्र में नजर रखने वाली टीमें",
    "CDC Updates Guidelines on Respiratory Illness Prevention": "सीडीसी ने श्वसन संबंधी बीमारियों की रोकथाम पर दिशानिर्देश अपडेट किए",
    "Hollywood Studios Announce Slate of Major Film Releases": "हॉलीवुड स्टूडियो ने प्रमुख फिल्मों की रिलीज की सूची घोषित की",
    "Federal Reserve Signals Policy Shift Amid Economic Growth": "आर्थिक विकास के बीच फेडरल रिजर्व ने नीति में बदलाव के संकेत दिए",
    "Major Wildfire Threatens Communities in Western States": "पश्चिमी राज्यों में भीषण जंगल की आग से समुदायों पर खतरा",
    // UK
    "Parliament Debates New Economic Reform Package": "संसद में नए आर्थिक सुधार पैकेज पर बहस शुरू",
    "London Stock Exchange Sees Record Trading Volume": "लंदन स्टॉक एक्सचेंज में रिकॉर्ड कारोबारी मात्रा दर्ज",
    "Premier League Transfer Window: Major Signings Confirmed": "प्रीमियर लीग ट्रांसफर विंडो: बड़े अनुबंधों की पुष्टि",
    "NHS Launches Revolutionary Gene Therapy Program": "एनएचएस ने क्रांतिकारी जीन थेरेपी कार्यक्रम शुरू किया",
    "UK Tech Sector Grows Despite Global Market Uncertainty": "वैश्विक बाजार में अनिश्चितता के बावजूद ब्रिटेन का टेक क्षेत्र बढ़ा",
    "Royal Family Announces New Charitable Foundation": "शाही परिवार ने नए धर्मार्थ फाउंडेशन की घोषणा की",
    "British Scientists Make Breakthrough in Fusion Energy": "ब्रिटिश वैज्ञानिकों ने संलयन ऊर्जा में बड़ी सफलता हासिल की",
    "West End Shows Break Box Office Records This Season": "वेस्ट एंड शो ने इस सीजन में बॉक्स ऑफिस के रिकॉर्ड तोड़े",
    "UK Housing Market Shows Signs of Recovery": "ब्रिटेन के आवास बाजार में सुधार के संकेत दिखे",
    "Brexit Trade Agreements Yield Positive Results": "ब्रेक्सिट व्यापार समझौते सकारात्मक परिणाम दे रहे हैं",
    // India
    "India Launches Ambitious Space Station Program": "भारत ने महत्वाकांक्षी अंतरिक्ष स्टेशन कार्यक्रम शुरू किया",
    "Sensex Crosses Historic Milestone as Markets Rally": "बाजार में तेजी के साथ सेंसेक्स ऐतिहासिक मील के पत्थर पर पहुंचा",
    "IPL Final Draws Record Viewership Numbers Worldwide": "आईपीएल फाइनल ने दुनिया भर में दर्शकों के रिकॉर्ड तोड़े",
    "Government Unveils Digital India 3.0 Initiative": "सरकार ने डिजिटल इंडिया 3.0 पहल का अनावरण किया",
    "Monsoon Forecast Predicts Normal Rainfall This Season": "मानसून का अनुमान: इस सीजन में सामान्य बारिश की संभावना",
    "Parliament Passes Major Healthcare Reform Bill": "संसद ने प्रमुख स्वास्थ्य सेवा सुधार विधेयक पारित किया",
    "Bollywood Film Breaks Global Box Office Records": "बॉलीवुड फिल्म ने दुनिया भर में बॉक्स ऑफिस के रिकॉर्ड तोड़े",
    "India Becomes World Leader in Renewable Energy Capacity": "अक्षय ऊर्जा क्षमता में भारत दुनिया का अग्रणी देश बना",
    "AIIMS Develops Novel Treatment for Tropical Diseases": "एम्स ने उष्णकटिबंधीय रोगों के लिए नया इलाज विकसित किया",
    "Startup Ecosystem Attracts Record Foreign Investment": "स्टार्टअप इकोसिस्टम ने रिकॉर्ड विदेशी निवेश आकर्षित किया",
    // Japan
    "Japan Unveils Next-Generation Bullet Train Technology": "जापान ने अगली पीढ़ी की बुलेट ट्रेन तकनीक का अनावरण किया",
    "Tokyo Stock Exchange Hits Multi-Decade Highs": "टोक्यो स्टॉक एक्सचेंज कई दशकों के उच्चतम स्तर पर पहुंचा",
    "Japan Space Agency Plans First Crewed Moon Mission": "जापान अंतरिक्ष एजेंसी ने पहले मानव युक्त चंद्रमा मिशन की योजना बनाई",
    "New Anime Season Breaks Streaming Records Globally": "नया एनीमे सीजन दुनिया भर में स्ट्रीमिंग रिकॉर्ड तोड़ रहा है",
    "Japan National Team Prepares for World Cup Qualifiers": "जापान की राष्ट्रीय टीम विश्व कप क्वालीफायर की तैयारी में",
    "Prime Minister Addresses Regional Security Concerns": "प्रधानमंत्री ने क्षेत्रीय सुरक्षा चिंताओं को संबोधित किया",
    "Japanese Researchers Pioneer Quantum Computing Advance": "जापानी शोधकर्ताओं ने क्वांटम कंप्यूटिंग में नया मार्ग प्रशस्त किया",
    "Health Ministry Reports Declining Birth Rate Challenges": "स्वास्थ्य मंत्रालय ने गिरती जन्म दर की चुनौतियों की रिपोर्ट दी",
    "Major Earthquake Preparedness Drill Held Nationwide": "देश भर में भूकंप तैयारियों का बड़ा अभ्यास आयोजित किया गया",
    "Japanese Automakers Lead Global EV Sales Growth": "जापानी वाहन निर्माता वैश्विक ईवी बिक्री वृद्धि का नेतृत्व कर रहे हैं",
    // Germany
    "Bundestag Approves Major Climate Protection Legislation": "बुंडेस्टैग ने प्रमुख जलवायु संरक्षण कानून को मंजूरी दी",
    "German Manufacturing Sector Shows Strong Recovery Signs": "जर्मनी के विनिर्माण क्षेत्र में सुधार के मजबूत संकेत दिखे",
    "Bundesliga Season Opens with Dramatic Matches": "बुंडेसलीगा सीजन की शुरुआत रोमांचक मैचों के साथ हुई",
    "German Scientists Lead European Quantum Research Project": "जर्मन वैज्ञानिक यूरोपीय क्वांटम अनुसंधान परियोजना का नेतृत्व कर रहे हैं",
    "Berlin Startup Scene Attracts Global Tech Talent": "बर्लिन का स्टार्टअप परिदृश्य वैश्विक तकनीकी प्रतिभाओं को आकर्षित कर रहा है",
    "Germany Expands Universal Healthcare Coverage": "जर्मनी ने सार्वभौमिक स्वास्थ्य सेवा कवरेज का विस्तार किया",
    "Berlin Film Festival Announces Record Submissions": "बर्लिन फिल्म महोत्सव ने रिकॉर्ड सबमिशन की घोषणा की",
    "Renewable Energy Powers Record Share of German Grid": "अक्षय ऊर्जा ने जर्मन ग्रिड में रिकॉर्ड हिस्सेदारी दर्ज की",
    "EU Trade Deal Negotiations Enter Final Stage": "यूरोपीय संघ व्यापार समझौते की बातचीत अंतिम चरण में पहुंची",
    "VW Unveils Revolutionary Electric Vehicle Platform": "फॉक्सवैगन ने क्रांतिकारी इलेक्ट्रिक वाहन प्लेटफॉर्म का अनावरण किया",
    // France
    "Élysée Palace Announces Sweeping Education Reforms": "एलिसी पैलेस ने व्यापक शिक्षा सुधारों की घोषणा की",
    "Paris Fashion Week Showcases AI-Designed Collections": "पेरिस फैशन वीक में एआई-डिज़ाइन किए गए संग्रह प्रदर्शित",
    "French Nuclear Energy Program Sets New Efficiency Records": "फ्रांस के परमाणु ऊर्जा कार्यक्रम ने दक्षता के नए रिकॉर्ड बनाए",
    "Ligue 1 Kicks Off with Surprise Results in Opening Week": "लीग 1 की शुरुआत पहले सप्ताह में आश्चर्यजनक परिणामों के साथ हुई",
    "French Tech Companies Lead European AI Development": "फ्रांसीसी टेक कंपनियां यूरोपीय एआई विकास का नेतृत्व कर रही हैं",
    "France Launches National Mental Health Initiative": "फ्रांस ने राष्ट्रीय मानसिक स्वास्थ्य पहल शुरू की",
    "Cannes Film Festival Premieres Generate Global Buzz": "कान फिल्म महोत्सव के प्रीमियर ने दुनिया भर में चर्चा बटोरी",
    "French Wine Industry Adapts to Climate Change": "फ्रांस का वाइन उद्योग जलवायु परिवर्तन के अनुकूल ढल रहा है",
    "EU Defense Cooperation Deepens Under French Leadership": "फ्रांसीसी नेतृत्व में यूरोपीय संघ का रक्षा सहयोग गहरा हुआ",
    "Paris Metro Expansion Transforms City Transportation": "पेरिस मेट्रो विस्तार ने शहरी परिवहन की तस्वीर बदली",
    // Generic
    "National Bank Announces New Interest Rate Policy to Combat Inflation": "नेशनल बैंक ने मुद्रास्फीति से निपटने के लिए नई ब्याज दर नीति की घोषणा की",
    "Local Tech Startup Reaches Unicorn Status After New Funding Round": "नया निवेश मिलने के बाद स्थानीय टेक स्टार्टअप यूनिकॉर्न बना",
    "Government Unveils Ambitious Infrastructure Plan for Next Decade": "सरकार ने अगले दशक के लिए महत्वाकांक्षी बुनियादी ढांचा योजना का अनावरण किया",
    "Major Scientific Breakthrough at Leading Research University": "प्रमुख अनुसंधान विश्वविद्यालय में महत्वपूर्ण वैज्ञानिक सफलता",
    "National Team Secures Crucial Victory in Regional Qualifiers": "राष्ट्रीय टीम ने क्षेत्रीय क्वालीफायर में महत्वपूर्ण जीत हासिल की",
    "Healthcare System Receives Significant Funding Boost for Modernization": "स्वास्थ्य सेवा प्रणाली के आधुनिकीकरण के लिए बजट में भारी वृद्धि",
    "Award-Winning Director Announces Next Film Project on Local History": "पुरस्कार विजेता निर्देशक ने स्थानीय इतिहास पर अगले फिल्म प्रोजेक्ट की घोषणा की",
    "Stock Market Reaches Record High Amid Broad Economic Optimism": "आर्थिक सकारात्मकता के बीच शेयर बाजार रिकॉर्ड ऊंचाई पर पहुंचा",
    "New Environmental Protection Laws Passed by Legislature": "विधायिका द्वारा नए पर्यावरण संरक्षण कानून पारित",
    "Revolutionary Clean Energy Project Breaks Ground in Rural District": "ग्रामीण जिले में क्रांतिकारी स्वच्छ ऊर्जा परियोजना की शुरुआत",
    "Ministry of Education Proposes Sweeping Curriculum Changes": "शिक्षा मंत्रालय ने पाठ्यक्रम में व्यापक बदलावों का प्रस्ताव रखा",
    "Local Electric Vehicle Manufacturer Expands Export Operations": "स्थानीय इलेक्ट्रिक वाहन निर्माता ने निर्यात परिचालन का विस्तार किया",
    "Archaeological Team Discovers Ancient Settlement Ruins": "पुरातत्व टीम ने प्राचीन बस्ती के खंडहरों की खोज की",
    "Major Cyber Security Upgrade Planned for Public Infrastructure": "सार्वजनिक बुनियादी ढांचे के लिए प्रमुख साइबर सुरक्षा अपग्रेड की योजना",
    "National Athletics Federation Announces New Youth Training Program": "राष्ट्रीय एथलेटिक्स महासंघ ने नए युवा प्रशिक्षण कार्यक्रम की घोषणा की",
    "Renowned Chef Opens Innovative Farm-to-Table Restaurant": "प्रसिद्ध शेफ ने इनोवेटिव फार्म-टू-टेबल रेस्तरां खोला",
    "Breakthrough Study Reveals New Insights into Regional Ecosystem": "सफलतापूर्वक अध्ययन ने क्षेत्रीय पारिस्थितिकी तंत्र में नई अंतर्दृष्टि प्रकट की",
    "Public Transportation Network Expansion Completed Ahead of Schedule": "सार्वजनिक परिवहन नेटवर्क का विस्तार समय से पहले पूरा",
    "Surge in Renewable Energy Investments Boosts Local Economy": "अक्षय ऊर्जा निवेश में उछाल से स्थानीय अर्थव्यवस्था को बढ़ावा",
    "New Public Health Initiative Targets Preventive Care": "नई सार्वजनिक स्वास्थ्य पहल निवारक देखभाल पर केंद्रित",
    "Telecommunications Giant Launches Nationwide 5G Network": "दूरसंचार दिग्गज ने देशव्यापी 5G नेटवर्क लॉन्च किया",
    "Local Film Festival Breaks Attendance Records This Year": "स्थानीय फिल्म महोत्सव ने इस साल दर्शकों की संख्या का रिकॉर्ड तोड़ा",
    "Space Agency Successfully Launches Climate Monitoring Satellite": "अंतरिक्ष एजेंसी ने जलवायु निगरानी उपग्रह का सफल प्रक्षेपण किया",
    "Rising Star Athlete Signs Record-Breaking Endorsement Deal": "उभरते खिलाड़ी ने रिकॉर्ड-तोड़ विज्ञापन अनुबंध पर हस्ताक्षर किए",
    "Housing Market Shows Signs of Stabilization After Volatile Year": "उतार-चढ़ाव भरे साल के बाद आवास बाजार में स्थिरता के संकेत",
    "Government Increases Funding for Arts and Cultural Programs": "सरकार ने कला और सांस्कृतिक कार्यक्रमों के लिए धन बढ़ाया",
    "Researchers Develop Novel Treatment for Prevalent Local Disease": "शोधकर्ताओं ने प्रचलित स्थानीय बीमारी के लिए नया उपचार विकसित किया",
    "Innovative Waste Management System Deployed in Capital": "राजधानी में अभिनव अपशिष्ट प्रबंधन प्रणाली तैनात",
    "AI Research Institute Partners with Local Universities": "एआई अनुसंधान संस्थान ने स्थानीय विश्वविद्यालयों के साथ साझेदारी की",
    "Historic Cultural Monument Restored and Reopened to Public": "ऐतिहासिक सांस्कृतिक स्मारक का जीर्णोद्धार कर जनता के लिए फिर से खोला गया",
    // International
    "Global Leaders Convene for Emergency Summit on Climate Crisis": "जलवायु संकट पर आपातकालीन शिखर सम्मेलन के लिए वैश्विक नेता एकत्र",
    "Tech Giants Report Record AI Investment as Industry Transforms": "उद्योग में बदलाव के साथ टेक दिग्गजों ने एआई निवेश में रिकॉर्ड बढ़ोतरी दर्ज की",
    "Middle East Peace Negotiations Enter Critical Phase": "मध्य पूर्व शांति वार्ता अत्यंत महत्वपूर्ण चरण में पहुंची",
    "Global Markets Surge on Positive Economic Data": "सकारात्मक आर्थिक आंकड़ों के बाद वैश्विक बाजारों में भारी उछाल",
    "Breakthrough in Renewable Energy Storage Could Revolutionize Grid": "अक्षय ऊर्जा भंडारण में बड़ी सफलता ग्रिड में क्रांति ला सकती है",
    "International Sports Federation Announces Major Rule Changes": "अंतरराष्ट्रीय खेल महासंघ ने बड़े नियमों में बदलाव की घोषणा की",
    "WHO Issues New Guidelines on Global Health Preparedness": "डब्ल्यूएचओ ने वैश्विक स्वास्थ्य तैयारियों पर नए दिशानिर्देश जारी किए",
    "Award Season Predictions: Critics Weigh In on Frontrunners": "पुरस्कार सीजन का पूर्वानुमान: समीक्षकों ने पसंदीदा नामों पर राय दी",
    "European Union Proposes Landmark Digital Regulations": "यूरोपीय संघ ने ऐतिहासिक डिजिटल नियमों का प्रस्ताव रखा",
    "Space Agency Reveals Plans for Lunar Base Construction": "अंतरिक्ष एजेंसी ने स्थायी चंद्र बेस निर्माण की योजनाओं का खुलासा किया"
  }
};

function getCountryNameTranslation(name, lang) {
  if (!lang || lang === 'en') return name;
  return countryNameTranslations[lang]?.[name] || name;
}

function getTranslation(text, lang) {
  if (!lang || lang === 'en') return text;
  return translationDict[lang]?.[text] || text;
}

/**
 * Generate mock news data for development/demo
 */
export function getMockNews(category = 'top', country = '', lang = 'en') {
  let newsItems = [];

  // Strict country filtering
  if (country) {
    if (countryNews[country]) {
      newsItems = countryNews[country].map((item, idx) => {
        const rawTitle = item.title;
        const translatedTitle = getTranslation(rawTitle, lang);
        const rawDesc = item.desc || `Latest developments from ${item.source} covering ${item.cat} news.`;
        const rawContent = item.content || `${item.title}. This is a developing story with more updates expected throughout the day. Our correspondents are following the latest developments closely.`;

        let displayDesc = rawDesc;
        let displayContent = rawContent;

        if (lang && lang !== 'en') {
          const nativeCountryName = getCountryNameTranslation(getCountryByCode(country)?.name || country.toUpperCase(), lang);
          if (templateTranslations[lang]) {
            displayDesc = templateTranslations[lang].descTemplate(nativeCountryName, item.cat);
            displayContent = templateTranslations[lang].contentTemplate(nativeCountryName, translatedTitle);
          } else {
            displayDesc = `Latest developments from ${item.source} covering ${item.cat} news.`;
            displayContent = `${translatedTitle}. This is a developing story with more updates expected throughout the day. Our correspondents are following the latest developments closely.`;
          }
        }

        return {
          id: `${country}-${idx}`,
          title: translatedTitle,
          description: displayDesc,
          content: displayContent,
          imageUrl: item.image || getImage(item.cat, idx),
          source: item.source,
          sourceUrl: `https://${item.source.toLowerCase().replace(/\s+/g, '')}.com`,
          nativeUrl: `https://${item.source.toLowerCase().replace(/\s+/g, '')}.com/local`,
          ytChannelUrl: `https://youtube.com/@${item.source.toLowerCase().replace(/\s+/g, '')}news`,
          publishedAt: new Date(Date.now() - (idx * 1000 * 60 * 60 * (idx + 1))).toISOString(),
          url: `https://${item.source.toLowerCase().replace(/\s+/g, '')}.com/news/${idx}`,
          category: item.cat,
        };
      });
    } else {
      // Generate generic country mock data if no hardcoded data exists
      const countryInfo = getCountryByCode(country) || { name: country.toUpperCase() };
      
      // Select a unique subset of 10 headlines based on country code char codes
      const shift = (country.charCodeAt(0) || 0) + ((country.charCodeAt(1) || 0) * 3);
      const uniqueHeadlines = [];
      for (let i = 0; i < 10; i++) {
        uniqueHeadlines.push(genericCountryNews[(shift + i) % genericCountryNews.length]);
      }
      
      newsItems = uniqueHeadlines.map((item, idx) => {
        const rawTitle = item.title;
        const translatedTitle = getTranslation(rawTitle, lang);
        const nativeCountryName = getCountryNameTranslation(countryInfo.name, lang);
        
        const displayTitle = lang && lang !== 'en'
          ? `${nativeCountryName}: ${translatedTitle}`
          : `${countryInfo.name}: ${rawTitle}`;

        let displayDesc = `Local coverage from ${countryInfo.name} regarding the latest ${item.cat} developments.`;
        let displayContent = `Reporting live from ${countryInfo.name}: ${item.title}. This story is currently developing and more updates will follow as officials release further statements.`;

        if (lang && lang !== 'en') {
          if (templateTranslations[lang]) {
            displayDesc = templateTranslations[lang].descTemplate(nativeCountryName, item.cat);
            displayContent = templateTranslations[lang].contentTemplate(nativeCountryName, translatedTitle);
          } else {
            displayDesc = `Local coverage from ${nativeCountryName} regarding the latest ${item.cat} developments.`;
            displayContent = `Reporting live from ${nativeCountryName}: ${translatedTitle}. This story is currently developing and more updates will follow as officials release further statements.`;
          }
        }

        return {
          id: `${country}-${idx}`,
          title: displayTitle,
          description: displayDesc,
          content: displayContent,
          imageUrl: item.image || getImage(item.cat, idx),
          source: `${countryInfo.name} ${item.source}`,
          sourceUrl: `https://${countryInfo.name.toLowerCase().replace(/\s+/g, '')}news.com`,
          nativeUrl: `https://${countryInfo.name.toLowerCase().replace(/\s+/g, '')}news.com/local`,
          ytChannelUrl: `https://youtube.com/@${countryInfo.name.toLowerCase().replace(/\s+/g, '')}news`,
          publishedAt: new Date(Date.now() - (idx * 1000 * 60 * 60 * (idx + 1))).toISOString(),
          url: `https://${countryInfo.name.toLowerCase().replace(/\s+/g, '')}news.com/article/${idx}`,
          category: item.cat,
        };
      });
    }
  } else {
    // International news (no country selected)
    newsItems = internationalNews.map((item, idx) => {
      const rawTitle = item.title;
      const rawDesc = item.desc;
      const rawContent = item.content;

      const translatedTitle = getTranslation(rawTitle, lang);
      const translatedDesc = getTranslation(rawDesc, lang);
      const translatedContent = getTranslation(rawContent, lang);

      return {
        id: `intl-${idx}`,
        title: translatedTitle,
        description: translatedDesc,
        content: translatedContent,
        imageUrl: item.image || getImage(item.cat, idx),
        source: item.source,
        sourceUrl: `https://${item.source.toLowerCase().replace(/\s+/g, '')}.com`,
        nativeUrl: `https://${item.source.toLowerCase().replace(/\s+/g, '')}.com/global`,
        ytChannelUrl: `https://youtube.com/@${item.source.toLowerCase().replace(/\s+/g, '')}news`,
        publishedAt: new Date(Date.now() - (idx * 1000 * 60 * 60 * (idx + 1))).toISOString(),
        url: `https://${item.source.toLowerCase().replace(/\s+/g, '')}.com/news/${idx}`,
        category: item.cat,
      };
    });
  }

  // Filter by category
  let filtered = newsItems;
  if (category && category !== 'top') {
    filtered = newsItems.filter(a => a.category === category);
  }

  return {
    totalResults: filtered.length,
    articles: filtered,
  };
}
