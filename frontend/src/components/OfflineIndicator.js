import React from 'react';
import './OfflineIndicator.css';

function OfflineIndicator({ isOnline, cacheStats }) {
  return (
    <div className={`offline-indicator ${isOnline ? 'online' : 'offline'}`}>
      <div className="indicator-content">
        <div className="status-badge">
          {isOnline ? (
            <>
              <span className="status-icon">🌐</span>
              <span className="status-text">ONLINE</span>
            </>
          ) : (
            <>
              <span className="status-icon">📴</span>
              <span className="status-text">OFFLINE MODE</span>
            </>
          )}
        </div>

        {!isOnline && (
          <div className="offline-message">
            <strong>✅ Offline-First Active</strong>
            <p>You can continue browsing cached content</p>
          </div>
        )}

        {cacheStats && (
          <div className="cache-info">
            <span>📦 Cache Size: {cacheStats.size}</span>
          </div>
        )}
      </div>

      {!isOnline && (
        <div className="offline-banner">
          <p>
            <strong>🎯 DEMONSTRATION:</strong> This content is being served
            from local cache, proving offline-first architecture works!
          </p>
        </div>
      )}
    </div>
  );
}

export default OfflineIndicator;