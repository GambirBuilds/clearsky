/**
 * Formatting utilities for dates, numbers, and geolocation in Nepal context
 */

export function formatDateTime(date = new Date()) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kathmandu'
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

export function formatCoordinates(lat, lng) {
  if (lat === undefined || lng === undefined) return 'N/A';
  const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lngStr = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
  return `${latStr}, ${lngStr}`;
}

export function formatNumber(val, decimals = 1) {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return Number(val).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}
