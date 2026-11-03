import React from 'react';
import { useLocation } from '../hooks/useLocation';
import { POLLUTANTS } from '../constants/pollutants';
import { PollutantCard } from '../components/cards/PollutantCard';
import { Radio, Cpu, RefreshCw, Clock, Key, ExternalLink } from 'lucide-react';
import { Button } from '../components/common/Button';
import { formatDateTime } from '../utils/formatters';

export function LivePage() {
  const {
    selectedLocation,
    environmentalData,
    isLoading,
    refreshEnvironmentalData,
    lastRefreshedAt
  } = useLocation();

  const pollutantsData = environmentalData?.pollutants || {};
  const groundStations = environmentalData?.groundStations || [];
  const openAqStatus = environmentalData?.openAqStatus;
  const formattedTime = formatDateTime(lastRefreshedAt);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Live Air Quality Feeds
            </h1>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              {selectedLocation.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time pollutant breakdown, physical sensor telemetry, and calibration metadata
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            loading={isLoading}
            onClick={() => refreshEnvironmentalData(true)}
          >
            Probe Live Feed
          </Button>
        </div>
      </div>

      {/* Data Source & Freshness Transparency Callout */}
      <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-950 dark:text-emerald-200 flex items-start gap-3 text-xs">
        <Cpu className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            Data Source Classification: {environmentalData?.dataClassificationLabel || 'Open-Meteo & OpenAQ'}
          </span>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
            Readings below reflect atmospheric concentrations for {selectedLocation.name} coordinates ({selectedLocation.lat}° N, {selectedLocation.lng}° E).
            Last verified timestamp: <strong className="font-mono text-slate-800 dark:text-slate-200">{formattedTime}</strong>.
          </p>
        </div>
      </div>

      {/* Pollutant Overview Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Criteria Pollutants Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {POLLUTANTS.map((p) => (
            <PollutantCard
              key={p.id}
              pollutant={p}
              data={pollutantsData[p.id]}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>

      {/* Detailed Measurement & Sensor Source Table */}
      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Active Measurement Details & Ingestion Metadata
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Measurement methodologies adhering to Nepal Ministry of Forests and Environment benchmarks
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Pollutant</th>
                <th className="py-2.5 px-3">Current Value</th>
                <th className="py-2.5 px-3">Data Classification</th>
                <th className="py-2.5 px-3">Nepal 24-hr NAAQS</th>
                <th className="py-2.5 px-3">WHO Guideline</th>
                <th className="py-2.5 px-3">Calculated Sub-AQI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {POLLUTANTS.map((p) => {
                const item = pollutantsData[p.id];
                const val = item?.value;
                const isAvail = val !== null && val !== undefined;

                return (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-900 dark:text-slate-100">
                      {p.name}
                      <span className="text-[10px] text-slate-400 font-normal ml-1">({p.fullName})</span>
                    </td>
                    <td className="py-2.5 px-3 tabular-nums font-bold">
                      {isAvail ? `${val} ${item.unit}` : 'Unavailable'}
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className={`inline-flex items-center gap-1 text-[11px] ${
                        item?.sourceType === 'measured'
                          ? 'text-emerald-500'
                          : item?.sourceType === 'modeled'
                          ? 'text-cyan-500'
                          : 'text-slate-400'
                      }`}>
                        <Radio className="w-3 h-3" />
                        {item?.sourceType === 'measured' ? 'Ground Sensor' : item?.sourceType === 'modeled' ? 'Modeled Estimate' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 tabular-nums">
                      {p.standardLimit} {p.unit}
                    </td>
                    <td className="py-2.5 px-3 tabular-nums text-emerald-500">
                      {p.whoLimit} {p.unit}
                    </td>
                    <td className="py-2.5 px-3 tabular-nums">
                      {item?.subIndex?.aqi ?? '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
