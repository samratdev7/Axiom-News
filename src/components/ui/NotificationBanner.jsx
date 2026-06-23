'use client';

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import styles from './NotificationBanner.module.css';

export default function NotificationBanner() {
  const { activeNotification, closeNotification } = useUser();
  const [copied, setCopied] = useState(false);

  if (!activeNotification) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeNotification.code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className={styles.banner} role="alert" id="otp-notification-banner">
      <div className={styles.avatar}>
        {/* Sleek SVG Logo */}
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <defs>
            <linearGradient id="notif-grad" x1="0" y1="0" x2="32" y2="32">
              <stop offset="0%" stopColor="#7c5cfc" />
              <stop offset="100%" stopColor="#39d0d8" />
            </linearGradient>
          </defs>
          <path d="M16 2L2 16l14 14 14-14L16 2z" stroke="url(#notif-grad)" strokeWidth="2.5" fill="none" />
          <path d="M16 8v16M8 16h16" stroke="url(#notif-grad)" strokeWidth="1.5" opacity="0.6" />
          <circle cx="16" cy="16" r="3" fill="url(#notif-grad)" />
        </svg>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.sender}>Official Axiom News</span>
          <span className={styles.time}>Just now</span>
        </div>
        <p className={styles.body}>{activeNotification.message}</p>
        
        <div className={styles.actions}>
          <button className={styles.copyBtn} onClick={handleCopy} id="otp-copy-btn">
            {copied ? '✅ Copied' : '📋 Copy Code'}
          </button>
          <button className={styles.closeBtn} onClick={closeNotification} id="otp-close-btn">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
