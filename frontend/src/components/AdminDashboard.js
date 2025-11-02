import React, { useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

export default function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('article');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const upload = async (e) => {
    e.preventDefault();
    setBusy(true); setMsg('');
    try {
      await axios.post(`${API}/content`, { title, type, body });
      setMsg('Content uploaded.');
      setTitle(''); setBody(''); setType('article');
    } catch {
      setMsg('Upload failed.');
    } finally {
      setBusy(false);
    }
  };

  const seed = async () => {
    setBusy(true); setMsg('');
    try {
      await axios.post(`${API}/admin/seed`);
      setMsg('Example data created.');
    } catch {
      setMsg('Seeding failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="admin">
      <div className="card section">
        <h2 className="section-title">Admin</h2>
        <p className="subtle">Manage content and initialize sample data.</p>
      </div>

      <form className="card section row" onSubmit={upload}>
        <div>
          <label className="subtle">Title</label><br />
          <input className="input" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Content title" />
        </div>
        <div>
          <label className="subtle">Type</label><br />
          <select className="input" value={type} onChange={(e)=>setType(e.target.value)}>
            <option value="article">Article</option>
            <option value="video">Video</option>
            <option value="pdf">Document</option>
            <option value="image">Image</option>
          </select>
        </div>
        <div>
          <label className="subtle">Body (optional)</label><br />
          <textarea className="input" value={body} onChange={(e)=>setBody(e.target.value)} placeholder="Markdown or plain text"></textarea>
        </div>
        <div className="actions">
          <button className="btn" disabled={busy} type="submit">Upload Content</button>
          <button className="btn secondary" disabled={busy} type="button" onClick={seed}>Seed Example Data</button>
          {msg && <span className="subtle">{msg}</span>}
        </div>
      </form>
    </section>
  );
}
