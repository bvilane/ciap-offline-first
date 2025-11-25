import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

import { COMMUNITY_NAME, ENDPOINTS, API_BASE } from './config/appConfig.jsx';
import { AuthProvider, useAuth } from './context/AuthContext';

import OfflineBanner from './components/OfflineBanner.jsx';
import BottomNav from './components/BottomNav.jsx';
import Footer from './components/Footer.jsx';
import ContentBrowser from './components/ContentBrowser.jsx';
import PerformanceMetrics from './components/PerformanceMetrics.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import DirectoryPage from './components/DirectoryPage.jsx';
import HelpCenter from './components/HelpCenter.jsx';
import SystemStatus from './components/SystemStatus.jsx';
import HeaderBar from './components/home/HeaderBar.jsx';
import HeroCarousel from './components/home/HeroCarousel.jsx';
import CategoryRow from './components/home/CategoryRow.jsx';
import FeaturedSection from './components/home/FeaturedSection.jsx';
import JobsSection from './components/home/JobsSection.jsx';
import SkillsSection from './components/home/SkillsSection.jsx';
import NoticesSection from './components/home/NoticesSection.jsx';
import DirectoryPreview from './components/home/DirectoryPreview.jsx';
import EventsSection from './components/home/EventsSection.jsx';
import SubmitForm from './components/SubmitForm.jsx';
import FloatingActionButton from './components/FloatingActionButton.jsx';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  const [page, setPage] = useState('home');
  const [community, setCommunity] = useState(import.meta.env.VITE_COMMUNITY || COMMUNITY_NAME);
  const [query, setQuery] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitType, setSubmitType] = useState('notices');

  const apiUrl = useMemo(() => API_BASE, []);

  const handleViewAll = (section) => {
    if (section === 'jobs' || section === 'skills' || section === 'notices') {
      setPage('library');
    } else if (section === 'directory') {
      setPage('directory');
    } else if (section === 'events') {
      console.log('Events page coming soon');
    }
  };

  const handleCategorySelect = (target, key) => {
    if (target === 'directory') {
      setPage('directory');
    } else if (target === 'library') {
      setPage('library');
    } else {
      setPage('home');
      setTimeout(() => {
        const element = document.getElementById('whats-happening');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleSubmit = (type = 'notices') => {
    setSubmitType(type);
    setShowSubmitModal(true);
  };

  const handleSubmitSuccess = () => {
    alert('✓ Submission received! It will be reviewed by community moderators.');
    setShowSubmitModal(false);
  };

  return (
    <div className="App">
      
      <OfflineBanner isOnline={online} />

      <HeaderBar
        brandTitle="CIAP – Community Internet Access Platform"
        subtitle="Offline-First Content Delivery System"
        community={community}
        onCommunityChange={setCommunity}
        query={query}
        onQueryChange={setQuery}
        onNavigate={setPage}
        user={user}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
      />

      {page === 'home' && (
        <>
          <HeroCarousel />

          <div className="container">
            <CategoryRow onSelect={handleCategorySelect} />
          </div>

          <div id="whats-happening" aria-label="What's happening section" />

          <FeaturedSection 
            apiBase={apiUrl}
            community={community}
          />

          <JobsSection 
            apiBase={apiUrl}
            community={community}
            onViewAll={handleViewAll}
          />

          <SkillsSection 
            apiBase={apiUrl}
            community={community}
            onViewAll={handleViewAll}
          />

          <NoticesSection 
            apiBase={apiUrl}
            community={community}
            onViewAll={handleViewAll}
          />

          <DirectoryPreview 
            apiBase={apiUrl}
            community={community}
            onViewAll={handleViewAll}
          />

          <EventsSection 
            apiBase={apiUrl}
            community={community}
            onViewAll={handleViewAll}
          />

          {/* Desktop Submit Button (original) */}
          <div className="fab-container">
            <button 
              className="fab" 
              onClick={() => handleSubmit('notices')}
              aria-label="Submit content"
            >
              + Submit Content
            </button>
          </div>

          {/* Mobile FAB (new - auto-hides on desktop) */}
          <FloatingActionButton />

          {import.meta.env.DEV && (
            <footer className="container" style={{ marginTop: 40, marginBottom: 40 }}>
              <div className="card section" style={{ padding: 16, textAlign: 'center' }}>
                <span className="subtle">
                  Dev Mode: API Base: <strong>{apiUrl}</strong> • Community: <strong>{community}</strong>
                  {isAuthenticated && ` • Logged in as: ${user?.email} (${user?.role})`}
                </span>
              </div>
            </footer>
          )}
        </>
      )}

      {page === 'library' && (
        <main style={{ paddingTop: 20, paddingBottom: 80 }}>
          <ContentBrowser />
        </main>
      )}

      {page === 'directory' && (
        <main style={{ paddingTop: 20, paddingBottom: 80 }}>
          <DirectoryPage />
        </main>
      )}

      {page === 'metrics' && (
        <main className="container" style={{ paddingTop: 20, paddingBottom: 80 }}>
          <PerformanceMetrics />
        </main>
      )}

      {page === 'admin' && (
        <>
          {isAuthenticated && (user?.role === 'admin' || user?.role === 'moderator') ? (
            <AdminDashboard onNavigate={setPage} />
          ) : (
            <main className="container" style={{ paddingTop: 20, paddingBottom: 80 }}>
              <div className="card section">
                <h2>Access Denied</h2>
                <p>You need admin or moderator privileges to access this page.</p>
                <button className="btn btn-primary" onClick={() => setPage('login')}>
                  Log In
                </button>
              </div>
            </main>
          )}
        </>
      )}

      {page === 'help' && (
        <main style={{ paddingTop: 20, paddingBottom: 80 }}>
          <HelpCenter onNavigate={setPage} />
        </main>
      )}

      {page === 'system-status' && (
        <main style={{ paddingTop: 20, paddingBottom: 80 }}>
          <SystemStatus onNavigate={setPage} />
        </main>
      )}

      {page === 'support' && (
        <main className="container" style={{ paddingTop: 20, paddingBottom: 80 }}>
          <div className="card section">
            <h1>Support</h1>
            <h2>Frequently Asked Questions</h2>
            
            <div style={{ marginTop: 20 }}>
              <h3>How do I submit content?</h3>
              <p>Click the "+ Submit Content" button on the home page or Community Board.</p>
              
              <h3>How do I access content offline?</h3>
              <p>Visit pages while online - they will be cached automatically for offline access.</p>
              
              <h3>Who can approve submissions?</h3>
              <p>Community moderators and administrators review all submissions.</p>
              
              <h3>Need more help?</h3>
              <p>
                Visit the{' '}
                <button 
                  onClick={() => setPage('help')} 
                  style={{
                    color: '#2563eb', 
                    textDecoration: 'underline', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    fontSize: 'inherit',
                    padding: 0
                  }}
                >
                  Help Center
                </button>
                {' '}or contact your local CIAP administrator.
              </p>
            </div>
            
            <button onClick={() => setPage('home')} className="btn btn-primary" style={{ marginTop: 20 }}>
              ← Back to Home
            </button>
          </div>
        </main>
      )}

      {page === 'contact' && (
        <main className="container" style={{ paddingTop: 20, paddingBottom: 80 }}>
          <div className="card section">
            <h1>Contact Us</h1>
            
            <div style={{ marginTop: 20 }}>
              <h3>CIAP Community Platform</h3>
              <p><strong>Email:</strong> support@ciap.local</p>
              <p><strong>Phone:</strong> +27 XX XXX XXXX</p>
              <p><strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM</p>
              
              <h3 style={{ marginTop: 30 }}>Local Administrator</h3>
              <p>For technical support or content moderation inquiries, contact your local CIAP administrator at {community}.</p>
              
              <h3 style={{ marginTop: 30 }}>Emergency Contact</h3>
              <p>
                For urgent technical issues affecting community access, visit the{' '}
                <button 
                  onClick={() => setPage('help')} 
                  style={{
                    color: '#2563eb', 
                    textDecoration: 'underline', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    fontSize: 'inherit',
                    padding: 0
                  }}
                >
                  Help Center
                </button>.
              </p>
            </div>
            
            <button onClick={() => setPage('home')} className="btn btn-primary" style={{ marginTop: 20 }}>
              ← Back to Home
            </button>
          </div>
        </main>
      )}

      {page === 'login' && (
        <LoginPage onSuccess={() => setPage('home')} />
      )}

      {page === 'register' && (
        <RegisterPage onSuccess={() => setPage('home')} />
      )}

      {page === 'privacy-policy' && (
        <PrivacyPolicyPage onNavigate={setPage} />
      )}

      {showSubmitModal && (
        <SubmitForm
          type={submitType}
          onClose={() => setShowSubmitModal(false)}
          onSuccess={handleSubmitSuccess}
        />
      )}

      {page !== 'admin' && <Footer community={community} onNavigate={setPage} />}
      {page !== 'admin' && <BottomNav active={page} onNavigate={setPage} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}