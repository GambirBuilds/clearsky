/**
 * Major atmospheric pollutants & weather metrics definitions
 */
export const POLLUTANTS = [
  {
    id: 'pm25',
    name: 'PM2.5',
    fullName: 'Fine Particulate Matter (< 2.5 µm)',
    nepaliName: 'सूक्ष्म कण (पीएम २.५)',
    unit: 'µg/m³',
    standardLimit: 40,
    whoLimit: 5,
    primarySource: 'Vehicle emissions, biomass burning, brick kilns, cross-border agricultural smoke',
    healthImpact: 'Deep lung penetration and bloodstream entry, cardiovascular strain, systemic inflammation.',
    description: 'Microscopic particles 30 times thinner than human hair that penetrate deeply into the respiratory tract.'
  },
  {
    id: 'pm10',
    name: 'PM10',
    fullName: 'Coarse Particulate Matter (< 10 µm)',
    nepaliName: 'धुलोका कण (पीएम १०)',
    unit: 'µg/m³',
    standardLimit: 120,
    whoLimit: 15,
    primarySource: 'Unpaved road dust, construction excavation, stone crushing, soil abrasion',
    healthImpact: 'Nasal, throat, and bronchial irritation, coughing, chronic bronchitis triggers.',
    description: 'Inhalable coarse dust particles suspended by traffic turbulence and road degradation.'
  },
  {
    id: 'no2',
    name: 'NO2',
    fullName: 'Nitrogen Dioxide',
    nepaliName: 'नाइट्रोजन डाइअक्साइड',
    unit: 'ppb',
    standardLimit: 40,
    whoLimit: 13,
    primarySource: 'Diesel engine combustion, high-temperature thermal power, industrial boilers',
    healthImpact: 'Airway inflammation, exacerbates asthma symptoms, precursor to photochemical ozone.',
    description: 'A pungent reddish-brown toxic gas resulting from high-temperature motor fuel combustion.'
  },
  {
    id: 'so2',
    name: 'SO2',
    fullName: 'Sulfur Dioxide',
    nepaliName: 'सल्फर डाइअक्साइड',
    unit: 'ppb',
    standardLimit: 70,
    whoLimit: 40,
    primarySource: 'Low-grade coal combustion in brick kilns, heavy furnace oils, industrial smelting',
    healthImpact: 'Bronchoconstriction, throat stinging, eye irritation, acid precipitation precursor.',
    description: 'Reactive gas released during burning of sulfur-containing fossil fuels like coal.'
  },
  {
    id: 'co',
    name: 'CO',
    fullName: 'Carbon Monoxide',
    nepaliName: 'कार्बन मोनोअक्साइड',
    unit: 'ppm',
    standardLimit: 9,
    whoLimit: 4,
    primarySource: 'Incomplete fuel combustion, idling two-wheelers in congestion, indoor chulho stoves',
    healthImpact: 'Reduces oxygen delivery to body organs and tissues by binding with hemoglobin.',
    description: 'Colorless, odorless, highly toxic gas formed by incomplete carbon oxidation.'
  },
  {
    id: 'o3',
    name: 'O3',
    fullName: 'Tropospheric Ground-level Ozone',
    nepaliName: 'सतही ओजोन',
    unit: 'ppb',
    standardLimit: 80,
    whoLimit: 60,
    primarySource: 'Photochemical reaction of NOx and VOCs under intense valley sunlight',
    healthImpact: 'Lung tissue damage, acute chest tightness, reduced agricultural crop yields.',
    description: 'Secondary pollutant produced when sunlight triggers chemical reactions between NOx and organic vapors.'
  }
];

export const WEATHER_METRICS = [
  {
    id: 'temperature',
    name: 'Temperature',
    unit: '°C',
    description: 'Ambient air temperature influencing thermal inversion layers and boundary height.'
  },
  {
    id: 'humidity',
    name: 'Relative Humidity',
    unit: '%',
    description: 'Moisture content favoring hygroscopic particulate swelling and winter radiation fog.'
  },
  {
    id: 'wind_speed',
    name: 'Wind Velocity',
    unit: 'km/h',
    description: 'Atmospheric ventilation rate dictating valley flushing vs stagnation.'
  }
];
