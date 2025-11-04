import React from 'react';
import './FeedCard.css';

export default function FeedCard({ title, body, meta, actions = [] }) {
  return (
    <article className="feed-card card">
      <div className="feed-inner">
        <h3 className="feed-title">{title}</h3>
        {body && <p className="feed-body">{body}</p>}
        {meta && <div className="feed-meta">{meta}</div>}
        {actions.length > 0 && (
          <div className="feed-actions">
            {actions.map((a, i) =>
              a.href ? (
                <a key={i} className="btn" href={a.href} target="_blank" rel="noreferrer">{a.label}</a>
              ) : (
                <button key={i} className="btn">{a.label}</button>
              )
            )}
          </div>
        )}
      </div>
    </article>
  );
}
