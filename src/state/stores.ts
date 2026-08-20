import { create } from 'zustand';

// Storage Adapter interface - abstracts platform-specific storage
export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}

// Web implementation using localStorage
export class LocalStorageAdapter implements StorageAdapter {
  get<T>(key: string): Promise<T | null> {
    try {
      const item = window.localStorage.getItem(key);
      return item ? Promise.resolve(JSON.parse(item)) : Promise.resolve(null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  set<T>(key: string, value: T): Promise<void> {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  remove(key: string): Promise<void> {
    try {
      window.localStorage.removeItem(key);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  clear(): Promise<void> {
    try {
      window.localStorage.clear();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  keys(): Promise<string[]> {
    try {
      const keys = Object.keys(window.localStorage);
      return Promise.resolve(keys);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

// AsyncStorage implementation for React Native
export class AsyncStorageAdapter implements StorageAdapter {
  constructor(private storage: any) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = await this.storage.getItem(key);
      return item ? Promise.resolve(JSON.parse(item)) : Promise.resolve(null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await this.storage.setItem(key, JSON.stringify(value));
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await this.storage.removeItem(key);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.storage.clear();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async keys(): Promise<string[]> {
    try {
      const keys = await this.storage.getAllKeys();
      return Promise.resolve(keys);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

// ============================================================================
// ZUSTAND STORES
// ============================================================================

// User profile store - persisted
export interface UserProfile {
  id: string;
  onboardingComplete: boolean;
  favoriteSports: string[];
  favoriteTeams: string[];
  favoritePlayers: string[];
  favoriteDrivers: string[];
  favoriteLeagues: string[];
  favoriteCompetitions: string[];
  notifications: NotificationPreferences;
  display: DisplayPreferences;
  recentlyViewed: RecentlyViewedItem[];
  followedEvents: string[];
  personalizationSignals: PersonalizationSignal[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  enabled: boolean;
  eventStarting: boolean;
  eventStarted: boolean;
  scoreChange: boolean;
  favoriteScored: boolean;
  eventFinished: boolean;
  statusChange: boolean;
  minutesBeforeStart: number;
}

export interface DisplayPreferences {
  timezone: string;
  appearance: Appearance;
  showEventTimezone: boolean;
  compactMode: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

export interface RecentlyViewedItem {
  id: string;
  type: FavoriteType;
  name: string;
  viewedAt: string;
}

export interface PersonalizationSignal {
  entityType: FavoriteType;
  entityId: string;
  signal: 'favorite' | 'recently_viewed' | 'followed_event' | 'notification_interaction';
  weight: number;
  timestamp: string;
}

export interface FavoritesState {
  favorites: Favorite[];
}

export interface UserPrefsState {
  userProfile: UserProfile | null;
  isOnboardingComplete: boolean;
}

export interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
}

export interface EventState {
  events: SportEvent[];
  lastUpdated: string;
  isLoading: boolean;
}

export interface CacheState {
  cachedUserProfile: UserProfile | null;
  cachedSportsData: Record<string, any>;
  lastSync: string;
}

export const createUserPrefsStore = (storageAdapter: StorageAdapter) => {
  return create<{ userPrefs: UserPrefsState }>((set, get) => ({
    userPrefs: {
      userProfile: null,
      isOnboardingComplete: false,
    },
    setUserProfile: (profile: UserProfile) => set((state) => ({
      userPrefs: {
        ...state.userPrefs,
        userProfile: profile,
      },
    })),
    setOnboardingComplete: (complete: boolean) =>
      set((state) => ({
        userPrefs: {
          ...state.userPrefs,
          isOnboardingComplete: complete,
        },
      })),
    },
    getUserProfile: () => get(state => state.userPrefs.userProfile),
    getOnboardingComplete: () => get(state => state.userPrefs.isOnboardingComplete),
  }));
};

// Favorites store - persisted
export interface Favorite {
  id: string;
  type: FavoriteType;
  refId: string;
  name: string;
  addedAt: string;
}

export interface FavoritesState {
  favorites: Favorite[];
}

export const createFavoritesStore = (storageAdapter: StorageAdapter) => {
  return create<{ favorites: FavoritesState }>((set, get) => ({
    favorites: {
      favorites: [],
    },
    addFavorite: (favorite: Favorite) =>
      set((state) => ({
        favorites: {
          ...state.favorites,
          favorites: [...state.favorites.favorites, favorite],
        },
      })),
    removeFavorite: (id: string, type: FavoriteType) =>
      set((state) => ({
        favorites: {
          ...state.favorites,
          favorites: state.favorites.favorites.filter(
            (f) => !(f.id === id && f.type === type)
          ),
        },
      })),
    isFavorite: (id: string, type: FavoriteType) =>
      get(state => state.favorites.favorites.some(f => f.id === id && f.type === type)),
    getFavorites: () => get(state => state.favorites.favorites),
  });
};

// Notification store - persisted
export interface Notification {
  id: string;
  type: NotificationType;
  eventId: string;
  sportId: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

export interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
}

export const createNotificationStore = (storageAdapter: StorageAdapter) => {
  return create<{ notifications: NotificationState }>((set, get) => ({
    notifications: {
      notifications: [],
      unreadCount: 0,
    },
    addNotification: (notification: AppNotification) =>
      set((state) => {
        const updated = [...state.notifications.notifications, notification];
        const unreadCount = notification.read ? state.notifications.notifications.length : updated.filter(n => !n.read).length;
        return {
          notifications: { ...state.notifications, notifications: updated },
          unreadCount,
        };
      }),
    markAsRead: (notificationId: string) =>
      set((state) => {
        const updated = state.notifications.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        );
        const unreadCount = updated.filter(n => !n.read).length;
        return {
          notifications: { ...state.notifications, notifications: updated },
          unreadCount,
        };
      }),
  }));
};

// Cache store - non-persisted
export interface CacheState {
  cachedUserProfile: UserProfile | null;
  cachedSportsData: Record<string, any>;
  lastSync: string;
}

export const createCacheStore = () => {
  return create<{ cache: CacheState }>((set, get) => ({
    cache: {
      cachedUserProfile: null,
      cachedSportsData: {},
      lastSync: new Date().toISOString(),
    },
    setCachedUserProfile: (profile: UserProfile | null) =>
      set((state) => ({
        cache: {
          ...state.cache,
          cachedUserProfile: profile,
        }),
      }),
    setCachedSportsData: (data: Record<string, any>) =>
      set((state) => ({
        cache: {
          ...state.cache,
          cachedSportsData: data,
        }),
    },
    getCachedUserProfile: () => get(state) => state.cache.cachedUserProfile,
    getCachedSportsData: () => get(state) => state.cache.cachedSportsData,
  }));
};

// Combined store for convenience
export interface AppStore {
  userPrefs: UserPrefsState;
  favorites: FavoritesState;
  notifications: NotificationState;
  events: EventState;
  cache: CacheState;
}

export const createAppStore = (storageAdapter: StorageAdapter) => {
  const userPrefs = createUserPrefsStore(storageAdapter);
  const favorites = createFavoritesStore(storageAdapter);
  const notifications = createNotificationStore(storageAdapter);
  const cache = createCacheStore();

  return {
    userPrefs,
    favorites,
    notifications,
    events: createEventStore(),
    cache,
  });
};

// Helper to create events store
const createEventStore = (storageAdapter: StorageAdapter) => {
  return create<{ events: EventState }>((set, get) => ({
    events: {
      events: [],
      lastUpdated: new Date().toISOString(),
      isLoading: false,
    },
    setEvents: (events: SportEvent[], lastUpdated: string) =>
      set((state) => ({
        events: {
          ...state.events,
          events: events,
          lastUpdated: lastUpdated,
          isLoading: false,
        },
      }),
    setLoading: (isLoading: boolean) =>
      set((state) => ({
        events: {
          ...state.events,
          isLoading: isLoading,
        },
      }),
    getEvents: () => get(state) => state.events.events,
  }));
};