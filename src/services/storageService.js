/**
 * Local Storage Persistence Service for ClearSky
 *
 * Implements resilient storage operations with corrupted data fallbacks,
 * saved locations management, custom dashboard settings, and alert preferences.
 * Notice: Browser storage is strictly client-side to the user's local device.
 */

const STORAGE_KEYS = {
  THEME: 'clearsky_theme',
  LOCATION: 'clearsky_location_id',
  SAVED_LOCATIONS: 'clearsky_saved_locations',
  COMPARE_LOCATIONS: 'clearsky_compare_ids',
  ALERT_PREFS: 'clearsky_alert_preferences',
  DASHBOARD_SETTINGS: 'clearsky_dashboard_settings',
  NOTIFICATIONS: 'clearsky_notifications',
  VIEW_MODE: 'clearsky_data_view_mode',
  OPENAQ_KEY: 'clearsky_openaq_key'
};

const DEFAULT_ALERT_PREFS = {
  alertsEnabled: true,
  aqiThreshold: 150,
  enableBrowserNotifications: false,
  enableInAppAlerts: true,
  emailAddress: '',
  phoneNumber: '',
  subscribedLocations: ['kathmandu', 'pokhara', 'birgunj'],
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '06:00',
  alertFrequency: 'on_breach' // 'on_breach' | 'hourly'
};

const DEFAULT_DASHBOARD_SETTINGS = {
  autoRefreshMinutes: 15, // 5, 15, 30, 0 (manual)
  tempUnit: 'C', // 'C' | 'F'
  showAerosolOverlay: false,
  soundAlerts: false
};

function safeJsonParse(jsonString, fallback) {
  if (!jsonString) return fallback;
  try {
    const parsed = JSON.parse(jsonString);
    return parsed !== null && typeof parsed === typeof fallback ? parsed : fallback;
  } catch (e) {
    console.warn('ClearSky Storage: Corrupted localStorage value detected. Reverting to fallback.', e);
    return fallback;
  }
}

export const storageService = {
  // --- Theme ---
  getTheme() {
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME);
      return theme === 'light' || theme === 'dark' ? theme : 'dark';
    } catch {
      return 'dark';
    }
  },

  setTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.error('Storage write error (Theme):', e);
    }
  },

  // --- Active Location ---
  getSelectedLocationId() {
    try {
      return localStorage.getItem(STORAGE_KEYS.LOCATION) || 'kathmandu';
    } catch {
      return 'kathmandu';
    }
  },

  setSelectedLocationId(id) {
    try {
      localStorage.setItem(STORAGE_KEYS.LOCATION, id);
    } catch (e) {
      console.error('Storage write error (Location):', e);
    }
  },

  // --- Saved / Favorite Municipalities ---
  getSavedLocations() {
    try {
      return safeJsonParse(localStorage.getItem(STORAGE_KEYS.SAVED_LOCATIONS), ['kathmandu', 'pokhara']);
    } catch {
      return ['kathmandu', 'pokhara'];
    }
  },

  saveLocation(id) {
    try {
      const current = this.getSavedLocations();
      if (!current.includes(id)) {
        const updated = [...current, id];
        localStorage.setItem(STORAGE_KEYS.SAVED_LOCATIONS, JSON.stringify(updated));
        return updated;
      }
      return current;
    } catch (e) {
      console.error('Storage write error (Save Location):', e);
      return [];
    }
  },

  removeSavedLocation(id) {
    try {
      const current = this.getSavedLocations();
      const updated = current.filter(locId => locId !== id);
      localStorage.setItem(STORAGE_KEYS.SAVED_LOCATIONS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Storage write error (Remove Saved Location):', e);
      return [];
    }
  },

  clearSavedLocations() {
    try {
      localStorage.removeItem(STORAGE_KEYS.SAVED_LOCATIONS);
      return [];
    } catch (e) {
      console.error('Storage write error (Clear Saved Locations):', e);
      return [];
    }
  },

  // --- Comparison Locations ---
  getCompareLocationIds() {
    try {
      return safeJsonParse(localStorage.getItem(STORAGE_KEYS.COMPARE_LOCATIONS), ['kathmandu', 'pokhara', 'birgunj']);
    } catch {
      return ['kathmandu', 'pokhara', 'birgunj'];
    }
  },

  setCompareLocationIds(ids) {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPARE_LOCATIONS, JSON.stringify(ids));
    } catch (e) {
      console.error('Storage write error (Compare IDs):', e);
    }
  },

  // --- Alert Preferences ---
  getAlertPreferences() {
    try {
      const saved = safeJsonParse(localStorage.getItem(STORAGE_KEYS.ALERT_PREFS), DEFAULT_ALERT_PREFS);
      return { ...DEFAULT_ALERT_PREFS, ...saved };
    } catch {
      return DEFAULT_ALERT_PREFS;
    }
  },

  setAlertPreferences(prefs) {
    try {
      localStorage.setItem(STORAGE_KEYS.ALERT_PREFS, JSON.stringify(prefs));
    } catch (e) {
      console.error('Storage write error (Alert Preferences):', e);
    }
  },

  // --- Dashboard Settings ---
  getDashboardSettings() {
    try {
      const saved = safeJsonParse(localStorage.getItem(STORAGE_KEYS.DASHBOARD_SETTINGS), DEFAULT_DASHBOARD_SETTINGS);
      return { ...DEFAULT_DASHBOARD_SETTINGS, ...saved };
    } catch {
      return DEFAULT_DASHBOARD_SETTINGS;
    }
  },

  setDashboardSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.DASHBOARD_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Storage write error (Dashboard Settings):', e);
    }
  },

  // --- Reset All Preferences ---
  resetAllSettings() {
    try {
      localStorage.removeItem(STORAGE_KEYS.THEME);
      localStorage.removeItem(STORAGE_KEYS.LOCATION);
      localStorage.removeItem(STORAGE_KEYS.SAVED_LOCATIONS);
      localStorage.removeItem(STORAGE_KEYS.COMPARE_LOCATIONS);
      localStorage.removeItem(STORAGE_KEYS.ALERT_PREFS);
      localStorage.removeItem(STORAGE_KEYS.DASHBOARD_SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
      localStorage.removeItem(STORAGE_KEYS.OPENAQ_KEY);
      return true;
    } catch (e) {
      console.error('Storage reset error:', e);
      return false;
    }
  }
};
