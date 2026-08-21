import { useMemo, useState } from 'react';
import { NewsGrid } from '@/components/NewsGrid';
import { OffSeasonLock } from '@/components/OffSeasonLock';
import { ScoreTicket } from '@/components/ScoreTicket';
import { SocialRow } from '@/components/SocialRow';
import { LEAGUE_SOCIALS } from '@/lib/socials';
import { useSportsData } from '@/providers/SportsDataContext';
import type { SportKey } from '@/domain/dbs';

export function LivePage() {
  const { events, news, gates, loading } = useSportsData();
  const [sport, setSport] = useState<SportKey | 'all'>('all');
  const visible = useMemo(() => {
    return events.filter((e) => {
      if (sport !== 'all' && e.sport !== sport) return false;
      if (gates[e.sport] && !gates[e.sport].inSeason) return false;
      return e.state !== 'post';
    });
  }, [events, gates, sport]);
  if (loading) return <p>Listening for whistles…</p>;
  const selected = sport === 'all' ? undefined : sport;
  const locked = Boolean(selected && gates[selected] && !gates[selected].inSeason);
  return (
    <>
      <h1 className="display" style={{ fontSize: 48, color: 'var(--ivy-dark)' }}>Live</h1>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(['all', 'f1', 'mlb', 'soccer', 'nfl', 'nba'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSport(s)}
            style={{
              border: '2px solid var(--ivy-dark)',
              borderRadius: 4,
              padding: '8px 12px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
              background: sport === s ? 'var(--ivy)' : 'var(--paper)',
              color: sport === s ? '#fff' : 'var(--ink)',
            }}
          >
            {s === 'all' ? 'All' : s.toUpperCase()}
          </button>
        ))}
      </div>
      {locked && selected ? (
        <>
          <OffSeasonLock gate={gates[selected]}>
            <div style={{ minHeight: 220 }} />
          </OffSeasonLock>
          <NewsGrid items={news.filter((n) => n.sport === selected)} />
          <SocialRow links={LEAGUE_SOCIALS[selected]} title="Official X" />
        </>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {visible.map((e) => <ScoreTicket key={e.id} event={e} />)}
        </div>
      )}
    </>
  );
}
