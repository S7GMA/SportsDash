import type { EventStatus } from '@/domain/types';

const LABELS: Record<EventStatus, string> = {
  scheduled: 'Upcoming',
  live: 'Live',
  halftime: 'Halftime',
  delayed: 'Delayed',
  postponed: 'Postponed',
  suspended: 'Suspended',
  cancelled: 'Cancelled',
  completed: 'Final',
};

export function StatusBadge({ status }: { status: EventStatus }) {
  const isLive = status === 'live' || status === 'halftime';
  return (
    <span
      className="chip"
      style={{
        background: isLive ? 'rgba(255,45,85,0.16)' : status === 'completed' ? 'rgba(255,255,255,0.08)' : 'rgba(0,229,168,0.12)',
        color: isLive ? 'var(--live)' : status === 'completed' ? 'var(--muted)' : 'var(--accent)',
      }}
    >
      {isLive && <span className="pulse-dot" />}
      {LABELS[status]}
    </span>
  );
}
