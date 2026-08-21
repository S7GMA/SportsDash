import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { NewsGrid } from '@/components/NewsGrid';
import { OffSeasonLock } from '@/components/OffSeasonLock';
import { ScoreTicket } from '@/components/ScoreTicket';
import { SocialRow } from '@/components/SocialRow';
import { DriverCard, TeamTradingCard } from '@/components/TradingCard';
import { LEAGUE_SOCIALS } from '@/lib/socials';
import { isSameDay } from '@/lib/time';
import { useSportsData } from '@/providers/SportsDataContext';
import type { SportKey } from '@/domain/dbs';

const ORDER: SportKey[] = ['f1', 'mlb', 'soccer', 'nfl', 'nba'];
const LABELS: Record<SportKey, string> = {
  f1: 'Formula 1',
  mlb: 'MLB',
  soccer: 'FIFA / Premier League',
  nfl: 'NFL',
  nba: 'NBA',
};

export function HomePage() {
  const { loading, error, gates, events, teams, drivers, news } = useSportsData();
  const [open, setOpen] = useState<Record<SportKey, boolean>>(() => ({
    f1: true,
    mlb: true,
    soccer: true,
    nfl: false,
    nba: false,
  }));

  const todayGames = useMemo(
    () =>
      events
        .filter((e) => isSameDay(e.start, 0))
        .sort((a, b) => +new Date(a.start) - +new Date(b.start)),
    [events],
  );

  if (loading) return <Warming />;
  if (error) return <p>Couldn’t reach the wires: {error}</p>;

  return (
    <>
      <header>
        <div className="kicker">Home</div>
        <h1 className="display" style={{ fontSize: 48, color: 'var(--ivy-dark)' }}>The long game</h1>
        <p style={{ fontSize: 20, color: 'var(--mute)', maxWidth: 640 }}>
                  Real Scores, Full Clubs, & The F1 grid. No sign up needed.
        </p>
      </header>

      <section className="ticket" style={{ padding: 20 }}>
        <h2 className="kicker" style={{ fontSize: 20, marginBottom: 12 }}>— Today —</h2>
        {todayGames.length === 0 ? (
          <p style={{ color: 'var(--mute)' }}>No games on today’s slate yet. Check Live / Scores for the week.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
            {todayGames.map((e) => <ScoreTicket key={e.id} event={e} />)}
          </div>
        )}
      </section>

      {ORDER.map((sport) => {
        const gate = gates[sport];
        const isOpen = open[sport] ?? Boolean(gate?.inSeason);
        const sportNews = news.filter((n) => n.sport === sport).slice(0, 6);
        const sportTeams = teams.filter((t) => t.sport === sport);
        const today = events.filter((e) => e.sport === sport && isSameDay(e.start, 0));
        const upcoming = events
          .filter((e) => e.sport === sport && e.state === 'pre' && !isSameDay(e.start, 0))
          .slice(0, 6);
        return (
          <section key={sport} className="ticket" style={{ padding: 0, overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setOpen((s) => ({ ...s, [sport]: !isOpen }))}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                padding: '16px 18px',
                background: 'var(--paper)',
                border: 0,
                borderBottom: isOpen ? '3px solid var(--ivy-dark)' : 0,
                textAlign: 'left',
              }}
            >
              <span className="kicker" style={{ fontSize: 20 }}>— {LABELS[sport]} —</span>
              <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span className="chip">{gate?.inSeason ? gate.phase : 'Out of season'}</span>
                <span className="wordmark" style={{ fontSize: 22, color: 'var(--ivy-dark)' }}>{isOpen ? '▾' : '▸'}</span>
              </span>
            </button>
            {isOpen && (
              <div style={{ padding: 18 }}>
                {today.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div className="kicker" style={{ marginBottom: 8 }}>Today</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
                      {today.map((e) => <ScoreTicket key={e.id} event={e} />)}
                    </div>
                  </div>
                )}
                <OffSeasonLock gate={gate}>
                  {sport === 'f1' ? (
                    <>
                      {upcoming.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10, marginBottom: 14 }}>
                          {upcoming.map((e) => <ScoreTicket key={e.id} event={e} />)}
                        </div>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                        {drivers.slice(0, 8).map((d) => <DriverCard key={d.id} driver={d} />)}
                      </div>
                    </>
                  ) : (
                    <>
                      {upcoming.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10, marginBottom: 14 }}>
                          {upcoming.map((e) => <ScoreTicket key={e.id} event={e} />)}
                        </div>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                        {sportTeams.slice(0, gate?.inSeason ? 12 : 6).map((t) => (
                          <TeamTradingCard key={t.id} name={t.name} logo={t.logo} color={t.color} meta={t.abbr} href={`/team/${t.id}`} type="team" refId={t.id} />
                        ))}
                      </div>
                    </>
                  )}
                </OffSeasonLock>
                <div style={{ marginTop: 16, display: 'grid', gap: 14 }}>
                  <NewsGrid items={sportNews} />
                  <SocialRow links={LEAGUE_SOCIALS[sport]} title="Official X" />
                </div>
                <Link to={sport === 'f1' ? '/garage' : '/explore'} className="kicker" style={{ display: 'inline-block', marginTop: 12, fontSize: 16 }}>
                  See the full set →
                </Link>
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}

function Warming() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: 360, gap: 12 }}>
      <img src="/brand/dannyboy-logo.png" alt="" className="logo" style={{ height: 64 }} />
      <p className="kicker" style={{ fontSize: 16 }}>Loading the board…</p>
    </div>
  );
}
