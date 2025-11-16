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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(ENDPOINTS.directory, { 
          params: { community: COMMUNITY_NAME } 
        });
        // FIXED: Backend returns { data: [...], categories: [...] }
        // So we need data.data, not just data
        if (mounted) {
          const directoryItems = data?.data || data || [];
          setItems(Array.isArray(directoryItems) ? directoryItems : []);
        }
      } catch (error) {
        console.error('Directory fetch failed:', error);
        if (mounted) setItems(FALLBACK);
      } finally {
        if (mounted) setLoading(false);
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
    <div className="directory-page">
      <div className="directory-header">
        <h1>Directory</h1>
        <p className="directory-subtitle">Essential services in {COMMUNITY_NAME}. Tap to call.</p>
      </div>

      <div className="directory-search-bar">
        <input type="search" className="directory-search-input" placeholder="Search name, phone, address..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="directory-category-select" value={cat} onChange={(e) => setCat(e.target.value)}>
          {CATS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="directory-loading">Loading directory...</div>
      ) : filtered.length === 0 ? (
        <div className="directory-empty"><p>No matches found.</p></div>
      ) : (
        <div className="directory-list">
          {filtered.map(x => (
            <div key={x.id || x.name} className="directory-item">
              <div className="directory-item-content">
                <div className="directory-item-info">
                  <h3 className="directory-item-name">{x.name}</h3>
                  <span className="directory-item-category">{x.category || 'Other'}</span>
                  {x.hours && <p className="directory-item-hours">🕒 {x.hours}</p>}
                  {x.address && <p className="directory-item-address">📍 {x.address}</p>}
                </div>
                <div className="directory-item-actions">
                  {x.phone && <a href={`tel:${x.phone}`} className="directory-action-btn directory-call-btn">📞 Call</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}