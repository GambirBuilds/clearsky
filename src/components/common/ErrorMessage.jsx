import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

/**
 * Reusable error message alert card
 */
export function ErrorMessage({
  title = 'Sensor Telemetry Offline',
  message,
  onRetry,
  className = ''
}) {
  return (
    <div className={`p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
            {title}
          </h4>
          <p className="text-xs text-rose-700 dark:text-rose-400 mt-1 leading-relaxed">
            {message}
          </p>
          {onRetry && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                icon={RefreshCw}
                onClick={onRetry}
                className="border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900/40"
              >
                Retry Probe
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
