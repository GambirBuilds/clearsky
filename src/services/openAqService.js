/**
 * OpenAQ API v3 Client Service
 *
 * Provides real ground-level sensor station metadata and live pollutant readings.
 * OpenAQ v3 requires an API Key sent via `X-API-Key` header (obtainable for free at https://explore.openaq.org/register).
 */

const OPENAQ_BASE_URL = 'https://api.openaq.org/v3';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

// In-memory request deduplication and response cache
const requestCache = new Map();

export const openAqService = {
  /**
   * Retrieve configured API key from localStorage or Vite environment variable
   */
  getApiKey() {
    try {
      return (
        localStorage.getItem('clearsky_openaq_key') ||
        import.meta.env.VITE_OPENAQ_API_KEY ||
        ''
      );
    } catch {
      return '';
    }
  },

  /**
   * Save user-provided OpenAQ API key in localStorage
   */
  setApiKey(key) {
    try {
      if (key) {
        localStorage.setItem('clearsky_openaq_key', key.trim());
      } else {
        localStorage.removeItem('clearsky_openaq_key');
      }
      // Invalidate cached requests upon key change
      requestCache.clear();
    } catch (e) {
      console.error('Error saving OpenAQ API key:', e);
    }
  },

  /**
   * Internal authenticated fetch helper with caching and timeout
   */
  async _fetch(endpoint, options = {}) {
    const cacheKey = endpoint;
    const now = Date.now();

    // Check cache
    if (requestCache.has(cacheKey)) {
      const cached = requestCache.get(cacheKey);
      if (now - cached.timestamp < CACHE_TTL_MS) {
        return cached.data;
      }
    }

    const apiKey = this.getApiKey();
    const headers = {
      'Accept': 'application/json',
      ...options.headers
    };

    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const res = await fetch(`${OPENAQ_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.status === 401) {
        return {
          success: false,
          requiresKey: true,
          statusCode: 401,
          message: 'OpenAQ API v3 requires an API Key. Please provide your free key in Settings.',
          results: []
        };
      }

      if (res.status === 429) {
        return {
          success: false,
          rateLimited: true,
          statusCode: 429,
          message: 'OpenAQ API rate limit reached. Please wait before refreshing.',
          results: []
        };
      }

      if (!res.ok) {
        throw new Error(`OpenAQ responded with HTTP status ${res.status}`);
      }

      const json = await res.json();
      const payload = {
        success: true,
        statusCode: res.status,
        ...json
      };

      // Store in cache
      requestCache.set(cacheKey, { timestamp: now, data: payload });
      return payload;
    } catch (err) {
      clearTimeout(timeoutId);
      return {
        success: false,
        isNetworkError: true,
        message: err.name === 'AbortError'
          ? 'OpenAQ request timed out after 10 seconds.'
          : err.message,
        results: []
      };
    }
  },

  /**
   * Retrieve real monitoring stations in Nepal
   * Uses ISO 3166-1 alpha-2 'np' or Nepal bounding box
   */
  async getNepalStations(limit = 100) {
    return this._fetch(`/locations?iso=np&limit=${limit}`);
  },

  /**
   * Retrieve station details by OpenAQ location ID
   */
  async getStationDetails(locationId) {
    if (!locationId) return { success: false, message: 'Invalid location ID' };
    return this._fetch(`/locations/${locationId}`);
  },

  /**
   * Retrieve latest ground-level sensor measurements for a station
   */
  async getStationLatest(locationId) {
    if (!locationId) return { success: false, message: 'Invalid location ID' };
    return this._fetch(`/locations/${locationId}/latest`);
  },

  /**
   * Discover stations closest to given coordinates within radius
   */
  async getNearbyStations(lat, lng, radiusMeters = 50000) {
    if (!lat || !lng) return { success: false, message: 'Coordinates required' };
    return this._fetch(`/locations?coordinates=${lat},${lng}&radius=${radiusMeters}&limit=20`);
  }
};
