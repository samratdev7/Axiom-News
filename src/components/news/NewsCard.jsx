'use client';

import { useUser } from '@/context/UserContext';
import { getCategoryById } from '@/lib/categories';
import styles from './NewsCard.module.css';

function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NewsCard({ article, mode = 'detailed', onArticleClick }) {
  const { user, isBookmarked, addBookmark, removeBookmark, setShowAuthModal } = useUser();
  const category = getCategoryById(article.category);
  const bookmarked = isBookmarked(article.id);

  const handleClick = (e) => {
    e.preventDefault();
    if (onArticleClick) {
      onArticleClick(article);
    }
  };

  const handleBookmarkToggle = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent opening the article modal
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (bookmarked) {
      removeBookmark(article.id);
    } else {
      addBookmark(article);
    }
  };

  if (mode === 'headlines') {
    return (
      <div
        className={styles.headlineCard}
        onClick={handleClick}
        id={`article-${article.id}`}
        role="button"
        tabIndex={0}
      >
        <div className={styles.headlineLeft}>
          <div className={styles.headlineMeta}>
            <span
              className={styles.categoryBadge}
              style={{ '--cat-color': `var(${category.colorVar})` }}
            >
              {category.icon} {category.name}
            </span>
            <span className={styles.dot}>·</span>
            <span className={styles.time}>{formatTimeAgo(article.publishedAt)}</span>
          </div>
          <h3 className={styles.headlineTitle}>{article.title}</h3>
          <div className={styles.source}>
            <span className={styles.sourceIcon}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </span>
            {article.source}
          </div>
        </div>
        
        <div className={styles.headlineRight}>
          <button
            className={`${styles.bookmarkBtn} ${bookmarked ? styles.bookmarkActive : ''}`}
            onClick={handleBookmarkToggle}
            title={bookmarked ? "Remove Bookmark" : "Save Bookmark"}
            aria-label="Bookmark article"
            id={`bookmark-btn-${article.id}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
          
          <div className={styles.headlineArrow}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Detailed mode
  return (
    <div
      className={styles.detailedCard}
      onClick={handleClick}
      id={`article-${article.id}`}
      role="button"
      tabIndex={0}
    >
      <div className={styles.imageContainer}>
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        
        {/* Floating Bookmark Button */}
        <button
          className={`${styles.bookmarkBtnOverlay} ${bookmarked ? styles.bookmarkActive : ''}`}
          onClick={handleBookmarkToggle}
          title={bookmarked ? "Remove Bookmark" : "Save Bookmark"}
          aria-label="Bookmark article"
          id={`bookmark-btn-${article.id}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>

        <div className={styles.imageOverlay} />
      </div>
      <div className={styles.content}>
        <div className={styles.headlineMeta}>
          <span
            className={styles.categoryBadge}
            style={{ '--cat-color': `var(${category.colorVar})` }}
          >
            {category.icon} {category.name}
          </span>
          <span className={styles.dot}>·</span>
          <span className={styles.time}>{formatTimeAgo(article.publishedAt)}</span>
        </div>
        <h3 className={styles.detailedTitle}>{article.title}</h3>
        {article.description && (
          <p className={styles.description}>{article.description}</p>
        )}
        <div className={styles.footer}>
          <div className={styles.source}>
            <span className={styles.sourceIcon}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </span>
            {article.source}
          </div>
          <span className={styles.readMore}>
            Read article
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );

}
