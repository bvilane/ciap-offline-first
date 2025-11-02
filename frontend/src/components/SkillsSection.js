import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ENDPOINTS, COMMUNITY_NAME } from '../config/appConfig';
import FeedCard from './FeedCard';

const FALLBACK = [
  { id: 's1', title: 'Basics of Digital Marketing', provider: 'Community Hub', summary: 'Free weekend workshop. Limited seats.' },
  { id: 's2', title: 'Intro to Freelancing', provider: 'Remote Academy', summary: 'Self-paced video course for beginners.' },
];

export default function SkillsSection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await axios.get(ENDPOINTS.skills, { params: { community: COMMUNITY_NAME } });
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setItems(FALLBACK);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="card section">
      <h2 className="section-title">Skills & Training</h2>
      <p className="subtle" style={{ marginTop: 0, marginBottom: 12 }}>
        Workshops, tutorials, and courses to build practical income skills.
      </p>
      {items.length === 0 && <div className="subtle">No training items available.</div>}
      {items.map(x => (
        <FeedCard
          key={x.id || x.title}
          title={x.title}
          body={x.summary || ''}
          meta={x.provider ? `Provider: ${x.provider}` : ''}
          actions={x.url ? [{ label: 'Open', href: x.url }] : []}
        />
      ))}
    </section>
  );
}
