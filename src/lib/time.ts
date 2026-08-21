const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function getUserTimezone(): string {
  return userTz;
}

export function formatLocalTime(iso: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: userTz,
    ...options,
  });
}

export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: userTz,
  });
}

export function formatEventTimezone(iso: string, eventTimezone: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: eventTimezone,
    timeZoneName: 'short',
  });
}

export function relativeDay(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = Math.round((startOf(date) - startOf(now)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function isSameDay(iso: string, offsetDays = 0): boolean {
  const date = new Date(iso);
  const target = new Date();
  target.setDate(target.getDate() + offsetDays);
  return date.toDateString() === target.toDateString();
}
