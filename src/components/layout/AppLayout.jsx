import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav, MobileBottomBar } from './MobileNav';
import { Cloud, ShieldCheck, Heart } from 'lucide-react';

export function AppLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100 antialiased">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-900/40 dark:bg-slate-950">
        <Header onOpenMobileMenu={() => setIsMobileNavOpen(true)} />

        {/* Scrollable Main Content Viewport */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <Outlet />
          </div>

          {/* Quiet Institutional Footer */}
          <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 border-t border-slate-200/40 dark:border-slate-800/60 mt-12 text-xs text-slate-400">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-slate-300">ClearSky Environmental Intelligence</span>
                <span>·</span>
                <span>Nepal Environmental Observatory</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <Link to="/about" className="hover:text-slate-200 transition-colors">About Project</Link>
                <Link to="/education" className="hover:text-slate-200 transition-colors">Air Standards</Link>
                <Link to="/alerts" className="hover:text-slate-200 transition-colors">Alert Preferences</Link>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p>
                Part 1 Foundation Architecture. Real sensor telemetry ingestion is scheduled for Part 2 integration.
              </p>
              <p className="flex items-center gap-1">
                <span>Designed for Nepal public health & clean air stewardship</span>
              </p>
            </div>
          </footer>
        </main>

        {/* Mobile Pinned Bottom Bar */}
        <MobileBottomBar onOpenMore={() => setIsMobileNavOpen(true)} />
      </div>
    </div>
  );
}
