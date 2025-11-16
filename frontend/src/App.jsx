import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

import { COMMUNITY_NAME, ENDPOINTS, API_BASE } from './config/appConfig.jsx';
import { AuthProvider, useAuth } from './context/AuthContext';

import OfflineIndicator from './components/OfflineIndicator.jsx';
import BottomNav from './components/BottomNav.jsx';
import Footer from './components/Footer.jsx';
import ContentBrowser from './components/ContentBrowser.jsx';
import PerformanceMetrics from './components/PerformanceMetrics.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import DirectoryPage from './components/DirectoryPage.jsx';
import HelpCenter from './components/HelpCenter.jsx'; // NEW - Line 14
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

// Auth pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

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

  // Handle "View All" clicks from sections
  const handleViewAll = (section) => {
    if (section === 'jobs' || section === 'skills' || section === 'notices') {
      setPage('library');
    } else if (section === 'directory') {
      setPage('directory');
    } else if (section === 'events') {
      console.log('Events page coming soon');
    }
  };

  // Handle category selection from CategoryRow
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

  // Handle submit content
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
      <OfflineIndicator online={online} />

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

          {/* Floating Action Button - Submit Content */}
          <div className="fab-container">
            <button 
              className="fab" 
              onClick={() => handleSubmit('notices')}
              aria-label="Submit content"
            >
              + Submit Content
            </button>
          </div>

          {/* Dev Mode Footer */}
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

      {/* UPDATED: Community Board - No extra container */}
      {page === 'library' && (
        <main style={{ paddingTop: 20, paddingBottom: 80 }}>
          <ContentBrowser />
        </main>
      )}

      {/* UPDATED: Directory - No extra container */}
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
        <main className="container" style={{ paddingTop: 20, paddingBottom: 80 }}>
          {isAuthenticated && (user?.role === 'admin' || user?.role === 'moderator') ? (
            <AdminDashboard />
          ) : (
            <div className="card section">
              <h2>Access Denied</h2>
              <p>You need admin or moderator privileges to access this page.</p>
              <button className="btn btn-primary" onClick={() => setPage('login')}>
                Log In
              </button>
            </div>
          )}
        </main>
      )}

      {/* UPDATED: Help Center with new component */}
      {page === 'help' && (
        <main style={{ paddingTop: 20, paddingBottom: 80 }}>
          <HelpCenter onNavigate={setPage} />
        </main>
      )}

      {page === 'login' && (
        <LoginPage onSuccess={() => setPage('home')} />
      )}

      {page === 'register' && (
        <RegisterPage onSuccess={() => setPage('home')} />
      )}

      {/* Submit Form Modal */}
      {showSubmitModal && (
        <SubmitForm
          type={submitType}
          onClose={() => setShowSubmitModal(false)}
          onSuccess={handleSubmitSuccess}
        />
      )}

      <Footer community={community} onNavigate={setPage} />
      <BottomNav active={page} onNavigate={setPage} />
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