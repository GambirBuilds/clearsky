import React from 'react';
import { X, MapPin, Radio, Activity, ExternalLink, Mountain, Clock } from 'lucide-react';
import { Button } from '../common/Button';
import { formatCoordinates, formatDateTime } from '../../utils/formatters';
import { getAQICategory } from '../../utils/aqiUtils';

export function StationDetailsPanel({
  location,
  environmentalData,
  onClose,
  onInspectLive
}) {
  if (!location) return null;

  const aqi = environmentalData?.location?.id === location.id
    ? environmentalData.aqi
    : null;
  const category = getAQICategory(aqi);

  const pm25 = environmentalData?.location?.id === location.id
    ? environmentalData.pollutants?.pm25?.value
    : null;

  const groundStations = environmentalData?.location?.id === location.id
    ? (environmentalData.groundStations || [])
    : [];

  return (
    <div className="w-full sm:w-80 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {location.name}
            </h3>
            <span className="text-xs text-slate-400">({location.nepaliName})</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {location.district}, {location.province}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Geospatial Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Mountain className="w-3 h-3 text-cyan-400" />
            <span>Elevation</span>
          </div>
          <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
            {location.elevation}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>Real AQI</span>
          </div>
          <div
            className="font-bold text-base font-mono mt-0.5 tabular-nums"
            style={{ color: category.color }}
          >
            {aqi !== null ? `${aqi} AQI` : 'Select to sync'}
          </div>
        </div>
      </div>

      {/* Real Pollutant Snapshot */}
      {pm25 !== null && (
        <div className="p-2.5 rounded-lg bg-emerald-50/20 dark:bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-300">PM2.5 Concentration:</span>
          <span className="font-bold font-mono text-emerald-500 tabular-nums">
            {pm25} µg/m³
          </span>
        </div>
      )}

      {/* Description */}
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {location.description}
      </p>

      {/* Station Feed Targets List */}
      <div>
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Monitoring Station Classification
        </h5>
        <div className="space-y-1.5">
          {groundStations.length > 0 ? (
            groundStations.map((st) => (
              <div
                key={st.id}
                className="p-2 rounded-lg bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-medium text-slate-800 dark:text-slate-200 block truncate max-w-[170px]">
                    {st.name}
                  </span>
                  <span className="text-[10px] text-emerald-500">OpenAQ Physical Monitor</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                  Live
                </span>
              </div>
            ))
          ) : (
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-medium text-slate-800 dark:text-slate-200 block">
                Open-Meteo CAMS Model Grid
              </span>
              <span className="text-[10px] text-slate-400">
                Ground monitoring awaiting OpenAQ API key configuration
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Coordinates */}
      <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span>Coordinates</span>
        <span className="font-mono text-slate-600 dark:text-slate-300">
          {formatCoordinates(location.lat, location.lng)}
        </span>
      </div>

      {/* Action */}
      {onInspectLive && (
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          icon={ExternalLink}
          onClick={() => onInspectLive(location)}
        >
          View Full Intelligence
        </Button>
      )}
    </div>
  );
}
