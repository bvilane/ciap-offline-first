/**
 * Content Browser Component
 * Displays cached content with search and filtering
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContentBrowser.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

function ContentBrowser({ isOnline }) {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [loadTime, setLoadTime] = useState(null);

  useEffect(() => {
    fetchContent();
  }, [selectedType, searchTerm]);

  const fetchContent = async () => {
    const startTime = performance.now();
    setLoading(true);
    setError(null);

    try {
      const params = {};
      if (selectedType !== 'all') params.type = selectedType;
      if (searchTerm) params.search = searchTerm;

      const response = await axios.get(`${API_BASE}/content`, { params });
      
      const endTime = performance.now();
      setLoadTime(Math.round(endTime - startTime));
      
      setContent(response.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching content:', err);
      
      if (!isOnline) {
        setError('Offline mode - Showing cached content only');
      } else {
        setError('Failed to load content');
      }
      
      setLoading(false);
    }
  };

  const handleContentClick = async (contentId) => {
    const startTime = performance.now();
    
    try {
      const response = await axios.get(`${API_BASE}/content/${contentId}`);
      const endTime = performance.now();
      
      const itemLoadTime = Math.round(endTime - startTime);
      
      alert(`Content loaded in ${itemLoadTime}ms\n${isOnline ? 'From: Server/Cache' : 'From: Local Cache'}`);
      
      console.log('Content details:', response.data);
    } catch (err) {
      console.error('Error loading content:', err);
    }
  };

  const filteredContent = content;

  return (
    <div className="content-browser">
      <div className="browser-header">
        <h2>📚 Educational Content Library</h2>
        {loadTime !== null && (
          <div className={`load-time ${isOnline ? 'online' : 'offline'}`}>
            ⚡ Loaded in {loadTime}ms {isOnline ? '' : '(from cache)'}
          </div>
        )}
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="type-filter"
        >
          <option value="all">All Types</option>
          <option value="application/pdf">📄 PDFs</option>
          <option value="text/html">📝 Articles</option>
          <option value="image/jpeg">🖼️ Images</option>
        </select>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading content...</p>
        </div>
      ) : (
        <div className="content-grid">
          {filteredContent.length === 0 ? (
            <div className="no-content">
              <p>No content available</p>
              {!isOnline && <p>Try going online to sync new content</p>}
            </div>
          ) : (
            filteredContent.map((item) => (
              <div
                key={item.content_id}
                className="content-card"
                onClick={() => handleContentClick(item.content_id)}
              >
                <div className="card-icon">
                  {item.content_type === 'application/pdf' && '📄'}
                  {item.content_type === 'text/html' && '📝'}
                  {item.content_type.startsWith('image/') && '🖼️'}
                </div>
                <h3>{item.title}</h3>
                <p className="description">{item.description || 'No description'}</p>
                <div className="card-meta">
                  <span className="type">{item.content_type}</span>
                  <span className="size">
                    {item.file_size ? `${(item.file_size / 1024).toFixed(1)} KB` : 'N/A'}
                  </span>
                </div>
                <div className="card-footer">
                  <span className="date">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="demo-instructions">
        <h3>🎥 Demo Instructions:</h3>
        <ol>
          <li>Browse content while ONLINE - note the load time</li>
          <li>Turn on Airplane Mode or disconnect WiFi</li>
          <li>Observe the OFFLINE MODE indicator appears</li>
          <li>Click any content card - it still works!</li>
          <li>Check DevTools Network tab - 0ms responses from cache</li>
        </ol>
      </div>
    </div>
  );
}

export default ContentBrowser;