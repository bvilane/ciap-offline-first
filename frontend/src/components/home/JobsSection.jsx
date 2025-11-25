import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomeSection.css';
import cacheManager from '../../utils/cacheManager';
import useNetworkStatus from '../../hooks/useNetworkStatus';

export default function JobsSection({ apiBase, community, onViewAll }) {
  const { isOnline } = useNetworkStatus();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community]);

  const fetchJobs = async () => {
    const cacheKey = `jobs_${community}`;

    // If offline, try cache first
    if (!isOnline) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        console.log('✅ Using cached jobs (offline)');
        setJobs(cached);
        setFromCache(true);
        setLoading(false);
        return;
      }
    }

    // Online: fetch from API
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${apiBase}/jobs`, {
        params: { community, limit: 6, page: 1 }
      });
      
      const jobsData = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      // Cache the results
      cacheManager.set(cacheKey, jobsData);
      console.log(`✅ Fetched and cached ${jobsData.length} jobs`);
      
      setJobs(jobsData);
      setFromCache(false);
    } catch (err) {
      console.error('❌ Jobs fetch failed:', err);
      setError('Failed to load jobs');
      
      // Try to serve from cache on error
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        console.log('✅ Serving cached jobs after error');
        setJobs(cached);
        setFromCache(true);
      } else {
        setJobs([]);
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
              <span className="section-icon">💼</span>
              <h2>Jobs & Opportunities</h2>
            </div>
          </div>
          <div className="section-loading">Loading jobs...</div>
        </div>
      </section>
    );
  }

  if (error && jobs.length === 0) {
    return (
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon">💼</span>
              <h2>Jobs & Opportunities</h2>
            </div>
          </div>
          <div className="section-empty">
            <p>{error}</p>
            {!isOnline && (
              <p style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
                Connect to the internet to see latest opportunities.
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (jobs.length === 0) {
    return (
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon">💼</span>
              <h2>Jobs & Opportunities</h2>
            </div>
          </div>
          <div className="section-empty">
            <p>No jobs available at the moment. Check back soon!</p>
            {!isOnline && (
              <p style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
                Connect to the internet to see latest opportunities.
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
            <span className="section-icon">💼</span>
            <h2>Jobs & Opportunities</h2>
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
            onClick={() => onViewAll('jobs')}
          >
            View All Jobs →
          </button>
        </div>

        <div className="card-grid">
          {jobs.map((job) => (
            <div key={job.id} className="content-card">
              {job.image_url ? (
                <div 
                  className="card-image" 
                  style={{ backgroundImage: `url(${job.image_url})` }}
                  role="img"
                  aria-label={job.title}
                />
              ) : (
                <div className="card-image card-gradient" />
              )}

              <div className="card-content">
                <div className="card-badge">
                  JOB
                  {fromCache && !isOnline && (
                    <span style={{ marginLeft: '8px', opacity: 0.8 }}>• OFFLINE</span>
                  )}
                </div>
                <h3 className="card-title">{job.title}</h3>
                <p className="card-description">{job.summary}</p>
                
                <div className="card-meta">
                  {job.company && <span>{job.company}</span>}
                  {job.location && <span> • {job.location}</span>}
                  {job.type && <span> • {job.type}</span>}
                </div>

                {job.apply_url && isOnline && (
                  <a 
                    href={job.apply_url}
                    className="card-button"
                    target={job.apply_url.startsWith('http') ? '_blank' : undefined}
                    rel={job.apply_url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    Apply Now
                  </a>
                )}

                {job.apply_url && !isOnline && (
                  <button
                    className="card-button"
                    disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    title="Connect to internet to apply"
                  >
                    Apply Now (Offline)
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