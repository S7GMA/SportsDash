import { Link } from 'react-router-dom';
import type { DbsEvent } from '@/domain/dbs';
import { formatLocal } from '@/lib/countdown';

export function ScoreTicket({ event }: { event: DbsEvent }) {
  const live = event.state === 'in';
  return (
    <Link to={`/event/${event.id}`} className="ticket" style={{ display: 'block', padding: '16px 22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span className="chip">{event.sport.toUpperCase()}</span>
        <span className="chip" style={{ color: live ? 'var(--live)' : 'var(--gold)' }}>
          {live && <span className="pulse-dot" />}
          {event.status}
        </span>
      </div>
      {event.home && event.away ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 8 }}>
          <Side team={event.home} align="end" />
          <div className="wordmark" style={{ fontSize: 28, opacity: 0.5 }}>VS</div>
          <Side team={event.away} align="start" />
        </div>
      ) : (
        <div className="display" style={{ fontSize: 26 }}>{event.name}</div>
      )}
      <div className="mono" style={{ marginTop: 12, fontSize: 12, color: 'var(--mute)' }}>
        {event.venue ? `${event.venue} · ` : ''}
        {formatLocal(event.start)}
      </div>
    </Link>
  );
}

function Side({
  team,
  align,
}: {
  team: NonNullable<DbsEvent['home']>;
  align: 'start' | 'end';
}) {
  return (
    <div style={{ textAlign: align === 'end' ? 'right' : 'left' }}>
      {team.logo && <img src={team.logo} alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />}
      <div style={{ fontWeight: 700 }}>{team.abbr}</div>
      <div className="wordmark" style={{ fontSize: 40, lineHeight: 0.9 }}>{team.score ?? '—'}</div>
    </div>
  );
}
