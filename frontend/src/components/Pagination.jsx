// frontend/src/components/Pagination.jsx
import React from 'react';

export default function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  const prev = () => onPage(Math.max(1, page - 1));
  const next = () => onPage(Math.min(totalPages, page + 1));
  return (
    <div style={{ display:'flex', gap:8, alignItems:'center', justifyContent:'center', padding:'12px 0' }}>
      <button onClick={prev} disabled={page<=1}>Prev</button>
      <span style={{ fontSize:13, color:'#475569' }}>Page {page} of {totalPages}</span>
      <button onClick={next} disabled={page>=totalPages}>Next</button>
    </div>
  );
}
