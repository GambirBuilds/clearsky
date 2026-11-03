/**
 * Location Management & Geolocation Service
 *
 * Coordinates, Haversine spatial proximity calculations, and browser geolocation.
 */

import { NEPAL_LOCATIONS, DEFAULT_LOCATION } from '../constants/locations';

/**
 * Haversine distance formula between two lat/lng coordinates in kilometers
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const locationService = {
  /**
   * Get all defined Nepal municipalities
   */
  getLocations() {
    return NEPAL_LOCATIONS;
  },

  /**
   * Get location by unique ID
   */
  getLocationById(id) {
    return NEPAL_LOCATIONS.find(l => l.id === id) || DEFAULT_LOCATION;
  },

  /**
   * Find nearest Nepal municipality to given GPS coordinates
   */
  findNearestLocation(lat, lng) {
    let closest = DEFAULT_LOCATION;
    let minDistance = Infinity;

    for (const loc of NEPAL_LOCATIONS) {
      const dist = calculateDistanceKm(lat, lng, loc.lat, loc.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closest = { ...loc, distanceKm: Math.round(dist * 10) / 10 };
      }
    }

    return closest;
  },

  /**
   * Request device browser geolocation
   * @returns {Promise<{ success: boolean, coords?: { latitude: number, longitude: number }, nearestLocation?: object, error?: string }>}
   */
  async requestBrowserGeolocation() {
    if (!navigator.geolocation) {
      return {
        success: false,
        error: 'Geolocation is not supported by your browser.'
      };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const nearest = this.findNearestLocation(latitude, longitude);
          resolve({
            success: true,
            coords: { latitude, longitude },
            nearestLocation: nearest
          });
        },
        (error) => {
          let errorMsg = 'Could not retrieve your location.';
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg = 'Location permission was denied by the user.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg = 'Location information is unavailable.';
          } else if (error.code === error.TIMEOUT) {
            errorMsg = 'The request to get your location timed out.';
          }
          resolve({
            success: false,
            error: errorMsg
          });
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  }
};
