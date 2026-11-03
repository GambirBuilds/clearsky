import { AQI_CATEGORIES } from '../constants/aqiCategories';

/**
 * Returns the matching AQI category object based on numerical value
 * @param {number|null} aqi - Numerical AQI (0-500)
 */
export function getAQICategory(aqi) {
  if (aqi === null || aqi === undefined || isNaN(aqi)) {
    return {
      range: [0, 0],
      level: 'Awaiting Feed',
      nepaliLevel: 'डाटा संकलन हुँदै',
      color: '#64748b', // Slate
      bgColor: 'rgba(100, 116, 139, 0.1)',
      borderColor: 'rgba(100, 116, 139, 0.3)',
      textColor: 'text-slate-400',
      description: 'Sensor link currently awaiting live telemetry in Part 1.',
      healthAdvice: 'Please check back once station feeds are integrated in Part 2.',
      sensitiveGroups: 'Pending station verification.'
    };
  }

  const found = AQI_CATEGORIES.find(cat => aqi >= cat.range[0] && aqi <= cat.range[1]);
  return found || AQI_CATEGORIES[AQI_CATEGORIES.length - 1];
}

/**
 * Get AQI color token or fallback
 */
export function getAQIColor(aqi) {
  return getAQICategory(aqi).color;
}

/**
 * Format category badge classes safely
 */
export function getAQIBadgeStyle(aqi) {
  const cat = getAQICategory(aqi);
  return {
    color: cat.color,
    backgroundColor: cat.bgColor,
    borderColor: cat.borderColor
  };
}
