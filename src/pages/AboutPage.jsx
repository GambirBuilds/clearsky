import React from 'react';
import { Cloud, Target, Eye, ShieldCheck, Radio, CheckCircle2, Server, Key, Database, Cpu } from 'lucide-react';
import { runAqiValidationTests } from '../utils/aqiCalculator';

export function AboutPage() {
  const testResults = runAqiValidationTests();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Hero */}
      <div className="p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Cloud className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              ClearSky Environmental Intelligence
            </h1>
            <p className="text-xs text-emerald-400 font-semibold tracking-wider uppercase mt-0.5">
              Breathe Smarter. Live Better.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          ClearSky is a production-grade, Nepal-first atmospheric intelligence web platform designed to democratize air-quality awareness, explain Himalayan basin meteorology, and empower citizen health decisions with uncompromising scientific fidelity.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-500">
            <Target className="w-5 h-5" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Project Mission
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            To provide every resident, commuter, athlete, and public health official across Nepal with hyper-localized, actionable air quality data, translating complex aerosol physics into understandable everyday precautions.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-cyan-500">
            <Eye className="w-5 h-5" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Project Vision
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            A Nepal where environmental transparency drives policy decisions, school schedules, outdoor activity planning, and regional cooperation to dismantle the winter air pollution crisis across the Himalayas.
          </p>
        </div>
      </div>

      {/* Part 2 Live Data Architecture & Endpoints */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Live Providers & Implemented API Endpoints
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Open-Meteo */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">Open-Meteo Air Quality</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">Active · Free</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Provides modeled current and hourly PM2.5, PM10, NO2, SO2, CO, and Ozone concentrations, 7-day historical reanalysis, and 48-hour forward forecasts.
            </p>
            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 p-2 rounded truncate">
              air-quality-api.open-meteo.com/v1/air-quality
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              <strong>Auth: </strong> None required. High reliability, global coverage.
            </div>
          </div>

          {/* OpenAQ */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">OpenAQ API v3</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 font-semibold">Ground Monitors</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Provides physical ground-level monitoring station coordinates, instrument descriptions, and sensor observations in Nepal.
            </p>
            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 p-2 rounded truncate">
              api.openaq.org/v3/locations?iso=np
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              <strong>Auth: </strong> X-API-Key header (free at explore.openaq.org).
            </div>
          </div>
        </div>
      </div>

      {/* EPA AQI Verification Test Suite */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              EPA AQI Calculation Test Suite Verification
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md">
            {testResults.allPassed ? 'All 6 Tests Passed (100%)' : 'Validation Error'}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          ClearSky implements official US-EPA Technical Breakpoints (EPA-454/B-18-007) with precise truncation rules. Raw PM2.5 concentrations are never confused with index values.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
          {testResults.results.map((t, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 uppercase">{t.pollutant}</span> {t.conc}
              </div>
              <div className="flex items-center gap-1 text-emerald-500 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AQI {t.actual}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Known Data Coverage Limitations */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          <span>Known Environmental Data Coverage Limitations</span>
        </h3>
        <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-2">
          <p>
            • <strong>Ground Sensor Network Density: </strong> Nepal's ground monitoring infrastructure (DHM and international monitors) is primarily concentrated in the Kathmandu Valley and Pokhara. In outer Terai and mountain districts, modeled atmospheric data fills essential observation gaps.
          </p>
          <p>
            • <strong>OpenAQ v3 Authentication: </strong> OpenAQ API v3 enforces personal API keys for ground stations. ClearSky allows users to paste their key in Preferences while maintaining immediate out-of-the-box modeled coverage via Open-Meteo.
          </p>
          <p>
            • <strong>Data Classification Integrity: </strong> Every reading clearly indicates whether it is measured from a physical sensor or derived from an atmospheric dispersion model.
          </p>
        </div>
      </div>
    </div>
  );
}
