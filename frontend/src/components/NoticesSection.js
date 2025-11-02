import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ENDPOINTS, COMMUNITY_NAME } from '../config/appConfig';
import FeedCard from './FeedCard';

const FALLBACK = [
  { id: 'n1', title: 'Water Maintenance – Ward 8', body: 'Low pressure expected 10:00–13:00. Use water sparingly.', createdAt: Date.now()-3600e3 },
  { id: 'n2', title: 'Clinic Outreach', body: 'Free basic screenings at Community Hall, Sat 09:00–12:00.', createdAt: Date.now()-7200e3 },
];

export default function NoticesSection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await axios.get(ENDPOINTS.notices, { params: { community: COMMUNITY_NAME } });
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setItems(FALLBACK);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="card section">
      <h2 className="section-title">Latest Notices</h2>
      <div className="subtle" style={{ marginBottom: 8 }}>{COMMUNITY_NAME}</div>
      {items.length === 0 && <div className="subtle">No notices available.</div>}
      {items.map(n => (
        <FeedCard key={n.id || n.title} title={n.title} body={n.body} meta={formatTime(n.createdAt)} />
      ))}
    </section>
  );
}

function formatTime(ts) {
  try { return new Date(ts).toLocaleString(); } catch { return ''; }
}
