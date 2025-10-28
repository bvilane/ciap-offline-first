/**
 * Performance Metrics Component
 * Displays cache statistics and performance data
 * Critical for demonstrating testing results
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PerformanceMetrics.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

function PerformanceMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [cacheStats, setCacheStats] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllMetrics();
  }, [timeRange]);

  const fetchAllMetrics = async () => {
    setLoading(true);
    try {
      const [perfRes, cacheRes, compRes] = await Promise.all([
        axios.get(`${API_BASE}/metrics/performance?timeRange=${timeRange}`),
        axios.get(`${API_BASE}/content/stats/cache`),
        axios.get(`${API_BASE}/metrics/comparison`),
      ]);

      setMetrics(perfRes.data.data);
      setCacheStats(cacheRes.data.data);
      setComparison(compRes.data.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading metrics...</p>
      </div>
    );
  }

  const getCacheData = comparison?.find((c) => c.served_from === 'cache') || {};
  const getDbData = comparison?.find((c) => c.served_from === 'database') || {};

  return (
    <div className="performance-metrics">
      <div className="metrics-header">
        <h2>📊 Performance Metrics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="time-range-select"
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
        </select>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card highlight">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <h3>Cache Hit Rate</h3>
            <div className="metric-value">{metrics?.cacheHitRate || '0%'}</div>
            <p className="metric-desc">Requests served from cache</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🚀</div>
          <div className="metric-content">
            <h3>Avg Cache Latency</h3>
            <div className="metric-value">{metrics?.avgCacheLatency || '0ms'}</div>
            <p className="metric-desc">Average response time from cache</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🐌</div>
          <div className="metric-content">
            <h3>Avg DB Latency</h3>
            <div className="metric-value">{metrics?.avgDatabaseLatency || '0ms'}</div>
            <p className="metric-desc">Average database query time</p>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">💾</div>
          <div className="metric-content">
            <h3>Bandwidth Saved</h3>
            <div className="metric-value">{metrics?.bandwidthSaved?.savedData || '0 MB'}</div>
            <p className="metric-desc">Data transfer avoided</p>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="comparison-section">
        <h3>📈 Online vs Offline Comparison</h3>
        <div className="comparison-bars">
          <div className="comparison-item">
            <div className="comparison-label">
              <span className="label-icon">🌐</span>
              <span>Database (Online)</span>
            </div>
            <div className="bar-container">
              <div
                className="bar db-bar"
                style={{ width: `${Math.min((getDbData.avg_latency / 500) * 100, 100)}%` }}
              >
                <span className="bar-value">{Math.round(getDbData.avg_latency || 0)}ms</span>
              </div>
            </div>
            <div className="comparison-stats">
              {getDbData.requests || 0} requests
            </div>
          </div>

          <div className="comparison-item">
            <div className="comparison-label">
              <span className="label-icon">⚡</span>
              <span>Cache (Offline)</span>
            </div>
            <div className="bar-container">
              <div
                className="bar cache-bar"
                style={{ width: `${Math.min((getCacheData.avg_latency / 500) * 100, 100)}%` }}
              >
                <span className="bar-value">{Math.round(getCacheData.avg_latency || 0)}ms</span>
              </div>
            </div>
            <div className="comparison-stats">
              {getCacheData.requests || 0} requests
            </div>
          </div>
        </div>

        {getCacheData.avg_latency && getDbData.avg_latency && (
          <div className="performance-insight">
            <strong>⚡ Performance Improvement:</strong> Cache is{' '}
            {Math.round((getDbData.avg_latency / getCacheData.avg_latency) * 10) / 10}x faster
            than database queries
          </div>
        )}
      </div>

      {/* Cache Strategy Info */}
      {cacheStats && (
        <div className="cache-strategy-section">
          <h3>🎯 Cache Strategy Details</h3>
          <div className="strategy-grid">
            <div className="strategy-item">
              <strong>Strategy:</strong> {cacheStats.strategy}
            </div>
            <div className="strategy-item">
              <strong>Total Hits:</strong> {cacheStats.hits}
            </div>
            <div className="strategy-item">
              <strong>Total Misses:</strong> {cacheStats.misses}
            </div>
            <div className="strategy-item">
              <strong>Cache Size:</strong> {cacheStats.size}/{cacheStats.maxSize} items
            </div>
          </div>

          {cacheStats.topContent && cacheStats.topContent.length > 0 && (
            <div className="top-content">
              <h4>🔥 Most Accessed Content</h4>
              <table className="content-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Access Count</th>
                    <th>Last Accessed</th>
                  </tr>
                </thead>
                <tbody>
                  {cacheStats.topContent.slice(0, 5).map((item, index) => (
                    <tr key={index}>
                      <td>{item.title}</td>
                      <td>{item.access_count}</td>
                      <td>{new Date(item.last_accessed).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Testing Evidence */}
      <div className="testing-evidence">
        <h3>✅ Testing Evidence</h3>
        <div className="evidence-list">
          <div className="evidence-item">
            <span className="evidence-check">✓</span>
            <div>
              <strong>Performance Testing:</strong> Measured latency across {metrics?.totalRequests || 0} requests
            </div>
          </div>
          <div className="evidence-item">
            <span className="evidence-check">✓</span>
            <div>
              <strong>Cache Efficiency:</strong> {metrics?.cacheHitRate} hit rate demonstrates intelligent caching
            </div>
          </div>
          <div className="evidence-item">
            <span className="evidence-check">✓</span>
            <div>
              <strong>Bandwidth Optimization:</strong> Saved {metrics?.bandwidthSaved?.savedData} of data transfer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceMetrics;
