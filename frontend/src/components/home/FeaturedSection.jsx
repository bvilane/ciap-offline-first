// frontend/src/components/home/FeaturedSection.jsx
// Enhanced with offline caching - Full version maintaining all original features

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomeSection.css';
import cacheManager from '../../utils/cacheManager';
import useNetworkStatus from '../../hooks/useNetworkStatus';

export default function FeaturedSection({ apiBase, community }) {
  const { isOnline } = useNetworkStatus();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    fetchFeatured();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community]);

  const fetchFeatured = async () => {
    const cacheKey = `featured_${community}`;

    // If offline, try cache first
    if (!isOnline) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        console.log('Using cached featured content');
        setFeatured(cached);
        setFromCache(true);
        setLoading(false);
        return;
      }
    }

    // Online: fetch from API
    try {
      setLoading(true);
      
      // Fetch featured items from all endpoints
      const [noticesRes, jobsRes, skillsRes] = await Promise.allSettled([
        axios.get(`${apiBase}/notices`, { params: { community, featured: true, limit: 3 } }),
        axios.get(`${apiBase}/jobs`, { params: { community, featured: true, limit: 3 } }),
        axios.get(`${apiBase}/skills`, { params: { community, featured: true, limit: 3 } })
      ]);

      const items = [];

      // Process notices
      if (noticesRes.status === 'fulfilled') {
        const noticesData = Array.isArray(noticesRes.value.data) 
          ? noticesRes.value.data 
          : noticesRes.value.data.data || [];
        items.push(...noticesData.map(item => ({ ...item, type: 'notice' })));
      }

      // Process jobs
      if (jobsRes.status === 'fulfilled') {
        const jobsData = Array.isArray(jobsRes.value.data) 
          ? jobsRes.value.data 
          : jobsRes.value.data.data || [];
        items.push(...jobsData.map(item => ({ ...item, type: 'job' })));
      }

      // Process skills
      if (skillsRes.status === 'fulfilled') {
        const skillsData = Array.isArray(skillsRes.value.data) 
          ? skillsRes.value.data 
          : skillsRes.value.data.data || [];
        items.push(...skillsData.map(item => ({ ...item, type: 'skill' })));
      }

      // Sort by created_at or posted_at (most recent first)
      items.sort((a, b) => {
        const aTime = a.posted_at || a.created_at || 0;
        const bTime = b.posted_at || b.created_at || 0;
        return bTime - aTime;
      });

      // Limit to 6 items
      const limitedItems = items.slice(0, 6);
      
      // Cache the results
      cacheManager.set(cacheKey, limitedItems);
      
      setFeatured(limitedItems);
      setFromCache(false);
      
      console.log('Featured content fetched and cached');
    } catch (err) {
      console.error('Error fetching featured content:', err);
      
      // Try to serve from cache on error
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        console.log('Serving cached featured content after error');
        setFeatured(cached);
        setFromCache(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="home-section" id="whats-happening-content">
        <div className="container">
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon">🎯</span>
              <h2>What's happening</h2>
            </div>
          </div>
          <div className="section-loading">Loading featured content...</div>
        </div>
      </section>
    );
  }

  if (featured.length === 0) {
    return (
      <section className="home-section" id="whats-happening-content">
        <div className="container">
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon">🎯</span>
              <h2>What's happening</h2>
            </div>
          </div>
          <div className="section-empty">
            <p>Featured news and opportunities in {community}</p>
            {!isOnline && (
              <p style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
                No cached content available. Connect to the internet to load content.
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  const getItemLabel = (item) => {
    if (item.type === 'notice') return 'NOTICE';
    if (item.type === 'job') return 'JOB';
    if (item.type === 'skill') return 'SKILL';
    return 'FEATURED';
  };

  const getItemTitle = (item) => item.title || item.name;
  const getItemDescription = (item) => item.body || item.summary || item.description;
  const getItemAction = (item) => {
    if (item.type === 'job' && item.apply_url) {
      return { label: 'Apply Now', url: item.apply_url };
    }
    if (item.type === 'skill' && item.url) {
      return { label: 'Learn More', url: item.url };
    }
    return null;
  };

  return (
    <section className="home-section" id="whats-happening-content">
      <div className="container">
        <div className="section-header">
          <div className="section-title">
            <span className="section-icon">🎯</span>
            <h2>What's happening</h2>
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
        </div>
        <p style={{ color: '#6c757d', marginBottom: '24px' }}>
          Featured news and opportunities in {community}
        </p>

        <div className="card-grid">
          {featured.map((item, index) => {
            const action = getItemAction(item);
            return (
              <div key={`${item.type}-${item.id}-${index}`} className="content-card">
                {item.image_url ? (
                  <div 
                    className="card-image" 
                    style={{ backgroundImage: `url(${item.image_url})` }}
                    role="img"
                    aria-label={getItemTitle(item)}
                  />
                ) : (
                  <div className="card-image card-gradient" />
                )}

                <div className="card-content">
                  <div className="card-badge">
                    {getItemLabel(item)}
                    {fromCache && !isOnline && (
                      <span style={{ marginLeft: '8px', opacity: 0.8 }}>• OFFLINE</span>
                    )}
                  </div>
                  <h3 className="card-title">{getItemTitle(item)}</h3>
                  <p className="card-description">{getItemDescription(item)}</p>
                  
                  {item.type === 'job' && (
                    <div className="card-meta">
                      {item.company && <span>{item.company}</span>}
                      {item.location && <span> • {item.location}</span>}
                      {item.type && <span> • {item.type}</span>}
                    </div>
                  )}

                  {item.type === 'skill' && item.provider && (
                    <div className="card-meta">
                      Provider: {item.provider}
                    </div>
                  )}

                  {item.type === 'notice' && item.contact && (
                    <div className="card-meta">
                      Contact: {item.contact}
                    </div>
                  )}

                  {action && isOnline && (
                    <a 
                      href={action.url}
                      className="card-button"
                      target={action.url.startsWith('http') ? '_blank' : undefined}
                      rel={action.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {action.label}
                    </a>
                  )}
                  
                  {action && !isOnline && (
                    <button 
                      className="card-button" 
                      disabled
                      style={{ opacity: 0.6, cursor: 'not-allowed' }}
                      title="Connect to internet to access external links"
                    >
                      {action.label} (Offline)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}