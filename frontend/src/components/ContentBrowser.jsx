import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ContentBrowser.css';
import { API_BASE } from '../config/appConfig.jsx';

const API = API_BASE;

export default function ContentBrowser() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (selectedType !== 'all') params.type = selectedType;
      if (q.trim()) params.q = q.trim();

      const url = `${API}/content`;
      const { data } = await axios.get(url, { params });
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Content fetch failed:', err?.response?.status, err?.message);
      setItems([]);
      setError('No content found or endpoint not available yet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <section className="browser">
      <div className="card section">
        <h2 className="section-title">Content Library</h2>
        <form className="filters" onSubmit={onSearch}>
          <input
            className="input search-input"
            placeholder="Search content..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="type-filter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All types</option>
            <option value="article">Articles</option>
            <option value="video">Videos</option>
            <option value="pdf">Documents</option>
            <option value="image">Images</option>
          </select>
          <button className="btn" type="submit">Apply</button>
        </form>
      </div>

      <div className="list">
        {loading && <div className="card section">Loading…</div>}

        {!loading && error && (
          <div className="card section empty">{error}</div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="card section empty">
            No results. Adjust your filters and try again.
          </div>
        )}

        {!loading && !error && items.map((it) => (
          <div key={it.id || `${it.title}-${it.type}`} className="card section item">
            <h3>{it.title || 'Untitled'}</h3>
            <div className="meta">
              {it.type ? it.type.toUpperCase() : 'UNKNOWN'}
              {it.size ? ` • ${it.size}` : ''}
              {it.cached ? ` • Cached` : ''}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
