import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { NEPAL_LOCATIONS, DEFAULT_LOCATION } from '../constants/locations';
import { storageService } from '../services/storageService';
import { airQualityService } from '../services/airQualityService';
import { locationService } from '../services/locationService';
import { openAqService } from '../services/openAqService';

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  // Current selected Nepal city
  const [selectedLocation, setSelectedLocationState] = useState(() => {
    const savedId = storageService.getSelectedLocationId();
    return NEPAL_LOCATIONS.find(loc => loc.id === savedId) || DEFAULT_LOCATION;
  });

  // Comparison locations list (up to 4)
  const [compareIds, setCompareIds] = useState(() => storageService.getCompareLocationIds());

  // Search input query
  const [searchQuery, setSearchQuery] = useState('');

  // Live environmental intelligence state
  const [environmentalData, setEnvironmentalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(() => new Date());

  // Multi-location comparison intelligence cache
  const [comparisonData, setComparisonData] = useState([]);
  const [isLoadingComparison, setIsLoadingComparison] = useState(false);

  // OpenAQ API key configuration
  const [openAqKey, setOpenAqKeyState] = useState(() => openAqService.getApiKey());

  const setOpenAqKey = (key) => {
    openAqService.setApiKey(key);
    setOpenAqKeyState(key);
    // Trigger fresh load with new credentials
    refreshEnvironmentalData();
  };

  // In-memory cache for location intelligence
  const cacheRef = useRef(new Map());

  const setSelectedLocation = (locationOrId) => {
    const target = typeof locationOrId === 'string'
      ? NEPAL_LOCATIONS.find(l => l.id === locationOrId) || DEFAULT_LOCATION
      : locationOrId;

    setSelectedLocationState(target);
    storageService.setSelectedLocationId(target.id);
  };

  /**
   * Fetch real environmental intelligence for the active location
   */
  const refreshEnvironmentalData = useCallback(async (bypassCache = false) => {
    setIsLoading(true);
    setError(null);

    const cacheKey = selectedLocation.id;
    if (!bypassCache && cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey);
      // Use cache if less than 3 minutes old
      if (Date.now() - cached.timestamp < 3 * 60 * 1000) {
        setEnvironmentalData(cached.data);
        setIsLoading(false);
        setLastRefreshedAt(new Date(cached.timestamp));
        return;
      }
    }

    try {
      const result = await airQualityService.getEnvironmentalIntelligence(selectedLocation);
      if (result.success) {
        setEnvironmentalData(result);
        setLastRefreshedAt(new Date());
        cacheRef.current.set(cacheKey, { timestamp: Date.now(), data: result });
      } else {
        setError(result.error || 'Unable to retrieve environmental data');
      }
    } catch (err) {
      setError(err.message || 'Network error connecting to atmospheric feeds');
    } finally {
      setIsLoading(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    refreshEnvironmentalData();
  }, [refreshEnvironmentalData]);

  /**
   * Browser geolocation helper
   */
  const locateUser = async () => {
    const res = await locationService.requestBrowserGeolocation();
    if (res.success && res.nearestLocation) {
      setSelectedLocation(res.nearestLocation);
      return { success: true, location: res.nearestLocation };
    }
    return { success: false, error: res.error };
  };

  /**
   * Comparison management
   */
  const addToCompare = (locationId) => {
    if (compareIds.includes(locationId)) return;
    if (compareIds.length >= 4) {
      setCompareIds(prev => [...prev.slice(1), locationId]);
    } else {
      setCompareIds(prev => [...prev, locationId]);
    }
  };

  const removeFromCompare = (locationId) => {
    if (compareIds.length <= 1) return;
    setCompareIds(prev => prev.filter(id => id !== locationId));
  };

  const setCompareLocationsList = (ids) => {
    const unique = [...new Set(ids)].slice(0, 4);
    setCompareIds(unique);
    storageService.setCompareLocationIds(unique);
  };

  useEffect(() => {
    storageService.setCompareLocationIds(compareIds);
  }, [compareIds]);

  const compareLocations = compareIds
    .map(id => NEPAL_LOCATIONS.find(l => l.id === id))
    .filter(Boolean);

  // Fetch comparison data when compareLocations change
  const refreshComparisonData = useCallback(async () => {
    setIsLoadingComparison(true);
    try {
      const results = await airQualityService.compareLocations(compareLocations);
      setComparisonData(results);
    } catch (e) {
      console.error('Error fetching comparison data:', e);
    } finally {
      setIsLoadingComparison(false);
    }
  }, [compareLocations]);

  useEffect(() => {
    refreshComparisonData();
  }, [refreshComparisonData]);

  // Search filter
  const filteredLocations = NEPAL_LOCATIONS.filter(loc => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.nepaliName.includes(q) ||
      loc.province.toLowerCase().includes(q) ||
      loc.district.toLowerCase().includes(q)
    );
  });

  return (
    <LocationContext.Provider
      value={{
        locations: NEPAL_LOCATIONS,
        selectedLocation,
        setSelectedLocation,
        searchQuery,
        setSearchQuery,
        filteredLocations,
        environmentalData,
        isLoading,
        error,
        refreshEnvironmentalData,
        locateUser,
        lastRefreshedAt,
        openAqKey,
        setOpenAqKey,
        compareLocations,
        compareIds,
        comparisonData,
        isLoadingComparison,
        addToCompare,
        removeFromCompare,
        setCompareLocationsList,
        refreshComparisonData
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
