// frontend/src/components/Footer.jsx
import React from 'react';
import './Footer.css';

export default function Footer({ community, onNavigate }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* About Section */}
          <div className="footer-col">
            <h3 className="footer-heading">CIAP</h3>
            <p className="footer-text">
              Community Internet Access Platform providing offline-first digital access to underserved communities across South Africa.
            </p>
            <p className="footer-text">
              Currently serving: <strong>{community}</strong>
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h3 className="footer-heading">Explore</h3>
            <ul className="footer-links">
              <li><button onClick={() => onNavigate('home')}>Home</button></li>
              <li><button onClick={() => onNavigate('library')}>Community Board</button></li>
              <li><button onClick={() => onNavigate('directory')}>Local Directory</button></li>
              <li><button onClick={() => onNavigate('help')}>Help Center</button></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-col">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links">
              <li><button onClick={() => onNavigate('library')}>Jobs & Opportunities</button></li>
              <li><button onClick={() => onNavigate('library')}>Skills & Training</button></li>
              <li><button onClick={() => onNavigate('library')}>Community Notices</button></li>
              <li><button onClick={() => onNavigate('metrics')}>System Status</button></li>
            </ul>
          </div>

          {/* Admin & Account */}
          <div className="footer-col">
            <h3 className="footer-heading">Account</h3>
            <ul className="footer-links">
              <li><button onClick={() => onNavigate('login')}>Sign In</button></li>
              <li><button onClick={() => onNavigate('admin')}>Admin Dashboard</button></li>
              <li><button onClick={() => onNavigate('help')}>Support</button></li>
              <li><button onClick={() => onNavigate('help')}>Contact Us</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} CIAP - Community Internet Access Platform. Built for offline-first access.
          </p>
          <div className="footer-meta">
            <span className="footer-badge">Open Source</span>
            <span className="footer-badge">Offline-First</span>
            <span className="footer-badge">Community-Driven</span>
          </div>
        </div>
      </div>
    </footer>
  );
}