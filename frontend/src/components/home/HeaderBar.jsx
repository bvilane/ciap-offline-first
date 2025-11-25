import React, { useState } from 'react';
import './HeaderBar.css';
import Logo from './Logo';
import AuthModal from '../AuthModal';

const COMMUNITIES = [
  'Acornhoek',
  'Hoedspruit',
  'Timbavati',
  'Mbombela',
  'Custom…'
];

export default function HeaderBar({
  brandTitle = 'CIAP',
  subtitle = 'Community Internet Access Platform',
  community,
  onCommunityChange,
  onNavigate,
  query,
  onQueryChange,
  user,
  isAuthenticated,
  onLogout
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const handleNavClick = (pageId) => {
    // Handle auth modals
    if (pageId === 'login') {
      setAuthModalTab('login');
      setAuthModalOpen(true);
      setMenuOpen(false);
      return;
    }
    if (pageId === 'register') {
      setAuthModalTab('signup');
      setAuthModalOpen(true);
      setMenuOpen(false);
      return;
    }
    
    onNavigate?.(pageId);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout?.();
    setMenuOpen(false);
    setAccountDropdownOpen(false);
  };

  // Dynamic nav items
  const getNavItems = () => {
    const baseItems = [
      { id: 'home', label: 'Explore' },
      { id: 'library', label: 'Community Board' },
      { id: 'directory', label: 'Directory' },
      { id: 'help', label: 'Help Center' }
    ];

    if (isAuthenticated && (user?.role === 'admin' || user?.role === 'moderator')) {
      baseItems.push({ id: 'admin', label: 'Admin Dashboard' });
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <>
      <header className="ciap-header">
        {/* Left: Logo Only */}
        <div 
          className="ciap-header__brand" 
          onClick={() => handleNavClick('home')} 
          role="button" 
          aria-label="Go home"
        >
          <div className="ciap-logo">
            <Logo variant="light" height={28} alt="CIAP logo" />
          </div>
          {/* Desktop: Show brand text */}
          <div className="ciap-brandtext ciap-brandtext--desktop">
            <div className="title">{brandTitle}</div>
            <div className="subtitle">{subtitle}</div>
          </div>
        </div>

        {/* Desktop: Center Search Bar */}
        <div className="ciap-header__search">
          <input
            className="ciap-search"
            type="search"
            placeholder="Search notices, jobs, skills…"
            value={query || ''}
            onChange={(e) => onQueryChange?.(e.target.value)}
            aria-label="Search content"
          />
        </div>

        {/* Mobile Only: Center Community Selector */}
        <div className="ciap-header__center">
          <select
            className="ciap-select ciap-select--mobile"
            value={community}
            onChange={(e) => onCommunityChange?.(e.target.value)}
            aria-label="Select community"
          >
            {COMMUNITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Right: Nav + Account + Community (Desktop) + Burger */}
        <div className="ciap-header__actions">
          {/* Desktop Community Selector */}
          <select
            className="ciap-select ciap-select--desktop"
            value={community}
            onChange={(e) => onCommunityChange?.(e.target.value)}
            aria-label="Select community"
          >
            {COMMUNITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Desktop Nav */}
          <nav className="ciap-nav ciap-nav--desktop" aria-label="Primary navigation">
            {navItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => handleNavClick(item.id)}
                className="nav-btn"
              >
                {item.label}
              </button>
            ))}
            
            {/* Account Button/Dropdown */}
            {isAuthenticated ? (
              <div className="account-dropdown">
                <button 
                  className="account-btn"
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  aria-expanded={accountDropdownOpen}
                >
                  <svg className="account-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>{user?.name || user?.email?.split('@')[0]}</span>
                </button>
                
                {accountDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <strong>{user?.name || user?.email}</strong>
                      <span className="user-role-badge">{user?.role}</span>
                    </div>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="account-btn login-btn"
                onClick={() => {
                  setAuthModalTab('login');
                  setAuthModalOpen(true);
                }}
              >
                <svg className="account-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Sign In</span>
              </button>
            )}
          </nav>

          {/* Mobile Burger */}
          <button 
            className="ciap-burger" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span className="burger-line"></span>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </button>
        </div>
      </header>

      {/* Mobile Search Bar (Below Header) */}
      <div className="ciap-mobile-search">
        <input
          className="ciap-search"
          type="search"
          placeholder="Search notices, jobs, skills…"
          value={query || ''}
          onChange={(e) => onQueryChange?.(e.target.value)}
          aria-label="Search content"
        />
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <>
          <div 
            className="ciap-overlay" 
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          ></div>
          <nav className="ciap-nav--mobile" aria-label="Mobile navigation">
            {/* Close Button Inside Menu */}
            <button 
              className="mobile-close-btn"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              ×
            </button>

            {isAuthenticated && (
              <div className="mobile-user-info">
                <strong>{user?.name || user?.email}</strong>
                <span className="user-role">{user?.role}</span>
              </div>
            )}
            
            {navItems.map(item => (
              <button 
                key={item.id} 
                className="mobile-nav-item"
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            ))}
            
            {isAuthenticated ? (
              <button 
                className="mobile-nav-item logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <button 
                className="mobile-nav-item"
                onClick={() => {
                  setAuthModalTab('login');
                  setAuthModalOpen(true);
                  setMenuOpen(false);
                }}
              >
                Sign In
              </button>
            )}
          </nav>
        </>
      )}

      {/* Auth Modal */}
      {authModalOpen && (
        <AuthModal
          initialTab={authModalTab}
          onClose={() => setAuthModalOpen(false)}
          onNavigate={onNavigate}
        />
      )}
    </>
  );
}