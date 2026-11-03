import React from 'react';
import { Thermometer, Droplets, Wind } from 'lucide-react';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

/**
 * Reusable meteorological metric card connected to live Open-Meteo weather
 */
export function WeatherCard({
  type = 'temperature', // 'temperature' | 'humidity' | 'wind_speed'
  data,
  isLoading = false
}) {
  const configs = {
    temperature: {
      name: 'Ambient Temperature',
      icon: Thermometer,
      defaultUnit: '°C',
      impact: 'Drives diurnal mixing height & surface inversion strength'
    },
    humidity: {
      name: 'Relative Humidity',
      icon: Droplets,
      defaultUnit: '%',
      impact: 'Promotes hygroscopic growth of fine aerosol particles'
    },
    wind_speed: {
      name: 'Surface Wind Velocity',
      icon: Wind,
      defaultUnit: 'km/h',
      impact: 'Controls horizontal advective ventilation across the valley'
    }
  };

  const item = configs[type] || configs.temperature;
  const Icon = item.icon;

  if (isLoading || !data) {
    return (
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
        <LoadingSkeleton className="h-4 w-28" />
        <LoadingSkeleton className="h-8 w-20" />
        <LoadingSkeleton className="h-3 w-full" />
      </div>
    );
  }

  const { value, unit } = data;
  const isAvailable = value !== null && value !== undefined;

  return (
    <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {item.name}
            </h4>
          </div>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            {unit || item.defaultUnit}
          </span>
        </div>

        <div className="py-3">
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
            {isAvailable ? `${value} ${unit || item.defaultUnit}` : '— —'}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {isAvailable ? 'Open-Meteo Synoptic Forecast' : 'Weather observation unavailable'}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400">
        <p className="leading-relaxed">{item.impact}</p>
      </div>
    </div>
  );
}
