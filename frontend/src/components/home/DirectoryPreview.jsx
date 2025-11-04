// frontend/src/components/home/DirectoryPreview.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomeSection.css';

export default function DirectoryPreview({ apiBase, community, onViewAll }) {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBusinesses();
  }, [community]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${apiBase}/directory`, {
        params: { community, limit: 4, page: 1 }
      });
      
      const businessData = Array.isArray(response.data) ? response.data : response.data.data || [];
      setBusinesses(businessData);
    } catch (err) {
      console.error('Error fetching directory:', err);
      setError('Failed to load directory');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon">🏢</span>
              <h2>Local Directory</h2>
            </div>
          </div>
          <div className="section-loading">Loading businesses...</div>
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
              <span className="section-icon">🏢</span>
              <h2>Local Directory</h2>
            </div>
          </div>
          <div className="section-empty">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (businesses.length === 0) {
    return (
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon">🏢</span>
              <h2>Local Directory</h2>
            </div>
          </div>
          <div className="section-empty">
            <p>No businesses listed yet.</p>
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
            <span className="section-icon">🏢</span>
            <h2>Local Directory</h2>
          </div>
          <button 
            className="view-all-btn"
            onClick={() => onViewAll('directory')}
          >
            Browse Full Directory →
          </button>
        </div>

        <div className="card-grid">
          {businesses.map((business) => (
            <div key={business.id} className="content-card">
              {business.image_url ? (
                <div 
                  className="card-image" 
                  style={{ backgroundImage: `url(${business.image_url})` }}
                  role="img"
                  aria-label={business.name}
                />
              ) : (
                <div className="card-image card-gradient" />
              )}

              <div className="card-content">
                {business.category && (
                  <div className="card-badge">{business.category.toUpperCase()}</div>
                )}
                <h3 className="card-title">{business.name}</h3>
                <p className="card-description">{business.description}</p>
                
                <div className="card-meta">
                  {business.address && <div>{business.address}</div>}
                  {business.hours && <div>{business.hours}</div>}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  {business.phone && (
                    <a 
                      href={`tel:${business.phone}`}
                      className="card-button"
                      style={{ flex: 1 }}
                    >
                      📞 Call
                    </a>
                  )}
                  {business.website && (
                    <a 
                      href={business.website}
                      className="card-button"
                      style={{ flex: 1 }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🌐 Visit
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}