// frontend/src/pages/Submit.jsx
import React, { useState } from 'react';
import useCommunity from '../hooks/useCommunity';
import { submit } from '../lib/api';

export default function Submit() {
  const { community } = useCommunity();
  const [type, setType] = useState('jobs');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [msg, setMsg] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setMsg('');
    if (!title.trim() || !description.trim()) {
      setMsg('Please fill in title and description.');
      return;
    }
    const res = await submit(type, { title, description, contact, community });
    if (res.ok) {
      setTitle(''); setDescription(''); setContact('');
      setMsg('Submitted for approval. Thank you!');
    } else {
      setMsg(res.error || 'Error submitting.');
    }
  }

  return (
    <div className="container">
      <h2>Submit a Listing</h2>
      <form onSubmit={onSubmit} style={{ maxWidth:680 }}>
        <label>Type</label>
        <select value={type} onChange={e=>setType(e.target.value)}>
          <option value="jobs">Job</option>
          <option value="notices">Notice</option>
          <option value="skills">Skill</option>
        </select>

        <label style={{ marginTop:10 }}>Title</label>
        <input value={title} onChange={e=>setTitle(e.target.value)} required />

        <label style={{ marginTop:10 }}>Description</label>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={6} required />

        <label style={{ marginTop:10 }}>Contact (optional)</label>
        <input value={contact} onChange={e=>setContact(e.target.value)} placeholder="Phone or email" />

        <div style={{ marginTop:12 }}>
          <button type="submit">Submit</button>
        </div>

        {msg ? <p style={{ marginTop:10 }}>{msg}</p> : null}
      </form>
    </div>
  );
}
