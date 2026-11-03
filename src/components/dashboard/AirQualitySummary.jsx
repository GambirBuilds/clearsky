import React from 'react';
import { Wind, ShieldAlert, HeartPulse, ShieldCheck, AlertCircle } from 'lucide-react';
import { useLocation } from '../../hooks/useLocation';
import { getAQICategory } from '../../utils/aqiUtils';

export function AirQualitySummary() {
  const { selectedLocation, environmentalData, isLoading } = useLocation();

  if (isLoading || !environmentalData) {
    return null;
  }

  const { aqi, pollutants, dominantPollutant, dataClassificationLabel } = environmentalData;
  const category = getAQICategory(aqi);

  // Dynamic rule-based guidance derived directly from live environmental intelligence
  let exerciseAdvice = 'Conditions are favorable for outdoor cardiovascular exercise.';
  let ventilationAdvice = 'Outdoor air is fresh; open windows for clean indoor air exchange.';
  let ppeAdvice = 'Masks are not required for general population outdoors.';

  if (aqi > 200) {
    exerciseAdvice = 'Avoid all outdoor athletics and physical exertion. Exercise indoors with active air filtration.';
    ventilationAdvice = 'Keep doors and windows tightly closed. Run HEPA air purifiers continuously.';
    ppeAdvice = 'Certified N95 / FFP2 respirators with tight facial seal are strongly advised if stepping outdoors.';
  } else if (aqi > 150) {
    exerciseAdvice = 'Avoid prolonged or strenuous outdoor exertion. Move workouts indoors.';
    ventilationAdvice = 'Keep street-facing windows shut during morning traffic and evening stagnation hours.';
    ppeAdvice = 'Wear an N95 mask during outdoor commutes, especially along unpaved or heavy-traffic corridors.';
  } else if (aqi > 100) {
    exerciseAdvice = 'Sensitive individuals (children, asthmatics, elderly) should reduce heavy outdoor exertion.';
    ventilationAdvice = 'Ventilate living spaces primarily during mid-day when valley winds flush out pollutants.';
    ppeAdvice = 'Sensitive groups should keep a well-fitted mask on hand when traveling through busy junctions.';
  } else if (aqi > 50) {
    exerciseAdvice = 'Generally acceptable for outdoor activities; unusually sensitive people should take note.';
    ventilationAdvice = 'Safe for routine home ventilation.';
    ppeAdvice = 'No mask requirement for general public.';
  }

  const guidanceItems = [
    {
      title: 'Outdoor Physical Exercise',
      recommendation: exerciseAdvice,
      icon: HeartPulse,
      status: aqi > 150 ? 'danger' : aqi > 100 ? 'caution' : 'favorable'
    },
    {
      title: 'Residential Ventilation',
      recommendation: ventilationAdvice,
      icon: Wind,
      status: aqi > 150 ? 'danger' : aqi > 100 ? 'caution' : 'favorable'
    },
    {
      title: 'Personal Protection (PPE)',
      recommendation: ppeAdvice,
      icon: ShieldAlert,
      status: aqi > 150 ? 'danger' : aqi > 100 ? 'caution' : 'favorable'
    }
  ];

  const pm25Val = pollutants?.pm25?.value;

  return (
    <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Atmospheric Health & Behavior Guidance
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Rule-based public health guidance evaluated for {selectedLocation.name} (AQI: {aqi ?? '—'})
          </p>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Category: <strong style={{ color: category.color }}>{category.level}</strong></span>
        </div>
      </div>

      {/* Atmospheric Context Summary Callout */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <strong className="text-slate-800 dark:text-slate-200 font-semibold">Scientific Overview: </strong>
        {dominantPollutant?.toUpperCase() || 'PM2.5'} is currently the primary determinant of air quality in {selectedLocation.name}
        {pm25Val ? ` with an ambient concentration of ${pm25Val} µg/m³` : ''}.
        {' '}{category.description}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {guidanceItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${
                  item.status === 'danger'
                    ? 'bg-rose-500/10 text-rose-500'
                    : item.status === 'caution'
                    ? 'bg-amber-500/10 text-amber-500'
                    : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {item.title}
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.recommendation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
