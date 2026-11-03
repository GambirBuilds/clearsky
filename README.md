# ClearSky — Nepal Environmental Intelligence

> **Breathe Smarter. Live Better.**

ClearSky is a production-grade, Nepal-first environmental intelligence and air quality web application. It transforms complex atmospheric aerosol physics and meteorology into accessible, actionable daily health insights for residents, athletes, commuters, and public health officials across Nepal.

---

## 1. Project Mission & Vision

- **Mission**: To provide hyper-localized, scientifically validated air quality intelligence across Nepal's urban centers and mountain valleys, translating particulate concentrations into clear public health guidance without inventing fake readings.
- **Vision**: A data-transparent Nepal where real-time atmospheric intelligence informs public policy, school schedules, outdoor conditioning, and regional airshed collaboration to confront the Himalayan winter smog crisis.

---

## 2. Key Features

- **Live Air Quality Intelligence**:
  - Continuous criteria pollutants monitoring: $\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{SO}_2$, $\text{CO}$, and $\text{O}_3$.
  - Official US-EPA Air Quality Index (AQI) calculation with exact breakpoints and concentration truncation rules.
  - Distinguishes locally computed EPA AQI from provider-reported index values.
  - Meteorological integration: temperature, relative humidity, and wind speed.
- **Interactive Geospatial Map of Nepal**:
  - Built with Leaflet and CartoDB Dark/Light basemaps.
  - Interactive CircleMarkers for all 10 initial Nepal municipalities, dynamically color-coded by real-time AQI severity.
  - Station inspector drawer with real coordinates, elevation, and instrument status.
- **Historical Analytics & Diurnal Trends**:
  - High-resolution 24-hour diurnal trajectory area chart reflecting mountain-valley thermal inversion patterns.
  - Past 7 days multi-pollutant comparative concentration charts.
  - Dynamic KPI calculations: Real Mean AQI, Peak $\text{PM}_{2.5}$, Minimum $\text{PM}_{2.5}$, and Clean Air Hours ($< 50\ \text{AQI}$).
- **48-Hour Dispersion Forecast**:
  - Hourly predictive trajectory and 5-day daily synoptic outlook driven by the Copernicus Atmosphere Monitoring Service (CAMS).
  - Explicit documentation of model limitations in complex Himalayan topography.
- **Multi-Location Benchmark & Comparison**:
  - Parallel comparative matrix for up to 4 selected Nepal municipalities.
  - Side-by-side criteria pollutant levels, weather conditions, and EPA classifications.
- **Environmental Intelligence Assistant**:
  - Deterministic rule-based synthesis engine grounded in WHO and US-EPA atmospheric guidelines.
  - Explains current readings, outdoor exercise safety, WHO baseline comparisons, and valley inversion physics.
- **Smart Pollution Alerts**:
  - Configurable trigger thresholds ($50\text{--}300\ \text{AQI}$).
  - Native browser Web Notifications governed by explicit user permission (`Notification.requestPermission()`).
  - Nocturnal quiet hours filter.
  - Transparent client-side architecture (explaining that alerts fire while the web app is active).
- **Comprehensive Education Center**:
  - In-depth guides for all 6 criteria pollutants.
  - Searchable educational article library.
  - Interactive FAQ accordion addressing winter smog, brick kiln seasonality, and mask efficacy.
  - Official public health disclaimers.
- **User Preferences & Privacy**:
  - Theme switching (Dark Navy default & High-Contrast Light) with instant `localStorage` persistence.
  - Browser geolocation support to auto-detect nearest Nepal municipality.
  - Factory reset controls and corrupted localStorage protection.
  - Optional user-configured OpenAQ v3 API key support.

---

## 3. Technology Stack

- **Frontend Framework**: React.js 19 (Strictly JavaScript ES6+, no TypeScript)
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 with custom dark mode variant (`@custom-variant dark`)
- **Routing**: React Router DOM v7 (Single-page app architecture)
- **Charts & Data Visualization**: Recharts
- **Geospatial Mapping**: Leaflet & React Leaflet
- **Iconography**: Lucide React
- **Dates & Timezones**: Native `Intl.DateTimeFormat` (Asia/Kathmandu NPT timezone)

---

## 4. API Providers & Data Methodology

### 1. Primary Ground Provider: OpenAQ API v3
- **Base URL**: `https://api.openaq.org/v3`
- **Endpoints**:
  - `GET /v3/locations?iso=np&limit=100`
  - `GET /v3/locations/{id}/latest`
  - `GET /v3/locations?coordinates={lat},{lng}&radius=35000`
- **Authentication**: `X-API-Key` HTTP header. Supported via `VITE_OPENAQ_API_KEY` or direct in-app entry in Preferences.

### 2. Secondary Atmospheric Provider: Open-Meteo Air Quality & Weather API
- **Base URLs**:
  - `https://air-quality-api.open-meteo.com/v1/air-quality`
  - `https://api.open-meteo.com/v1/forecast`
- **Features**: Current observations, past 7 days hourly reanalysis, 48h forecasts, and synoptic weather.
- **Authentication**: Free, zero API keys required, 100% reliable coverage across all Nepal coordinates.

---

## 5. US EPA AQI Calculation Methodology

ClearSky implements the official mathematical formula from EPA-454/B-18-007:
$$I_p = \frac{I_{Hi} - I_{Lo}}{BP_{Hi} - BP_{Lo}} (C_p - BP_{Lo}) + I_{Lo}$$

Where:
- $I_p$ is the index for pollutant $p$.
- $C_p$ is the truncated concentration of pollutant $p$.
- $[BP_{Lo}, BP_{Hi}]$ is the concentration breakpoint bracket.
- $[I_{Lo}, I_{Hi}]$ is the corresponding AQI bracket.

The composite AQI is the maximum of all valid criteria pollutant sub-indices:
$$\text{AQI} = \max(I_{\text{PM2.5}}, I_{\text{PM10}}, I_{\text{O3}}, I_{\text{NO2}}, I_{\text{SO2}}, I_{\text{CO}})$$

---

## 6. Known Environmental Data Limitations

1. **Physical Monitor Density**: Official reference monitoring stations in Nepal are predominantly clustered within the Kathmandu Valley (Ratna Park, US Embassy, Pulchowk) and Pokhara. In outer mountain and Terai districts, Open-Meteo's CAMS atmospheric dispersion model fills spatial observation gaps.
2. **Topographic Micro-climates**: In steep Himalayan valleys, localized nocturnal radiative temperature inversions and calm wind pooling can trap aerosols at concentrations exceeding regional synoptic model grid cells.
3. **Client-Side Notification Execution**: In adherence to the strict no-backend architecture, browser Web Notifications fire when the ClearSky web application is open in an active tab. Notifications do not run when the browser application is completely terminated.

---

## 7. Local Development & Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd clearsky

# 2. Install dependencies
npm install

# 3. Start local development server (port 3000)
npm run dev

# 4. Run production build
npm run build

# 5. Preview production build
npm run preview
```

---

## 8. Deployment (Vercel & Static Hosts)

ClearSky is engineered for zero-config deployment on Vercel or any static cloud platform.

The project includes `vercel.json` with SPA routing rewrites:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

To deploy via Vercel CLI:
```bash
npm install -g vercel
vercel
```

---

## 9. Privacy Policy & Local Storage

ClearSky collects **zero personal tracking data**. All user configurations (selected city, dark/light theme, alert thresholds, and optional OpenAQ API keys) are stored strictly within the user's local browser via `window.localStorage`. No telemetry is transmitted to external analytics servers.

---

## 10. License

Apache-2.0 License. Open for public health research, educational institutions, and environmental monitoring initiatives across Nepal.
