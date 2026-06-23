// News category definitions with icons and colors

const categories = [
  { id: 'top', name: 'Top Stories', icon: '🔥', colorVar: '--accent-primary' },
  { id: 'world', name: 'World', icon: '🌍', colorVar: '--cat-world' },
  { id: 'politics', name: 'Politics', icon: '🏛️', colorVar: '--cat-politics' },
  { id: 'business', name: 'Business', icon: '📈', colorVar: '--cat-business' },
  { id: 'technology', name: 'Technology', icon: '💻', colorVar: '--cat-technology' },
  { id: 'sports', name: 'Sports', icon: '⚽', colorVar: '--cat-sports' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', colorVar: '--cat-entertainment' },
  { id: 'health', name: 'Health', icon: '🏥', colorVar: '--cat-health' },
  { id: 'science', name: 'Science', icon: '🔬', colorVar: '--cat-science' },
];

export const getCategoryById = (id) => {
  return categories.find(c => c.id === id) || categories[0];
};

export default categories;
