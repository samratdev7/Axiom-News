'use client';

import { useState } from 'react';
import { useUser, AVATARS } from '@/context/UserContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import AccountMenu from '@/components/layout/AccountMenu';
import styles from './Header.module.css';

export default function Header({ onMobileMenuToggle, isMobileMenuOpen, onSelectBookmarks }) {
  const { user, setShowAuthModal } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentAvatar = user ? (AVATARS.find(av => av.id === user.avatarId) || null) : null;

  return (
    <header className={styles.header} id="main-header">
      <div className={styles.inner}>
        <div className={styles.left}>
          <button
            className={styles.menuBtn}
            onClick={onMobileMenuToggle}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            <div className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          <a href="/" className={styles.logo} id="logo-link">
            <div className={styles.logoIcon}>
              {/* Minimalist geometric diamond logo */}
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <defs>
                  <linearGradient id="axiom-grad" x1="0" y1="0" x2="32" y2="32">
                    <stop offset="0%" stopColor="#7c5cfc" />
                    <stop offset="100%" stopColor="#39d0d8" />
                  </linearGradient>
                </defs>
                <path d="M16 2L2 16l14 14 14-14L16 2z" stroke="url(#axiom-grad)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 8v16M8 16h16" stroke="url(#axiom-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <circle cx="16" cy="16" r="3" fill="url(#axiom-grad)" />
              </svg>
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoName}>Axiom</span>
              <span className={styles.logoDot}>News</span>
            </div>
          </a>
        </div>

        <div className={styles.right}>
          <div className={styles.liveIndicator} id="live-indicator">
            <span className={styles.liveDot}></span>
            <span className={styles.liveText}>Live</span>
          </div>
          
          <ThemeToggle />

          {/* User Sign In / Account Avatar Bubble */}
          {!user ? (
            <button 
              className={styles.signInBtn}
              onClick={() => setShowAuthModal(true)}
              id="header-signin-btn"
            >
              Sign In
            </button>
          ) : (
            <div className={styles.accountWrapper}>
              <button
                className={styles.accountBubble}
                onClick={() => setIsMenuOpen(prev => !prev)}
                style={{ 
                  background: user.avatarUrl ? 'transparent' : (currentAvatar?.bg || 'var(--accent-gradient)') 
                }}
                id="account-bubble-btn"
                aria-label="Account menu"
              >
                {user.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt="" 
                    className={styles.bubbleImg} 
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  currentAvatar?.emoji || '👤'
                )}
              </button>
              
              <AccountMenu 
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onSelectBookmarks={onSelectBookmarks}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
