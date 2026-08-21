import { ScoreTicket } from '@/components/ScoreTicket';
import { OffSeasonLock } from '@/components/OffSeasonLock';
import { formatLocal } from '@/lib/countdown';
import { useSportsData } from '@/providers/SportsDataContext';

export function SchedulePage() {
  const { events, gates, loading } = useSportsData();
  if (loading) return <p>Setting the markers…</p>;
  const upcoming = [...events].sort((a, b) => +new Date(a.start) - +new Date(b.start));
  return (
    <>
      <h1 className="display" style={{ fontSize: 48, color: 'var(--ivy-dark)' }}>Scores</h1>
      <p style={{ color: 'var(--mute)' }}>Local times · {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
      {(['mlb', 'soccer', 'f1', 'nfl', 'nba'] as const).map((sport) => {
        const list = upcoming.filter((e) => e.sport === sport);
        if (!list.length) return null;
        return (
          <section key={sport}>
            <h2 className="display" style={{ fontSize: 28, marginBottom: 8 }}>{sport.toUpperCase()}</h2>
            <OffSeasonLock gate={gates[sport]}>
              <div style={{ display: 'grid', gap: 10 }}>
                {list.map((e) => <ScoreTicket key={e.id} event={e} />)}
              </div>
            </OffSeasonLock>
            {!gates[sport]?.inSeason && (
              <p className="mono" style={{ marginTop: 8, color: 'var(--gold)' }}>
                Back {formatLocal(gates[sport]?.resumesAt)}
              </p>
            )}
          </section>
        );
      })}
    </>
  );
}
