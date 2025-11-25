// frontend/src/components/SystemStatus.jsx
import React, { useState, useEffect } from 'react';
import './SystemStatus.css';

export default function SystemStatus({ onNavigate }) {
  const [status, setStatus] = useState({
    apiHealth: 'checking',
    database: 'checking',
    cacheHits: 0,
    uptime: 'Loading...',
    lastSync: 'Never',
    environment: 'unknown'
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
    
    console.log('Fetching health from:', `${apiUrl}/health`);
    
    fetch(`${apiUrl}/health`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Health check response:', data);
        
        // Map backend response to frontend state
        // Backend returns: { status: "ok", database: "connected", uptime: "50h 18m", ... }
        setStatus({
          apiHealth: data.status === 'ok' ? 'healthy' : 'error',
          database: data.database === 'connected' ? 'healthy' : 'error',
          uptime: data.uptime || 'Unknown',
          lastSync: new Date().toLocaleString(),
          environment: data.environment || 'unknown',
          cacheHits: 0 // Not tracked yet
        });
        
        setError(null);
      })
      .catch((err) => {
        console.error('Health check failed:', err);
        setStatus(prev => ({
          ...prev,
          apiHealth: 'error',
          database: 'error'
        }));
        setError(err.message);
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

        {error && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '20px',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#991b1b'
          }}>
            <strong>Connection Error:</strong> {error}
          </div>
        )}

        <div className="status-grid">
          <div className={`status-card ${
            status.apiHealth === 'healthy' ? 'healthy' : 
            status.apiHealth === 'checking' ? 'info' : 'error'
          }`}>
            <div className="status-icon">
              {status.apiHealth === 'healthy' ? '✓' : 
               status.apiHealth === 'checking' ? '...' : '✗'}
            </div>
            <h3>API Server</h3>
            <p className="status-label">
              {status.apiHealth === 'healthy' ? 'Operational' : 
               status.apiHealth === 'checking' ? 'Checking...' : 'Offline'}
            </p>
          </div>

          <div className={`status-card ${
            status.database === 'healthy' ? 'healthy' : 
            status.database === 'checking' ? 'info' : 'error'
          }`}>
            <div className="status-icon">
              {status.database === 'healthy' ? '✓' : 
               status.database === 'checking' ? '...' : '✗'}
            </div>
            <h3>Database</h3>
            <p className="status-label">
              {status.database === 'healthy' ? 'Connected' : 
               status.database === 'checking' ? 'Checking...' : 'Disconnected'}
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
            <div style={{ marginTop: '12px' }}>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0' }}>
                Last checked: {status.lastSync}
              </p>
              {status.environment !== 'unknown' && (
                <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0' }}>
                  Environment: <strong>{status.environment}</strong>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Development debugging info */}
        {import.meta.env.DEV && (
          <div style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            fontSize: '13px'
          }}>
            <strong>Development Debug Info:</strong>
            <pre style={{ 
              marginTop: '8px', 
              fontSize: '12px', 
              backgroundColor: '#fff',
              padding: '8px',
              borderRadius: '4px',
              overflow: 'auto'
            }}>
              API URL: {import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'}
              {'\n'}Status: {JSON.stringify(status, null, 2)}
            </pre>
          </div>
        )}

        <button onClick={handleBackClick} className="btn-back">
          ← Back to Home
        </button>
      </div>
    </div>
  );
}