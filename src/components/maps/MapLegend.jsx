import React from 'react';
import { AQI_CATEGORIES } from '../../constants/aqiCategories';

export function MapLegend({ className = '' }) {
  return (
    <div className={`p-3 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-lg text-xs ${className}`}>
      <div className="font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center justify-between text-[11px] uppercase tracking-wider">
        <span>AQI Severity Scale</span>
        <span className="text-[10px] text-slate-400 font-normal">US-EPA</span>
      </div>
      <div className="space-y-1.5">
        {AQI_CATEGORIES.map((cat) => (
          <div key={cat.level} className="flex items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {cat.level}
              </span>
            </div>
            <span className="text-slate-400 font-mono tabular-nums text-[10px]">
              {cat.range[0]}–{cat.range[1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
