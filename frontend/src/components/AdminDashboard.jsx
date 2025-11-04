import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import axios from 'axios';
import { API_BASE, ENDPOINTS } from '../config/appConfig.jsx';

const TYPES = ['notices', 'jobs', 'skills'];

export default function AdminDashboard() {
  const [active, setActive] = useState('notices');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    setLoading(true);
    setMsg('');
    try {
      // fetch pending only (backend should support ?status=pending)
      const url = `${API_BASE}/${active}`;
      const { data } = await axios.get(url, { params: { status: 'pending' } });
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setRows([]);
      setMsg('Failed to load pending submissions.');
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    try {
      await axios.post(ENDPOINTS.approve(active, id));
      setMsg('Approved successfully.');
      await load();
    } catch (err) {
      console.error(err);
      setMsg('Approval failed.');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <section className="admin">
      <div className="card section">
        <h2 className="section-title">Admin – Approvals</h2>

        <div className="admin-tabs">
          {TYPES.map(t => (
            <button
              key={t}
              className={`tab ${t === active ? 'active' : ''}`}
              onClick={() => setActive(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="subtle" style={{ marginTop: 6 }}>
          API Base: <strong>{API_BASE}</strong>
        </div>
      </div>

      {msg && <div className="card section">{msg}</div>}
      {loading && <div className="card section">Loading…</div>}

      {!loading && rows.length === 0 && (
        <div className="card section">No pending {active}.</div>
      )}

      {!loading && rows.length > 0 && (
        <div className="card section">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Community</th>
                <th>Submitted By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.title || r.name || 'Untitled'}</td>
                  <td>{r.community || '-'}</td>
                  <td>{r.submittedBy || r.email || '-'}</td>
                  <td>
                    <button className="btn" onClick={() => approve(r.id)}>Approve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
