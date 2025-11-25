import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ContentBrowser.css';
import { API_BASE } from '../config/appConfig.jsx';
import cacheManager from '../utils/cacheManager';
import useNetworkStatus from '../hooks/useNetworkStatus';

const API = API_BASE;

export default function ContentBrowser() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const { isOnline } = useNetworkStatus();
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const fetchData = async () => {
  setLoading(true);
  setError('');

  const cacheKey = `content_${selectedType}_${q}`;

  // Try cache if offline
  if (!isOnline) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      setItems(Array.isArray(cached) ? cached : []);
      setLoading(false);
      return;
    }
  }

  try {
    const params = {};
    if (selectedType !== 'all') params.type = selectedType;
    if (q.trim()) params.search = q.trim();

    const url = `${API}/content`;
    const { data } = await axios.get(url, { params });
    
    const contentItems = data?.data || [];
    const itemsArray = Array.isArray(contentItems) ? contentItems : [];
    
    // Cache the results
    cacheManager.set(cacheKey, itemsArray);
    
    setItems(itemsArray);
  } catch (err) {
    console.error('Content fetch failed:', err?.response?.status, err?.message);
    
    // Try cache on error
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      setItems(Array.isArray(cached) ? cached : []);
    } else {
      setItems([]);
      setError('Unable to load content. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="content-browser-page">
      <div className="browser-header">
        <h1>Content Library</h1>
        <p className="browser-subtitle">
          Browse notices, jobs, and skills from your community.
        </p>
      </div>

      <div className="browser-search-bar">
        <input
          type="search"
          className="browser-search-input"
          placeholder="Search content..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="browser-type-filter"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All types</option>
          <option value="notice">Notices</option>
          <option value="job">Jobs</option>
          <option value="skill">Skills</option>
        </select>
        <button className="browser-apply-btn" onClick={onSearch}>
          Apply
        </button>
      </div>

      {loading && (
        <div className="browser-loading">Loading content...</div>
      )}

      {!loading && error && (
        <div className="browser-empty">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="browser-empty">
          <p>No content found. Try adjusting your filters.</p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="browser-list">
          {items.map((it) => (
            <div key={it.id} className="browser-item">
              <div className="browser-item-content">
                <h3 className="browser-item-title">
                  {it.title || 'Untitled'}
                </h3>
                {it.description && (
                  <p className="browser-item-description">
                    {it.description.substring(0, 150)}
                    {it.description.length > 150 ? '...' : ''}
                  </p>
                )}
                <div className="browser-item-meta">
                  <span className="browser-item-type">
                    {it.type ? it.type.toUpperCase() : 'UNKNOWN'}
                  </span>
                  {it.cached && <span className="cached-badge">• Cached</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}