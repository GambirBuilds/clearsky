import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Clock, Radio } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

/**
 * 24-hour diurnal AQI trend chart connected to real hourly data
 */
export function Trend24hChart({ data = [], isLoading = false }) {
  const { isDark } = useTheme();

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col justify-end p-4 space-y-4">
        <div className="grid grid-cols-12 gap-2 h-44 items-end animate-pulse">
          {[40, 65, 30, 80, 55, 90, 70, 85, 45, 60, 75, 50].map((h, i) => (
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
          <Clock className="w-6 h-6 text-cyan-400" />
        </div>
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Hourly Timeseries Unavailable
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 leading-relaxed">
          No hourly observations or modeled timeseries available for this interval.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="realAqiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="aqi"
            name="Air Quality Index"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#realAqiGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
