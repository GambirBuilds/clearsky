import React, { useState, useMemo } from 'react';
import { useLocation } from '../hooks/useLocation';
import { CloudRain, Sun, CloudFog, Wind, Clock, Calendar, ShieldCheck, Info } from 'lucide-react';
import { ChartContainer } from '../components/charts/ChartContainer';
import { Trend24hChart } from '../components/charts/Trend24hChart';
import { getAQICategory } from '../utils/aqiUtils';

export function ForecastPage() {
  const { selectedLocation, environmentalData, isLoading } = useLocation();
  const [activeTab, setActiveTab] = useState('hourly'); // 'hourly' | 'daily'

  const forecastHourly = environmentalData?.forecast48hData || [];

  // Group forecast by day to generate real 5-day daily summary
  const dailyForecastItems = useMemo(() => {
    if (!forecastHourly || forecastHourly.length === 0) return [];

    const byDate = {};
    for (const item of forecastHourly) {
      if (!byDate[item.date]) {
        byDate[item.date] = [];
      }
      byDate[item.date].push(item);
    }

    return Object.entries(byDate).slice(0, 5).map(([dateStr, items]) => {
      const aqis = items.map(i => i.aqi).filter(a => a !== null);
      const pm25s = items.map(i => i.pm25).filter(p => p !== null);

      const maxAqi = aqis.length > 0 ? Math.max(...aqis) : 100;
      const avgAqi = aqis.length > 0 ? Math.round(aqis.reduce((a, b) => a + b, 0) / aqis.length) : 100;
      const maxPm25 = pm25s.length > 0 ? Math.max(...pm25s) : 35;

      const dateObj = new Date(dateStr);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

      return {
        dateStr,
        dayName,
        maxAqi,
        avgAqi,
        maxPm25,
        category: getAQICategory(maxAqi)
      };
    });
  }, [forecastHourly]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Atmospheric Air Quality Forecast
            </h1>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              {selectedLocation.name} Airshed
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            48-Hour predictive dispersion and boundary-layer meteorological simulation
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('hourly')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'hourly'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            48-Hour Hourly
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'daily'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Daily Outlook
          </button>
        </div>
      </div>

      {/* Modeled Forecast Classification Notice */}
      <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-900 dark:text-cyan-200 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            Model-Based Forecast Transparency
          </span>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
            Forecast figures below are simulated numerical estimates produced by the Copernicus Atmosphere Monitoring Service (CAMS) atmospheric chemical dispersion model. Modeled forecasts are not ground measurements.
          </p>
        </div>
      </div>

      {/* Hourly / Daily Forecast Grid Layout */}
      {activeTab === 'hourly' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>Next 24 Hours Hourly Simulation</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Model: CAMS 0.4° Global Dispersion Grid
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {forecastHourly.slice(0, 16).map((item, idx) => {
              const cat = getAQICategory(item.aqi);
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs text-center flex flex-col justify-between space-y-2"
                >
                  <span className="text-xs font-semibold text-slate-400">{item.hour}</span>
                  <div>
                    <div
                      className="text-lg font-bold font-mono tabular-nums"
                      style={{ color: cat.color }}
                    >
                      {item.aqi !== null ? item.aqi : '—'}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {cat.level}
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between font-mono">
                    <span>PM2.5:</span>
                    <span>{item.pm25 ?? '—'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Multi-Day Synoptic Progression</span>
            </h3>
            <span className="text-xs text-slate-400">
              Modeled daily peak AQI projection
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {dailyForecastItems.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-3"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{item.dayName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{item.dateStr}</div>
                </div>
                <div className="py-1">
                  <div
                    className="text-2xl font-bold font-mono tabular-nums"
                    style={{ color: item.category.color }}
                  >
                    {item.maxAqi} AQI
                  </div>
                  <div className="text-xs font-medium mt-0.5" style={{ color: item.category.color }}>
                    Peak: {item.category.level}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Avg AQI: {item.avgAqi}</span>
                  <span className="font-mono">PM2.5: {item.maxPm25}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Forecast Chart Container */}
      <ChartContainer
        title="48-Hour Predictive Trajectory Curve"
        subtitle={`Simulated diurnal particulate trajectory over ${selectedLocation.name}`}
        height="h-72"
      >
        <Trend24hChart
          data={forecastHourly}
          isLoading={isLoading}
        />
      </ChartContainer>

      {/* Model Information & Known Limitations */}
      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Model Specifications & Known Coverage Limitations
          </h3>
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-2">
          <p>
            • <strong>Forecast Engine: </strong> Open-Meteo Air Quality forecasts ingest data from ECMWF Copernicus Atmosphere Monitoring Service (CAMS) coupled with global weather prediction models.
          </p>
          <p>
            • <strong>Topography Limitation: </strong> Deep mountain valleys (such as the Kathmandu basin or Pokhara valley) possess complex micro-climates and localized radiative temperature inversions that standard 10 km–40 km grid-cell models may under-predict during calm nocturnal periods.
          </p>
          <p>
            • <strong>Localized Source Variance: </strong> Unregulated agricultural residue fires and localized brick kiln plumes can cause localized particulate spikes exceeding regional synoptic forecasts.
          </p>
        </div>
      </div>
    </div>
  );
}
