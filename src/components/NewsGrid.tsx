import type { DbsNews } from '@/domain/dbs';
import { formatLocal } from '@/lib/countdown';

export function NewsGrid({ items }: { items: DbsNews[] }) {
  if (!items.length) return <p style={{ color: 'var(--mute)' }}>No fresh wires yet.</p>;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
      {items.map((n) => {
        const inner = (
          <article
            className="news-tile"
            style={{
              minHeight: 300,
              ...(n.image ? { backgroundImage: `url(${n.image})` } : undefined),
            }}
          >
            <div>
              <div className="kicker" style={{ fontSize: 15 }}>{n.sport}</div>
              <div className="display" style={{ fontSize: 28, lineHeight: 1.15 }}>{n.headline}</div>
              {n.description && (
                <p style={{ marginTop: 8, fontSize: 15, opacity: 0.9, maxWidth: 520 }}>{n.description}</p>
              )}
              <div className="mono" style={{ fontSize: 13, marginTop: 10 }}>{formatLocal(n.published)}</div>
            </div>
          </article>
        );
        return n.href ? (
          <a key={n.id} href={n.href} target="_blank" rel="noreferrer">{inner}</a>
        ) : (
          <div key={n.id}>{inner}</div>
        );
      })}
    </div>
  );
}
