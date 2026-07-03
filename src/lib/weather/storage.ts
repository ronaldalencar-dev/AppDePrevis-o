import type { AppSettings, SavedCity, WeatherData } from "./types";

const KEYS = {
  settings: "weather.settings",
  history: "weather.history",
  favorites: "weather.favorites",
  cache: "weather.cache",
  lastCity: "weather.lastCity",
} as const;

const HISTORY_LIMIT = 8;
const FAVORITES_LIMIT = 12;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full / unavailable — ignore
  }
}

// ---------- Settings ----------
const DEFAULT_SETTINGS: AppSettings = {
  units: "metric",
  language: "pt",
  themeMode: "system",
};

export function loadSettings(): AppSettings {
  return { ...DEFAULT_SETTINGS, ...read<Partial<AppSettings>>(KEYS.settings, {}) };
}

export function saveSettings(settings: AppSettings): void {
  write(KEYS.settings, settings);
}

// ---------- History ----------
export function loadHistory(): SavedCity[] {
  return read<SavedCity[]>(KEYS.history, []);
}

export function addToHistory(city: SavedCity): SavedCity[] {
  const existing = loadHistory().filter((c) => c.id !== city.id);
  const next = [{ ...city, savedAt: Date.now() }, ...existing].slice(0, HISTORY_LIMIT);
  write(KEYS.history, next);
  return next;
}

export function clearHistory(): void {
  write(KEYS.history, []);
}

// ---------- Favorites ----------
export function loadFavorites(): SavedCity[] {
  return read<SavedCity[]>(KEYS.favorites, []);
}

export function toggleFavorite(city: SavedCity): SavedCity[] {
  const existing = loadFavorites();
  const isFav = existing.some((c) => c.id === city.id);
  let next: SavedCity[];
  if (isFav) {
    next = existing.filter((c) => c.id !== city.id);
  } else {
    next = [{ ...city, savedAt: Date.now() }, ...existing].slice(0, FAVORITES_LIMIT);
  }
  write(KEYS.favorites, next);
  return next;
}

export function isFavorite(cityId: number): boolean {
  return loadFavorites().some((c) => c.id === cityId);
}

// ---------- Cache ----------
interface CacheEntry {
  key: string;
  data: WeatherData;
  timestamp: number;
}

function cacheKey(locationId: number | string, units: string): string {
  return `${locationId}:${units}`;
}

export function getCachedWeather(locationId: number | string, units: string): WeatherData | null {
  const cache = read<Record<string, CacheEntry>>(KEYS.cache, {});
  const entry = cache[cacheKey(locationId, units)];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    // stale — remove
    delete cache[cacheKey(locationId, units)];
    write(KEYS.cache, cache);
    return null;
  }
  return entry.data;
}

export function setCachedWeather(locationId: number | string, units: string, data: WeatherData): void {
  const cache = read<Record<string, CacheEntry>>(KEYS.cache, {});
  cache[cacheKey(locationId, units)] = { key: cacheKey(locationId, units), data, timestamp: Date.now() };
  // keep only the 6 most recent entries
  const entries = Object.values(cache).sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);
  const next: Record<string, CacheEntry> = {};
  for (const e of entries) next[e.key] = e;
  write(KEYS.cache, next);
}

// ---------- Last city ----------
export function saveLastCity(city: SavedCity): void {
  write(KEYS.lastCity, city);
}

export function loadLastCity(): SavedCity | null {
  return read<SavedCity | null>(KEYS.lastCity, null);
}
