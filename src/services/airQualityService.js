/**
 * Unified Environmental Intelligence Data Normalization Service
 *
 * Harmonizes ground-level sensor data (OpenAQ) and atmospheric dispersion models (Open-Meteo).
 * Strictly distinguishes observations vs modeled forecasts vs unavailable data.
 * Computes official EPA AQI via aqiCalculator and detects data freshness.
 */

import { openMeteoService } from './openMeteoService';
import { openAqService } from './openAqService';
import { calculateCompositeAQI, calculatePollutantSubIndex } from '../utils/aqiCalculator';
import { POLLUTANTS } from '../constants/pollutants';
import { NEPAL_LOCATIONS } from '../constants/locations';

export const airQualityService = {
  /**
   * Main method to retrieve full environmental intelligence for a given location
   * @param {object} location - { id, name, lat, lng, ... }
   */
  async getEnvironmentalIntelligence(location) {
    if (!location || !location.lat || !location.lng) {
      return { success: false, error: 'Invalid location coordinates' };
    }

    const { lat, lng } = location;

    // Fetch Open-Meteo air quality and weather in parallel
    const [aqResult, weatherResult, openAqStations] = await Promise.all([
      openMeteoService.getAirQuality(lat, lng),
      openMeteoService.getWeather(lat, lng),
      openAqService.getNearbyStations(lat, lng, 35000)
    ]);

    const hasMeteo = aqResult.success && aqResult.current;
    const currentMeteo = hasMeteo ? aqResult.current : {};
    const unitsMeteo = hasMeteo ? aqResult.current_units : {};

    // 1. Normalize Pollutants with strict source classification
    const normalizedPollutants = {};
    const concentrationsForAqi = {};

    // Helper to extract or flag unavailable
    const extractPollutant = (id, meteoKey, defaultUnit, multiplierToPpbOrPpm = 1) => {
      const meta = POLLUTANTS.find(p => p.id === id) || {};
      const rawVal = currentMeteo[meteoKey];

      if (rawVal !== undefined && rawVal !== null && !isNaN(rawVal)) {
        const val = Number(rawVal);
        normalizedPollutants[id] = {
          id,
          name: meta.name || id.toUpperCase(),
          fullName: meta.fullName,
          nepaliName: meta.nepaliName,
          value: Math.round(val * 10) / 10,
          unit: unitsMeteo[meteoKey] || defaultUnit,
          source: 'Open-Meteo / Copernicus Atmospheric Model',
          sourceType: 'modeled', // 'measured' | 'modeled' | 'unavailable'
          timestamp: currentMeteo.time || new Date().toISOString(),
          standardLimit: meta.standardLimit,
          whoLimit: meta.whoLimit,
          primarySource: meta.primarySource,
          subIndex: calculatePollutantSubIndex(id, val * multiplierToPpbOrPpm)
        };
        concentrationsForAqi[id] = val * multiplierToPpbOrPpm;
      } else {
        normalizedPollutants[id] = {
          id,
          name: meta.name || id.toUpperCase(),
          fullName: meta.fullName,
          nepaliName: meta.nepaliName,
          value: null,
          unit: defaultUnit,
          source: 'Unavailable',
          sourceType: 'unavailable',
          timestamp: null,
          standardLimit: meta.standardLimit,
          whoLimit: meta.whoLimit,
          primarySource: meta.primarySource,
          subIndex: null
        };
      }
    };

    // Open-Meteo units:
    // pm2_5: µg/m³, pm10: µg/m³, carbon_monoxide: µg/m³ (convert to ppm: ~ divide by 1150 or use ratio),
    // nitrogen_dioxide: µg/m³ (convert to ppb: ~ multiply by 0.53), sulphur_dioxide: µg/m³ (ppb: ~ 0.38), ozone: µg/m³ (ppb: ~ 0.50)
    extractPollutant('pm25', 'pm2_5', 'µg/m³', 1);
    extractPollutant('pm10', 'pm10', 'µg/m³', 1);
    extractPollutant('no2', 'nitrogen_dioxide', 'µg/m³', 0.53);
    extractPollutant('so2', 'sulphur_dioxide', 'µg/m³', 0.38);
    extractPollutant('co', 'carbon_monoxide', 'µg/m³', 0.00087);
    extractPollutant('o3', 'ozone', 'µg/m³', 0.50);

    // 2. AQI Determination: Distinguish provider-reported vs locally calculated EPA AQI
    const locallyCalculated = calculateCompositeAQI(concentrationsForAqi);
    const providerReportedUsAqi = currentMeteo.us_aqi ?? null;
    const providerReportedEuropeanAqi = currentMeteo.european_aqi ?? null;

    // Use locally calculated EPA index if criteria pollutants exist, else fallback to reported
    const finalAqi = locallyCalculated.isCalculated
      ? locallyCalculated.aqi
      : providerReportedUsAqi;

    // 3. Meteorological data normalization
    const currentWeather = weatherResult.success && weatherResult.current ? weatherResult.current : {};
    const weatherUnits = weatherResult.success && weatherResult.current_units ? weatherResult.current_units : {};

    const normalizedWeather = {
      temperature: {
        value: currentWeather.temperature_2m !== undefined ? Math.round(currentWeather.temperature_2m * 10) / 10 : null,
        unit: weatherUnits.temperature_2m || '°C'
      },
      humidity: {
        value: currentWeather.relative_humidity_2m !== undefined ? Math.round(currentWeather.relative_humidity_2m) : null,
        unit: weatherUnits.relative_humidity_2m || '%'
      },
      windSpeed: {
        value: currentWeather.wind_speed_10m !== undefined ? Math.round(currentWeather.wind_speed_10m * 10) / 10 : null,
        unit: weatherUnits.wind_speed_10m || 'km/h'
      },
      timestamp: currentWeather.time || null,
      source: 'Open-Meteo Synoptic Forecast'
    };

    // 4. Ground-Level Stations (OpenAQ integration status)
    let groundStations = [];
    let openAqStatus = {
      hasAccess: false,
      message: 'Ground monitoring telemetry requires an OpenAQ API key (explore.openaq.org).'
    };

    if (openAqStations && openAqStations.success && Array.isArray(openAqStations.results)) {
      groundStations = openAqStations.results.map(st => ({
        id: st.id,
        name: st.name,
        locality: st.locality || location.name,
        coordinates: st.coordinates,
        parameters: st.sensors?.map(s => s.parameter?.name) || [],
        isGroundSensor: true,
        source: 'OpenAQ Real-Time Sensor Network',
        lastUpdated: st.datetimeLast?.utc || null
      }));
      openAqStatus = {
        hasAccess: true,
        count: groundStations.length,
        message: `${groundStations.length} physical OpenAQ ground monitor(s) detected near coordinates.`
      };
    } else if (openAqStations?.requiresKey) {
      openAqStatus = {
        hasAccess: false,
        requiresKey: true,
        message: 'OpenAQ API key not configured. Displaying modeled CAMS/Copernicus atmospheric feed.'
      };
    }

    // 5. Timeseries processing (Hourly past 24h & 7 days for Analytics & Charts)
    const hourlyData = [];
    if (hasMeteo && aqResult.hourly && Array.isArray(aqResult.hourly.time)) {
      const times = aqResult.hourly.time;
      const pm25Arr = aqResult.hourly.pm2_5 || [];
      const pm10Arr = aqResult.hourly.pm10 || [];
      const no2Arr = aqResult.hourly.nitrogen_dioxide || [];
      const o3Arr = aqResult.hourly.ozone || [];
      const aqiArr = aqResult.hourly.us_aqi || [];

      for (let i = 0; i < times.length; i++) {
        hourlyData.push({
          time: times[i],
          hour: times[i].slice(11, 16),
          date: times[i].slice(0, 10),
          pm25: pm25Arr[i] !== null ? Math.round(pm25Arr[i] * 10) / 10 : null,
          pm10: pm10Arr[i] !== null ? Math.round(pm10Arr[i] * 10) / 10 : null,
          no2: no2Arr[i] !== null ? Math.round(no2Arr[i] * 10) / 10 : null,
          o3: o3Arr[i] !== null ? Math.round(o3Arr[i] * 10) / 10 : null,
          aqi: aqiArr[i] !== null ? Math.round(aqiArr[i]) : null
        });
      }
    }

    // Split hourlyData into:
    // Past 24 hours (up to current index)
    // Future 48 hours forecast
    const nowIso = new Date().toISOString();
    // Find closest index
    const currentIndex = hourlyData.findIndex(h => h.time >= nowIso.slice(0, 13)) >= 0
      ? hourlyData.findIndex(h => h.time >= nowIso.slice(0, 13))
      : Math.floor(hourlyData.length / 2);

    const past24hData = hourlyData.slice(Math.max(0, currentIndex - 24), currentIndex + 1);
    const forecast48hData = hourlyData.slice(currentIndex, currentIndex + 48);
    const past7DaysData = hourlyData.slice(0, currentIndex + 1);

    return {
      success: true,
      location,
      lastUpdated: currentMeteo.time || new Date().toISOString(),
      dataClassification: 'modeled_cams_forecast',
      dataClassificationLabel: 'Modeled Atmospheric Data (Open-Meteo)',
      aqi: finalAqi,
      locallyCalculatedAqi: locallyCalculated.aqi,
      providerReportedUsAqi,
      providerReportedEuropeanAqi,
      dominantPollutant: locallyCalculated.dominantPollutant || 'pm25',
      category: locallyCalculated.category,
      pollutants: normalizedPollutants,
      weather: normalizedWeather,
      groundStations,
      openAqStatus,
      hourlyData,
      past24hData,
      forecast48hData,
      past7DaysData
    };
  },

  /**
   * Probe station status (wrapper used in Part 1 that now pulls real metadata)
   */
  async probeStationStatus(locationId) {
    const loc = NEPAL_LOCATIONS.find(l => l.id === locationId);
    if (!loc) return null;
    return this.getEnvironmentalIntelligence(loc);
  },

  /**
   * Compare multiple locations in parallel
   */
  async compareLocations(locations) {
    if (!Array.isArray(locations) || locations.length === 0) return [];
    const results = await Promise.all(
      locations.map(loc => this.getEnvironmentalIntelligence(loc))
    );
    return results;
  }
};
