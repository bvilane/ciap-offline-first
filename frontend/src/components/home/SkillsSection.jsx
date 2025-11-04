// frontend/src/components/home/SkillsSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomeSection.css';

export default function SkillsSection({ apiBase, community, onViewAll }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, [community]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${apiBase}/skills`, {
        params: { community, limit: 6, page: 1 }
      });
      
      const skillsData = Array.isArray(response.data) ? response.data : response.data.data || [];
      setSkills(skillsData);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills');
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

  if (error) {
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
                <div className="card-badge">SKILL</div>
                <h3 className="card-title">{skill.title}</h3>
                <p className="card-description">{skill.summary}</p>
                
                {skill.provider && (
                  <div className="card-meta">
                    Provider: {skill.provider}
                  </div>
                )}

                {skill.url && (
                  <a 
                    href={skill.url}
                    className="card-button"
                    target={skill.url.startsWith('http') ? '_blank' : undefined}
                    rel={skill.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    Learn More
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