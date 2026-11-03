import React from 'react';
import { Radio, ArrowRight, Key, ExternalLink, ShieldAlert } from 'lucide-react';
import { useLocation } from '../../hooks/useLocation';
import { StationCard } from '../cards/StationCard';
import { Link } from 'react-router-dom';

export function NearbyStationsSection() {
  const { selectedLocation, environmentalData } = useLocation();

  const openAqStatus = environmentalData?.openAqStatus;
  const groundStations = environmentalData?.groundStations || [];

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-500" />
            <span>Regional Monitoring Stations</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active ambient air monitoring stations in {selectedLocation.name}
          </p>
        </div>
        <Link
          to="/map"
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <span>View on Geospatial Map</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* OpenAQ Provider Status Banner */}
      {openAqStatus?.requiresKey && (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-600 dark:text-slate-300">
              OpenAQ v3 ground sensors require an API key. You can add your free key in Settings to unlock physical sensor streams.
            </span>
          </div>
          <a
            href="https://explore.openaq.org/register"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0 inline-flex items-center gap-1"
          >
            <span>Register Free</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Stations list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {groundStations.length > 0 ? (
          groundStations.map((station) => (
            <StationCard
              key={station.id}
              station={{
                name: station.name,
                type: station.isGroundSensor ? 'Physical Ground Sensor (OpenAQ)' : 'Reference Station',
                status: 'Real Sensor Active'
              }}
              locationName={selectedLocation.name}
            />
          ))
        ) : (
          selectedLocation.monitoringStations.map((station) => (
            <StationCard
              key={station.id}
              station={{
                name: station.name,
                type: station.type,
                status: 'Open-Meteo Grid Sync'
              }}
              locationName={selectedLocation.name}
            />
          ))
        )}
      </div>
    </div>
  );
}
