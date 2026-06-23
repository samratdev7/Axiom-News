'use client';

import { useState, useEffect } from 'react';
import { useUser, AVATARS } from '@/context/UserContext';
import countries from '@/lib/countries';
import styles from './SettingsModal.module.css';

export default function SettingsModal() {
  const { 
    showSettingsModal, 
    setShowSettingsModal, 
    user, 
    updateSettings, 
    bookmarks, 
    clearBookmarks,
    logout
  } = useUser();

  const [activeTab, setActiveTab] = useState('profile'); // profile, preferences, notifications, data
  const [name, setName] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [defaultCountry, setDefaultCountry] = useState('');
  const [defaultFeedMode, setDefaultFeedMode] = useState('detailed');
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Sync state with current user settings on open
  useEffect(() => {
    if (showSettingsModal && user) {
      setName(user.name || '');
      setSelectedAvatarId(user.avatarId || 'gravatar');
      setAvatarUrl(user.avatarUrl || '');
      setDefaultCountry(user.settings?.defaultCountry || '');
      setDefaultFeedMode(user.settings?.defaultFeedMode || 'detailed');
      setNotifEnabled(user.settings?.notifications ?? true);
    }
  }, [showSettingsModal, user]);

  if (!showSettingsModal || !user) return null;

  const getPreviewAvatar = () => {
    if (selectedAvatarId === 'custom') {
      return avatarUrl || user.avatarUrl || '';
    }
    if (selectedAvatarId === 'gravatar') {
      return user.avatarUrl || '';
    }
    return '';
  };
  const previewImgUrl = getPreviewAvatar();
  const currentPreset = AVATARS.find(av => av.id === selectedAvatarId);

  // Save changes on input changes (autosave with toast feedback)
  const triggerAutosave = (updatedFields) => {
    updateSettings(updatedFields);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 1500);
  };

  const handleNameBlur = () => {
    if (name.trim() && name !== user.name) {
      triggerAutosave({ name: name.trim() });
    }
  };

  const handleAvatarSelect = (avatarId) => {
    setSelectedAvatarId(avatarId);
    setAvatarUrl(''); // Wipes custom photo url to show emoji preset
    triggerAutosave({ avatarId, avatarUrl: null });
  };

  const handleCustomAvatarBlur = () => {
    const trimmed = avatarUrl.trim();
    if (trimmed) {
      if (trimmed !== user.avatarUrl) {
        setSelectedAvatarId('custom');
        triggerAutosave({ avatarId: 'custom', avatarUrl: trimmed });
      }
    } else if (user.avatarId === 'custom') {
      // Revert to gravatar if custom URL is cleared
      setSelectedAvatarId('gravatar');
      triggerAutosave({ avatarId: 'gravatar', avatarUrl: null });
    }
  };

  const handleUseGravatar = () => {
    setSelectedAvatarId('gravatar');
    setAvatarUrl('');
    triggerAutosave({ avatarId: 'gravatar', avatarUrl: null });
  };


  const handleCountryChange = (e) => {
    const val = e.target.value;
    setDefaultCountry(val);
    triggerAutosave({
      settings: {
        ...user.settings,
        defaultCountry: val
      }
    });
  };

  const handleFeedModeChange = (mode) => {
    setDefaultFeedMode(mode);
    triggerAutosave({
      settings: {
        ...user.settings,
        defaultFeedMode: mode
      }
    });
  };

  const handleNotifToggle = () => {
    const newVal = !notifEnabled;
    setNotifEnabled(newVal);
    triggerAutosave({
      settings: {
        ...user.settings,
        notifications: newVal
      }
    });
  };

  // Data Actions
  const handleClearBookmarks = () => {
    if (confirm('Are you sure you want to clear all your saved bookmarks? This action cannot be undone.')) {
      clearBookmarks();
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      axiomUser: user,
      axiomBookmarks: bookmarks,
      exportDate: new Date().toISOString()
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `axiom_news_backup_${user.email.split('@')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteAccount = () => {
    if (confirm('DANGER: Are you sure you want to delete your account? All bookmarks, settings, and profile details will be permanently wiped.')) {
      clearBookmarks();
      logout();
      setShowSettingsModal(false);
    }
  };

  return (
    <div className={styles.overlay} id="settings-modal-overlay" onClick={() => setShowSettingsModal(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} id="settings-modal">
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>General Settings</h2>
          <button 
            className={styles.closeBtn} 
            onClick={() => setShowSettingsModal(false)}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Saved feedback toast inside modal */}
        <div className={`${styles.savedToast} ${showSavedToast ? styles.toastVisible : ''}`}>
          ✨ Preference updated
        </div>

        {/* Content Container */}
        <div className={styles.container}>
          {/* Tabs Sidebar */}
          <aside className={styles.sidebar}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'profile' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('profile')}
              id="settings-tab-profile"
            >
              👤 Profile
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'preferences' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('preferences')}
              id="settings-tab-pref"
            >
              ⚙️ Feed Preferences
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'notifications' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('notifications')}
              id="settings-tab-notif"
            >
              🔔 Notifications
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'data' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('data')}
              id="settings-tab-data"
            >
              🔒 Data & Security
            </button>
          </aside>

          {/* Settings Panel */}
          <main className={styles.panel}>
            {activeTab === 'profile' && (
              <div className={styles.section} id="settings-panel-profile">
                <div className={styles.profileHeader}>
                  <div className={styles.profileHeaderLeft}>
                    <h3 className={styles.panelTitle}>Profile Details</h3>
                    <p className={styles.panelDesc}>Customize how you appear in Axiom News.</p>
                  </div>
                  <div 
                    className={styles.profilePreview}
                    style={{ 
                      background: previewImgUrl ? 'transparent' : (currentPreset?.bg || 'var(--accent-gradient)') 
                    }}
                  >
                    {previewImgUrl ? (
                      <img src={previewImgUrl} alt="Preview" className={styles.profilePreviewImg} />
                    ) : (
                      currentPreset?.emoji || '👤'
                    )}
                  </div>
                </div>

                <div className={styles.avatarGridSection}>
                  <label className={styles.inputLabel}>Choose Avatar</label>
                  <div className={styles.avatarGrid}>
                    {AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        className={`${styles.avatarBtn} ${selectedAvatarId === av.id ? styles.avatarBtnActive : ''}`}
                        style={{ background: av.bg }}
                        onClick={() => handleAvatarSelect(av.id)}
                        title={av.name}
                      >
                        <span className={styles.avatarEmoji}>{av.emoji}</span>
                        <span className={styles.avatarName}>{av.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.customPfpSection}>
                  <label className={styles.inputLabel}>Custom Profile Picture URL</label>
                  <div className={styles.customPfpRow}>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      onBlur={handleCustomAvatarBlur}
                      placeholder="Paste image URL (https://...)"
                    />
                    <button
                      type="button"
                      className={`${styles.resetPfpBtn} ${selectedAvatarId === 'gravatar' ? styles.resetPfpBtnActive : ''}`}
                      onClick={handleUseGravatar}
                    >
                      Use Gmail Photo
                    </button>
                  </div>
                  <small className={styles.fieldHelp}>
                    {selectedAvatarId === 'gravatar' 
                      ? 'Currently using your official Gmail account photo.' 
                      : 'Provide a custom image URL or click "Use Gmail Photo" to load your Google/Gmail account picture.'}
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="settings-name" className={styles.inputLabel}>Display Name</label>
                  <input
                    type="text"
                    id="settings-name"
                    className={styles.textInput}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleNameBlur}
                    placeholder="Enter display name"
                  />
                  <small className={styles.fieldHelp}>Changes are saved automatically when clicking outside the field.</small>
                </div>

                <div className={styles.readOnlyGroup}>
                  <span className={styles.readOnlyLabel}>Email Address</span>
                  <span className={styles.readOnlyValue}>{user.email}</span>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className={styles.section} id="settings-panel-preferences">
                <h3 className={styles.panelTitle}>Feed Preferences</h3>
                <p className={styles.panelDesc}>Set up your personal default viewing mode and homepage filters.</p>

                <div className={styles.formGroup}>
                  <label htmlFor="settings-country" className={styles.inputLabel}>Default Country/Region</label>
                  <select
                    id="settings-country"
                    className={styles.selectInput}
                    value={defaultCountry}
                    onChange={handleCountryChange}
                  >
                    <option value="">🌐 International (All countries)</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                  <small className={styles.fieldHelp}>This region's stories will load first when opening the application.</small>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Default Layout Mode</label>
                  <div className={styles.toggleGroup}>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${defaultFeedMode === 'detailed' ? styles.toggleBtnActive : ''}`}
                      onClick={() => handleFeedModeChange('detailed')}
                    >
                      📰 Detailed Card Grid
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${defaultFeedMode === 'compact' ? styles.toggleBtnActive : ''}`}
                      onClick={() => handleFeedModeChange('compact')}
                    >
                      📝 Compact Headline List
                    </button>
                  </div>
                  <small className={styles.fieldHelp}>Detailed grid renders full thumbnails. Compact view hides previews for density.</small>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className={styles.section} id="settings-panel-notifications">
                <h3 className={styles.panelTitle}>Notification Preferences</h3>
                <p className={styles.panelDesc}>Configure breaking alerts and simulated communication frequencies.</p>

                <div className={styles.settingRow}>
                  <div className={styles.settingMeta}>
                    <span className={styles.settingTitle}>Simulate Breaking News Flashes</span>
                    <span className={styles.settingDesc}>Display instant notifications when global flash articles arrive.</span>
                  </div>
                  <button 
                    type="button"
                    className={`${styles.switchBtn} ${notifEnabled ? styles.switchBtnActive : ''}`}
                    onClick={handleNotifToggle}
                    aria-checked={notifEnabled}
                    role="switch"
                  >
                    <span className={styles.switchHandle}></span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className={styles.section} id="settings-panel-data">
                <h3 className={styles.panelTitle}>Data & Security Management</h3>
                <p className={styles.panelDesc}>Manage and back up your saved data. Wiping account details can be done here.</p>

                <div className={styles.dataCardGrid}>
                  <div className={styles.dataCard}>
                    <span className={styles.dataCardNumber}>{bookmarks.length}</span>
                    <span className={styles.dataCardLabel}>Saved Bookmarks</span>
                  </div>
                  <div className={styles.dataCard}>
                    <span className={styles.dataCardNumber}>Client-Side</span>
                    <span className={styles.dataCardLabel}>Storage Model</span>
                  </div>
                </div>

                <div className={styles.actionBlock}>
                  <button 
                    type="button" 
                    className={`${styles.actionBtn} ${styles.btnOutline}`}
                    onClick={handleExportBackup}
                    id="settings-export-btn"
                  >
                    📥 Export Settings & Bookmarks Backup
                  </button>
                  <p className={styles.actionDesc}>Downloads a backup JSON file to migrate your settings or saved news items to another device.</p>
                </div>

                <div className={styles.actionBlock}>
                  <button 
                    type="button" 
                    className={`${styles.actionBtn} ${styles.btnDangerOutline}`}
                    onClick={handleClearBookmarks}
                    disabled={bookmarks.length === 0}
                    id="settings-clear-bookmarks-btn"
                  >
                    🗑️ Clear Saved Bookmarks ({bookmarks.length})
                  </button>
                </div>

                <hr className={styles.panelDivider} />

                <div className={styles.dangerZone}>
                  <h4 className={styles.dangerTitle}>Danger Zone</h4>
                  <div className={styles.dangerRow}>
                    <div>
                      <span className={styles.dangerRowTitle}>Delete Axiom Account</span>
                      <p className={styles.dangerRowDesc}>This will delete your credentials and bookmarks from local storage. Your settings will revert to defaults.</p>
                    </div>
                    <button 
                      type="button" 
                      className={`${styles.actionBtn} ${styles.btnDanger}`}
                      onClick={handleDeleteAccount}
                      id="settings-delete-account-btn"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
