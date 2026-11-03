import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCw, Clock, Sparkles, Radio } from 'lucide-react';
import { useLocation } from '../../hooks/useLocation';
import { formatDateTime } from '../../utils/formatters';
import { Button } from '../common/Button';

export function WelcomePanel() {
  const {
    locations,
    selectedLocation,
    setSelectedLocation,
    environmentalData,
    isLoading,
    refreshEnvironmentalData,
    lastRefreshedAt
  } = useLocation();

  const [currentTime, setCurrentTime] = useState(() => formatDateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatDateTime());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800/90 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Nepal Environmental Intelligence</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
          ClearSky Atmospheric Observatory
        </h1>
        <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
          Real-time air-quality monitoring and health intelligence across Nepal's urban centers and mountain valleys.
        </p>

        {/* Date, Time & Station Telemetry Info */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-slate-300 pt-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="tabular-nums font-mono">{currentTime} (NPT)</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target: {selectedLocation.name}, {selectedLocation.province}</span>
          </div>
          {environmentalData?.dataClassificationLabel && (
            <>
              <span>·</span>
              <div className="flex items-center gap-1.5 text-emerald-300">
                <Radio className="w-3 h-3 text-emerald-400" />
                <span>{environmentalData.dataClassificationLabel}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Location Switcher & Refresh Actions */}
      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        <div className="relative">
          <select
            value={selectedLocation.id}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-slate-100 hover:bg-slate-750 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.nepaliName})
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          loading={isLoading}
          onClick={() => refreshEnvironmentalData(true)}
          title="Fetch fresh real-time atmospheric feeds"
        >
          {isLoading ? 'Probing...' : 'Refresh'}
        </Button>
      </div>
    </div>
  );
}
