import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomeSection.css';
import cacheManager from '../../utils/cacheManager';
import useNetworkStatus from '../../hooks/useNetworkStatus';

export default function SkillsSection({ apiBase, community, onViewAll }) {
  const { isOnline } = useNetworkStatus();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    fetchSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community]);

  const fetchSkills = async () => {
    const cacheKey = `skills_${community}`;

    // If offline, try cache first
    if (!isOnline) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        console.log('✅ Using cached skills (offline)');
        setSkills(cached);
        setFromCache(true);
        setLoading(false);
        return;
      }
    }

    // Online: fetch from API
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${apiBase}/skills`, {
        params: { community, limit: 6, page: 1 }
      });
      
      const skillsData = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      // Cache the results
      cacheManager.set(cacheKey, skillsData);
      console.log(`✅ Fetched and cached ${skillsData.length} skills`);
      
      setSkills(skillsData);
      setFromCache(false);
    } catch (err) {
      console.error('❌ Skills fetch failed:', err);
      setError('Failed to load skills');
      
      // Try to serve from cache on error
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        console.log('✅ Serving cached skills after error');
        setSkills(cached);
        setFromCache(true);
      } else {
        setSkills([]);
      }
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
              <span className="section-icon">📚</span>
              <h2>Skills & Tutorials</h2>
            </div>
          </div>
          <div className="section-loading">Loading skills...</div>
        </div>
      </section>
    );
  }

  if (error && skills.length === 0) {
    return (
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon">📚</span>
              <h2>Skills & Tutorials</h2>
            </div>
          </div>
          <div className="section-empty">
            <p>{error}</p>
            {!isOnline && (
              <p style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
                Connect to the internet to see latest tutorials.
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (skills.length === 0) {
    return (
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon">📚</span>
              <h2>Skills & Tutorials</h2>
            </div>
          </div>
          <div className="section-empty">
            <p>No skills available at the moment. Check back soon!</p>
            {!isOnline && (
              <p style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
                Connect to the internet to see latest tutorials.
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
            <span className="section-icon">📚</span>
            <h2>Skills & Tutorials</h2>
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
            onClick={() => onViewAll('skills')}
          >
            View All Skills →
          </button>
        </div>

        <div className="card-grid">
          {skills.map((skill) => (
            <div key={skill.id} className="content-card">
              {skill.image_url ? (
                <div 
                  className="card-image" 
                  style={{ backgroundImage: `url(${skill.image_url})` }}
                  role="img"
                  aria-label={skill.title}
                />
              ) : (
                <div className="card-image card-gradient" />
              )}

              <div className="card-content">
                <div className="card-badge">
                  SKILL
                  {fromCache && !isOnline && (
                    <span style={{ marginLeft: '8px', opacity: 0.8 }}>• OFFLINE</span>
                  )}
                </div>
                <h3 className="card-title">{skill.title}</h3>
                <p className="card-description">{skill.summary}</p>
                
                {skill.provider && (
                  <div className="card-meta">
                    Provider: {skill.provider}
                  </div>
                )}

                {skill.url && isOnline && (
                  <a 
                    href={skill.url}
                    className="card-button"
                    target={skill.url.startsWith('http') ? '_blank' : undefined}
                    rel={skill.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    Learn More
                  </a>
                )}

                {skill.url && !isOnline && (
                  <button
                    className="card-button"
                    disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    title="Connect to internet to access"
                  >
                    Learn More (Offline)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}