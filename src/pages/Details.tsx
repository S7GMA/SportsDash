import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { loadDriverCareer } from '@/api/catalog';
import { HeartButton } from '@/components/HeartButton';
import { NewsGrid } from '@/components/NewsGrid';
import { ScoreTicket } from '@/components/ScoreTicket';
import { SocialRow } from '@/components/SocialRow';
import { DriverCard } from '@/components/TradingCard';
import type { CareerRecord } from '@/domain/dbs';
import { F1_TEAM_X, LEAGUE_SOCIALS } from '@/lib/socials';
import { useSportsData } from '@/providers/SportsDataContext';

export function EventDetailPage() {
  const { id } = useParams();
  const { events } = useSportsData();
  const event = events.find((e) => e.id === id);
  if (!event) return <Missing label="Event" />;
  return (
    <div>
      <Back />
      <h1 className="display" style={{ fontSize: 40, color: 'var(--ivy-dark)', margin: '8px 0' }}>{event.name}</h1>
      <ScoreTicket event={event} />
    </div>
  );
}

export function TeamDetailPage() {
  const { id } = useParams();
  const { teams, events, drivers, news, constructors } = useSportsData();
  const team = teams.find((t) => t.id === id);
  if (!team) return <Missing label="Club" />;
  const related = events.filter(
    (e) => e.home?.name === team.name || e.away?.name === team.name || e.home?.id === team.id.replace(/^[a-z]+-/, '') || e.away?.id === team.id.replace(/^[a-z]+-/, ''),
  );
  const roster = drivers.filter((d) => `f1-${d.teamId}` === team.id);
  const ctor = constructors.find((c) => `f1-${c.id}` === team.id);
  const socials = team.sport === 'f1' && team.x
    ? [{ label: team.name, handle: team.x.replace('https://x.com/', '@'), href: team.x }]
    : LEAGUE_SOCIALS[team.sport];
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Back />
      <div className="ticket" style={{ padding: 20, display: 'grid', justifyItems: 'center', gap: 8 }}>
        {team.logo && <img src={team.logo} alt="" style={{ width: 120, height: 120, objectFit: 'contain' }} />}
        <h1 className="display" style={{ fontSize: 40, color: 'var(--ivy-dark)' }}>{team.name}</h1>
        <HeartButton type="team" refId={team.id} name={team.name} />
        {ctor && <p className="mono">{`P${ctor.position} · ${ctor.points} pts · ${ctor.wins ?? 0} wins`}</p>}
      </div>
      {roster.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 12 }}>
          {roster.map((d) => <DriverCard key={d.id} driver={d} />)}
        </div>
      )}
      {related.map((e) => <ScoreTicket key={e.id} event={e} />)}
      <NewsGrid items={news.filter((n) => n.sport === team.sport).slice(0, 4)} />
      <SocialRow links={socials} title="X booth" />
    </div>
  );
}

export function DriverDetailPage() {
  const { id } = useParams();
  const { drivers } = useSportsData();
  const driver = drivers.find((d) => d.id === id);
  const [career, setCareer] = useState<CareerRecord | null>(null);
  useEffect(() => {
    if (!id) return;
    loadDriverCareer(id).then(setCareer).catch(() => setCareer(null));
  }, [id]);
  if (!driver) return <Missing label="Driver" />;
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 520 }}>
      <Back />
      <DriverCard driver={driver} career={career ?? undefined} />
      <section className="ticket" style={{ padding: 16 }}>
        <h2 className="display">2026 season</h2>
        <div className="stat-grid" style={{ marginTop: 12 }}>
          <div><strong>P{driver.season.position}</strong><span>Champ</span></div>
          <div><strong>{driver.season.points}</strong><span>Points</span></div>
          <div><strong>{driver.season.wins}</strong><span>Wins</span></div>
        </div>
      </section>
      {career && (
        <section className="ticket" style={{ padding: 16 }}>
          <h2 className="display">All-time</h2>
          <p className="mono" style={{ margin: '6px 0 12px' }}>{career.seasons} seasons in the book</p>
          <div className="stat-grid">
            <div><strong>{career.races}</strong><span>Starts</span></div>
            <div><strong>{career.wins}</strong><span>Wins</span></div>
            <div><strong>{career.podiums}</strong><span>Podiums</span></div>
            <div><strong>{career.poles}</strong><span>Poles</span></div>
            <div><strong>{career.championships}</strong><span>Titles</span></div>
            <div><strong>{career.dnfs}</strong><span>DNF</span></div>
          </div>
        </section>
      )}
      <HeartButton type="driver" refId={driver.id} name={driver.name} />
      {F1_TEAM_X[driver.teamId] && (
        <SocialRow links={[{ label: driver.teamName, handle: '@team', href: F1_TEAM_X[driver.teamId] }]} />
      )}
    </div>
  );
}

export function PlayerDetailPage() {
  return <Missing label="Player" />;
}

export function LeagueDetailPage() {
  return <Missing label="League" />;
}

function Back() {
  return (
    <Link to="/" className="kicker">← Back to the board</Link>
  );
}

function Missing({ label }: { label: string }) {
  return (
    <div className="ticket" style={{ padding: 24 }}>
      <Back />
      <p style={{ marginTop: 12 }}>{label} isn’t on this card.</p>
    </div>
  );
}
