import React from 'react';
import './BottomNav.css';

export default function BottomNav({ active, onNavigate }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'library', label: 'Board', icon: '📋' },
    { id: 'directory', label: 'Directory', icon: '🏢' },
    { id: 'help', label: 'Help', icon: '💬' },
    { id: 'login', label: 'Account', icon: '👤' }
  ];

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Mobile navigation">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`bn-item ${active === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
          aria-label={item.label}
          aria-current={active === item.id ? 'page' : undefined}
        >
          <span className="bn-icon" role="img" aria-hidden="true">
            {item.icon}
          </span>
          <span className="bn-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}