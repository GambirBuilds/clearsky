import React from 'react';

/**
 * Reusable animated skeleton loader for data and card layouts
 */
export function LoadingSkeleton({ className = '', height, width, circle = false }) {
  const style = {};
  if (height) style.height = height;
  if (width) style.width = width;

  return (
    <div
      style={style}
      className={`animate-pulse bg-slate-200 dark:bg-slate-800/70 ${circle ? 'rounded-full' : 'rounded-md'} ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Metric card skeleton layout
 */
export function MetricCardSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 space-y-3">
      <div className="flex items-center justify-between">
        <LoadingSkeleton className="h-4 w-20" />
        <LoadingSkeleton className="h-4 w-8" />
      </div>
      <LoadingSkeleton className="h-8 w-28" />
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <LoadingSkeleton className="h-3 w-full" />
      </div>
    </div>
  );
}
