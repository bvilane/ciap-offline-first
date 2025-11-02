import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ContentBrowser.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

export default function ContentBrowser() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedType !== 'all') params.type = selectedType;
      if (q.trim()) params.q = q.trim();
      const { data } = await axios.get(`${API}/content`, { params });
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []); // initial

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

        {!loading && items.length === 0 && (
          <div className="card section empty">
            No results. Adjust your filters and try again.
          </div>
        )}

        {!loading && items.map((it) => (
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
