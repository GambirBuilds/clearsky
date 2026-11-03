/**
 * Open-Meteo Air Quality & Weather API Client
 *
 * Provides high-resolution global atmospheric CAMS / Copernicus modeled air-quality
 * forecasts, hourly time-series, and meteorological context.
 * 100% Free & Open — No API key required.
 */

const AIR_QUALITY_BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const requestCache = new Map();

export const openMeteoService = {
  /**
   * Internal cached fetcher with timeout
   */
  async _fetch(url) {
    const now = Date.now();
    if (requestCache.has(url)) {
      const cached = requestCache.get(url);
      if (now - cached.timestamp < CACHE_TTL_MS) {
        return cached.data;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Open-Meteo returned status ${res.status}`);
      }

      const json = await res.json();
      const payload = { success: true, ...json };
      requestCache.set(url, { timestamp: now, data: payload });
      return payload;
    } catch (err) {
      clearTimeout(timeoutId);
      return {
        success: false,
        message: err.name === 'AbortError' ? 'Request timed out' : err.message
      };
    }
  },

  /**
   * Fetch current and hourly air quality data for given coordinates
   * Includes past 7 days historical reanalysis + 3 days future forecast
   */
  async getAirQuality(lat, lng) {
    if (!lat || !lng) return { success: false, message: 'Invalid coordinates' };

    const params = new URLSearchParams({
      latitude: lat,
      longitude: lng,
      current: [
        'european_aqi',
        'us_aqi',
        'pm10',
        'pm2_5',
        'carbon_monoxide',
        'nitrogen_dioxide',
        'sulphur_dioxide',
        'ozone'
      ].join(','),
      hourly: [
        'pm10',
        'pm2_5',
        'carbon_monoxide',
        'nitrogen_dioxide',
        'sulphur_dioxide',
        'ozone',
        'us_aqi'
      ].join(','),
      past_days: '7',
      forecast_days: '3',
      timezone: 'Asia/Kathmandu'
    });

    return this._fetch(`${AIR_QUALITY_BASE_URL}?${params.toString()}`);
  },

  /**
   * Fetch meteorological context (temperature, humidity, wind) for dispersion analysis
   */
  async getWeather(lat, lng) {
    if (!lat || !lng) return { success: false, message: 'Invalid coordinates' };

    const params = new URLSearchParams({
      latitude: lat,
      longitude: lng,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'wind_speed_10m',
        'wind_direction_10m',
        'surface_pressure'
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'wind_speed_10m'
      ].join(','),
      forecast_days: '3',
      timezone: 'Asia/Kathmandu'
    });

    return this._fetch(`${WEATHER_BASE_URL}?${params.toString()}`);
  }
};
