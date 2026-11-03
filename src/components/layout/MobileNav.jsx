import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, Cloud, LayoutDashboard, Activity, MapPin, BarChart3, Menu } from 'lucide-react';
import { NAV_ITEMS } from '../../constants/navItems';

export function MobileNav({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[85vw] h-full bg-slate-900 border-r border-slate-800 flex flex-col z-10 animate-in slide-in-from-left duration-200">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Cloud className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="font-bold text-sm text-white">ClearSky</span>
              <p className="text-[10px] text-slate-400">Nepal Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

/**
 * Pinned bottom navigation bar for quick mobile access
 */
export function MobileBottomBar({ onOpenMore }) {
  const primaryTabs = [
    { path: '/', label: 'Overview', icon: LayoutDashboard },
    { path: '/live', label: 'Live', icon: Activity },
    { path: '/map', label: 'Map', icon: MapPin },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <nav aria-label="Mobile Navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1 flex items-center justify-around">
      {primaryTabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`
            }
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span>{tab.label}</span>
          </NavLink>
        );
      })}
      <button
        type="button"
        onClick={onOpenMore}
        className="flex flex-col items-center py-1 px-3 text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
      >
        <Menu className="w-4 h-4 mb-0.5" />
        <span>Menu</span>
      </button>
    </nav>
  );
}
