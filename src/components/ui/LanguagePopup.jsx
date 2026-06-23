'use client';

import { useEffect } from 'react';
import styles from './LanguagePopup.module.css';

// Map country codes to their primary languages
const countryLanguages = {
  us: { name: 'English', code: 'en' },
  gb: { name: 'English', code: 'en' },
  ca: { name: 'English / French', code: 'en' },
  au: { name: 'English', code: 'en' },
  in: { name: 'Hindi', code: 'hi' },
  de: { name: 'German', code: 'de' },
  fr: { name: 'French', code: 'fr' },
  jp: { name: 'Japanese', code: 'ja' },
  cn: { name: 'Chinese', code: 'zh' },
  br: { name: 'Portuguese', code: 'pt' },
  ru: { name: 'Russian', code: 'ru' },
  kr: { name: 'Korean', code: 'ko' },
  mx: { name: 'Spanish', code: 'es' },
  it: { name: 'Italian', code: 'it' },
  es: { name: 'Spanish', code: 'es' },
  nl: { name: 'Dutch', code: 'nl' },
  se: { name: 'Swedish', code: 'sv' },
  ch: { name: 'German / French', code: 'de' },
  pl: { name: 'Polish', code: 'pl' },
  ua: { name: 'Ukrainian', code: 'uk' },
  tr: { name: 'Turkish', code: 'tr' },
  il: { name: 'Hebrew', code: 'he' },
  sa: { name: 'Arabic', code: 'ar' },
  ae: { name: 'Arabic', code: 'ar' },
  ir: { name: 'Persian', code: 'fa' },
  eg: { name: 'Arabic', code: 'ar' },
  za: { name: 'English', code: 'en' },
  ng: { name: 'English', code: 'en' },
  ke: { name: 'English', code: 'en' },
  pk: { name: 'Urdu', code: 'ur' },
  id: { name: 'Indonesian', code: 'id' },
  th: { name: 'Thai', code: 'th' },
  ph: { name: 'English', code: 'en' },
  sg: { name: 'English', code: 'en' },
  ar: { name: 'Spanish', code: 'es' },
  co: { name: 'Spanish', code: 'es' },
  nz: { name: 'English', code: 'en' },
  no: { name: 'Norwegian', code: 'no' },
};

export default function LanguagePopup({ country, position, onSelect, onClose }) {
  const langInfo = countryLanguages[country.code] || { name: 'English', code: 'en' };
  const isEnglishNative = langInfo.code === 'en';

  useEffect(() => {
    let timeoutId;
    const handleClick = (e) => {
      if (!e.target.closest('[data-language-popup]')) {
        onClose();
      }
    };
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };

    timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClick);
      document.addEventListener('keydown', handleEsc);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className={styles.popup}
      data-language-popup
      style={{ top: position?.top || 0, left: position?.left || 0 }}
      id="language-popup"
    >
      <div className={styles.header}>
        <span className={styles.flag}>{country.flag}</span>
        <span className={styles.countryName}>{country.name}</span>
      </div>

      <p className={styles.prompt}>Read articles and summaries in:</p>

      <div className={styles.options}>
        {!isEnglishNative && (
          <button
            className={styles.option}
            onClick={() => onSelect(country.code, langInfo.code)}
            id="lang-native"
          >
            <span className={styles.optionIcon}>🌐</span>
            <div className={styles.optionText}>
              <strong>{langInfo.name}</strong>
              <span>Show in native language</span>
            </div>
          </button>
        )}

        <button
          className={styles.option}
          onClick={() => onSelect(country.code, 'en')}
          id="lang-english"
        >
          <span className={styles.optionIcon}>🇬🇧</span>
          <div className={styles.optionText}>
            <strong>English</strong>
            <span>{isEnglishNative ? 'Show in native language' : 'Translate to English'}</span>
          </div>
        </button>
      </div>
    </div>
  );
}
