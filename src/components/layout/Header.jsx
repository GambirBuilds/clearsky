import React, { useState } from 'react';
import {
  Menu,
  MapPin,
  RefreshCw,
  Bell,
  Sliders,
  ChevronDown,
  Navigation,
  Radio
} from 'lucide-react';
import { useLocation } from '../../hooks/useLocation';
import { useAlerts } from '../../hooks/useAlerts';
import { SearchInput } from '../common/SearchInput';
import { ThemeToggle } from '../common/ThemeToggle';
import { Breadcrumb } from '../common/Breadcrumb';
import { NotificationsDropdown } from './NotificationsDropdown';
import { PreferencesModal } from './PreferencesModal';

export function Header({ onOpenMobileMenu }) {
  const {
    locations,
    selectedLocation,
    setSelectedLocation,
    environmentalData,
    isLoading,
    refreshEnvironmentalData,
    locateUser
  } = useLocation();

  const { unreadCount } = useAlerts();

  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleLocateMe = async () => {
    setIsLocating(true);
    await locateUser();
    setIsLocating(false);
    setIsLocationDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left Zone: Mobile toggle + Breadcrumb / Location Quick Pill */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <Breadcrumb />
          </div>

          {/* Quick Location Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate max-w-[110px] md:max-w-[150px]">
                {selectedLocation.name}
              </span>
              <ChevronDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400 opacity-75" />
            </button>

            {isLocationDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl py-1 z-50">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleLocateMe}
                    disabled={isLocating}
                    className="w-full py-1.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>{isLocating ? 'Detecting Nearest City...' : 'Find Nearest Nepal City'}</span>
                  </button>
                </div>

                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  Select Nepal Municipality
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {locations.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => {
                        setSelectedLocation(loc);
                        setIsLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        loc.id === selectedLocation.id
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div>{loc.name}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{loc.province}</div>
                      </div>
                      <span className="text-[11px] text-slate-400 tabular-nums">{loc.elevation}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Zone: Search bar (desktop/tablet) */}
        <div className="hidden md:block flex-1 max-w-md mx-2">
          <SearchInput />
        </div>

        {/* Right Zone: Controls & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Data Freshness Tag */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px]">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span className="text-slate-500 dark:text-slate-400">Feed:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {environmentalData?.dataClassificationLabel || 'Open-Meteo & OpenAQ'}
            </span>
          </div>

          {/* Refresh Station Probe Button */}
          <button
            type="button"
            onClick={() => refreshEnvironmentalData(true)}
            disabled={isLoading}
            aria-label="Refresh environmental feeds"
            title="Fetch latest atmospheric and station data"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-500' : ''}`} />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notification Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              aria-label="View notifications"
              title="Atmospheric alerts and notifications"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>
            <NotificationsDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          {/* Preferences / Profile Button */}
          <button
            type="button"
            onClick={() => setIsPrefsOpen(true)}
            aria-label="ClearSky Settings and Preferences"
            title="Configure settings and preferences"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Preferences Modal */}
      <PreferencesModal isOpen={isPrefsOpen} onClose={() => setIsPrefsOpen(false)} />
    </>
  );
}
