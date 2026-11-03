import React from 'react';
import { ArrowRight, GitCompare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NEPAL_LOCATIONS } from '../../constants/locations';
import { useLocation } from '../../hooks/useLocation';
import { getAQICategory } from '../../utils/aqiUtils';

export function LocationComparisonPreview() {
  const { comparisonData, isLoadingComparison } = useLocation();

  // Pick Kathmandu, Pokhara, and Birgunj if available
  const previewLocations = [
    NEPAL_LOCATIONS.find(l => l.id === 'kathmandu') || NEPAL_LOCATIONS[0],
    NEPAL_LOCATIONS.find(l => l.id === 'pokhara') || NEPAL_LOCATIONS[3],
    NEPAL_LOCATIONS.find(l => l.id === 'birgunj') || NEPAL_LOCATIONS[6]
  ];

  return (
    <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-cyan-400" />
            <span>Regional Air Quality Comparison</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real atmospheric variations across Kathmandu Valley, Pokhara Valley, and Southern Terai
          </p>
        </div>
        <Link
          to="/compare"
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <span>Open Full Comparison</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {previewLocations.map((loc) => {
          // Look up in comparisonData
          const data = comparisonData.find(c => c?.location?.id === loc.id);
          const aqi = data?.aqi ?? null;
          const category = getAQICategory(aqi);

          return (
            <div
              key={loc.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {loc.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{loc.elevation}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {loc.province}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-baseline justify-between">
                <span className="text-xs text-slate-400">AQI Index:</span>
                <div className="text-right">
                  <span
                    className="text-base font-bold font-mono tabular-nums"
                    style={{ color: category.color }}
                  >
                    {aqi !== null ? aqi : (isLoadingComparison ? '...' : '—')}
                  </span>
                  <div className="text-[10px]" style={{ color: category.color }}>
                    {category.level}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
