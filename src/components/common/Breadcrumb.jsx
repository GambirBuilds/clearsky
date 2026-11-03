import React from 'react';
import { Link, useLocation as useRouterLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { NAV_ITEMS } from '../../constants/navItems';

/**
 * Contextual breadcrumb navigation
 */
export function Breadcrumb({ customSegment }) {
  const routerLoc = useRouterLocation();
  const currentNav = NAV_ITEMS.find(item => item.path === routerLoc.pathname) || NAV_ITEMS[0];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
      <Link to="/" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
        ClearSky
      </Link>
      <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600" />
      <span className="font-medium text-slate-800 dark:text-slate-200">
        {customSegment || currentNav.label}
      </span>
    </nav>
  );
}
