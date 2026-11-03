import React, { useState } from 'react';
import { useAlerts } from '../hooks/useAlerts';
import { useLocation } from '../hooks/useLocation';
import {
  BellRing,
  ShieldAlert,
  Smartphone,
  Moon,
  Check,
  Zap,
  Globe,
  Radio,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/common/Button';

export function AlertsPage() {
  const {
    preferences,
    updatePreferences,
    dispatchAlert,
    permissionStatus,
    requestNotificationPermission
  } = useAlerts();

  const { locations } = useLocation();

  const [alertsEnabled, setAlertsEnabled] = useState(preferences.alertsEnabled);
  const [threshold, setThreshold] = useState(preferences.aqiThreshold);
  const [enableBrowser, setEnableBrowser] = useState(preferences.enableBrowserNotifications);
  const [enableInApp, setEnableInApp] = useState(preferences.enableInAppAlerts);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(preferences.quietHoursEnabled);
  const [quietHoursStart, setQuietHoursStart] = useState(preferences.quietHoursStart || '22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState(preferences.quietHoursEnd || '06:00');
  const [subscribedLocations, setSubscribedLocations] = useState(preferences.subscribedLocations);
  const [saveToast, setSaveToast] = useState(false);
  const [permissionMsg, setPermissionMsg] = useState('');

  const toggleLocation = (id) => {
    if (subscribedLocations.includes(id)) {
      if (subscribedLocations.length > 1) {
        setSubscribedLocations(subscribedLocations.filter(locId => locId !== id));
      }
    } else {
      setSubscribedLocations([...subscribedLocations, id]);
    }
  };

  const handleRequestPermission = async () => {
    setPermissionMsg('Requesting browser permission...');
    const res = await requestNotificationPermission();
    if (res.success) {
      setEnableBrowser(true);
      setPermissionMsg('Browser notifications granted successfully!');
    } else {
      setEnableBrowser(false);
      setPermissionMsg(res.reason || 'Browser notification permission was not granted.');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updatePreferences({
      alertsEnabled,
      aqiThreshold: threshold,
      enableBrowserNotifications: enableBrowser,
      enableInAppAlerts: enableInApp,
      quietHoursEnabled,
      quietHoursStart,
      quietHoursEnd,
      subscribedLocations
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleTriggerTest = () => {
    dispatchAlert({
      title: 'ClearSky Pollution Alert',
      message: `Atmospheric AQI has breached threshold (${threshold} AQI) in ${subscribedLocations.join(', ')}. Action recommended: limit strenuous outdoor exertion.`,
      type: 'warning',
      aqi: threshold + 15,
      locationName: subscribedLocations[0] || 'Kathmandu'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-emerald-500" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Smart Pollution Alert Preferences
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure automated threshold monitors, active browser alerts, and quiet hours
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Zap}
          onClick={handleTriggerTest}
        >
          Dispatch Test Alert
        </Button>
      </div>

      {/* Active Monitoring Status Banner */}
      <div className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${
        alertsEnabled
          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
          : 'bg-slate-100 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
      }`}>
        <div className="flex items-center gap-2.5">
          <Radio className={`w-4 h-4 shrink-0 ${alertsEnabled ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
          <div>
            <span className="font-bold">
              {alertsEnabled ? 'Active Atmospheric Sentinel Enabled' : 'Alert Monitoring Paused'}
            </span>
            <div className="text-[11px] opacity-80 mt-0.5">
              {alertsEnabled
                ? `Monitoring ${subscribedLocations.length} municipality target(s) for AQI > ${threshold}.`
                : 'Turn on alert monitoring below to receive notifications.'}
            </div>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={alertsEnabled}
            onChange={(e) => setAlertsEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* AQI Trigger Threshold Slider */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Trigger AQI Threshold</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Generate alerts when ambient AQI exceeds this concentration index
              </p>
            </div>
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
              {threshold} AQI
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="50"
              max="300"
              step="5"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>50 (Good)</span>
              <span>100 (Moderate)</span>
              <span>150 (Sensitive)</span>
              <span>200 (Unhealthy)</span>
              <span>300 (Hazardous)</span>
            </div>
          </div>
        </div>

        {/* Subscribed Municipalities */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Subscribed Nepal Municipalities
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select which regional airsheds trigger automated notifications
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {locations.map((loc) => {
              const isChecked = subscribedLocations.includes(loc.id);
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => toggleLocation(loc.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span className="truncate">{loc.name}</span>
                  {isChecked && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Browser & In-App Notification Channels */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Notification Delivery Channels
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Active channel settings for live threshold alerts
            </p>
          </div>

          <div className="space-y-3">
            {/* Native Browser Notification Channel */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Browser Web Notifications (Desktop & Mobile)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Native system toasts when threshold is breached while app is open
                    </div>
                  </div>
                </div>

                {permissionStatus === 'granted' ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Granted
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRequestPermission}
                  >
                    Enable Permission
                  </Button>
                )}
              </div>

              {permissionMsg && (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                  {permissionMsg}
                </div>
              )}

              {/* No-backend Architecture Notice */}
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Client-Side Architecture: </strong> As ClearSky operates securely client-side with no central backend server, browser notifications fire when the tab/app is active. Notifications are not sent when your browser is completely closed.
                </span>
              </div>
            </div>

            {/* In-App Notifications */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    In-App Notification Center
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Badges and advisory notices inside the ClearSky header bell menu
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={enableInApp}
                onChange={(e) => setEnableInApp(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-cyan-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Quiet Hours (Nocturnal Silence)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Silence non-hazardous notifications between configured night hours
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={quietHoursEnabled}
              onChange={(e) => setQuietHoursEnabled(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {quietHoursEnabled && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Silence Start Time</label>
                <input
                  type="time"
                  value={quietHoursStart}
                  onChange={(e) => setQuietHoursStart(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Silence End Time</label>
                <input
                  type="time"
                  value={quietHoursEnd}
                  onChange={(e) => setQuietHoursEnd(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit & Reset Bar */}
        <div className="flex items-center justify-between pt-2">
          {saveToast ? (
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Alert preferences saved to localStorage!
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              Preferences persist across sessions
            </span>
          )}
          <Button type="submit" variant="primary" size="md">
            Save Alert Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
