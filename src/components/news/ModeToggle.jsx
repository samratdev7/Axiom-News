'use client';

import styles from './ModeToggle.module.css';

export default function ModeToggle({ mode, onToggle }) {
  return (
    <div className={styles.container} id="mode-toggle">
      <button
        className={`${styles.option} ${mode === 'headlines' ? styles.active : ''}`}
        onClick={() => onToggle('headlines')}
        aria-label="Headlines view"
        id="mode-headlines"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        <span>Headlines</span>
      </button>
      <button
        className={`${styles.option} ${mode === 'detailed' ? styles.active : ''}`}
        onClick={() => onToggle('detailed')}
        aria-label="Detailed view"
        id="mode-detailed"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
        <span>Detailed</span>
      </button>
      <div
        className={styles.slider}
        style={{ transform: mode === 'detailed' ? 'translateX(100%)' : 'translateX(0)' }}
      />
    </div>
  );
}
