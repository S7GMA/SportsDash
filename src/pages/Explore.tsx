import { OffSeasonLock } from '@/components/OffSeasonLock';
import { NewsGrid } from '@/components/NewsGrid';
import { SocialRow } from '@/components/SocialRow';
import { TeamTradingCard } from '@/components/TradingCard';
import { LEAGUE_SOCIALS } from '@/lib/socials';
import { useSportsData } from '@/providers/SportsDataContext';
import type { SportKey } from '@/domain/dbs';

const SPORTS: SportKey[] = ['mlb', 'soccer', 'nfl', 'nba', 'f1'];
const LABELS: Record<SportKey, string> = {
  mlb: 'Every MLB club',
  soccer: 'Every Premier League club',
  nfl: 'Every NFL franchise',
  nba: 'Every NBA franchise',
  f1: 'Every F1 constructor',
};

export function ExplorePage() {
  const { teams, news, gates, loading } = useSportsData();
  if (loading) return <p>Counting jerseys…</p>;
  return (
    <>
      <div>
        <div className="kicker">The clubs</div>
        <h1 className="display" style={{ fontSize: 48, color: 'var(--ivy-dark)' }}>Full sets</h1>
        <p style={{ color: 'var(--mute)' }}>All teams for in-season sports. Greyed sports keep news and X only.</p>
      </div>
      {SPORTS.map((sport) => {
        const list = teams.filter((t) => t.sport === sport);
        const gate = gates[sport];
        return (
          <section key={sport}>
            <h2 className="kicker" style={{ fontSize: 16, marginBottom: 8 }}>
              {LABELS[sport]} <span className="mono" style={{ color: 'var(--gold)' }}>({list.length})</span>
            </h2>
            <OffSeasonLock gate={gate}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                {list.map((t) => (
                  <TeamTradingCard key={t.id} name={t.name} logo={t.logo} color={t.color} meta={t.abbr} href={`/team/${t.id}`} type="team" refId={t.id} />
                ))}
              </div>
            </OffSeasonLock>
            <div style={{ marginTop: 14 }}>
              <NewsGrid items={news.filter((n) => n.sport === sport).slice(0, 3)} />
              <div style={{ height: 10 }} />
              <SocialRow links={LEAGUE_SOCIALS[sport]} />
            </div>
          </section>
        );
      })}
    </>
  );
}
