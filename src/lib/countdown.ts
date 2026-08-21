export function countdownParts(iso?: string) {
  if (!iso) return { d: 0, h: 0, m: 0, s: 0, past: true };
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, past: true };
  const s = Math.floor(diff / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
    past: false,
  };
}

export function formatLocal(iso?: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
