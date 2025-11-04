// frontend/src/components/CardGrid.jsx
import React from 'react';
import './CardGrid.css';

export default function CardGrid({ items = [], offline = false, type = 'notices' }) {
  return (
    <div className="cg-grid">
      {items.map((it) => (
        <article key={`${type}-${it.id}`} className="cg-card">
          <div className="cg-thumb" aria-hidden />
          <div className="cg-body">
            <h3 className="cg-title">{it.title}</h3>
            <p className="cg-desc">{it.description?.slice(0, 140) || ''}{(it.description || '').length > 140 ? '…' : ''}</p>
            <div className="cg-meta">
              {it.community ? <span className="cg-badge">{it.community}</span> : null}
              {offline ? <span className="cg-badge cg-offline">offline</span> : null}
              {it.status && it.status !== 'approved' ? <span className="cg-badge cg-pending">{it.status}</span> : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
