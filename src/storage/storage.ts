import { StorageAdapter, LocalStorageAdapter } from '../state/stores';

// Import AsyncStorage for React Native
let AsyncStorage: any = null;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  // AsyncStorage not available (web)
}

// ============================================================================
// STORAGE KEYS - namespaced to avoid collisions
// ============================================================================

export const STORAGE_KEYS = {
  USER_PROFILE: 'sportsdash:userProfile',
  FAVORITES: 'sportsdash:favorites',
  USER_PREFS: 'sportsdash:userPrefs',
  NOTIFICATIONS: 'sportsdash:notifications',
  RECENTLY_VIEWED: 'sportsdash:recentlyViewed',
  ONBOARDING_COMPLETE: 'sportsdash:onboarding',
  CACHED_SPORTS_DATA: 'sportsdash:cachedSportsData',
  CACHE_TIMESTAMPS: 'sportsdash:cacheTimestamps',
} as const;

// ============================================================================
// STORAGE FACTORY - creates appropriate adapter for platform
// ============================================================================

export function createStorageAdapter(): StorageAdapter {
  // Check if we're in a React Native environment
  if (typeof window === 'undefined' || (typeof navigator !== 'undefined' && navigator.product === 'ReactNative')) {
    if (AsyncStorage) {
      return new AsyncStorageAdapter(AsyncStorage);
    }
  }
  // Default to localStorage for web
  return new LocalStorageAdapter();
}

// ============================================================================
// REACT NATIVE ASYNC STORAGE ADAPTER
// ============================================================================

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
// STORAGE HELPERS
// ============================================================================

export async function saveUserProfile(adapter: StorageAdapter, profile: any): Promise<void> {
  await adapter.set(STORAGE_KEYS.USER_PROFILE, profile);
}

export async function loadUserProfile(adapter: StorageAdapter): Promise<any | null> {
  return adapter.get(STORAGE_KEYS.USER_PROFILE);
}

export async function saveFavorites(adapter: StorageAdapter, favorites: any[]): Promise<void> {
  await adapter.set(STORAGE_KEYS.FAVORITES, favorites);
}

export async function loadFavorites(adapter: StorageAdapter): Promise<any[]> {
  const data = await adapter.get(STORAGE_KEYS.FAVORITES);
  return data || [];
}

export async function saveNotificationPreferences(adapter: StorageAdapter, prefs: any): Promise<void> {
  await adapter.set(STORAGE_KEYS.USER_PREFS, prefs);
}

export async function loadNotificationPreferences(adapter: StorageAdapter): Promise<any | null> {
  return adapter.get(STORAGE_KEYS.USER_PREFS);
}

export async function saveNotifications(adapter: StorageAdapter, notifications: any[]): Promise<void> {
  await adapter.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

export async function loadNotifications(adapter: StorageAdapter): Promise<any[]> {
  const data = await adapter.get(STORAGE_KEYS.NOTIFICATIONS);
  return data || [];
}

export async function saveRecentlyViewed(adapter: StorageAdapter, items: any[]): Promise<void> {
  await adapter.set(STORAGE_KEYS.RECENTLY_VIEWED, items);
}

export async function loadRecentlyViewed(adapter: StorageAdapter): Promise<any[]> {
  const data = await adapter.get(STORAGE_KEYS.RECENTLY_VIEWED);
  return data || [];
}

export async function saveOnboardingComplete(adapter: StorageAdapter, complete: boolean): Promise<void> {
  await adapter.set(STORAGE_KEYS.ONBOARDING_COMPLETE, complete);
}

export async function loadOnboardingComplete(adapter: StorageAdapter): Promise<boolean> {
  const data = await adapter.get(STORAGE_KEYS.ONBOARDING_COMPLETE);
  return data || false;
}

// ============================================================================
// CACHE HELPERS
// ============================================================================

export interface CacheEntry<T> {
  data: T;
  timestamp: string;
  expiresAt?: string;
}

export async function saveCache<T>(adapter: StorageAdapter, key: string, data: T, ttlMs?: number): Promise<void> {
  const entry: CacheEntry<T> = {
    data,
    timestamp: new Date().toISOString(),
    expiresAt: ttlMs ? new Date(Date.now() + ttlMs).toISOString() : undefined,
  };
  await adapter.set(`${STORAGE_KEYS.CACHED_SPORTS_DATA}:${key}`, entry);
}

export async function loadCache<T>(adapter: StorageAdapter, key: string): Promise<T | null> {
  const entry = await adapter.get<CacheEntry<T>>(`${STORAGE_KEYS.CACHED_SPORTS_DATA}:${key}`);
  if (!entry) return null;

  // Check if expired
  if (entry.expiresAt && new Date(entry.expiresAt) < new Date()) {
    await adapter.remove(`${STORAGE_KEYS.CACHED_SPORTS_DATA}:${key}`);
    return null;
  }

  return entry.data;
}

export async function clearExpiredCache(adapter: StorageAdapter): Promise<void> {
  const keys = await adapter.keys();
  const cacheKeys = keys.filter(k => k.startsWith(STORAGE_KEYS.CACHED_SPORTS_DATA));

  for (const key of cacheKeys) {
    const entry = await adapter.get<CacheEntry<any>>(key);
    if (entry?.expiresAt && new Date(entry.expiresAt) < new Date()) {
      await adapter.remove(key);
    }
  }
}

// ============================================================================
// MIGRATION HELPERS
// ============================================================================

export async function migrateStorage(adapter: StorageAdapter): Promise<void> {
  // Future: handle migrations between schema versions
  // For now, just clear expired cache
  await clearExpiredCache(adapter);
}