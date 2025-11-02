import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ENDPOINTS, COMMUNITY_NAME } from '../config/appConfig';
import FeedCard from './FeedCard';

const FALLBACK = [
  { id: 'j1', title: 'Receptionist – Local Clinic', location: COMMUNITY_NAME, type: 'Full-time', summary: 'Front desk, patient queries, scheduling.' },
  { id: 'j2', title: 'Remote Customer Support (Entry)', location: 'Remote', type: 'Remote', summary: 'Chat/email support. Training provided.' },
];

export default function JobsSection() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await axios.get(ENDPOINTS.jobs, { params: { community: COMMUNITY_NAME } });
        const arr = Array.isArray(data) ? data : [];
        arr.sort((a, b) => (b.location === COMMUNITY_NAME) - (a.location === COMMUNITY_NAME));
        if (mounted) setJobs(arr);
      } catch {
        if (mounted) setJobs(FALLBACK);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="card section">
      <h2 className="section-title">Jobs</h2>
      <p className="subtle" style={{ marginTop: 0, marginBottom: 12 }}>
        Local opportunities in {COMMUNITY_NAME}, plus curated remote roles.
      </p>
      {jobs.length === 0 && <div className="subtle">No jobs available.</div>}
      {jobs.map(j => (
        <FeedCard
          key={j.id || j.title}
          title={j.title}
          body={j.summary || ''}
          meta={[j.company, j.location, j.type].filter(Boolean).join(' • ')}
          actions={(j.applyUrl || j.apply_url) ? [{ label: 'Apply', href: j.applyUrl || j.apply_url }] : []}
        />
      ))}
    </section>
  );
}
