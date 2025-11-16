import React from 'react';
import './HelpCenter.css';

export default function HelpCenter({ onNavigate }) {
  return (
    <div className="help-center-page">
      <div className="help-header">
        <h1>Help Center</h1>
        <p className="help-subtitle">
          Emergency contacts, support tickets, and community guides.
        </p>
      </div>

      <div className="help-content">
        <div className="help-section">
          <h2>🚨 Emergency Contacts</h2>
          <ul className="help-list">
            <li>
              <strong>Emergency Services:</strong>{' '}
              <a href="tel:10111" className="help-link">10111</a>
            </li>
            <li>
              <strong>Ambulance:</strong>{' '}
              <a href="tel:10177" className="help-link">10177</a>
            </li>
            <li>
              <strong>Fire Department:</strong>{' '}
              <a href="tel:10111" className="help-link">10111</a>
            </li>
          </ul>
        </div>

        <div className="help-section">
          <h2>📚 Getting Started</h2>
          <p>
            CIAP (Community Internet Access Platform) provides offline-first
            access to local content, jobs, skills, and services.
          </p>
          <ul className="help-list">
            <li>Browse cached educational resources</li>
            <li>Find local jobs and opportunities</li>
            <li>Connect with community services</li>
            <li>Access content even when offline</li>
          </ul>
        </div>

        <div className="help-section">
          <h2>💬 Support</h2>
          <p>
            Need help? Support tickets and community forums are coming soon.
          </p>
          <button 
            className="help-back-btn"
            onClick={() => onNavigate?.('home')}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}