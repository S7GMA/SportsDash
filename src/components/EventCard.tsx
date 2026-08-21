import { Link } from 'react-router-dom';
import type { Driver, SportEvent } from '@/domain/types';
import { StatusBadge } from '@/components/StatusBadge';
import { formatClock, formatEventTimezone, formatLocalTime, relativeDay } from '@/lib/time';
import { useFavoritesStore, usePrefsStore } from '@/state/stores';
import { eventTouchesFavorite } from '@/lib/favorites';

const SPORT_LABEL: Record<string, string> = {
  f1: 'F1',
  nfl: 'NFL',
  nba: 'NBA',
  mlb: 'MLB',
  soccer: 'Soccer',
};

export function EventCard({
  event,
  drivers = [],
  compact = false,
}: {
  event: SportEvent;
  drivers?: Driver[];
  compact?: boolean;
}) {
  const favorites = useFavoritesStore((s) => s.favorites);
  const showTz = usePrefsStore((s) => s.showEventTimezone);
  const highlighted = eventTouchesFavorite(event, favorites);
  const f1 = event.details?.sportType === 'f1' ? event.details : null;
  const session = f1?.currentSession ?? f1?.sessions.find((s) => s.status === 'live') ?? f1?.sessions.at(-1);
  const home = event.participants[0];
  const away = event.participants[1];

  return (
    <Link
      to={`/event/${event.id}`}
      className="card"
      style={{
        display: 'block',
        padding: compact ? 14 : 18,
        outline: highlighted ? '1px solid rgba(0,229,168,0.35)' : undefined,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="chip" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--muted)' }}>
            {SPORT_LABEL[event.sportId] ?? event.sportId}
          </span>
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>{event.competition}</span>
        </div>
        <StatusBadge status={event.status} />
      </div>

      {f1 ? (
        <div>
          <div style={{ fontSize: compact ? 20 : 26 }} className="score-font">
            {event.name}
          </div>
          <div style={{ color: 'var(--muted)', marginTop: 4, fontSize: 13 }}>
            {f1.circuit.name} · {session?.name}
            {session?.currentLap && session.lapCount
              ? ` · Lap ${session.currentLap}/${session.lapCount}`
              : null}
          </div>
          {session?.results && session.results.length > 0 && (
            <div style={{ marginTop: 12, display: 'grid', gap: 6 }}>
              {session.results.slice(0, compact ? 3 : 5).map((row) => {
                const driver = drivers.find((d) => d.id === row.driverId);
                return (
                  <div key={row.driverId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span>
                      <span className="score-font" style={{ width: 24, display: 'inline-block', color: 'var(--gold)' }}>
                        P{row.position}
                      </span>
                      {driver?.code ?? row.driverId.toUpperCase()} {driver?.name ? `· ${driver.name}` : ''}
                    </span>
                    <span style={{ color: 'var(--muted)' }}>{row.time ?? `${row.laps ?? ''} L`}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 12 }}>
          <TeamSide name={home?.name ?? 'TBD'} short={home?.shortName} score={home?.score} align="right" live={event.status === 'live'} />
          <div style={{ textAlign: 'center', color: 'var(--faint)', fontSize: 12, fontWeight: 700 }}>
            {event.status === 'live' ? sportClock(event) : 'VS'}
          </div>
          <TeamSide name={away?.name ?? 'TBD'} short={away?.shortName} score={away?.score} align="left" live={event.status === 'live'} />
        </div>
      )}

      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', gap: 8, color: 'var(--muted)', fontSize: 12 }}>
        <span>
          {event.venue?.name}
          {event.venue?.city ? ` · ${event.venue.city}` : ''}
        </span>
        <span>
          {event.status === 'scheduled'
            ? `${relativeDay(event.startTime)} ${formatClock(event.startTime)}`
            : formatLocalTime(event.startTime, { weekday: undefined })}
          {showTz ? ` · local` : ''}
        </span>
      </div>
      {showTz && event.status === 'scheduled' && (
        <div style={{ marginTop: 4, color: 'var(--faint)', fontSize: 11, textAlign: 'right' }}>
          Event time {formatEventTimezone(event.startTime, event.eventTimezone)}
        </div>
      )}
    </Link>
  );
}

function TeamSide({
  name,
  short,
  score,
  align,
  live,
}: {
  name: string;
  short?: string;
  score?: number;
  align: 'left' | 'right';
  live: boolean;
}) {
  return (
    <div style={{ textAlign: align }}>
      <div style={{ fontWeight: 600, fontSize: 14 }}>{short ?? name}</div>
      <div className="score-font" style={{ fontSize: live || score !== undefined ? 36 : 22, lineHeight: 1, marginTop: 4 }}>
        {score ?? '—'}
      </div>
    </div>
  );
}

function sportClock(event: SportEvent): string {
  const d = event.details;
  if (!d || d.sportType === 'f1') return 'LIVE';
  if (d.sportType === 'soccer' && d.soccerSpecific) return `${d.soccerSpecific.minute}'`;
  if (d.sportType === 'mlb' && d.mlbSpecific) {
    return `${d.mlbSpecific.half === 'top' ? 'Top' : 'Bot'} ${d.mlbSpecific.inning}`;
  }
  if (d.clock) return `${d.periods?.find((p) => p.number === d.currentPeriod)?.name ?? ''} ${d.clock}`;
  return 'LIVE';
}
