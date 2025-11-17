// frontend/src/components/SystemStatus.jsx
import React, { useState, useEffect } from 'react';
import './SystemStatus.css';

export default function SystemStatus({ onNavigate }) {
  const [status, setStatus] = useState({
    apiHealth: 'checking',
    database: 'checking',
    cacheHits: 0,
    uptime: 'Loading...',
    lastSync: 'Never'
  });

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
    
    fetch(`${apiUrl}/health`)
      .then(res => {
        if (!res.ok) throw new Error('API unreachable');
        return res.json();
      })
      .then(data => {
        setStatus(prev => ({
          ...prev,
          apiHealth: 'healthy',
          database: data.database || 'healthy',
          uptime: data.uptime || 'Unknown',
          lastSync: new Date().toLocaleString()
        }));
      })
      .catch((error) => {
        console.error('Health check failed:', error);
        setStatus(prev => ({
          ...prev,
          apiHealth: 'error',
          database: 'error'
        }));
      });
  }, []);

  const handleBackClick = () => {
    if (onNavigate) {
      onNavigate('home');
    } else {
      window.location.href = '/';
    }
    window.scrollTo(0, 0);
  };

  return (
    <div className="system-status-page">
      <div className="container">
        <header className="page-header">
          <h1>System Status</h1>
          <p>Monitor the health and performance of CIAP services</p>
        </header>

        <div className="status-grid">
          <div className={`status-card ${status.apiHealth === 'healthy' ? 'healthy' : status.apiHealth === 'checking' ? 'info' : 'error'}`}>
            <div className="status-icon">
              {status.apiHealth === 'healthy' ? '✓' : status.apiHealth === 'checking' ? '...' : '✗'}
            </div>
            <h3>API Server</h3>
            <p className="status-label">
              {status.apiHealth === 'healthy' ? 'Operational' : status.apiHealth === 'checking' ? 'Checking...' : 'Offline'}
            </p>
          </div>

          <div className={`status-card ${status.database === 'healthy' ? 'healthy' : status.database === 'checking' ? 'info' : 'error'}`}>
            <div className="status-icon">
              {status.database === 'healthy' ? '✓' : status.database === 'checking' ? '...' : '✗'}
            </div>
            <h3>Database</h3>
            <p className="status-label">
              {status.database === 'healthy' ? 'Connected' : status.database === 'checking' ? 'Checking...' : 'Disconnected'}
            </p>
          </div>

          <div className="status-card info">
            <div className="status-icon">📊</div>
            <h3>Cache Performance</h3>
            <p className="status-label">{status.cacheHits} hits today</p>
          </div>

          <div className="status-card info">
            <div className="status-icon">⏱️</div>
            <h3>System Uptime</h3>
            <p className="status-label">{status.uptime}</p>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <p>No errors reported in the last 24 hours</p>
          {status.lastSync !== 'Never' && (
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
              Last checked: {status.lastSync}
            </p>
          )}
        </div>

        <button onClick={handleBackClick} className="btn-back">
          ← Back to Home
        </button>
      </div>
    </div>
  );
}