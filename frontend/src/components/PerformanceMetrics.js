import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PerformanceMetrics.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

export default function PerformanceMetrics() {
  const [stats, setStats] = useState({ hitRate: 0, bandwidthSaved: 0, latencyMs: 0 });

  const load = async () => {
    try {
      const { data } = await axios.get(`${API}/metrics`);
      setStats({
        hitRate: data?.hitRate ?? 0,
        bandwidthSaved: data?.bandwidthSaved ?? 0,
        latencyMs: data?.latencyMs ?? 0,
      });
    } catch {
      // keep defaults
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <section className="metrics">
      <div className="card section">
        <h2 className="section-title">Performance Metrics</h2>
        <p className="subtle">Key indicators from the caching layer and edge network.</p>
      </div>

      <div className="tiles">
        <div className="card section tile">
          <h4>Cache Hit Rate</h4>
          <div className="value">{(stats.hitRate * 100).toFixed(1)}%</div>
        </div>
        <div className="card section tile">
          <h4>Bandwidth Savings</h4>
          <div className="value">{stats.bandwidthSaved.toFixed(2)} MB</div>
        </div>
        <div className="card section tile">
          <h4>Median Latency</h4>
          <div className="value">{Math.round(stats.latencyMs)} ms</div>
        </div>
      </div>
    </section>
  );
}
