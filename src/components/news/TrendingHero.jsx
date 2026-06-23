'use client';

import { useUser } from '@/context/UserContext';
import styles from './TrendingHero.module.css';

function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function TrendingHero({ articles = [], onArticleClick }) {
  const { user, isBookmarked, addBookmark, removeBookmark, setShowAuthModal } = useUser();

  if (!articles.length) return null;

  const featured = articles[0];
  const secondary = articles.slice(1, 4);

  const handleClick = (article) => (e) => {
    e.preventDefault();
    if (onArticleClick) onArticleClick(article);
  };

  const handleBookmarkToggle = (article) => (e) => {
    e.preventDefault();
    e.stopPropagation(); // Avoid triggering full modal read view
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (isBookmarked(article.id)) {
      removeBookmark(article.id);
    } else {
      addBookmark(article);
    }
  };

  return (
    <section className={styles.hero} id="trending-hero">
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <span className={styles.trendingIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </span>
          <h2>Trending Now</h2>
        </div>
        <p className={styles.sectionSub}>Top stories making headlines worldwide</p>
      </div>

      <div className={styles.grid}>
        {/* Featured large card */}
        <div
          className={styles.featuredCard}
          onClick={handleClick(featured)}
          id="trending-featured"
          role="button"
          tabIndex={0}
        >
          <div className={styles.featuredBg}>
            {featured.imageUrl && (
              <img src={featured.imageUrl} alt="" className={styles.featuredImg} loading="lazy" />
            )}
            <div className={styles.featuredOverlay} />
          </div>

          {/* Floating Bookmark Button */}
          <button
            className={`${styles.bookmarkBtnOverlay} ${isBookmarked(featured.id) ? styles.bookmarkActive : ''}`}
            onClick={handleBookmarkToggle(featured)}
            title={isBookmarked(featured.id) ? "Remove Bookmark" : "Save Bookmark"}
            aria-label="Bookmark article"
            id={`bookmark-btn-${featured.id}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isBookmarked(featured.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>

          <div className={styles.featuredContent}>
            <div className={styles.featuredMeta}>
              <span className={styles.breakingBadge}>
                <span className={styles.breakingDot} />
                Breaking
              </span>
              <span className={styles.featuredTime}>{formatTimeAgo(featured.publishedAt)}</span>
            </div>
            <h2 className={styles.featuredTitle}>{featured.title}</h2>
            {featured.description && (
              <p className={styles.featuredDesc}>{featured.description}</p>
            )}
            <div className={styles.featuredSource}>{featured.source}</div>
          </div>
        </div>

        {/* Secondary cards */}
        <div className={styles.secondaryList}>
          {secondary.map((article, idx) => (
            <div
              key={article.id}
              className={styles.secondaryCard}
              onClick={handleClick(article)}
              id={`trending-${idx + 1}`}
              role="button"
              tabIndex={0}
            >
              <div className={styles.secondaryNumber}>
                {String(idx + 2).padStart(2, '0')}
              </div>
              <div className={styles.secondaryContent}>
                <h3 className={styles.secondaryTitle}>{article.title}</h3>
                <div className={styles.secondaryMeta}>
                  <span className={styles.secondarySource}>{article.source}</span>
                  <span className={styles.dot}>·</span>
                  <span className={styles.secondaryTime}>{formatTimeAgo(article.publishedAt)}</span>
                </div>
              </div>

              {/* Bookmark button for secondary trending items */}
              <button
                className={`${styles.bookmarkBtnSecondary} ${isBookmarked(article.id) ? styles.bookmarkActive : ''}`}
                onClick={handleBookmarkToggle(article)}
                title={isBookmarked(article.id) ? "Remove Bookmark" : "Save Bookmark"}
                aria-label="Bookmark article"
                id={`bookmark-btn-${article.id}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill={isBookmarked(article.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

}
