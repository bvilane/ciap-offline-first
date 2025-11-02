import React from 'react';
import './HeaderBar.css';

const COMMUNITIES = [
  'Acornhoek',
  'Hoedspruit',
  'Timbavati',
  'Mbombela',
  'Custom…'
];

export default function HeaderBar({
  brandTitle,
  subtitle,
  community,
  onCommunityChange,
  query,
  onQueryChange,
  onNavigate
}) {
  const handleCommunity = (e) => {
    const val = e.target.value;
    if (val === 'Custom…') {
      const custom = window.prompt('Enter community name');
      if (custom && custom.trim()) onCommunityChange(custom.trim());
    } else {
      onCommunityChange(val);
    }
  };

  return (
    <header className="ciap-header">
      <div className="ciap-header__brand">
        <div className="ciap-logo" aria-hidden>🌍</div>
        <div>
          <div className="ciap-title">{brandTitle}</div>
          <div className="ciap-subtitle">{subtitle}</div>
        </div>
      </div>

      <div className="ciap-header__search">
        <input
          className="ciap-search"
          placeholder="Search community updates, services, news…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('home')}
        />
      </div>

      <div className="ciap-header__actions">
        <select className="ciap-select" value={community} onChange={handleCommunity}>
          {COMMUNITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <nav className="ciap-nav">
          <button onClick={() => onNavigate('home')}>Explore</button>
          <button onClick={() => onNavigate('library')}>Community Board</button>
          <button onClick={() => onNavigate('metrics')}>Help Center</button>
          <button onClick={() => onNavigate('directory')}>Directory</button>
          <button onClick={() => onNavigate('admin')}>Log In</button>
        </nav>
      </div>
    </header>
  );
}
