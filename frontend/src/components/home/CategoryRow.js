import React from 'react';
import './CategoryRow.css';

const CATS = [
  { key: 'news', label: 'Local News' },
  { key: 'events', label: 'Community Events' },
  { key: 'health', label: 'Health & Wellness' },
  { key: 'arts', label: 'Arts & Culture' },
  { key: 'sports', label: 'Sports & Recreation' },
  { key: 'directory', label: 'Business Directory', target: 'directory' },
  { key: 'education', label: 'Education', target: 'library' },
  { key: 'food', label: 'Food & Dining' },
];

export default function CategoryRow({ onSelect }) {
  return (
    <div className="catrow">
      {CATS.map((c, idx) => (
        <button
          key={c.key}
          className={`catrow-item ${idx===1 ? 'new':''}`}
          onClick={() => onSelect(c.target || 'home')}
        >
          <span className="circle" />
          <span className="label">{c.label}</span>
          {idx===1 && <span className="badge">New</span>}
        </button>
      ))}
    </div>
  );
}
