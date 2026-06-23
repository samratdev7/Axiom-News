'use client';

import { useState, useRef } from 'react';
import countries, { regions, getCountriesByRegion, getCountryByCode } from '@/lib/countries';
import LanguagePopup from '@/components/ui/LanguagePopup';
import styles from './Sidebar.module.css';

export default function Sidebar({ selectedCountry, onCountrySelect, isOpen, onClose, view, onSelectBookmarks }) {
  const [langPopup, setLangPopup] = useState(null); // { country, position }

  const handleCountryClick = (countryCode, e) => {
    e.stopPropagation(); // Prevent document click handler from immediately closing the new popup
    if (!countryCode) {
      // "All Countries" — no popup
      onCountrySelect('', 'en');
      onClose();
      return;
    }

    const country = getCountryByCode(countryCode);
    if (!country) return;

    // Always show language popup for any specific country
    const rect = e.currentTarget.getBoundingClientRect();
    setLangPopup({
      country,
      position: {
        top: rect.top,
        left: rect.right + 8,
      },
    });
  };

  const handleLangSelect = (code, lang) => {
    onCountrySelect(code, lang);
    setLangPopup(null);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`} id="country-sidebar">
        <div className={styles.header}>
          <h3 className={styles.title}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            Countries
          </h3>
        </div>

        <div className={styles.list}>
          {/* My Bookmarks option */}
          <button
            className={`${styles.countryItem} ${view === 'bookmarks' ? styles.active : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectBookmarks) onSelectBookmarks();
              onClose();
            }}
            id="sidebar-bookmarks"
          >
            <span className={styles.bookmarkIcon}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill={view === 'bookmarks' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </span>
            <span className={styles.name}>My Bookmarks</span>
          </button>

          {/* All countries option */}
          <button
            className={`${styles.countryItem} ${view === 'feed' && !selectedCountry ? styles.active : ''}`}
            onClick={(e) => handleCountryClick('', e)}
            id="country-all"
          >
            <span className={styles.flag}>🌐</span>
            <span className={styles.name}>All Countries</span>
          </button>


          {regions.map(region => (
            <div key={region} className={styles.regionGroup}>
              <div className={styles.regionLabel}>{region}</div>
              {getCountriesByRegion(region).map(country => (
                <button
                  key={country.code}
                  className={`${styles.countryItem} ${selectedCountry === country.code ? styles.active : ''}`}
                  onClick={(e) => handleCountryClick(country.code, e)}
                  id={`country-${country.code}`}
                >
                  <span className={styles.flag}>{country.flag}</span>
                  <span className={styles.name}>{country.name}</span>
                  {selectedCountry === country.code && (
                    <span className={styles.check}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* Language popup */}
      {langPopup && (
        <LanguagePopup
          country={langPopup.country}
          position={langPopup.position}
          onSelect={handleLangSelect}
          onClose={() => setLangPopup(null)}
        />
      )}
    </>
  );
}
