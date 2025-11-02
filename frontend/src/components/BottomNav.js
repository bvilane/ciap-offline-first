import React from 'react';
import './BottomNav.css';

export default function BottomNav({ active, onNavigate }) {
  const Item = ({ id, label }) => (
    <button
      className={`bn-item ${active === id ? 'active' : ''}`}
      onClick={() => onNavigate(id)}
      aria-label={label}
    >
      <span className="bn-label">{label}</span>
    </button>
  );

  return (
    <div className="bottom-nav">
      <Item id="home" label="Home" />
      <Item id="library" label="Library" />
      <Item id="directory" label="Directory" />
      <Item id="metrics" label="Metrics" />
      <Item id="admin" label="Admin" />
    </div>
  );
}
