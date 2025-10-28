/**
 * Main CIAP Application
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ContentBrowser from './components/ContentBrowser';
import AdminDashboard from './components/AdminDashboard';
import PerformanceMetrics from './components/PerformanceMetrics';
import OfflineIndicator from './components/OfflineIndicator';
import { registerServiceWorker } from './utils/serviceWorkerRegistration';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swRegistration, setSwRegistration] = useState(null);
  const [cacheStats, setCacheStats] = useState(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Connection restored');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('📴 Connection lost - Offline mode');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Register Service Worker
  useEffect(() => {
    registerServiceWorker()
      .then((registration) => {
        console.log('✅ Service Worker registered');
        setSwRegistration(registration);
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  }, []);

  // Get cache statistics
  useEffect(() => {
    if (swRegistration && swRegistration.active) {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.size !== undefined) {
          setCacheStats({
            size: (event.data.size / (1024 * 1024)).toFixed(2) + ' MB',
          });
        }
      };

      swRegistration.active.postMessage(
        { type: 'GET_CACHE_SIZE' },
        [messageChannel.port2]
      );
    }
  }, [swRegistration]);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-content">
            <h1>🌐 CIAP - Community Internet Access Platform</h1>
            <p className="subtitle">Offline-First Content Delivery System</p>
          </div>
          
          <OfflineIndicator isOnline={isOnline} cacheStats={cacheStats} />
          
          <nav className="main-nav">
            <Link to="/" className="nav-link">📚 Browse Content</Link>
            <Link to="/admin" className="nav-link">⚙️ Admin Dashboard</Link>
            <Link to="/metrics" className="nav-link">📊 Performance Metrics</Link>
          </nav>
        </header>

        <main className="App-main">
          <Routes>
            <Route path="/" element={<ContentBrowser isOnline={isOnline} />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/metrics" element={<PerformanceMetrics />} />
          </Routes>
        </main>

        <footer className="App-footer">
          <p>
            🎓 Software Engineering Capstone Project | Bavukile Vilane | ALU
          </p>
          <p className="tech-stack">
            Built with: React, Node.js, Express, Service Workers, SQLite
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;