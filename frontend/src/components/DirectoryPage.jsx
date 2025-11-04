import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { ENDPOINTS, COMMUNITY_NAME } from '../config/appConfig';
import './DirectoryPage.css';

const FALLBACK = [
  { id: 'd1', name: 'Acornhoek Clinic', category: 'Clinic', phone: '+27 11 000 0001', hours: 'Mon–Fri 08:00–16:00', address: 'Main Rd, Acornhoek' },
  { id: 'd2', name: 'Ward 8 Primary School', category: 'School', phone: '+27 11 000 0002', hours: 'Mon–Fri 07:30–14:00', address: 'School St, Acornhoek' },
  { id: 'd3', name: 'Municipal Office', category: 'Municipal', phone: '+27 11 000 0003', hours: 'Mon–Fri 08:00–16:00', address: 'Civic Center' },
];

const CATS = ['All','Clinic','School','Transport','Municipal','Emergency','Library','Other'];

export default function DirectoryPage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await axios.get(ENDPOINTS.directory, { params: { community: COMMUNITY_NAME } });
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setItems(FALLBACK);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter(x => {
      const matchCat = (cat === 'All') || (x.category?.toLowerCase() === cat.toLowerCase());
      const matchQ = !term || [x.name, x.address, x.phone, x.category].join(' ').toLowerCase().includes(term);
      return matchCat && matchQ;
    });
  }, [items, q, cat]);

  return (
    <section className="directory">
      <div className="card section">
        <h2 className="section-title">Directory</h2>
        <p className="subtle">Essential services in {COMMUNITY_NAME}. Tap to call.</p>
        <div className="dir-controls">
          <input className="input" placeholder="Search name, phone, address..." value={q} onChange={(e)=>setQ(e.target.value)} />
          <select className="input" value={cat} onChange={(e)=>setCat(e.target.value)}>
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="dir-list">
        {filtered.length === 0 && <div className="card section subtle">No matches.</div>}
        {filtered.map(x => (
          <div key={x.id || x.name} className="card section dir-item">
            <div className="dir-primary">
              <div className="dir-name">{x.name}</div>
              <div className="dir-cat">{x.category || 'Other'}</div>
            </div>
            <div className="dir-meta">
              {x.phone && <a className="btn" href={`tel:${x.phone}`}>Call</a>}
              <div className="subtle">{x.hours || ''}</div>
              <div className="subtle">{x.address || ''}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
