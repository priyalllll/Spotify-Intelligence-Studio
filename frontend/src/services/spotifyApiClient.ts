import { API_BASE_URL } from '../config/env';

/**
 * Spotify API Client for Frontend Requests
 * Centralized reusable fetch wrapper with automatic token management, Bearer header injection,
 * 5-minute response caching, and exponential backoff retries.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5-minute TTL

export const getStoredAccessToken = (): string | null => {
  return (
    sessionStorage.getItem('spotify_access_token') ||
    localStorage.getItem('spotify_access_token') ||
    null
  );
};

export const fetchFromBackend = async <T>(
  endpoint: string,
  accessToken?: string,
  bypassCache = false,
  retries = 3
): Promise<T> => {
  const token = accessToken || getStoredAccessToken();

  if (!token) {
    throw new Error('No Spotify access token available. Please authenticate.');
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const cacheKey = `${url}_${token.slice(-10)}`;

  // Check cache if not bypassing
  if (!bypassCache) {
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      console.log(`[SpotifyApiClient] Serving CACHED response for ${endpoint}`);
      return cached.data as T;
    }
  }

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt < retries) {
    try {
      console.log(`[SpotifyApiClient] Fetching ${endpoint} (Attempt ${attempt + 1}/${retries})`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 429) {
        // Rate limit encountered - wait Retry-After header or default 1.5s
        const retryAfter = parseInt(response.headers.get('Retry-After') || '2', 10);
        console.warn(`[SpotifyApiClient] 429 Rate limited. Waiting ${retryAfter}s before retry...`);
        await new Promise((r) => setTimeout(r, retryAfter * 1000));
        attempt++;
        continue;
      }

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
          errorBody.details ||
          errorBody.error ||
          `HTTP Error ${response.status}: ${response.statusText}`;
        console.error(`[SpotifyApiClient] Request to ${url} failed:`, message);
        throw new Error(message);
      }

      const data = (await response.json()) as T;
      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (err: any) {
      lastError = err;
      attempt++;
      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 300;
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw lastError || new Error(`Failed to fetch ${endpoint} after ${retries} attempts.`);
};

export const clearApiCache = (): void => {
  memoryCache.clear();
  console.log('[SpotifyApiClient] API Cache cleared');
};
