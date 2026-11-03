import React from 'react';
import { Radio, MapPin, Activity } from 'lucide-react';
import { Button } from '../common/Button';

export function StationCard({
  station,
  locationName,
  onSelectStation,
  isSelected = false
}) {
  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        isSelected
          ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs'
          : 'border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{station.name}</span>
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {locationName} · {station.type}
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
          {station.status || 'Awaiting Link'}
        </span>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-emerald-500" />
          <span>Part 2 Ingestion Ready</span>
        </span>
        {onSelectStation && (
          <button
            type="button"
            onClick={() => onSelectStation(station)}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
          >
            Inspect Target →
          </button>
        )}
      </div>
    </div>
  );
}
