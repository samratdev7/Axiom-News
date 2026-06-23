'use client';

import { useEffect, useRef } from 'react';
import { useUser, AVATARS } from '@/context/UserContext';
import styles from './AccountMenu.module.css';

export default function AccountMenu({ isOpen, onClose, onSelectBookmarks }) {
  const { user, logout, setShowSettingsModal } = useUser();
  const menuRef = useRef(null);

  // Close when clicking outside of menu
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        // Only close if we didn't click the bubble itself (which is handled by Header.jsx toggle)
        if (!event.target.closest('#account-bubble-btn')) {
          onClose();
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const currentAvatar = AVATARS.find(av => av.id === user.avatarId) || null;

  return (
    <div className={styles.dropdown} ref={menuRef} id="account-menu-dropdown">
      {/* User profile section */}
      <div className={styles.userInfo}>
        <div 
          className={styles.avatarLarge} 
          style={{ 
            background: user.avatarUrl ? 'transparent' : (currentAvatar?.bg || 'var(--accent-gradient)') 
          }}
          aria-hidden="true"
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className={styles.avatarLargeImg} />
          ) : (
            currentAvatar?.emoji || '👤'
          )}
        </div>
        <div className={styles.meta}>
          <span className={styles.userName}>{user.name}</span>
          <span className={styles.userEmail}>{user.email}</span>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Options */}
      <div className={styles.menuList}>
        <button 
          className={styles.menuItem} 
          onClick={() => {
            onSelectBookmarks();
            onClose();
          }}
          id="menu-opt-bookmarks"
        >
          <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          My Saved Bookmarks
        </button>

        <button 
          className={styles.menuItem} 
          onClick={() => {
            setShowSettingsModal(true);
            onClose();
          }}
          id="menu-opt-settings"
        >
          <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          General Settings
        </button>

        <div className={styles.divider} />

        <button 
          className={`${styles.menuItem} ${styles.signOutBtn}`} 
          onClick={() => {
            logout();
            onClose();
          }}
          id="menu-opt-signout"
        >
          <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}
