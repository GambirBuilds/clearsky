import React from 'react';
import { WelcomePanel } from '../components/dashboard/WelcomePanel';
import { MainAQIVisualization } from '../components/dashboard/MainAQIVisualization';
import { PollutantCard } from '../components/cards/PollutantCard';
import { WeatherCard } from '../components/cards/WeatherCard';
import { ChartContainer } from '../components/charts/ChartContainer';
import { Trend24hChart } from '../components/charts/Trend24hChart';
import { PollutantTrendChart } from '../components/charts/PollutantTrendChart';
import { NearbyStationsSection } from '../components/dashboard/NearbyStationsSection';
import { AirQualitySummary } from '../components/dashboard/AirQualitySummary';
import { EnvironmentalAssistant } from '../components/dashboard/EnvironmentalAssistant';
import { LocationComparisonPreview } from '../components/dashboard/LocationComparisonPreview';
import { EnvironmentalInfoSection } from '../components/dashboard/EnvironmentalInfoSection';
import { POLLUTANTS } from '../constants/pollutants';
import { useLocation } from '../hooks/useLocation';
import { ErrorMessage } from '../components/common/ErrorMessage';

export function OverviewPage() {
  const { environmentalData, isLoading, error, refreshEnvironmentalData } = useLocation();

  const pollutantsData = environmentalData?.pollutants || {};
  const weatherData = environmentalData?.weather || {};

  return (
    <div className="space-y-6">
      {/* Section A: Welcome Panel */}
      <WelcomePanel />

      {/* Network or Feed Error Notice if applicable */}
      {error && (
        <ErrorMessage
          title="Environmental Feed Notice"
          message={error}
          onRetry={() => refreshEnvironmentalData(true)}
        />
      )}

      {/* Section B: Main AQI Visualization */}
      <MainAQIVisualization />

      {/* Section C: Criteria Pollutant Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Criteria Atmospheric Pollutants
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Continuous monitoring parameters evaluated against Nepal MOFE National Ambient Air Quality Standards
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {POLLUTANTS.map((pollutant) => (
            <PollutantCard
              key={pollutant.id}
              pollutant={pollutant}
              data={pollutantsData[pollutant.id]}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>

      {/* Section D: Meteorological Weather Cards */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Meteorological & Dispersion Conditions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Atmospheric parameters governing vertical mixing and boundary layer entrapment
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <WeatherCard
            type="temperature"
            data={weatherData?.temperature}
            isLoading={isLoading}
          />
          <WeatherCard
            type="humidity"
            data={weatherData?.humidity}
            isLoading={isLoading}
          />
          <WeatherCard
            type="wind_speed"
            data={weatherData?.windSpeed}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Section E: Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="24-Hour Diurnal AQI Trajectory"
          subtitle="Hourly index fluctuation across diurnal valley cycle"
          height="h-72"
        >
          <Trend24hChart
            data={environmentalData?.past24hData}
            isLoading={isLoading}
          />
        </ChartContainer>

        <ChartContainer
          title="Past 7 Days Multi-Pollutant Trend"
          subtitle="Hourly PM2.5, PM10, NO2, and Ozone trajectories"
          height="h-72"
        >
          <PollutantTrendChart
            data={environmentalData?.past7DaysData}
            isLoading={isLoading}
          />
        </ChartContainer>
      </div>

      {/* Environmental Intelligence Assistant (Rule-Based Synthesis) */}
      <EnvironmentalAssistant />

      {/* Section F: Additional Modules */}
      <NearbyStationsSection />
      <AirQualitySummary />
      <LocationComparisonPreview />
      <EnvironmentalInfoSection />
    </div>
  );
}
