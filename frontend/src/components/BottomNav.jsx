// frontend/src/components/BottomNav.jsx
import React from 'react';
import './BottomNav.css';

export default function BottomNav({ active, onNavigate }) {
  const handleNavigate = (page) => {
    onNavigate(page);
    window.scrollTo(0, 0);
  };

  const navItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
    { 
      id: 'library', 
      label: 'Board', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <line x1="9" y1="3" x2="9" y2="21"/>
        </svg>
      )
    },
    { 
      id: 'directory', 
      label: 'Directory', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      )
    },
    { 
      id: 'help', 
      label: 'Help', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      )
    },
    { 
      id: 'login', 
      label: 'Account', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    }
  ];

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Mobile navigation">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`bn-item ${active === item.id ? 'active' : ''}`}
          onClick={() => handleNavigate(item.id)}
          aria-label={item.label}
          aria-current={active === item.id ? 'page' : undefined}
        >
          <span className="bn-icon" aria-hidden="true">
            {item.icon}
          </span>
          <span className="bn-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}