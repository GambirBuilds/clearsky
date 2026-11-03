import React from 'react';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

/**
 * Reusable wrapper container for all dashboard analytics charts
 */
export function ChartContainer({
  title,
  subtitle,
  actions,
  children,
  isLoading = false,
  className = '',
  height = 'h-72'
}) {
  return (
    <div className={`p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Chart Canvas Area */}
      <div className={`mt-4 w-full ${height} flex items-center justify-center`}>
        {isLoading ? (
          <div className="w-full h-full flex flex-col justify-end p-4 space-y-4">
            <LoadingSkeleton className="h-4 w-32" />
            <div className="grid grid-cols-12 gap-2 h-44 items-end">
              {[40, 65, 30, 80, 55, 90, 70, 85, 45, 60, 75, 50].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="bg-slate-200 dark:bg-slate-800 rounded-t w-full animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
