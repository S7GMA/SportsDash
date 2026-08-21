import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Appearance,
  AppNotification,
  Favorite,
  FavoriteType,
  NotificationPreferences,
  RecentlyViewedItem,
} from '@/domain/types';
import { getUserTimezone } from '@/lib/time';

export interface UserPrefs {
  onboardingComplete: boolean;
  preferredSports: string[];
  timezone: string;
  appearance: Appearance;
  showEventTimezone: boolean;
  notifications: NotificationPreferences;
}

const defaultPrefs: UserPrefs = {
  onboardingComplete: false,
  preferredSports: [],
  timezone: getUserTimezone(),
  appearance: 'dark',
  showEventTimezone: true,
  notifications: {
    enabled: true,
    eventStarting: true,
    eventStarted: true,
    scoreChange: false,
    favoriteScored: true,
    eventFinished: true,
    statusChange: true,
    minutesBeforeStart: 15,
  },
};

interface FavoritesStore {
  favorites: Favorite[];
  toggleFavorite: (fav: Omit<Favorite, 'addedAt'>) => void;
  isFavorite: (type: FavoriteType, refId: string) => boolean;
  removeFavorite: (type: FavoriteType, refId: string) => void;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (fav) =>
        set((state) => {
          const exists = state.favorites.some((f) => f.type === fav.type && f.refId === fav.refId);
          if (exists) {
            return {
              favorites: state.favorites.filter((f) => !(f.type === fav.type && f.refId === fav.refId)),
            };
          }
          return {
            favorites: [
              ...state.favorites,
              { ...fav, id: `${fav.type}:${fav.refId}`, addedAt: new Date().toISOString() },
            ],
          };
        }),
      isFavorite: (type, refId) => get().favorites.some((f) => f.type === type && f.refId === refId),
      removeFavorite: (type, refId) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => !(f.type === type && f.refId === refId)),
        })),
      clear: () => set({ favorites: [] }),
    }),
    { name: 'sportsdash:favorites', storage: createJSONStorage(() => localStorage) },
  ),
);

interface PrefsStore extends UserPrefs {
  setOnboardingComplete: (value: boolean) => void;
  setPreferredSports: (ids: string[]) => void;
  setAppearance: (appearance: Appearance) => void;
  setShowEventTimezone: (value: boolean) => void;
  setNotifications: (patch: Partial<NotificationPreferences>) => void;
  reset: () => void;
}

export const usePrefsStore = create<PrefsStore>()(
  persist(
    (set) => ({
      ...defaultPrefs,
      setOnboardingComplete: (value) => set({ onboardingComplete: value }),
      setPreferredSports: (ids) => set({ preferredSports: ids }),
      setAppearance: (appearance) => set({ appearance }),
      setShowEventTimezone: (value) => set({ showEventTimezone: value }),
      setNotifications: (patch) =>
        set((state) => ({ notifications: { ...state.notifications, ...patch } })),
      reset: () => set({ ...defaultPrefs, timezone: getUserTimezone() }),
    }),
    { name: 'sportsdash:userPrefs', storage: createJSONStorage(() => localStorage) },
  ),
);

interface RecentsStore {
  items: RecentlyViewedItem[];
  view: (item: Omit<RecentlyViewedItem, 'viewedAt'>) => void;
}

export const useRecentsStore = create<RecentsStore>()(
  persist(
    (set) => ({
      items: [],
      view: (item) =>
        set((state) => {
          const next = [
            { ...item, viewedAt: new Date().toISOString() },
            ...state.items.filter((i) => !(i.type === item.type && i.id === item.id)),
          ].slice(0, 20);
          return { items: next };
        }),
    }),
    { name: 'sportsdash:recentlyViewed', storage: createJSONStorage(() => localStorage) },
  ),
);

interface NotificationStore {
  items: AppNotification[];
  add: (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      items: [],
      add: (n) =>
        set((state) => ({
          items: [
            {
              ...n,
              id: `${n.eventId}-${n.type}-${Date.now()}`,
              timestamp: new Date().toISOString(),
              read: false,
            },
            ...state.items,
          ].slice(0, 50),
        })),
      markRead: (id) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, read: true } : i)),
        })),
      markAllRead: () => set((state) => ({ items: state.items.map((i) => ({ ...i, read: true })) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'sportsdash:notifications', storage: createJSONStorage(() => localStorage) },
  ),
);
