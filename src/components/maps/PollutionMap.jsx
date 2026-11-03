import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap
} from 'react-leaflet';
import { useLocation } from '../../hooks/useLocation';
import { useTheme } from '../../hooks/useTheme';
import { MapLegend } from './MapLegend';
import { StationDetailsPanel } from './StationDetailsPanel';
import { SearchInput } from '../common/SearchInput';
import { Radio, Layers, Navigation } from 'lucide-react';
import { getAQICategory } from '../../utils/aqiUtils';

/**
 * Controller to smoothly animate map view to selected location coordinates
 */
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export function PollutionMap({
  height = 'h-[580px]',
  showSearch = true,
  onNavigateToCity
}) {
  const {
    locations,
    selectedLocation,
    setSelectedLocation,
    environmentalData,
    comparisonData
  } = useLocation();
  const { isDark } = useTheme();

  const [activeStation, setActiveStation] = useState(selectedLocation);
  const [mapLayer, setMapLayer] = useState('stations'); // 'stations' | 'pm25'

  useEffect(() => {
    setActiveStation(selectedLocation);
  }, [selectedLocation]);

  const mapCenter = [selectedLocation.lat, selectedLocation.lng];

  // Tile layer URL
  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  const attribution = '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md`}>
      {/* Top Search & Filter Bar Overlay */}
      {showSearch && (
        <div className="absolute top-4 left-4 right-4 z-400 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-none">
          <div className="w-full sm:w-80 pointer-events-auto">
            <SearchInput
              placeholder="Search & jump to Nepal city..."
              onSelectCity={(loc) => {
                setSelectedLocation(loc);
                setActiveStation(loc);
              }}
            />
          </div>

          {/* Layer Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-md pointer-events-auto self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setMapLayer('stations')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mapLayer === 'stations'
                  ? 'bg-emerald-500 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Monitoring Grid
            </button>
            <button
              type="button"
              onClick={() => setMapLayer('pm25')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mapLayer === 'pm25'
                  ? 'bg-emerald-500 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Aerosol Map
            </button>
          </div>
        </div>
      )}

      {/* Leaflet Map Canvas */}
      <MapContainer
        center={[28.3949, 84.1240]} // Center of Nepal
        zoom={7}
        minZoom={6}
        maxZoom={14}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer url={tileUrl} attribution={attribution} />
        <MapController center={mapCenter} zoom={10} />

        {/* Real Station Markers */}
        {locations.map((loc) => {
          const isSelected = loc.id === activeStation?.id;

          // Check if comparison data has real aqi for this location
          const matchedData = comparisonData?.find(c => c?.location?.id === loc.id);
          const cityAqi = loc.id === selectedLocation.id
            ? environmentalData?.aqi
            : matchedData?.aqi;

          const category = getAQICategory(cityAqi);
          const markerColor = cityAqi !== null && cityAqi !== undefined
            ? category.color
            : (isSelected ? '#10b981' : '#06b6d4');

          return (
            <CircleMarker
              key={loc.id}
              center={[loc.lat, loc.lng]}
              radius={isSelected ? 14 : 9}
              pathOptions={{
                color: markerColor,
                fillColor: markerColor,
                fillOpacity: isSelected ? 0.85 : 0.55,
                weight: isSelected ? 3.5 : 1.5
              }}
              eventHandlers={{
                click: () => {
                  setSelectedLocation(loc);
                  setActiveStation(loc);
                }
              }}
            >
              <Popup>
                <div className="p-1 text-xs text-slate-900">
                  <div className="font-bold">{loc.name} ({loc.nepaliName})</div>
                  <div className="text-[11px] text-slate-500">{loc.province} · {loc.elevation}</div>
                  <div className="mt-1 font-mono font-bold" style={{ color: markerColor }}>
                    {cityAqi !== null && cityAqi !== undefined ? `Real AQI: ${cityAqi} (${category.level})` : 'Atmospheric Model Connected'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Coordinates: {loc.lat}° N, {loc.lng}° E
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Floating Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-400 hidden sm:block pointer-events-auto">
        <MapLegend />
      </div>

      {/* Floating Station Inspector Drawer / Panel */}
      {activeStation && (
        <div className="absolute top-20 sm:top-16 right-4 z-400 pointer-events-auto max-w-[calc(100vw-2rem)]">
          <StationDetailsPanel
            location={activeStation}
            environmentalData={environmentalData}
            onClose={() => setActiveStation(null)}
            onInspectLive={(loc) => {
              if (onNavigateToCity) onNavigateToCity(loc);
            }}
          />
        </div>
      )}

      {/* Recenter Button */}
      <button
        type="button"
        onClick={() => {
          setSelectedLocation(locations[0]);
          setActiveStation(locations[0]);
        }}
        aria-label="Recenter on Kathmandu"
        title="Recenter on Kathmandu Valley"
        className="absolute bottom-4 right-4 z-400 p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-md text-slate-700 dark:text-slate-200 hover:text-emerald-500 transition-colors pointer-events-auto cursor-pointer"
      >
        <Navigation className="w-4 h-4" />
      </button>
    </div>
  );
}
