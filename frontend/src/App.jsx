import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

import { COMMUNITY_NAME, ENDPOINTS, API_BASE } from './config/appConfig.jsx';

import OfflineIndicator from './components/OfflineIndicator.jsx';
import BottomNav from './components/BottomNav.jsx';
import Footer from './components/Footer.jsx';
import ContentBrowser from './components/ContentBrowser.jsx';
import PerformanceMetrics from './components/PerformanceMetrics.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import DirectoryPage from './components/DirectoryPage.jsx';
import HeaderBar from './components/home/HeaderBar.jsx';
import HeroCarousel from './components/home/HeroCarousel.jsx';
import CategoryRow from './components/home/CategoryRow.jsx';

// New section components
import FeaturedSection from './components/home/FeaturedSection.jsx';
import JobsSection from './components/home/JobsSection.jsx';
import SkillsSection from './components/home/SkillsSection.jsx';
import NoticesSection from './components/home/NoticesSection.jsx';
import DirectoryPreview from './components/home/DirectoryPreview.jsx';
import EventsSection from './components/home/EventsSection.jsx';

export default function App() {
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
      // Scroll to relevant section if it exists
      setTimeout(() => {
        const element = document.getElementById('whats-happening');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
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
      />

      {page === 'home' && (
        <>
          <HeroCarousel />

          <div className="container">
            <CategoryRow onSelect={handleCategorySelect} />
          </div>

          {/* Scroll anchor for "Explore Your Community" button */}
          <div id="whats-happening" aria-label="What's happening section" />

          {/* Home Page Sections */}
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

          {/* ✅ CLEANER FOOTER - Only show debug info in development */}
          {import.meta.env.DEV && (
            <footer className="container" style={{ marginTop: 40, marginBottom: 40 }}>
              <div className="card section" style={{ padding: 16, textAlign: 'center' }}>
                <span className="subtle">
                  Dev Mode: API Base: <strong>{apiUrl}</strong> • Community: <strong>{community}</strong>
                </span>
              </div>
            </footer>
          )}
        </>
      )}

      {page === 'library' && (
        <main className="container" style={{ paddingTop: 20, paddingBottom: 80 }}>
          <ContentBrowser />
        </main>
      )}

      {page === 'directory' && (
        <main className="container" style={{ paddingTop: 20, paddingBottom: 80 }}>
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
          <AdminDashboard />
        </main>
      )}

      {/* Placeholder pages */}
      {page === 'help' && (
        <main className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
          <div className="card section">
            <h2>Help Center</h2>
            <p>Coming soon: Emergency contacts, support tickets, and community guides.</p>
            <button className="btn btn-secondary" onClick={() => setPage('home')}>
              Back to Home
            </button>
          </div>
        </main>
      )}

      {page === 'login' && (
        <main className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
          <div className="card section">
            <h2>Log In</h2>
            <p>Coming soon: User authentication with Admin, Moderator, and General User roles.</p>
            <button className="btn btn-secondary" onClick={() => setPage('home')}>
              Back to Home
            </button>
          </div>
        </main>
      )}

      {/* Desktop Footer - shows on desktop, hidden on mobile */}
      <Footer community={community} onNavigate={setPage} />

      {/* Mobile Bottom Nav - shows on mobile, hidden on desktop */}
      <BottomNav active={page} onNavigate={setPage} />
    </div>
  );
}