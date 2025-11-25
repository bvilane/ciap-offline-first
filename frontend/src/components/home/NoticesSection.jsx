import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomeSection.css';
import cacheManager from '../../utils/cacheManager';
import useNetworkStatus from '../../hooks/useNetworkStatus';

export default function NoticesSection({ apiBase, community, onViewAll }) {
  const { isOnline } = useNetworkStatus();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    fetchNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community]);

  const fetchNotices = async () => {
    const cacheKey = `notices_${community}`;

    // If offline, try cache first
    if (!isOnline) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        console.log('✅ Using cached notices (offline)');
        setNotices(cached);
        setFromCache(true);
        setLoading(false);
        return;
      }
    }

    // Online: fetch from API
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${apiBase}/notices`, {
        params: { community, limit: 5, page: 1 }
      });
      
      const noticesData = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      // Cache the results
      cacheManager.set(cacheKey, noticesData);
      console.log(`✅ Fetched and cached ${noticesData.length} notices`);
      
      setNotices(noticesData);
      setFromCache(false);
    } catch (err) {
      console.error('❌ Notices fetch failed:', err);
      setError('Failed to load notices');
      
      // Try to serve from cache on error
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        console.log('✅ Serving cached notices after error');
        setNotices(cached);
        setFromCache(true);
      } else {
        setNotices([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon">📢</span>
              <h2>Community Notices</h2>
            </div>
          </div>
          <div className="section-loading">Loading notices...</div>
        </div>
      </section>
    );
  }

  if (error && notices.length === 0) {
    return (
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon">📢</span>
              <h2>Community Notices</h2>
            </div>
          </div>
          <div className="section-empty">
            <p>{error}</p>
            {!isOnline && (
              <p style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
                Connect to the internet to see latest community notices.
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (notices.length === 0) {
    return (
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon">📢</span>
              <h2>Community Notices</h2>
            </div>
          </div>
          <div className="section-empty">
            <p>No notices available at the moment.</p>
            {!isOnline && (
              <p style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
                Connect to the internet to see latest community notices.
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="home-section">
      <div className="container">
        <div className="section-header">
          <div className="section-title">
            <span className="section-icon">📢</span>
            <h2>Community Notices</h2>
            {fromCache && !isOnline && (
              <span style={{
                fontSize: '12px',
                color: '#f97316',
                fontWeight: 600,
                marginLeft: '12px'
              }}>
                OFFLINE
              </span>
            )}
          </div>
          <button 
            className="view-all-btn"
            onClick={() => onViewAll('notices')}
          >
            View All Notices →
          </button>
        </div>

        <div className="card-grid">
          {notices.map((notice) => (
            <div key={notice.id} className="content-card">
              {notice.image_url ? (
                <div 
                  className="card-image" 
                  style={{ backgroundImage: `url(${notice.image_url})` }}
                  role="img"
                  aria-label={notice.title}
                />
              ) : (
                <div className="card-image card-gradient" />
              )}

              <div className="card-content">
                <div className="card-badge">
                  NOTICE
                  {fromCache && !isOnline && (
                    <span style={{ marginLeft: '8px', opacity: 0.8 }}>• OFFLINE</span>
                  )}
                </div>
                <h3 className="card-title">{notice.title}</h3>
                <p className="card-description">{notice.body}</p>
                
                {notice.contact && (
                  <div className="card-meta">
                    Contact: {notice.contact}
                  </div>
                )}

                {notice.created_at && (
                  <div className="card-meta" style={{ marginTop: '8px' }}>
                    {formatDate(notice.created_at)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}