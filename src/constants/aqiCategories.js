/**
 * Air Quality Index (AQI) categories and scientific thresholds
 * Following US-EPA / Nepal Ministry of Forests and Environment standards
 */
export const AQI_CATEGORIES = [
  {
    range: [0, 50],
    level: 'Good',
    nepaliLevel: 'राम्रो',
    color: '#10b981', // Emerald
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    textColor: 'text-emerald-400',
    description: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
    healthAdvice: 'Ideal conditions for outdoor physical activities and exercise. Open windows for fresh air ventilation.',
    sensitiveGroups: 'None affected.'
  },
  {
    range: [51, 100],
    level: 'Moderate',
    nepaliLevel: 'मध्यम',
    color: '#eab308', // Amber/Yellow
    bgColor: 'rgba(234, 179, 8, 0.1)',
    borderColor: 'rgba(234, 179, 8, 0.3)',
    textColor: 'text-amber-400',
    description: 'Air quality is acceptable; however, some pollutants may pose moderate health concern for a very small number of sensitive individuals.',
    healthAdvice: 'Unusually sensitive people should consider reducing prolonged or heavy outdoor exertion.',
    sensitiveGroups: 'Individuals with preexisting respiratory illnesses or asthma.'
  },
  {
    range: [101, 150],
    level: 'Unhealthy for Sensitive Groups',
    nepaliLevel: 'संवेदनशील समूहका लागि अस्वस्थ',
    color: '#f97316', // Orange
    bgColor: 'rgba(249, 115, 22, 0.1)',
    borderColor: 'rgba(249, 115, 22, 0.3)',
    textColor: 'text-orange-400',
    description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
    healthAdvice: 'Children, older adults, and individuals with heart or lung disease should limit prolonged outdoor exertion.',
    sensitiveGroups: 'Elderly, children, expectant mothers, asthmatic patients.'
  },
  {
    range: [151, 200],
    level: 'Unhealthy',
    nepaliLevel: 'अस्वस्थ',
    color: '#ef4444', // Red
    bgColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    textColor: 'text-rose-400',
    description: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
    healthAdvice: 'Avoid prolonged outdoor exertion. Wear certified N95 masks if commuting outdoors. Keep windows shut.',
    sensitiveGroups: 'General population experiences irritation; sensitive groups suffer severe aggravation.'
  },
  {
    range: [201, 300],
    level: 'Very Unhealthy',
    nepaliLevel: 'धेरै अस्वस्थ',
    color: '#a855f7', // Purple
    bgColor: 'rgba(168, 85, 247, 0.1)',
    borderColor: 'rgba(168, 85, 247, 0.3)',
    textColor: 'text-purple-400',
    description: 'Health alert: The risk of health effects is heightened for everyone in the population.',
    healthAdvice: 'Remain indoors with indoor air purifiers running. Prohibit strenuous outdoor exercise.',
    sensitiveGroups: 'High hazard for cardiovascular and pulmonary patients.'
  },
  {
    range: [301, 500],
    level: 'Hazardous',
    nepaliLevel: 'खतरनाक',
    color: '#881337', // Deep Maroon
    bgColor: 'rgba(136, 19, 55, 0.15)',
    borderColor: 'rgba(136, 19, 55, 0.4)',
    textColor: 'text-rose-600',
    description: 'Health warning of emergency conditions: The entire population is more likely to be seriously affected.',
    healthAdvice: 'Emergency health warning. Avoid all outdoor activities. Keep doors and windows tightly sealed.',
    sensitiveGroups: 'Entire population is at severe acute risk.'
  }
];

export const WHO_ANNUAL_GUIDELINE_PM25 = 5; // µg/m³
export const NEPAL_NATIONAL_AMBIENT_STD_PM25 = 40; // µg/m³ 24-hr avg
export const NEPAL_NATIONAL_AMBIENT_STD_PM10 = 120; // µg/m³ 24-hr avg
