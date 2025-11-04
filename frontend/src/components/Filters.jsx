// frontend/src/components/Filters.jsx
import React, { useState, useEffect } from 'react';

export default function Filters({ q: q0 = '', onApply }) {
  const [q, setQ] = useState(q0);
  useEffect(()=>{ setQ(q0); }, [q0]);

  return (
    <form onSubmit={(e)=>{ e.preventDefault(); onApply({ q }); }} style={{ display:'flex', gap:8, margin:'12px 0' }}>
      <input
        value={q}
        onChange={e=>setQ(e.target.value)}
        placeholder="Search…"
        style={{ flex:1, padding:'8px 10px', border:'1px solid #CBD5E1', borderRadius:6 }}
      />
      <button type="submit">Apply</button>
    </form>
  );
}
