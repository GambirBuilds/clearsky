import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';

const AlertsContext = createContext(null);

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'ClearSky Active Monitoring Operational',
    message: 'Atmospheric threshold monitoring is active for your subscribed Nepal municipalities.',
    time: 'System Ready',
    type: 'info',
    read: false
  }
];

export function AlertsProvider({ children }) {
  const [preferences, setPreferencesState] = useState(() => storageService.getAlertPreferences());
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [permissionStatus, setPermissionStatus] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  // Check for permission update
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const updatePreferences = (newPrefs) => {
    setPreferencesState(prev => {
      const updated = { ...prev, ...newPrefs };
      storageService.setAlertPreferences(updated);
      return updated;
    });
  };

  /**
   * Request native browser Web Notification permission upon explicit user action
   */
  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return { success: false, reason: 'Notifications not supported by this browser.' };
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      if (permission === 'granted') {
        updatePreferences({ enableBrowserNotifications: true });
        return { success: true, permission };
      } else {
        updatePreferences({ enableBrowserNotifications: false });
        return { success: false, permission };
      }
    } catch (e) {
      console.error('Error requesting notification permission:', e);
      return { success: false, error: e.message };
    }
  };

  /**
   * Dispatch an alert notification (both in-app and browser if permitted)
   */
  const dispatchAlert = useCallback(({ title, message, type = 'warning', aqi = null, locationName = '' }) => {
    if (!preferences.alertsEnabled) return;

    // Check quiet hours
    if (preferences.quietHoursEnabled) {
      const now = new Date();
      const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const { quietHoursStart, quietHoursEnd } = preferences;

      const isQuietTime = quietHoursStart > quietHoursEnd
        ? (currentHHMM >= quietHoursStart || currentHHMM <= quietHoursEnd)
        : (currentHHMM >= quietHoursStart && currentHHMM <= quietHoursEnd);

      if (isQuietTime && aqi !== null && aqi < 250) {
        // Suppress non-hazardous alerts during quiet hours
        return;
      }
    }

    // 1. Add to in-app notification list
    const newNotif = {
      id: `alert-${Date.now()}`,
      title,
      message,
      type,
      time: 'Just now',
      read: false,
      aqi,
      locationName
    };

    setNotifications(prev => [newNotif, ...prev.slice(0, 24)]);

    // 2. Trigger browser notification if permitted and tab is open
    if (
      preferences.enableBrowserNotifications &&
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
          tag: `clearsky-${locationName || 'general'}`
        });
      } catch (e) {
        console.warn('Browser notification dispatch error:', e);
      }
    }
  }, [preferences]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AlertsContext.Provider
      value={{
        preferences,
        updatePreferences,
        notifications,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        dispatchAlert,
        unreadCount,
        permissionStatus,
        requestNotificationPermission
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
}
