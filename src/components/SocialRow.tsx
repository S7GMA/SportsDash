import type { SocialLink } from '@/domain/dbs';

export function SocialRow({ links, title }: { links: SocialLink[]; title?: string }) {
  return (
    <section>
      {title && <h2 className="kicker" style={{ fontSize: 16, marginBottom: 12 }}>— {title} —</h2>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
        {links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="x-card">
            <div className="avatar">X</div>
            <div>
              <div style={{ fontWeight: 700 }}>{l.label}</div>
              <div className="mono" style={{ color: 'var(--ivy)', fontSize: 13 }}>{l.handle}</div>
              <div style={{ fontSize: 12, color: 'var(--mute)' }}>Official updates on X</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
