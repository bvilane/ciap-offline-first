import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './ContentGrid.css';

function Card({ tag, title, desc, meta, action }) {
  return (
    <div className="grid-card card">
      <div className="thumb" />
      <div className="body">
        <div className="tag">{tag}</div>
        <div className="title">{title}</div>
        <div className="desc">{desc}</div>
        {meta && <div className="meta">{meta}</div>}
        {action && action.href && (
          <a className="btn" href={action.href} target="_blank" rel="noreferrer">{action.label || 'Open'}</a>
        )}
      </div>
    </div>
  );
}

export default function ContentGrid({ api, community, query }) {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);

  const params = useMemo(() => ({ community }), [community]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [notices, jobs, skills] = await Promise.all([
          axios.get(api.notices, { params }),
          axios.get(api.jobs, { params }),
          axios.get(api.skills, { params }),
        ]);
        const nn = (notices.data || []).map(n => ({
          type: 'notice',
          title: n.title,
          desc: n.body || '',
          meta: new Date(Number(n.created_at)).toLocaleDateString(),
          tag: 'Notice'
        }));
        const jj = (jobs.data || []).map(j => ({
          type: 'job',
          title: j.title,
          desc: j.summary || '',
          meta: [j.company, j.location, j.type].filter(Boolean).join(' • '),
          tag: 'Job',
          action: (j.apply_url || j.applyUrl) ? { label: 'Apply', href: j.apply_url || j.applyUrl } : null
        }));
        const ss = (skills.data || []).map(s => ({
          type: 'skill',
          title: s.title,
          desc: s.summary || '',
          meta: s.provider ? `Provider: ${s.provider}` : '',
          tag: 'Skill',
          action: s.url ? { label: 'Open', href: s.url } : null
        }));

        let merged = [...nn, ...jj, ...ss];
        if (query && query.trim()) {
          const q = query.trim().toLowerCase();
          merged = merged.filter(c =>
            [c.title, c.desc, c.meta].join(' ').toLowerCase().includes(q)
          );
        }
        // show most recent first (approx by pushing notices first, jobs next, etc.)
        if (mounted) setCards(merged.slice(0, 12));
      } catch {
        if (mounted) setCards([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [api, params, query]);

  return (
    <div className="container">
      <section className="card section">
        <h2 className="section-title">What’s happening</h2>
        <p className="subtle">News, announcements, jobs and skills — curated for <strong>{community}</strong>.</p>
      </section>

      <div className="grid grid-3">
        {loading && <div className="card section">Loading…</div>}
        {!loading && cards.length === 0 && (
          <div className="card section">No results. Try a different search.</div>
        )}
        {!loading && cards.map((c, idx) => (
          <Card key={`${c.type}-${idx}`} {...c} />
        ))}
      </div>
    </div>
  );
}
