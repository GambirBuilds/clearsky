import React from 'react';
import { PollutionMap } from '../components/maps/PollutionMap';
import { useLocation } from '../hooks/useLocation';
import { MapPin, Navigation, Info, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MapPage() {
  const { locations, selectedLocation, setSelectedLocation } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-500" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Nepal Air Quality Geospatial Grid
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explore ambient air monitoring networks across mountain valleys, mid-hills, and southern plains
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {locations.length} Municipalities
          </span>
          <span>·</span>
          <span>OpenStreetMap & CartoDB Engine</span>
        </div>
      </div>

      {/* Interactive Map */}
      <PollutionMap
        height="h-[620px]"
        showSearch={true}
        onNavigateToCity={(loc) => {
          setSelectedLocation(loc);
          navigate('/');
        }}
      />

      {/* Grid of Nepal Municipal Targets */}
      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Configured Municipal Sentinel Targets
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click any municipality to focus the interactive map and set active context
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {locations.map((loc) => {
            const isSelected = loc.id === selectedLocation.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => setSelectedLocation(loc)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs'
                    : 'border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <span className="truncate">{loc.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  {loc.province}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {loc.elevation}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
