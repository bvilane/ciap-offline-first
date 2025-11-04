// frontend/src/components/home/NoticesSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomeSection.css';

export default function NoticesSection({ apiBase, community, onViewAll }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, [community]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${apiBase}/notices`, {
        params: { community, limit: 5, page: 1 }
      });
      
      const noticesData = Array.isArray(response.data) ? response.data : response.data.data || [];
      setNotices(noticesData);
    } catch (err) {
      console.error('Error fetching notices:', err);
      setError('Failed to load notices');
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

  if (error) {
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
                <div className="card-badge">NOTICE</div>
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