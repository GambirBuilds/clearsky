import React, { useState } from 'react';
import { useLocation } from '../hooks/useLocation';
import { GitCompare, Plus, X, Mountain, Radio, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '../components/common/Button';
import { ChartContainer } from '../components/charts/ChartContainer';
import { PollutantTrendChart } from '../components/charts/PollutantTrendChart';
import { getAQICategory } from '../utils/aqiUtils';
import { formatDateTime } from '../utils/formatters';

export function ComparePage() {
  const {
    locations,
    compareLocations,
    comparisonData,
    isLoadingComparison,
    addToCompare,
    removeFromCompare
  } = useLocation();

  const [isAddOpen, setIsAddOpen] = useState(false);

  // Available locations not yet in compare
  const availableToAdd = locations.filter(
    l => !compareLocations.some(c => c.id === l.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-emerald-500" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Comparative Municipal Air Quality Benchmark
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare real atmospheric pollution parameters and weather conditions across up to 4 Nepal municipalities
          </p>
        </div>

        {compareLocations.length < 4 && (
          <div className="relative">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddOpen(!isAddOpen)}
            >
              Add Municipality ({compareLocations.length}/4)
            </Button>

            {isAddOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  Select to Add
                </div>
                {availableToAdd.length > 0 ? (
                  availableToAdd.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => {
                        addToCompare(loc.id);
                        setIsAddOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      <span>{loc.name} ({loc.nepaliName})</span>
                      <span className="text-[10px] text-slate-400">{loc.elevation}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-slate-400">
                    All municipalities added
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Up to 4 Location Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {compareLocations.map((loc) => {
          const liveInfo = comparisonData.find(c => c?.location?.id === loc.id);
          const aqi = liveInfo?.aqi ?? null;
          const category = getAQICategory(aqi);
          const pm25 = liveInfo?.pollutants?.pm25?.value;

          return (
            <div
              key={loc.id}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs relative flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {loc.name}
                    </h3>
                    <div className="text-xs text-slate-400">
                      {loc.nepaliName} · {loc.district}
                    </div>
                  </div>

                  {compareLocations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFromCompare(loc.id)}
                      aria-label={`Remove ${loc.name}`}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="mt-3 py-2 border-y border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Elevation:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{loc.elevation}</span>
                </div>
              </div>

              <div>
                <div
                  className="text-3xl font-extrabold font-mono tabular-nums"
                  style={{ color: category.color }}
                >
                  {aqi !== null ? `${aqi} AQI` : (isLoadingComparison ? '...' : '— —')}
                </div>
                <div className="text-xs font-semibold mt-0.5" style={{ color: category.color }}>
                  {category.level}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  PM2.5: <span className="font-bold text-slate-700 dark:text-slate-300">{pm25 !== null && pm25 !== undefined ? `${pm25} µg/m³` : '—'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-side Comparative Metrics Table */}
      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Real Environmental Intelligence Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Key criteria pollutants and atmospheric indicators retrieved directly from live feeds
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Parameter</th>
                {compareLocations.map(loc => (
                  <th key={loc.id} className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                    {loc.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">Calculated EPA AQI</td>
                {compareLocations.map(loc => {
                  const data = comparisonData.find(c => c?.location?.id === loc.id);
                  const aqi = data?.aqi ?? null;
                  const cat = getAQICategory(aqi);
                  return (
                    <td key={loc.id} className="py-2.5 px-3 font-bold" style={{ color: cat.color }}>
                      {aqi !== null ? `${aqi} (${cat.level})` : '—'}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">PM2.5 Concentration</td>
                {compareLocations.map(loc => {
                  const data = comparisonData.find(c => c?.location?.id === loc.id);
                  const val = data?.pollutants?.pm25?.value;
                  return (
                    <td key={loc.id} className="py-2.5 px-3">
                      {val !== null && val !== undefined ? `${val} µg/m³` : 'Unavailable'}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">PM10 Concentration</td>
                {compareLocations.map(loc => {
                  const data = comparisonData.find(c => c?.location?.id === loc.id);
                  const val = data?.pollutants?.pm10?.value;
                  return (
                    <td key={loc.id} className="py-2.5 px-3">
                      {val !== null && val !== undefined ? `${val} µg/m³` : 'Unavailable'}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">NO2 Concentration</td>
                {compareLocations.map(loc => {
                  const data = comparisonData.find(c => c?.location?.id === loc.id);
                  const val = data?.pollutants?.no2?.value;
                  return (
                    <td key={loc.id} className="py-2.5 px-3">
                      {val !== null && val !== undefined ? `${val} µg/m³` : 'Unavailable'}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">Ambient Temperature</td>
                {compareLocations.map(loc => {
                  const data = comparisonData.find(c => c?.location?.id === loc.id);
                  const val = data?.weather?.temperature?.value;
                  return (
                    <td key={loc.id} className="py-2.5 px-3">
                      {val !== null && val !== undefined ? `${val} °C` : '—'}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">Surface Wind Velocity</td>
                {compareLocations.map(loc => {
                  const data = comparisonData.find(c => c?.location?.id === loc.id);
                  const val = data?.weather?.windSpeed?.value;
                  return (
                    <td key={loc.id} className="py-2.5 px-3">
                      {val !== null && val !== undefined ? `${val} km/h` : '—'}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">Data Classification</td>
                {compareLocations.map(loc => {
                  const data = comparisonData.find(c => c?.location?.id === loc.id);
                  return (
                    <td key={loc.id} className="py-2.5 px-3 font-sans text-[11px] text-cyan-500">
                      {data?.dataClassificationLabel || 'Modeled Atmospheric Feed'}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparison Chart */}
      <ChartContainer
        title="Comparative Historical Concentration Progression"
        subtitle="Comparing particulate trajectories for active selected regions"
        height="h-72"
      >
        <PollutantTrendChart
          data={comparisonData[0]?.past7DaysData || []}
          isLoading={isLoadingComparison}
        />
      </ChartContainer>
    </div>
  );
}
