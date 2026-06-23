'use client';

import NewsCard from './NewsCard';
import styles from './NewsFeed.module.css';

export default function NewsFeed({ articles = [], mode = 'detailed', loading = false, onArticleClick }) {
  if (loading) {
    return (
      <div className={mode === 'detailed' ? styles.gridDetailed : styles.gridHeadlines}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={mode === 'detailed' ? styles.skeletonCard : styles.skeletonHeadline}>
            {mode === 'detailed' && <div className={`${styles.skeletonImage} skeleton`} />}
            <div className={styles.skeletonContent}>
              <div className={`${styles.skeletonBadge} skeleton`} />
              <div className={`${styles.skeletonTitle} skeleton`} />
              <div className={`${styles.skeletonTitle2} skeleton`} />
              {mode === 'detailed' && <div className={`${styles.skeletonDesc} skeleton`} />}
              <div className={`${styles.skeletonMeta} skeleton`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className={styles.empty} id="news-empty">
        <div className={styles.emptyIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <h3 className={styles.emptyTitle}>No articles found</h3>
        <p className={styles.emptyText}>
          Try selecting a different country or topic to discover more news.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${mode === 'detailed' ? styles.gridDetailed : styles.gridHeadlines} stagger-children`}
      id="news-feed"
    >
      {articles.map(article => (
        <NewsCard
          key={article.id}
          article={article}
          mode={mode}
          onArticleClick={onArticleClick}
        />
      ))}
    </div>
  );
}
