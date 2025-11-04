import React, { useEffect, useState } from 'react';
import './PerformanceMetrics.css';
import { API_BASE, ENDPOINTS } from '../config/appConfig.jsx';

export default function PerformanceMetrics() {
  const [health, setHealth] = useState({ ok: false, detail: '' });
  const [timing, setTiming] = useState(null);

  useEffect(() => {
    const t0 = performance.now();
    fetch(ENDPOINTS.health, { cache: 'no-store' })
      .then(async (r) => {
        const t1 = performance.now();
        setTiming(Math.round(t1 - t0));
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json().catch(() => ({}));
        setHealth({ ok: true, detail: data?.status || 'ok' });
      })
      .catch((err) => setHealth({ ok: false, detail: err.message }));
  }, []);

  return (
    <section className="metrics">
      <div className="card section">
        <h2 className="section-title">System Status</h2>
        <ul className="metrics-list">
          <li><strong>Mode:</strong> {import.meta.env.MODE}</li>
          <li><strong>API Base:</strong> {API_BASE}</li>
          <li><strong>Health:</strong> {health.ok ? 'Healthy' : 'Unreachable'}{health.detail ? ` — ${health.detail}` : ''}</li>
          <li><strong>Health RTT:</strong> {timing !== null ? `${timing} ms` : '…'}</li>
          <li><strong>Online:</strong> {typeof navigator !== 'undefined' && navigator.onLine ? 'Yes' : 'No'}</li>
        </ul>
      </div>
    </section>
  );
}
