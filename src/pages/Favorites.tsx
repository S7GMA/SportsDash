import { Link } from 'react-router-dom';
import { HeartButton } from '@/components/HeartButton';
import { useSportsData } from '@/providers/SportsDataContext';
import { useFavoritesStore } from '@/state/stores';

export function FavoritesPage() {
  const favorites = useFavoritesStore((s) => s.favorites);
  const { teams, drivers } = useSportsData();
  return (
    <>
      <h1 className="display" style={{ fontSize: 48, color: 'var(--ivy-dark)' }}>Pinned</h1>
      <p style={{ color: 'var(--mute)' }}>Saved on this machine. No cloud, no login.</p>
      <div style={{ display: 'grid', gap: 10 }}>
        {favorites.length === 0 && <p style={{ color: 'var(--mute)' }}>Nothing pinned yet. Flip a card and stamp it.</p>}
        {favorites.map((f) => {
          const team = teams.find((t) => t.id === f.refId);
          const driver = drivers.find((d) => d.id === f.refId);
          const href = f.type === 'driver' ? `/driver/${f.refId}` : `/team/${f.refId}`;
          return (
            <div key={f.id} className="ticket" style={{ padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to={href} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {(team?.logo || driver?.headshot) && (
                  <img src={team?.logo || driver?.headshot} alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />
                )}
                <div>
                  <div className="display" style={{ fontSize: 22 }}>{team?.name ?? driver?.name ?? f.name}</div>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--ivy)' }}>{f.type}</div>
                </div>
              </Link>
              <HeartButton type={f.type} refId={f.refId} name={f.name} />
            </div>
          );
        })}
      </div>
    </>
  );
}
