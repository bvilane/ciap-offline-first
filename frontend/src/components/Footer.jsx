// frontend/src/components/Footer.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Footer.css';

export default function Footer({ community, onNavigate }) {
  const { user, isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  const handleNavigate = (page) => {
    onNavigate(page);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="site-footer">
      <div className="container">
        
        {/* Footer Grid */}
        <div className="footer-grid">

          {/* About Section */}
          <div className="footer-col">
            <h3 className="footer-heading">CIAP</h3>
            <p className="footer-text">
              Community Internet Access Platform providing offline-first digital access to underserved communities across South Africa.
            </p>
            <p className="footer-text">
              Currently serving: <strong>{community || 'Acornhoek'}</strong>
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h3 className="footer-heading">Explore</h3>
            <ul className="footer-links">
              <li><button onClick={() => handleNavigate('home')}>Home</button></li>
              <li><button onClick={() => handleNavigate('library')}>Community Board</button></li>
              <li><button onClick={() => handleNavigate('directory')}>Local Directory</button></li>
              <li><button onClick={() => handleNavigate('help')}>Help Center</button></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-col">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links">
              <li><button onClick={() => handleNavigate('library')}>Jobs & Opportunities</button></li>
              <li><button onClick={() => handleNavigate('library')}>Skills & Training</button></li>
              <li><button onClick={() => handleNavigate('library')}>Community Notices</button></li>
              <li><button onClick={() => handleNavigate('system-status')}>System Status</button></li>
            </ul>
          </div>

          {/* Account Section */}
          <div className="footer-col">
            <h3 className="footer-heading">Account</h3>
            <ul className="footer-links">
              <li><button onClick={() => handleNavigate('login')}>Sign In</button></li>

              {/* Admin Dashboard for authenticated admin */}
              {isAuthenticated && user?.role === 'admin' && (
                <li><button onClick={() => handleNavigate('admin')}>Admin Dashboard</button></li>
              )}

              <li><button onClick={() => handleNavigate('support')}>Support</button></li>
              <li><button onClick={() => handleNavigate('contact')}>Contact Us</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} CIAP - Community Internet Access Platform. Built for offline-first access.
          </p>

          <div className="footer-links-bottom">
            <button onClick={() => handleNavigate('privacy-policy')}>Privacy Policy</button>
            <span className="footer-separator">•</span>
            <button onClick={() => handleNavigate('contact')}>Contact</button>
          </div>

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
