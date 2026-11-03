import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useLocation } from '../../hooks/useLocation';
import { useTheme } from '../../hooks/useTheme';
import { NEPAL_LOCATIONS } from '../../constants/locations';
import { storageService } from '../../services/storageService';
import { Check, Key, ExternalLink, RotateCcw, Trash2, Sliders, ShieldCheck } from 'lucide-react';

export function PreferencesModal({ isOpen, onClose }) {
  const {
    selectedLocation,
    setSelectedLocation,
    openAqKey,
    setOpenAqKey,
    locateUser,
    refreshEnvironmentalData
  } = useLocation();

  const { theme, setTheme } = useTheme();

  const [dashboardSettings, setDashboardSettings] = useState(() => storageService.getDashboardSettings());
  const [apiKeyInput, setApiKeyInput] = useState(openAqKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locatingMsg, setLocatingMsg] = useState('');

  const handleSave = () => {
    setOpenAqKey(apiKeyInput);
    storageService.setDashboardSettings(dashboardSettings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleResetAll = () => {
    if (window.confirm('Reset all ClearSky preferences, alert thresholds, and cached keys to factory defaults?')) {
      storageService.resetAllSettings();
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 700);
    }
  };

  const handleLocate = async () => {
    setLocating(true);
    setLocatingMsg('');
    const res = await locateUser();
    setLocating(false);
    if (res.success) {
      setLocatingMsg(`Detected: ${res.location.name} (${res.location.distanceKm} km away)`);
    } else {
      setLocatingMsg(res.error || 'Failed to detect location.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Preferences & Environment"
      subtitle="Client-side configuration stored locally on your device"
      maxWidth="max-w-md"
    >
      <div className="space-y-5 text-xs text-slate-600 dark:text-slate-300">
        {/* Default City */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-medium text-slate-800 dark:text-slate-200">
              Default Nepal Municipality
            </label>
            <button
              type="button"
              onClick={handleLocate}
              disabled={locating}
              className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
            >
              {locating ? 'Detecting...' : 'Detect Nearest GPS'}
            </button>
          </div>
          <select
            value={selectedLocation.id}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            {NEPAL_LOCATIONS.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.nepaliName}) — {loc.province}
              </option>
            ))}
          </select>
          {locatingMsg && (
            <p className="text-[11px] text-emerald-500 mt-1">{locatingMsg}</p>
          )}
        </div>

        {/* Theme Preference */}
        <div>
          <label className="block font-medium text-slate-800 dark:text-slate-200 mb-1.5">
            Interface Theme
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>Dark Navy (Default)</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                theme === 'light'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>Light High-Contrast</span>
            </button>
          </div>
        </div>

        {/* Dashboard Settings: Auto-refresh & Unit */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
          <div>
            <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
              Data Refresh Cadence
            </label>
            <select
              value={dashboardSettings.autoRefreshMinutes}
              onChange={(e) => setDashboardSettings(prev => ({ ...prev, autoRefreshMinutes: Number(e.target.value) }))}
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 text-xs"
            >
              <option value={5}>Every 5 minutes</option>
              <option value={15}>Every 15 minutes</option>
              <option value={30}>Every 30 minutes</option>
              <option value={0}>Manual refresh only</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
              Temperature Unit
            </label>
            <select
              value={dashboardSettings.tempUnit}
              onChange={(e) => setDashboardSettings(prev => ({ ...prev, tempUnit: e.target.value }))}
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 text-xs"
            >
              <option value="C">Celsius (°C)</option>
              <option value="F">Fahrenheit (°F)</option>
            </select>
          </div>
        </div>

        {/* OpenAQ API Key Configuration */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>OpenAQ API Key (Optional)</span>
            </label>
            <a
              href="https://explore.openaq.org/register"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-0.5"
            >
              <span>Register Free</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="Paste OpenAQ v3 key..."
            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Key is stored exclusively in your browser's localStorage. ClearSky sends it strictly to OpenAQ v3 for ground monitor telemetry.
          </p>
        </div>

        {/* Reset Actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetAll}
            className="text-[11px] text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Factory Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} icon={savedSuccess ? Check : null}>
              {savedSuccess ? 'Saved' : 'Save Preferences'}
            </Button>
          </div>
        </div>

        {resetSuccess && (
          <div className="p-2 text-center text-xs text-rose-500 font-semibold">
            All settings reset. Reloading application...
          </div>
        )}
      </div>
    </Modal>
  );
}
