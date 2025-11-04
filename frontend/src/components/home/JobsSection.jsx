// frontend/src/components/home/JobsSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomeSection.css';

export default function JobsSection({ apiBase, community, onViewAll }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [community]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${apiBase}/jobs`, {
        params: { community, limit: 6, page: 1 }
      });
      
      // Handle both array and {data: [...]} formats
      const jobsData = Array.isArray(response.data) ? response.data : response.data.data || [];
      setJobs(jobsData);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs');
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

  if (error) {
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
              {/* ✅ IMAGE SUPPORT - Show image if available, otherwise gradient */}
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
                <div className="card-badge">JOB</div>
                <h3 className="card-title">{job.title}</h3>
                <p className="card-description">{job.summary}</p>
                
                <div className="card-meta">
                  {job.company && <span>{job.company}</span>}
                  {job.location && <span> • {job.location}</span>}
                  {job.type && <span> • {job.type}</span>}
                </div>

                {job.apply_url && (
                  <a 
                    href={job.apply_url}
                    className="card-button"
                    target={job.apply_url.startsWith('http') ? '_blank' : undefined}
                    rel={job.apply_url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    Apply Now
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}