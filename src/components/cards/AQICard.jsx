import React from 'react';
import { getAQICategory } from '../../utils/aqiUtils';
import { ShieldCheck, Info, Radio, Clock, Cpu, CheckCircle } from 'lucide-react';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { formatDateTime } from '../../utils/formatters';

/**
 * Main AQI visualization card connected to live environmental intelligence
 */
export function AQICard({
  location,
  environmentalData,
  isLoading = false,
  onRefresh
}) {
  if (isLoading || !environmentalData) {
    return (
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-4">
        <div className="flex items-center justify-between">
          <LoadingSkeleton className="h-5 w-36" />
          <LoadingSkeleton className="h-4 w-24" />
        </div>
        <div className="flex items-baseline gap-4 py-2">
          <LoadingSkeleton className="h-20 w-32" />
          <div className="space-y-2 flex-1">
            <LoadingSkeleton className="h-6 w-48" />
            <LoadingSkeleton className="h-4 w-full" />
          </div>
        </div>
        <LoadingSkeleton className="h-10 w-full" />
      </div>
    );
  }

  const {
    aqi,
    locallyCalculatedAqi,
    providerReportedUsAqi,
    dominantPollutant,
    dataClassificationLabel,
    lastUpdated
  } = environmentalData;

  const category = getAQICategory(aqi);
  const formattedTime = formatDateTime(new Date(lastUpdated));

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-sm p-6 lg:p-7">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Air Quality Index (AQI)
            </h2>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {location.name} ({location.nepaliName})
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Calculated via US-EPA Technical Breakpoints & Nepal MOFE Standards
          </p>
        </div>

        {/* Data Source & Freshness Pill */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Radio className="w-3 h-3 text-emerald-500" />
            <span>{dataClassificationLabel || 'Live Model Feed'}</span>
          </span>
        </div>
      </div>

      {/* Main AQI Hero Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-6">
        {/* Left: Large Numerical Metric Area */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex items-baseline gap-3">
            <span
              className="text-6xl sm:text-7xl font-extrabold tracking-tight font-mono tabular-nums select-none"
              style={{ color: category.color }}
            >
              {aqi !== null ? aqi : '— —'}
            </span>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              <div>AQI</div>
              <div className="text-[10px] lowercase text-slate-500 font-normal">points</div>
            </div>
          </div>

          <div className="mt-3">
            <span
              className="inline-block px-3 py-1 rounded-md text-xs font-semibold"
              style={{
                color: category.color,
                backgroundColor: category.bgColor,
                border: `1px solid ${category.borderColor}`
              }}
            >
              {category.level} ({category.nepaliLevel})
            </span>
          </div>

          <div className="text-[11px] text-slate-400 mt-2 space-y-0.5">
            {locallyCalculatedAqi !== null && (
              <div>EPA Calculated: <span className="font-semibold text-slate-700 dark:text-slate-300">{locallyCalculatedAqi}</span></div>
            )}
            {providerReportedUsAqi !== null && providerReportedUsAqi !== locallyCalculatedAqi && (
              <div>Provider Reported: <span className="font-semibold text-slate-700 dark:text-slate-300">{providerReportedUsAqi}</span></div>
            )}
          </div>
        </div>

        {/* Right: Category Explanation, Health Advice & Freshness */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Health & Environmental Implication</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {category.healthAdvice}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Sensitive Groups: {category.sensitiveGroups}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="tabular-nums">Updated: {formattedTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Methodology Footnote */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
        <div>
          <span>Primary Driving Pollutant: </span>
          <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase">
            {dominantPollutant || 'PM2.5'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-emerald-500" />
          <span>Real-time API Ingestion Active</span>
        </div>
      </div>
    </div>
  );
}
