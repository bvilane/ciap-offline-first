// frontend/src/components/OfflineBanner.jsx
import React from 'react';
import './OfflineBanner.css';

export default function OfflineBanner({ isOnline }) {
  return (
    <div className={`offline-banner ${isOnline ? 'online' : 'offline'}`}>
      {isOnline ? (
        'Online'
      ) : (
        <>
          Offline - Viewing cached content
          <button 
            className="sync-button"
            onClick={() => window.location.reload()}
            title="Refresh to sync latest content"
          >
            Sync Now
          </button>
        </>
      )}
    </div>
  );
}