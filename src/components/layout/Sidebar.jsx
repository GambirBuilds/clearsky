import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/navItems';
import { Cloud, Radio, ShieldCheck } from 'lucide-react';
import { useLocation } from '../../hooks/useLocation';

export function Sidebar({ className = '', onNavClick }) {
  const { selectedLocation } = useLocation();

  return (
    <aside className={`w-64 h-full flex flex-col bg-slate-900/95 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/80 text-slate-300 select-none ${className}`}>
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3">
        {/* Minimal cloud with atmospheric indicator */}
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner">
          <Cloud className="w-5 h-5 text-emerald-400" />
          <span className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-white">
              ClearSky
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              Nepal
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            Breathe Smarter. Live Better.
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main Navigation">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Environmental Intelligence
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onNavClick}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 shadow-xs'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <div className="flex-1 truncate">
                    <div className="truncate">{item.label}</div>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Municipal Context Footer */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-900/60 dark:bg-slate-950/60">
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Selected City</span>
            <span className="text-emerald-400 font-semibold">{selectedLocation.name}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Elevation</span>
            <span className="tabular-nums text-slate-300">{selectedLocation.elevation}</span>
          </div>
          <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-cyan-400" />
              Part 1 Architecture
            </span>
            <span className="text-slate-400">Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
