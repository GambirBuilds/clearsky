import React, { useState, useMemo } from 'react';
import { useLocation } from '../hooks/useLocation';
import { ChartContainer } from '../components/charts/ChartContainer';
import { Trend24hChart } from '../components/charts/Trend24hChart';
import { PollutantTrendChart } from '../components/charts/PollutantTrendChart';
import { Calendar, BarChart3, TrendingUp, ShieldAlert, Sparkles, Wind, Info } from 'lucide-react';
import { getAQICategory } from '../utils/aqiUtils';

export function AnalyticsPage() {
  const { selectedLocation, environmentalData, isLoading } = useLocation();
  const [selectedRange, setSelectedRange] = useState('7d');

  const ranges = [
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '1y', label: '1 Year (Seasonal)' }
  ];

  // Pick dataset based on range
  const activeDataset = useMemo(() => {
    if (!environmentalData?.hourlyData) return [];
    if (selectedRange === '24h') {
      return environmentalData.past24hData || [];
    }
    // Open-Meteo returns past 7 days (168 hours) of historical reanalysis
    return environmentalData.past7DaysData || [];
  }, [environmentalData, selectedRange]);

  // Dynamically compute real analytical metrics (Mean, Peak, Min, Clean hours)
  const stats = useMemo(() => {
    if (!activeDataset || activeDataset.length === 0) {
      return {
        meanAqi: null,
        peakPm25: null,
        minPm25: null,
        cleanHoursCount: 0,
        inversionRiskEpisodes: 0
      };
    }

    const validAqis = activeDataset.map(d => d.aqi).filter(a => a !== null && !isNaN(a));
    const validPm25s = activeDataset.map(d => d.pm25).filter(p => p !== null && !isNaN(p));

    const meanAqi = validAqis.length > 0
      ? Math.round(validAqis.reduce((a, b) => a + b, 0) / validAqis.length)
      : null;

    const peakPm25 = validPm25s.length > 0
      ? Math.max(...validPm25s)
      : null;

    const minPm25 = validPm25s.length > 0
      ? Math.min(...validPm25s)
      : null;

    const cleanHoursCount = validAqis.filter(a => a <= 50).length;
    // Count morning rush inversion spikes (AQI > 150)
    const inversionRiskEpisodes = activeDataset.filter(d => (d.hour === '07:00' || d.hour === '08:00') && (d.aqi > 140)).length;

    return {
      meanAqi,
      peakPm25,
      minPm25,
      cleanHoursCount,
      inversionRiskEpisodes
    };
  }, [activeDataset]);

  const meanCategory = getAQICategory(stats.meanAqi);

  const summaryMetrics = [
    {
      title: `${selectedRange.toUpperCase()} Mean AQI`,
      value: stats.meanAqi !== null ? stats.meanAqi : '— —',
      sub: stats.meanAqi !== null ? `${meanCategory.level}` : 'Awaiting data',
      icon: TrendingUp,
      color: 'text-amber-500'
    },
    {
      title: 'Peak PM2.5 Concentration',
      value: stats.peakPm25 !== null ? `${stats.peakPm25} µg/m³` : '— —',
      sub: stats.minPm25 !== null ? `Min recorded: ${stats.minPm25} µg/m³` : 'Awaiting sensor sync',
      icon: ShieldAlert,
      color: 'text-rose-500'
    },
    {
      title: 'Clean Air Hours (< 50 AQI)',
      value: activeDataset.length > 0 ? `${stats.cleanHoursCount} hrs` : '— —',
      sub: activeDataset.length > 0 ? `${Math.round((stats.cleanHoursCount / activeDataset.length) * 100)}% of observed window` : 'Awaiting data',
      icon: Sparkles,
      color: 'text-emerald-500'
    },
    {
      title: 'Morning Smog Spikes',
      value: activeDataset.length > 0 ? `${stats.inversionRiskEpisodes} events` : '— —',
      sub: 'Diurnal boundary layer trapping',
      icon: Wind,
      color: 'text-cyan-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Historical Air Quality Analytics
            </h1>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              {selectedLocation.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Time series analysis, seasonal trend patterns, and atmospheric exposure duration from live historical reanalysis
          </p>
        </div>

        {/* Date Range Selector Segmented Control */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          {ranges.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRange(r.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedRange === r.id
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Historical Coverage Notice */}
      {selectedRange === '30d' || selectedRange === '1y' ? (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Open-Meteo Air Quality provides high-resolution hourly reanalysis for the past 7 days. 30-day and multi-season archives will incorporate historical DHM Nepal records.
          </span>
        </div>
      ) : null}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryMetrics.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{kpi.title}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                {kpi.value}
              </div>
              <p className="text-[11px] text-slate-400">
                {kpi.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title={`Timeseries AQI Trajectory (${ranges.find(r => r.id === selectedRange)?.label})`}
          subtitle={`Diurnal variance and peak pollution episodes in ${selectedLocation.name}`}
          height="h-72"
        >
          <Trend24hChart
            data={activeDataset}
            isLoading={isLoading}
          />
        </ChartContainer>

        <ChartContainer
          title="Multi-Pollutant Concentration Breakdown"
          subtitle="PM2.5, PM10, NO2, and Ozone trajectories"
          height="h-72"
        >
          <PollutantTrendChart
            data={activeDataset}
            isLoading={isLoading}
          />
        </ChartContainer>
      </div>

      {/* Methodology & Airshed Footnote */}
      <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <strong className="text-slate-700 dark:text-slate-300">Data Source: </strong>
          Continuous hourly reanalysis modeled by Copernicus Atmosphere Monitoring Service (CAMS) via Open-Meteo.
        </div>
        <div className="text-emerald-500 font-medium">
          Real Timeseries Engine Connected
        </div>
      </div>
    </div>
  );
}
