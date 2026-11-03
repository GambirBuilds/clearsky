/**
 * US EPA Air Quality Index (AQI) Calculation Utility
 *
 * Implements official EPA Technical Assistance Document for the Reporting of Daily Air Quality (EPA-454/B-18-007).
 * Formula:
 *   Ip = [ (IHi - ILo) / (BPHi - BPLo) ] * (Cp - BPLo) + ILo
 *
 * Where:
 *   Ip   = the index for pollutant p
 *   Cp   = the rounded concentration of pollutant p
 *   BPHi = the breakpoint that is greater than or equal to Cp
 *   BPLo = the breakpoint that is less than or equal to Cp
 *   IHi  = the AQI value corresponding to BPHi
 *   ILo  = the AQI value corresponding to BPLo
 */

import { AQI_CATEGORIES } from '../constants/aqiCategories';

// Official EPA Breakpoints table
export const EPA_BREAKPOINTS = {
  // PM2.5 in µg/m³ (24-hr average, truncated to 1 decimal place)
  pm25: [
    { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
    { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
    { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 }
  ],

  // PM10 in µg/m³ (24-hr average, truncated to integer)
  pm10: [
    { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50 },
    { cLow: 55, cHigh: 154, iLow: 51, iHigh: 100 },
    { cLow: 155, cHigh: 254, iLow: 101, iHigh: 150 },
    { cLow: 255, cHigh: 354, iLow: 151, iHigh: 200 },
    { cLow: 355, cHigh: 424, iLow: 201, iHigh: 300 },
    { cLow: 425, cHigh: 504, iLow: 301, iHigh: 400 },
    { cLow: 505, cHigh: 604, iLow: 401, iHigh: 500 }
  ],

  // Ozone (O3) in ppb (8-hr average, truncated to integer)
  o3: [
    { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50 },
    { cLow: 55, cHigh: 70, iLow: 51, iHigh: 100 },
    { cLow: 71, cHigh: 85, iLow: 101, iHigh: 150 },
    { cLow: 86, cHigh: 105, iLow: 151, iHigh: 200 },
    { cLow: 106, cHigh: 200, iLow: 201, iHigh: 300 }
  ],

  // Carbon Monoxide (CO) in ppm (8-hr average, truncated to 1 decimal place)
  co: [
    { cLow: 0.0, cHigh: 4.4, iLow: 0, iHigh: 50 },
    { cLow: 4.5, cHigh: 9.4, iLow: 51, iHigh: 100 },
    { cLow: 9.5, cHigh: 12.4, iLow: 101, iHigh: 150 },
    { cLow: 12.5, cHigh: 15.4, iLow: 151, iHigh: 200 },
    { cLow: 15.5, cHigh: 30.4, iLow: 201, iHigh: 300 },
    { cLow: 30.5, cHigh: 40.4, iLow: 301, iHigh: 400 },
    { cLow: 40.5, cHigh: 50.4, iLow: 401, iHigh: 500 }
  ],

  // Nitrogen Dioxide (NO2) in ppb (1-hr average, truncated to integer)
  no2: [
    { cLow: 0, cHigh: 53, iLow: 0, iHigh: 50 },
    { cLow: 54, cHigh: 100, iLow: 51, iHigh: 100 },
    { cLow: 101, cHigh: 360, iLow: 101, iHigh: 150 },
    { cLow: 361, cHigh: 649, iLow: 151, iHigh: 200 },
    { cLow: 650, cHigh: 1249, iLow: 201, iHigh: 300 },
    { cLow: 1250, cHigh: 1649, iLow: 301, iHigh: 400 },
    { cLow: 1650, cHigh: 2049, iLow: 401, iHigh: 500 }
  ],

  // Sulfur Dioxide (SO2) in ppb (1-hr average, truncated to integer)
  so2: [
    { cLow: 0, cHigh: 35, iLow: 0, iHigh: 50 },
    { cLow: 36, cHigh: 75, iLow: 51, iHigh: 100 },
    { cLow: 76, cHigh: 185, iLow: 101, iHigh: 150 },
    { cLow: 186, cHigh: 304, iLow: 151, iHigh: 200 },
    { cLow: 305, cHigh: 604, iLow: 201, iHigh: 300 },
    { cLow: 605, cHigh: 804, iLow: 301, iHigh: 400 },
    { cLow: 805, cHigh: 1004, iLow: 401, iHigh: 500 }
  ]
};

/**
 * Truncate a number to specified decimal places without rounding
 */
export function truncate(val, decimals = 1) {
  if (val === null || val === undefined || isNaN(val)) return null;
  const factor = Math.pow(10, decimals);
  return Math.floor(Number(val) * factor) / factor;
}

/**
 * Calculate the sub-index for a single pollutant using EPA linear interpolation
 * @param {string} pollutant - 'pm25' | 'pm10' | 'o3' | 'co' | 'no2' | 'so2'
 * @param {number} concentration - raw concentration
 * @returns {{ aqi: number, category: object, pollutant: string } | null}
 */
export function calculatePollutantSubIndex(pollutant, concentration) {
  if (concentration === null || concentration === undefined || isNaN(concentration) || concentration < 0) {
    return null;
  }

  const bpList = EPA_BREAKPOINTS[pollutant];
  if (!bpList) return null;

  // Apply EPA truncation rules
  let cp;
  if (pollutant === 'pm25' || pollutant === 'co') {
    cp = truncate(concentration, 1);
  } else {
    cp = Math.floor(Number(concentration));
  }

  // Find corresponding breakpoint
  let bp = bpList.find(b => cp >= b.cLow && cp <= b.cHigh);

  // If above maximum breakpoint, cap at 500 or extrapolate to hazardous ceiling
  if (!bp) {
    const maxBp = bpList[bpList.length - 1];
    if (cp > maxBp.cHigh) {
      return {
        aqi: 500,
        concentration: cp,
        pollutant,
        isExtrapolated: true
      };
    }
    return null;
  }

  // Linear interpolation: Ip = [(IHi - ILo)/(BPHi - BPLo)] * (Cp - BPLo) + ILo
  const slope = (bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow);
  const aqiRaw = slope * (cp - bp.cLow) + bp.iLow;
  const aqiRounded = Math.round(aqiRaw);

  return {
    aqi: aqiRounded,
    concentration: cp,
    pollutant,
    isExtrapolated: false
  };
}

/**
 * Compute composite EPA AQI from all available criteria pollutants
 * The overall AQI is the maximum of all valid individual sub-indices.
 * @param {object} concentrations - { pm25, pm10, o3, no2, so2, co }
 * @returns {{
 *   aqi: number|null,
 *   dominantPollutant: string|null,
 *   subIndices: object,
 *   isCalculated: boolean,
 *   category: object|null
 * }}
 */
export function calculateCompositeAQI(concentrations = {}) {
  const subIndices = {};
  let maxAQI = -1;
  let dominant = null;

  for (const [key, val] of Object.entries(concentrations)) {
    if (EPA_BREAKPOINTS[key] && val !== null && val !== undefined && !isNaN(val)) {
      const sub = calculatePollutantSubIndex(key, Number(val));
      if (sub && sub.aqi !== null) {
        subIndices[key] = sub;
        if (sub.aqi > maxAQI) {
          maxAQI = sub.aqi;
          dominant = key;
        }
      }
    }
  }

  if (maxAQI < 0) {
    return {
      aqi: null,
      dominantPollutant: null,
      subIndices,
      isCalculated: false,
      category: null,
      message: 'No valid criteria pollutant concentrations available for calculation.'
    };
  }

  const category = AQI_CATEGORIES.find(c => maxAQI >= c.range[0] && maxAQI <= c.range[1])
    || AQI_CATEGORIES[AQI_CATEGORIES.length - 1];

  return {
    aqi: maxAQI,
    dominantPollutant: dominant,
    subIndices,
    isCalculated: true,
    category
  };
}

/**
 * Verification test suite for EPA AQI calculations
 * Matches official EPA test cases:
 * - PM2.5 at 12.0 µg/m³ -> AQI 50
 * - PM2.5 at 35.4 µg/m³ -> AQI 100
 * - PM2.5 at 55.4 µg/m³ -> AQI 150
 * - PM10 at 54 µg/m³    -> AQI 50
 * - CO at 9.4 ppm       -> AQI 100
 */
export function runAqiValidationTests() {
  const tests = [
    { pollutant: 'pm25', conc: 12.0, expected: 50 },
    { pollutant: 'pm25', conc: 35.4, expected: 100 },
    { pollutant: 'pm25', conc: 55.4, expected: 150 },
    { pollutant: 'pm10', conc: 54, expected: 50 },
    { pollutant: 'pm10', conc: 154, expected: 100 },
    { pollutant: 'co', conc: 9.4, expected: 100 }
  ];

  const results = tests.map(t => {
    const res = calculatePollutantSubIndex(t.pollutant, t.conc);
    const passed = res && res.aqi === t.expected;
    return { ...t, actual: res?.aqi, passed };
  });

  return {
    allPassed: results.every(r => r.passed),
    results
  };
}
