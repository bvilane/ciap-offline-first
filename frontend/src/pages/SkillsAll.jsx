// frontend/src/pages/SkillsAll.jsx
import React, { useEffect, useState } from 'react';
import useCommunity from '../hooks/useCommunity';
import { list } from '../lib/api';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';
import CardGrid from '../components/CardGrid';

export default function SkillsAll() {
  const { community } = useCommunity();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [offline, setOffline] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  async function load() {
    const { data, offline } = await list('skills', { page, q, community, status: 'approved' });
    setOffline(offline);
    setItems(data?.data || data?.items || []);
    setTotalPages(data?.meta?.totalPages || data?.totalPages || 1);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, q, community]);

  return (
    <div className="container">
      <h2>Skills in {community}</h2>
      <Filters q={q} onApply={({ q })=>{ setPage(1); setQ(q); }} />
      <CardGrid items={items} offline={offline} type="skill" />
      <Pagination page={page} totalPages={totalPages} onPage={setPage} />
    </div>
  );
}
