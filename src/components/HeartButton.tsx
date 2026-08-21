import type { FavoriteType } from '@/domain/types';
import { useFavoritesStore } from '@/state/stores';

export function HeartButton({
  type,
  refId,
  name,
}: {
  type: FavoriteType;
  refId: string;
  name: string;
}) {
  const isFav = useFavoritesStore((s) => s.isFavorite(type, refId));
  const toggle = useFavoritesStore((s) => s.toggleFavorite);
  return (
    <button
      aria-label={isFav ? `Unfavorite ${name}` : `Favorite ${name}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({ id: `${type}:${refId}`, type, refId, name });
      }}
      style={{
        border: '2px solid var(--ivy-dark)',
        background: isFav ? 'var(--ivy)' : 'var(--paper)',
        color: isFav ? '#fff' : 'var(--ink)',
        borderRadius: 4,
        padding: '5px 9px',
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}
    >
      {isFav ? '★ Saved' : '☆ Save'}
    </button>
  );
}
