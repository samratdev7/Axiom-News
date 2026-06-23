'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import styles from './AuthModal.module.css';

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, loginRequest, verifyOtp } = useUser();
  
  const [step, setStep] = useState(1); // 1 = credentials, 2 = OTP
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // Reset modal state when closed/opened
  useEffect(() => {
    if (!showAuthModal) {
      setStep(1);
      setEmail('');
      setName('');
      setOtp(['', '', '', '', '', '']);
      setError('');
      setLoading(false);
    }
  }, [showAuthModal]);

  // Focus first OTP field on step 2 load
  useEffect(() => {
    if (step === 2 && otpRefs[0].current) {
      setTimeout(() => otpRefs[0].current.focus(), 100);
    }
  }, [step]);

  if (!showAuthModal) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      loginRequest(email, name);
      setLoading(false);
      setStep(2);
    }, 800);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = verifyOtp(otpValue);
      setLoading(false);
      if (!success) {
        setError('Incorrect verification code. Please try again.');
      }
    }, 800);
  };

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Only take last digit
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5 && otpRefs[index + 1].current) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace back tab
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpRefs[index - 1].current) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
      const digits = pasteData.split('');
      setOtp(digits);
      // Focus the last digit input
      otpRefs[5].current.focus();
    }
  };

  return (
    <div className={styles.overlay} id="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} id="auth-modal">
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={() => setShowAuthModal(false)} aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.header}>
          <div className={styles.logo}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="auth-logo-grad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#7c5cfc" />
                  <stop offset="100%" stopColor="#39d0d8" />
                </linearGradient>
              </defs>
              <path d="M16 2L2 16l14 14 14-14L16 2z" stroke="url(#auth-logo-grad)" strokeWidth="2.5" fill="none" />
              <path d="M16 8v16M8 16h16" stroke="url(#auth-logo-grad)" strokeWidth="1.5" opacity="0.6" />
              <circle cx="16" cy="16" r="3" fill="url(#auth-logo-grad)" />
            </svg>
          </div>
          <h2 className={styles.title}>{step === 1 ? 'Welcome to Axiom News' : 'Verify Your Identity'}</h2>
          <p className={styles.subtitle}>
            {step === 1 
              ? 'Enter your email to sign in or create a new account.' 
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        {error && <div className={styles.errorAlert} role="alert">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="auth-name" className={styles.label}>Name (Optional for new users)</label>
              <input
                type="text"
                id="auth-name"
                className={styles.input}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="auth-email" className={styles.label}>Email Address</label>
              <input
                type="email"
                id="auth-email"
                className={styles.input}
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span className={styles.spinner}></span>
              ) : (
                'Send Verification Code'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className={styles.form}>
            <div className={styles.otpContainer}>
              <label className={styles.label} style={{ textAlign: 'center', display: 'block', marginBottom: '16px' }}>
                Enter verification code
              </label>
              <div className={styles.otpInputs} onPaste={handlePaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    pattern="[0-9]*"
                    maxLength="1"
                    className={styles.otpInput}
                    value={digit}
                    ref={otpRefs[idx]}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    disabled={loading}
                    required
                  />
                ))}
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span className={styles.spinner}></span>
              ) : (
                'Verify & Continue'
              )}
            </button>

            <button 
              type="button" 
              className={styles.backBtn} 
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Back to email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
