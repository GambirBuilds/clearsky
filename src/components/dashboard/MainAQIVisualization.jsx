import React from 'react';
import { AQICard } from '../cards/AQICard';
import { useLocation } from '../../hooks/useLocation';

export function MainAQIVisualization() {
  const { selectedLocation, environmentalData, isLoading, refreshEnvironmentalData } = useLocation();

  return (
    <AQICard
      location={selectedLocation}
      environmentalData={environmentalData}
      isLoading={isLoading}
      onRefresh={refreshEnvironmentalData}
    />
  );
}
