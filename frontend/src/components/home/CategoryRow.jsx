import React from 'react';
import './CategoryRow.css';

const CATEGORIES = [
  { key: 'news', label: 'Local News', icon: '📰', target: 'home' },
  { key: 'events', label: 'Community Events', icon: '📅', target: 'home', badge: 'New' },
  { key: 'health', label: 'Health & Wellness', icon: '🏥', target: 'home' },
  { key: 'arts', label: 'Arts & Culture', icon: '🎨', target: 'home' },
  { key: 'sports', label: 'Sports & Recreation', icon: '⚽', target: 'home' },
  { key: 'directory', label: 'Business Directory', icon: '🏢', target: 'directory' },
  { key: 'education', label: 'Education', icon: '📚', target: 'library' },
  { key: 'food', label: 'Food & Dining', icon: '🍽️', target: 'home' },
];

export default function CategoryRow({ onSelect }) {
  return (
    <div className="catrow" role="navigation" aria-label="Category navigation">
      <div className="catrow-scroll">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className="catrow-item"
            onClick={() => onSelect(cat.target, cat.key)}
            aria-label={cat.label}
          >
            <span className="catrow-icon" role="img" aria-hidden="true">
              {cat.icon}
            </span>
            <span className="catrow-label">{cat.label}</span>
            {cat.badge && <span className="catrow-badge">{cat.badge}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}