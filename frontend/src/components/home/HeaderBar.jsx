import React, { useState } from 'react';
import './HeaderBar.css';
import Logo from './Logo';

const COMMUNITIES = [
  'Acornhoek',
  'Hoedspruit',
  'Timbavati',
  'Mbombela',
  'Custom…'
];

const NAV_ITEMS = [
  { id: 'home', label: 'Explore' },
  { id: 'library', label: 'Community Board' },
  { id: 'help', label: 'Help Center' },
  { id: 'directory', label: 'Directory' },
  { id: 'login', label: 'Log In' }
];

export default function HeaderBar({
  brandTitle = 'CIAP',
  subtitle = 'Community Internet Access Platform',
  community,
  onCommunityChange,
  onNavigate,
  query,
  onQueryChange
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (pageId) => {
    onNavigate?.(pageId);
    setMenuOpen(false); // Close menu after navigation
  };

  return (
    <>
      <header className="ciap-header">
        {/* Left: Brand + Logo */}
        <div 
          className="ciap-header__brand" 
          onClick={() => handleNavClick('home')} 
          role="button" 
          aria-label="Go home"
        >
          <div className="ciap-logo">
            <Logo variant="light" height={28} alt="CIAP logo" />
          </div>
          <div className="ciap-brandtext">
            <div className="title">{brandTitle}</div>
            <div className="subtitle">{subtitle}</div>
          </div>
        </div>

        {/* Center: Search Bar (always visible) */}
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

        {/* Right: Community Selector + Nav (desktop) / Burger (mobile) */}
        <div className="ciap-header__actions">
          <select
            className="ciap-select"
            value={community}
            onChange={(e) => onCommunityChange?.(e.target.value)}
            aria-label="Select community"
          >
            {COMMUNITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Desktop Nav */}
          <nav className="ciap-nav ciap-nav--desktop" aria-label="Primary navigation">
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => handleNavClick(item.id)}>
                {item.label}
              </button>
            ))}
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

      {/* Mobile Slide-out Menu */}
      {menuOpen && (
        <>
          <div 
            className="ciap-overlay" 
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          ></div>
          <nav className="ciap-nav--mobile" aria-label="Mobile navigation">
            {NAV_ITEMS.map(item => (
              <button 
                key={item.id} 
                className="mobile-nav-item"
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </>
      )}
    </>
  );
}