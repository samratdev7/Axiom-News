'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import styles from './ArticleModal.module.css';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ArticleModal({ article, onClose }) {
  const [viewMode, setViewMode] = useState(null); // null = choice screen, 'summary', 'full'
  const { user, isBookmarked, addBookmark, removeBookmark, setShowAuthModal } = useUser();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!article) return null;

  const bookmarked = isBookmarked(article.id);

  const handleBookmarkToggle = (e) => {
    e.preventDefault();
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

  // Choice screen
  if (viewMode === null) {
    return (
      <div className={styles.overlay} onClick={onClose} id="article-modal-overlay">
        <div className={styles.choiceModal} onClick={(e) => e.stopPropagation()}>
          <button 
            className={`${styles.bookmarkBtn} ${bookmarked ? styles.bookmarkActive : ''}`} 
            onClick={handleBookmarkToggle}
            title={bookmarked ? "Remove Bookmark" : "Save Bookmark"}
            aria-label="Bookmark article"
            id={`modal-bookmark-btn-${article.id}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>

          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {article.imageUrl && (
            <div className={styles.choiceImage}>
              <img src={article.imageUrl} alt="" />
              <div className={styles.choiceImageOverlay} />
            </div>
          )}

          <div className={styles.choiceContent}>
            <h2 className={styles.choiceTitle}>{article.title}</h2>
            <div className={styles.choiceMeta}>
              <span className={styles.choiceSource}>{article.source}</span>
              <span className={styles.choiceDot}>·</span>
              <span className={styles.choiceTime}>{formatDate(article.publishedAt)}</span>
            </div>

            <p className={styles.choicePrompt}>How would you like to read this article?</p>

            <div className={styles.choiceButtons}>
              <button
                className={styles.choiceBtn}
                onClick={() => setViewMode('summary')}
                id="article-summary-btn"
              >
                <div className={styles.choiceBtnIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className={styles.choiceBtnText}>
                  <strong>Summary</strong>
                  <span>Quick overview of the article</span>
                </div>
              </button>

              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.choiceBtn}
                onClick={onClose}
                id="article-full-btn"
              >
                <div className={styles.choiceBtnIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <div className={styles.choiceBtnText}>
                  <strong>Full Article</strong>
                  <span>Read on the source website</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Summary view
  return (
    <div className={styles.overlay} onClick={onClose} id="article-modal-overlay">
      <div className={styles.summaryModal} onClick={(e) => e.stopPropagation()}>
        <button 
          className={`${styles.bookmarkBtn} ${bookmarked ? styles.bookmarkActive : ''}`} 
          onClick={handleBookmarkToggle}
          title={bookmarked ? "Remove Bookmark" : "Save Bookmark"}
          aria-label="Bookmark article"
          id={`modal-bookmark-btn-${article.id}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>

        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.summaryHeader}>
          <button className={styles.backBtn} onClick={() => setViewMode(null)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>
          <span className={styles.summaryBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Summary
          </span>
        </div>

        {article.imageUrl && (
          <div className={styles.summaryImage}>
            <img src={article.imageUrl} alt={article.title} />
          </div>
        )}

        <div className={styles.summaryContent}>
          <h2 className={styles.summaryTitle}>{article.title}</h2>
          <div className={styles.summaryMeta}>
            <span className={styles.choiceSource}>{article.source}</span>
            <span className={styles.choiceDot}>·</span>
            <span className={styles.choiceTime}>{formatDate(article.publishedAt)}</span>
          </div>

          <div className={styles.summaryBody}>
            {article.description && (
              <p className={styles.summaryPara}>{article.description}</p>
            )}
            {article.content && (
              <p className={styles.summaryPara}>{article.content}</p>
            )}
          </div>

          <div className={styles.externalLinks}>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readFullBtn}
            >
              Read full article on {article.source}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" /><path d="M7 7h10v10" />
              </svg>
            </a>
            
            {article.nativeUrl && (
              <a
                href={article.nativeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.nativeLinkBtn}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                Native News Website
              </a>
            )}
            
            {article.ytChannelUrl && (
              <a
                href={article.ytChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ytLinkBtn}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.582 6.186a2.665 2.665 0 0 0-1.876-1.888C18.048 3.846 12 3.846 12 3.846s-6.048 0-7.706.452a2.665 2.665 0 0 0-1.876 1.888C2 7.854 2 12 2 12s0 4.146.418 5.814a2.665 2.665 0 0 0 1.876 1.888C5.952 20.154 12 20.154 12 20.154s6.048 0 7.706-.452a2.665 2.665 0 0 0 1.876-1.888C22 16.146 22 12 22 12s0-4.146-.418-5.814zM9.996 15.281v-6.56l6.458 3.286-6.458 3.274z" />
                </svg>
                Native News Channel
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
