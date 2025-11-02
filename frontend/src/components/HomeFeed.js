import React from 'react';
import './HomeFeed.css';
import NoticesSection from './NoticesSection';
import JobsSection from './JobsSection';
import SkillsSection from './SkillsSection';

export default function HomeFeed() {
  return (
    <div className="home-grid">
      <div className="home-main">
        <NoticesSection />
        <JobsSection />
        <SkillsSection />
      </div>
      <aside className="home-aside">
        <div className="card section">
          <h3 className="section-title">About</h3>
          <p className="subtle">
            This portal aggregates local notices, jobs, and skills content for faster access on low bandwidth.
            It supports offline caching on mobile and desktop.
          </p>
        </div>
      </aside>
    </div>
  );
}
