import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LocationProvider } from './context/LocationContext';
import { AlertsProvider } from './context/AlertsContext';
import { AppLayout } from './components/layout/AppLayout';

import { OverviewPage } from './pages/OverviewPage';
import { LivePage } from './pages/LivePage';
import { MapPage } from './pages/MapPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ForecastPage } from './pages/ForecastPage';
import { ComparePage } from './pages/ComparePage';
import { EducationPage } from './pages/EducationPage';
import { AlertsPage } from './pages/AlertsPage';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  return (
    <ThemeProvider>
      <LocationProvider>
        <AlertsProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/live" element={<LivePage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/forecast" element={<ForecastPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/education" element={<EducationPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AlertsProvider>
      </LocationProvider>
    </ThemeProvider>
  );
}
