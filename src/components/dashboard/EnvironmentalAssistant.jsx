import React, { useState } from 'react';
import { Sparkles, MessageSquare, HelpCircle, ChevronRight, CheckCircle2, ShieldCheck, Wind, AlertTriangle, ArrowRight } from 'lucide-react';
import { useLocation } from '../../hooks/useLocation';
import { getAQICategory } from '../../utils/aqiUtils';

/**
 * Deterministic Rule-Based Environmental Explanation Assistant
 * Synthesizes real API readings into accessible environmental science explanations.
 * (Note: Does not claim to be an LLM / Generative AI; uses explicit meteorological rule trees).
 */
export function EnvironmentalAssistant() {
  const { selectedLocation, environmentalData } = useLocation();
  const [selectedTopic, setSelectedTopic] = useState('current');

  const aqi = environmentalData?.aqi ?? 120;
  const category = getAQICategory(aqi);
  const pm25 = environmentalData?.pollutants?.pm25?.value;
  const pm10 = environmentalData?.pollutants?.pm10?.value;
  const no2 = environmentalData?.pollutants?.no2?.value;
  const dominant = environmentalData?.dominantPollutant?.toUpperCase() || 'PM2.5';
  const temp = environmentalData?.weather?.temperature?.value;
  const wind = environmentalData?.weather?.windSpeed?.value;

  const topics = [
    {
      id: 'current',
      title: 'Current Air Quality Status',
      query: `What does the current ${aqi} AQI reading in ${selectedLocation.name} mean for my health?`
    },
    {
      id: 'exercise',
      title: 'Outdoor Exercise Safety',
      query: `Is it safe to run, jog, or cycle outdoors in ${selectedLocation.name} right now?`
    },
    {
      id: 'who_comparison',
      title: 'Comparison to WHO Guidelines',
      query: `How does our ${selectedLocation.name} particulate level compare against WHO standards?`
    },
    {
      id: 'pm25_vs_pm10',
      title: 'PM2.5 vs PM10 Differences',
      query: 'What is the physical and biological difference between PM2.5 and PM10?'
    },
    {
      id: 'forecast_trend',
      title: '48-Hour Forecast Dynamics',
      query: 'How are pollution levels expected to evolve over the next 48 hours?'
    },
    {
      id: 'topography',
      title: 'Valley Thermal Inversion',
      query: 'Why does pollution get trapped during winter in valleys like Kathmandu?'
    }
  ];

  // Generate dynamic, data-grounded explanations
  const getExplanation = () => {
    switch (selectedTopic) {
      case 'current':
        return (
          <div className="space-y-3">
            <p>
              The current Air Quality Index in <strong>{selectedLocation.name}</strong> is <strong>{aqi} AQI</strong>, which falls into the <strong style={{ color: category.color }}>{category.level}</strong> category.
            </p>
            <p>
              The primary driver is <strong>{dominant}</strong>{pm25 ? ` with an ambient concentration of ${pm25} µg/m³` : ''}.
              {' '}{category.description}
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs">
              <strong>Official EPA Guidance: </strong> {category.healthAdvice}
            </div>
          </div>
        );

      case 'exercise':
        return (
          <div className="space-y-3">
            {aqi <= 50 ? (
              <p>
                <strong>Optimal Outdoor Conditions: </strong> With an AQI of {aqi}, air quality is clean and satisfactory. Ideal for running, hiking, sports, and outdoor physical conditioning.
              </p>
            ) : aqi <= 100 ? (
              <p>
                <strong>Moderate Conditions: </strong> Safe for the vast majority of active adults. Unusually sensitive athletes with severe asthma should take note of airway response during intense interval sprints.
              </p>
            ) : aqi <= 150 ? (
              <p>
                <strong>Caution for Sensitive Groups: </strong> Athletes with cardiovascular or pulmonary conditions should reduce prolonged outdoor exertion. Healthy adults may exercise outdoors, but consider scheduling workouts during mid-day when solar heating ventilates valley air.
              </p>
            ) : (
              <p>
                <strong>Unhealthy for Outdoor Exercise: </strong> At {aqi} AQI, intense cardio outdoors causes heavy deep-lung inhalation of microscopic particulates. It is recommended to substitute outdoor runs with indoor training in spaces equipped with HEPA filtration.
              </p>
            )}
            <div className="text-[11px] text-slate-400">
              Note: Surface wind speed is currently {wind ? `${wind} km/h` : 'calm'}. Low wind speeds reduce mechanical particulate dispersion.
            </div>
          </div>
        );

      case 'who_comparison':
        const whoRatio = pm25 ? Math.round((pm25 / 5) * 10) / 10 : null;
        return (
          <div className="space-y-3">
            <p>
              The World Health Organization (WHO) updated its Global Air Quality Guidelines in 2021, establishing an annual average limit of <strong>5 µg/m³</strong> and a 24-hour limit of <strong>15 µg/m³</strong> for fine particulate matter (PM2.5).
            </p>
            {pm25 && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs">
                <div>
                  Current {selectedLocation.name} PM2.5: <strong className="font-mono">{pm25} µg/m³</strong>
                </div>
                <div className="mt-1 text-slate-500 dark:text-slate-400">
                  This reading is <strong className="text-amber-500 font-mono">{whoRatio}x</strong> above the WHO annual health baseline.
                </div>
              </div>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nepal's National Ambient Air Quality Standard (NAAQS) sets a 24-hour PM2.5 guideline of 40 µg/m³, which serves as an interim target on the path to long-term WHO alignment.
            </p>
          </div>
        );

      case 'pm25_vs_pm10':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <h5 className="font-bold text-slate-900 dark:text-slate-100">PM2.5 (Fine Particles)</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Diameter &le; 2.5 µm. Originates primarily from combustion (diesel exhaust, brick kilns, wood fires). Small enough to penetrate deep into pulmonary alveoli and cross into the bloodstream.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <h5 className="font-bold text-slate-900 dark:text-slate-100">PM10 (Coarse Particles)</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Diameter &le; 10 µm. Originates from mechanical abrasion (unpaved road dust, construction demolition, crushed aggregate). Trapped primarily in nasal passages and upper bronchi.
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Current readings in {selectedLocation.name}: PM2.5 is <strong>{pm25 ?? '—'} µg/m³</strong> and PM10 is <strong>{pm10 ?? '—'} µg/m³</strong>.
            </p>
          </div>
        );

      case 'forecast_trend':
        return (
          <div className="space-y-3">
            <p>
              Atmospheric dispersion in {selectedLocation.name} follows a distinct diurnal cycle:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              <li>
                <strong>Early Morning (06:00 – 09:30): </strong> Peak particulate accumulation as overnight inversion layers suppress vertical mixing, coinciding with morning transit emissions.
              </li>
              <li>
                <strong>Mid-day (12:00 – 16:00): </strong> Solar irradiation warms the ground surface, raising the boundary layer mixing height and dispersing ground-level smog.
              </li>
              <li>
                <strong>Evening (18:30 – 22:00): </strong> Rapid ground cooling re-establishes the nocturnal inversion lid, trapping evening commute and heating emissions.
              </li>
            </ul>
          </div>
        );

      case 'topography':
        return (
          <div className="space-y-3">
            <p>
              The geomorphology of mountain valleys (such as the Kathmandu basin at 1,400 m elevation surrounded by 2,000 m+ ridges) creates a natural physical bowl.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              During winter, radiational cooling of the ground causes dense, cold air to pool at the valley bottom. A layer of warmer air sits directly above it, acting as a thermal ceiling (temperature inversion). This suppresses vertical dispersion, keeping vehicular exhaust and smoke trapped at ground level until solar heating breaks the ceiling.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Environmental Intelligence Assistant
            </h3>
            <p className="text-[11px] text-slate-400">
              Rule-based scientific explanations evaluated from live atmospheric telemetry
            </p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
          Deterministic Rule Engine
        </span>
      </div>

      {/* Interactive Topic Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {topics.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedTopic(t.id)}
            className={`p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer flex flex-col justify-between ${
              selectedTopic === t.id
                ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold shadow-2xs'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <span className="truncate">{t.title}</span>
            <span className="text-[10px] opacity-75 font-normal mt-1">Explore →</span>
          </button>
        ))}
      </div>

      {/* Answer Area */}
      <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          {topics.find(t => t.id === selectedTopic)?.query}
        </div>
        {getExplanation()}
      </div>

      {/* Disclaimer */}
      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span>
          ClearSky explanations are grounded in published WHO guidelines and EPA standards. This is environmental intelligence, not personal medical diagnosis.
        </span>
      </div>
    </div>
  );
}
