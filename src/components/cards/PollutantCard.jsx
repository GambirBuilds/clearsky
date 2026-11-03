import React from 'react';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { Radio, AlertCircle } from 'lucide-react';

/**
 * Reusable card for criteria pollutants displaying real API measurements
 */
export function PollutantCard({
  pollutant,
  data,
  isLoading = false
}) {
  if (isLoading || !data) {
    return (
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
        <div className="flex items-center justify-between">
          <LoadingSkeleton className="h-4 w-16" />
          <LoadingSkeleton className="h-4 w-12" />
        </div>
        <LoadingSkeleton className="h-8 w-24" />
        <LoadingSkeleton className="h-3 w-full" />
        <LoadingSkeleton className="h-3 w-3/4" />
      </div>
    );
  }

  const {
    value,
    unit,
    source,
    sourceType,
    subIndex
  } = data;

  const isAvailable = value !== null && value !== undefined;

  return (
    <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {pollutant.name}
            </h3>
            <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
              {pollutant.nepaliName}
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            {unit || pollutant.unit}
          </span>
        </div>

        {/* Value Display */}
        <div className="py-3 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
              {isAvailable ? `${value}` : '— —'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
              {sourceType === 'measured' ? (
                <span className="text-emerald-500 font-medium">Ground sensor</span>
              ) : sourceType === 'modeled' ? (
                <span className="text-cyan-500 font-medium">Atmospheric model</span>
              ) : (
                <span className="text-slate-400">Unavailable</span>
              )}
              {subIndex?.aqi && (
                <span className="text-slate-500 dark:text-slate-400">· Sub-AQI {subIndex.aqi}</span>
              )}
            </div>
          </div>

          <div className="text-right text-[11px] space-y-0.5">
            <div className="text-slate-400">
              Nepal Std: <span className="font-semibold text-slate-600 dark:text-slate-300 tabular-nums">{pollutant.standardLimit}</span>
            </div>
            <div className="text-slate-400">
              WHO: <span className="font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">{pollutant.whoLimit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Source Attribution */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
        <p className="line-clamp-2 leading-relaxed">
          <strong className="text-slate-700 dark:text-slate-300 font-medium">Source: </strong>
          {pollutant.primarySource}
        </p>
        <div className="text-[10px] text-slate-400 truncate pt-0.5">
          Provider: {source}
        </div>
      </div>
    </div>
  );
}
