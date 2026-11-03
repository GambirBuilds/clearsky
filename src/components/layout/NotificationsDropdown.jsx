import React, { useRef, useEffect } from 'react';
import { Bell, Check, Trash2, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { useAlerts } from '../../hooks/useAlerts';
import { Link } from 'react-router-dom';

export function NotificationsDropdown({ isOpen, onClose }) {
  const { notifications, markAsRead, markAllAsRead, clearNotifications, unreadCount } = useAlerts();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-80 md:w-96 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-500" />
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Atmospheric Advisories
          </h4>
          {unreadCount > 0 && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-slate-500 hover:text-emerald-500 transition-colors cursor-pointer"
            >
              Mark read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
              title="Clear all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-3 text-xs transition-colors cursor-pointer ${
                n.read
                  ? 'opacity-70 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  : 'bg-emerald-50/30 dark:bg-emerald-950/20 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {n.type === 'warning' ? (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {n.title}
                    </p>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No active air quality advisories.
          </div>
        )}
      </div>

      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 text-center">
        <Link
          to="/alerts"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <span>Configure Notification Thresholds</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
