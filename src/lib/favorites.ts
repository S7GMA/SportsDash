import type { Favorite, SportEvent } from '@/domain/types';

export function eventTouchesFavorite(event: SportEvent, favorites: Favorite[]): boolean {
  const ids = new Set(favorites.map((f) => f.refId));
  if (ids.has(event.sportId) || ids.has(event.leagueId)) return true;
  return event.participants.some((p) => ids.has(p.id));
}

export function favoriteIdsByType(favorites: Favorite[], type: Favorite['type']): Set<string> {
  return new Set(favorites.filter((f) => f.type === type).map((f) => f.refId));
}
