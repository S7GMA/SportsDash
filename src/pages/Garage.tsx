import { useEffect, useState } from 'react';
import { loadDriverCareer } from '@/api/catalog';
import { OffSeasonLock } from '@/components/OffSeasonLock';
import { DriverCard, TeamTradingCard } from '@/components/TradingCard';
import type { CareerRecord } from '@/domain/dbs';
import { useSportsData } from '@/providers/SportsDataContext';

export function GaragePage() {
  const { drivers, teams, constructors, gates, loading } = useSportsData();
  const [careers, setCareers] = useState<Record<string, CareerRecord>>({});
  const f1Teams = teams.filter((t) => t.sport === 'f1');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next: Record<string, CareerRecord> = {};
      for (const d of drivers) {
        if (cancelled) return;
        try {
          next[d.id] = await loadDriverCareer(d.id);
          if (!cancelled) setCareers({ ...next });
        } catch {
          /* keep the card; career fills in on the profile */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [drivers]);

  if (loading) return <p>Rolling the garage door…</p>;

  return (
    <>
      <div>
        <div className="kicker">Formula 1 · 2026 grid</div>
        <h1 className="display" style={{ fontSize: 48, color: 'var(--ivy-dark)' }}>The garage</h1>
        <p style={{ color: 'var(--mute)' }}>Every current driver as a trading card. Hover to flip for the all-time record.</p>
      </div>
      <OffSeasonLock gate={gates.f1}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 16 }}>
          {drivers.map((d) => (
            <DriverCard key={d.id} driver={d} career={careers[d.id]} />
          ))}
        </div>
        <h2 className="kicker" style={{ fontSize: 18, margin: '28px 0 12px' }}>— Constructors —</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {f1Teams.map((t) => {
            const row = constructors.find((c) => c.id === t.abbr);
            return (
              <TeamTradingCard
                key={t.id}
                name={t.name}
                logo={t.logo}
                color={t.color}
                meta={row ? `P${row.position} · ${row.points} pts` : t.abbr}
                href={`/team/${t.id}`}
                type="team"
                refId={t.id}
              />
            );
          })}
        </div>
      </OffSeasonLock>
    </>
  );
}
