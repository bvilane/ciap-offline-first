// frontend/src/pages/DirectoryAll.jsx
import React, { useEffect, useMemo, useState } from 'react';
import useCommunity from '../hooks/useCommunity';
import { list } from '../lib/api';

export default function DirectoryAll() {
  const { community } = useCommunity();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [items, setItems] = useState([]);

  async function load() {
    const { data } = await list('directory', { q, community });
    setItems(data?.data || data?.items || []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [q, community]);

  const cats = useMemo(() => {
    const set = new Set(['all']);
    for (const it of items) if (it.category) set.add(it.category);
    return Array.from(set);
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter(it => cat === 'all' ? true : it.category === cat);
  }, [items, cat]);

  return (
    <div className="container">
      <h2>Directory — {community}</h2>
      <div style={{ display:'flex', gap:8, margin:'12px 0' }}>
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          placeholder="Search businesses, services…"
          style={{ flex:1, padding:'8px 10px', border:'1px solid #CBD5E1', borderRadius:6 }}
        />
        <select value={cat} onChange={e=>setCat(e.target.value)}>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <ul style={{ listStyle:'none', margin:0, padding:0 }}>
        {filtered.map((it) => (
          <li key={it.id} style={{ border:'1px solid #E6E8EB', borderRadius:8, padding:12, marginBottom:10, background:'#fff' }}>
            <div style={{ display:'flex', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
              <div>
                <div style={{ fontWeight:600 }}>{it.name}</div>
                <div style={{ fontSize:13, color:'#475569' }}>{it.category || 'General'}</div>
                {it.description ? <div style={{ marginTop:6, color:'#475569' }}>{it.description}</div> : null}
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                {it.phone ? (
                  <a
                    href={`tel:${it.phone}`}
                    style={{ padding:'6px 10px', border:'1px solid #CBD5E1', borderRadius:6 }}
                  >
                    Call
                  </a>
                ) : null}
                {it.website ? (
                  <a
                    href={it.website.startsWith('http') ? it.website : `https://${it.website}`}
                    target="_blank" rel="noreferrer"
                    style={{ padding:'6px 10px', border:'1px solid #CBD5E1', borderRadius:6 }}
                  >
                    Website
                  </a>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
