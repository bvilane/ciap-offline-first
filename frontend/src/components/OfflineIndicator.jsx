import React from 'react';
import './OfflineIndicator.css';

export default function OfflineIndicator({ online }) {
  return (
    <div className={`offline-banner ${online ? 'online' : 'offline'}`}>
      {online ? 'Online' : 'Offline'}
    </div>
  );
}
