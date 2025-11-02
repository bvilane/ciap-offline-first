import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

import { COMMUNITY_NAME, ENDPOINTS } from './config/appConfig';

import OfflineIndicator from './components/OfflineIndicator';
import BottomNav from './components/BottomNav';
import ContentBrowser from './components/ContentBrowser';
import PerformanceMetrics from './components/PerformanceMetrics';
import AdminDashboard from './components/AdminDashboard';
import DirectoryPage from './components/DirectoryPage';
import HeaderBar from './components/home/HeaderBar';
import HeroCarousel from './components/home/HeroCarousel';
import CategoryRow from './components/home/CategoryRow';
import ContentGrid from './components/home/ContentGrid';

export default function App() {
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const [page, setPage] = useState('home'); // home | library | directory | metrics | admin
  const [community, setCommunity] = useState(process.env.REACT_APP_COMMUNITY || COMMUNITY_NAME);
  const [query, setQuery] = useState('');

  const apiUrl = useMemo(
    () => process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1',
    []
  );

  return (
    <div className="App">
      <OfflineIndicator online={online} />

      {/* Top brand + search + community picker */}
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
            <CategoryRow onSelect={(target) => setPage(target)} />
          </div>
          <ContentGrid
            api={ENDPOINTS}
            community={community}
            query={query}
          />
          <footer className="container" style={{ marginTop: 12, marginBottom: 24 }}>
            <div className="card section" style={{ padding: 12 }}>
              <span className="subtle">
                API Base: <strong>{apiUrl}</strong> • Community: <strong>{community}</strong>
              </span>
            </div>
          </footer>
        </>
      )}

      {page === 'library' && (
        <main className="container" style={{ paddingBottom: 56 }}>
          <ContentBrowser />
        </main>
      )}
      {page === 'directory' && (
        <main className="container" style={{ paddingBottom: 56 }}>
          <DirectoryPage />
        </main>
      )}
      {page === 'metrics' && (
        <main className="container" style={{ paddingBottom: 56 }}>
          <PerformanceMetrics />
        </main>
      )}
      {page === 'admin' && (
        <main className="container" style={{ paddingBottom: 56 }}>
          <AdminDashboard />
        </main>
      )}

      <BottomNav active={page} onNavigate={setPage} />
    </div>
  );
}
