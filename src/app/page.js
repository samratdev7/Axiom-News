'use client';

import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider, useUser } from '@/context/UserContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import TopicPills from '@/components/news/TopicPills';
import ModeToggle from '@/components/news/ModeToggle';
import TrendingHero from '@/components/news/TrendingHero';
import NewsFeed from '@/components/news/NewsFeed';
import ArticleModal from '@/components/news/ArticleModal';
import ParticleCursor from '@/components/ui/ParticleCursor';
import AuthModal from '@/components/ui/AuthModal';
import SettingsModal from '@/components/ui/SettingsModal';
import NotificationBanner from '@/components/ui/NotificationBanner';
import { getCountryByCode } from '@/lib/countries';
import styles from './page.module.css';

function HomeContent() {
  const { user, bookmarks, mounted } = useUser();
  const [view, setView] = useState('feed'); // feed, bookmarks
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('top');
  const [language, setLanguage] = useState('en');
  const [mode, setMode] = useState('detailed');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [initialPreferencesApplied, setInitialPreferencesApplied] = useState(false);

  // Apply default preferences when user is logged in
  useEffect(() => {
    if (mounted && user && user.settings && !initialPreferencesApplied) {
      if (user.settings.defaultFeedMode) {
        setMode(user.settings.defaultFeedMode);
      }
      if (user.settings.defaultCountry !== undefined) {
        const defaultC = user.settings.defaultCountry;
        const cInfo = defaultC ? getCountryByCode(defaultC) : null;
        setCountry(defaultC);
        setLanguage(cInfo?.defaultLang || 'en');
      }
      setInitialPreferencesApplied(true);
    }
  }, [mounted, user, initialPreferencesApplied]);

  // Reset initial preference flag on logout so it triggers next login
  useEffect(() => {
    if (!user) {
      setInitialPreferencesApplied(false);
    }
  }, [user]);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (country) params.set('country', country);
      if (category && category !== 'top') params.set('category', category);
      if (language) params.set('lang', language);

      const res = await fetch(`/api/news?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setArticles(data.articles || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching news:', err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [country, category, language]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Handle country selection with language
  const handleCountrySelect = (code, lang) => {
    setView('feed');
    setCountry(code);
    setLanguage(lang || 'en');
    setCategory('top');
  };

  // Handle category selection
  const handleCategorySelect = (cat) => {
    setView('feed');
    setCategory(cat);
  };

  // Handle article click — open modal
  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  // Get country display name
  const countryInfo = country ? getCountryByCode(country) : null;
  
  let pageTitle = 'International News';
  if (view === 'bookmarks') {
    pageTitle = '📚 Saved Bookmarks';
  } else if (countryInfo) {
    pageTitle = `${countryInfo.flag} ${countryInfo.name}`;
  } else if (category !== 'top') {
    pageTitle = `Latest News`;
  }

  // Split articles for trending hero vs feed
  const trendingArticles = view === 'feed' && !country && category === 'top' ? articles.slice(0, 4) : [];
  const feedArticles = view === 'feed' && !country && category === 'top' ? articles.slice(4) : articles;

  return (
    <div className={styles.app}>
      <ParticleCursor />

      <Header
        onMobileMenuToggle={() => setMobileMenuOpen(prev => !prev)}
        isMobileMenuOpen={mobileMenuOpen}
        onSelectBookmarks={() => setView('bookmarks')}
      />

      <Sidebar
        selectedCountry={view === 'bookmarks' ? '' : country}
        onCountrySelect={handleCountrySelect}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        view={view}
        onSelectBookmarks={() => setView('bookmarks')}
      />

      <main className={styles.main}>
        {/* Toolbar: Topic pills + mode toggle */}
        <div className={styles.toolbar}>
          <TopicPills selected={view === 'bookmarks' ? '' : category} onSelect={handleCategorySelect} />
          <div className={styles.toolbarRight}>
            {view === 'feed' && lastUpdated && (
              <span className={styles.updated}>
                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <ModeToggle mode={mode} onToggle={setMode} />
          </div>
        </div>

        {/* Page heading */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{pageTitle}</h1>
          {view === 'bookmarks' ? (
            <span className={styles.resultCount}>
              {bookmarks.length} saved article{bookmarks.length !== 1 ? 's' : ''}
            </span>
          ) : (
            articles.length > 0 && !loading && (
              <span className={styles.resultCount}>
                {articles.length} article{articles.length !== 1 ? 's' : ''}
              </span>
            )
          )}
          {view === 'feed' && language !== 'en' && country && (
            <div className={styles.langContainer}>
              <span className={styles.langBadge}>
                🌐 {language.toUpperCase()}
              </span>
              <button
                className={styles.resetLangBtn}
                onClick={() => setLanguage('en')}
                title="Switch back to English"
                id="reset-lang-btn"
              >
                Reset to English
              </button>
            </div>
          )}
        </div>

        {/* Trending hero (only on homepage feed with no filters) */}
        {view === 'feed' && trendingArticles.length > 0 && !loading && (
          <TrendingHero articles={trendingArticles} onArticleClick={handleArticleClick} />
        )}

        {/* Main feed / Bookmarks */}
        <section className={styles.feedSection}>
          {view === 'bookmarks' ? (
            bookmarks.length > 0 ? (
              <NewsFeed
                articles={bookmarks}
                mode={mode}
                loading={false}
                onArticleClick={handleArticleClick}
              />
            ) : (
              <div className={styles.emptyState} id="bookmarks-empty-state">
                <div className={styles.emptyIcon}>📚</div>
                <h3>Your Reading List is Empty</h3>
                <p>Save articles by clicking the bookmark icon on any news card.</p>
                <button className={styles.emptyBtn} onClick={() => setView('feed')} id="bookmarks-explore-btn">
                  Explore Stories
                </button>
              </div>
            )
          ) : (
            feedArticles.length > 0 || loading ? (
              <>
                {!loading && trendingArticles.length > 0 && (
                  <div className={styles.feedHeader}>
                    <h2 className={styles.feedTitle}>More Stories</h2>
                  </div>
                )}
                <NewsFeed
                  articles={feedArticles}
                  mode={mode}
                  loading={loading}
                  onArticleClick={handleArticleClick}
                />
              </>
            ) : (
              !loading && <NewsFeed articles={[]} mode={mode} loading={false} />
            )
          )}
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <span className={styles.footerLogo}>Axiom</span>
              <span className={styles.footerLogoDot}>News</span>
            </div>
            <p className={styles.footerText}>
              Fast international news aggregator for journalists.
              <br />
              Built with Next.js • Data from GNews
            </p>
            <p className={styles.footerCopy}>
              © {new Date().getFullYear()} Axiom News. Portfolio project.
            </p>
          </div>
        </footer>
      </main>

      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}

      {/* Account Authentication & Settings Overlays */}
      <AuthModal />
      <SettingsModal />
      <NotificationBanner />
    </div>
  );
}

export default function Home() {
  return (
    <UserProvider>
      <ThemeProvider>
        <HomeContent />
      </ThemeProvider>
    </UserProvider>
  );
}
