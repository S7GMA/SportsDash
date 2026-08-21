import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartButton } from '@/components/HeartButton';
import { useSportsData } from '@/providers/SportsDataContext';

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { teams, drivers } = useSportsData();
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (!query) return [];
    const hits: { to: string; title: string; sub: string; type: 'team' | 'driver'; refId: string }[] = [];
    teams.forEach((t) => {
      if (t.name.toLowerCase().includes(query) || t.abbr.toLowerCase().includes(query)) {
        hits.push({ to: `/team/${t.id}`, title: t.name, sub: t.sport.toUpperCase(), type: 'team', refId: t.id });
      }
    });
    drivers.forEach((d) => {
      if (d.name.toLowerCase().includes(query) || d.code.toLowerCase().includes(query)) {
        hits.push({ to: `/driver/${d.id}`, title: d.name, sub: d.code, type: 'driver', refId: d.id });
      }
    });
    return hits.slice(0, 18);
  }, [drivers, query, teams]);

  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20, 38, 28, 0.55)', zIndex: 50, padding: 24 }}>
      <div className="ticket" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640, margin: '80px auto', padding: 16 }}>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Teams, clubs, drivers…"
          style={{ width: '100%', background: 'var(--bg)', border: '3px solid var(--ivy-dark)', borderRadius: 6, padding: '12px 14px' }}
        />
        <div style={{ marginTop: 12, display: 'grid', gap: 8, maxHeight: 420, overflow: 'auto' }}>
          {query && !results.length && <div style={{ color: 'var(--mute)', padding: 12 }}>No matches.</div>}
          {results.map((r) => (
            <div key={r.to} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
              <Link to={r.to} onClick={onClose} style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{r.title}</div>
                <div className="mono" style={{ fontSize: 12, color: 'var(--gold)' }}>{r.sub}</div>
              </Link>
              <HeartButton type={r.type} refId={r.refId} name={r.title} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
