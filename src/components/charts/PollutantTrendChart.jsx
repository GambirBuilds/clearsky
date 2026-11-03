import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { BarChart2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

/**
 * Multi-pollutant comparative trend layout connected to real timeseries data
 */
export function PollutantTrendChart({ data = [], isLoading = false }) {
  const { isDark } = useTheme();
  const [activePollutants, setActivePollutants] = useState({
    pm25: true,
    pm10: true,
    no2: false,
    o3: false
  });

  const togglePollutant = (key) => {
    setActivePollutants(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col justify-end p-4 space-y-4">
        <div className="grid grid-cols-12 gap-2 h-44 items-end animate-pulse">
          {[50, 40, 75, 60, 85, 30, 95, 70, 65, 80, 55, 45].map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className="bg-slate-200 dark:bg-slate-800 rounded-t w-full"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 mb-3">
          <BarChart2 className="w-6 h-6 text-emerald-400" />
        </div>
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Criteria Multi-Stream Unavailable
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 leading-relaxed">
          Pollutant timeseries observations are currently not available for this period.
        </p>
      </div>
    );
  }

  // Downsample if more than 50 points to keep line smooth
  const displayData = data.length > 48
    ? data.filter((_, idx) => idx % Math.ceil(data.length / 36) === 0)
    : data;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Toggles */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <button
          type="button"
          onClick={() => togglePollutant('pm25')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            activePollutants.pm25
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-transparent'
          }`}
        >
          PM2.5 (Fine)
        </button>
        <button
          type="button"
          onClick={() => togglePollutant('pm10')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            activePollutants.pm10
              ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-transparent'
          }`}
        >
          PM10 (Coarse)
        </button>
        <button
          type="button"
          onClick={() => togglePollutant('no2')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            activePollutants.no2
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-transparent'
          }`}
        >
          NO2
        </button>
        <button
          type="button"
          onClick={() => togglePollutant('o3')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            activePollutants.o3
              ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-transparent'
          }`}
        >
          O3 (Ozone)
        </button>
      </div>

      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#1e293b' : '#e2e8f0'}
              vertical={false}
            />
            <XAxis
              dataKey="hour"
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: isDark ? '#334155' : '#cbd5e1' }}
            />
            <YAxis
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                borderColor: isDark ? '#334155' : '#e2e8f0',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: isDark ? '#f8fafc' : '#0f172a'
              }}
            />
            {activePollutants.pm25 && (
              <Line
                type="monotone"
                dataKey="pm25"
                name="PM2.5 (µg/m³)"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            )}
            {activePollutants.pm10 && (
              <Line
                type="monotone"
                dataKey="pm10"
                name="PM10 (µg/m³)"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
              />
            )}
            {activePollutants.no2 && (
              <Line
                type="monotone"
                dataKey="no2"
                name="NO2 (µg/m³)"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
            )}
            {activePollutants.o3 && (
              <Line
                type="monotone"
                dataKey="o3"
                name="O3 (µg/m³)"
                stroke="#a855f7"
                strokeWidth={2}
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
