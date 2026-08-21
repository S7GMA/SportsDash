const PREFIX = 'sportsdash:';

export interface StorageAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
}

function fullKey(key: string) {
  return key.startsWith(PREFIX) ? key : `${PREFIX}${key}`;
}

export const localStorageAdapter: StorageAdapter = {
  get<T>(key: string): T | null {
    try {
      const raw = window.localStorage.getItem(fullKey(key));
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  set<T>(key: string, value: T): void {
    window.localStorage.setItem(fullKey(key), JSON.stringify(value));
  },
  remove(key: string): void {
    window.localStorage.removeItem(fullKey(key));
  },
  clear(): void {
    const keys = Object.keys(window.localStorage).filter((k) => k.startsWith(PREFIX));
    keys.forEach((k) => window.localStorage.removeItem(k));
  },
};

export const storageKeys = {
  favorites: 'favorites',
  prefs: 'userPrefs',
  recentlyViewed: 'recentlyViewed',
  notifications: 'notifications',
  onboarding: 'onboarding',
} as const;
