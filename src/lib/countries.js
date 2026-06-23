// Country list with ISO codes and flag emojis
// Curated list of ~40 major countries for clean UX

const countries = [
  { code: 'us', name: 'United States', flag: '🇺🇸', region: 'North America' },
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦', region: 'North America' },
  { code: 'au', name: 'Australia', flag: '🇦🇺', region: 'Oceania' },
  { code: 'in', name: 'India', flag: '🇮🇳', region: 'Asia' },
  { code: 'de', name: 'Germany', flag: '🇩🇪', region: 'Europe' },
  { code: 'fr', name: 'France', flag: '🇫🇷', region: 'Europe' },
  { code: 'jp', name: 'Japan', flag: '🇯🇵', region: 'Asia' },
  { code: 'cn', name: 'China', flag: '🇨🇳', region: 'Asia' },
  { code: 'br', name: 'Brazil', flag: '🇧🇷', region: 'South America' },
  { code: 'ru', name: 'Russia', flag: '🇷🇺', region: 'Europe' },
  { code: 'kr', name: 'South Korea', flag: '🇰🇷', region: 'Asia' },
  { code: 'mx', name: 'Mexico', flag: '🇲🇽', region: 'North America' },
  { code: 'it', name: 'Italy', flag: '🇮🇹', region: 'Europe' },
  { code: 'es', name: 'Spain', flag: '🇪🇸', region: 'Europe' },
  { code: 'nl', name: 'Netherlands', flag: '🇳🇱', region: 'Europe' },
  { code: 'se', name: 'Sweden', flag: '🇸🇪', region: 'Europe' },
  { code: 'ch', name: 'Switzerland', flag: '🇨🇭', region: 'Europe' },
  { code: 'pl', name: 'Poland', flag: '🇵🇱', region: 'Europe' },
  { code: 'ua', name: 'Ukraine', flag: '🇺🇦', region: 'Europe' },
  { code: 'tr', name: 'Turkey', flag: '🇹🇷', region: 'Middle East' },
  { code: 'il', name: 'Israel', flag: '🇮🇱', region: 'Middle East' },
  { code: 'sa', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East' },
  { code: 'ae', name: 'UAE', flag: '🇦🇪', region: 'Middle East' },
  { code: 'ir', name: 'Iran', flag: '🇮🇷', region: 'Middle East' },
  { code: 'eg', name: 'Egypt', flag: '🇪🇬', region: 'Africa' },
  { code: 'za', name: 'South Africa', flag: '🇿🇦', region: 'Africa' },
  { code: 'ng', name: 'Nigeria', flag: '🇳🇬', region: 'Africa' },
  { code: 'ke', name: 'Kenya', flag: '🇰🇪', region: 'Africa' },
  { code: 'pk', name: 'Pakistan', flag: '🇵🇰', region: 'Asia' },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩', region: 'Asia' },
  { code: 'th', name: 'Thailand', flag: '🇹🇭', region: 'Asia' },
  { code: 'ph', name: 'Philippines', flag: '🇵🇭', region: 'Asia' },
  { code: 'sg', name: 'Singapore', flag: '🇸🇬', region: 'Asia' },
  { code: 'ar', name: 'Argentina', flag: '🇦🇷', region: 'South America' },
  { code: 'co', name: 'Colombia', flag: '🇨🇴', region: 'South America' },
  { code: 'nz', name: 'New Zealand', flag: '🇳🇿', region: 'Oceania' },
  { code: 'no', name: 'Norway', flag: '🇳🇴', region: 'Europe' },
];

// Group countries by region
export const regions = [...new Set(countries.map(c => c.region))];

export const getCountriesByRegion = (region) => {
  return countries.filter(c => c.region === region);
};

export const getCountryByCode = (code) => {
  return countries.find(c => c.code === code);
};

export default countries;
