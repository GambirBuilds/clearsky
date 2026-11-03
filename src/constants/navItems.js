import {
  LayoutDashboard,
  Activity,
  MapPin,
  BarChart3,
  CloudRain,
  GitCompare,
  BookOpen,
  BellRing,
  Info
} from 'lucide-react';

export const NAV_ITEMS = [
  {
    path: '/',
    label: 'Overview',
    description: 'City snapshot & atmospheric status',
    icon: LayoutDashboard
  },
  {
    path: '/live',
    label: 'Live Air Quality',
    description: 'Pollutant breakdown & station status',
    icon: Activity
  },
  {
    path: '/map',
    label: 'Pollution Map',
    description: 'Interactive geospatial grid of Nepal',
    icon: MapPin
  },
  {
    path: '/analytics',
    label: 'Historical Analytics',
    description: 'Time series & seasonal trends',
    icon: BarChart3
  },
  {
    path: '/forecast',
    label: 'Forecast',
    description: '48h predictive dispersion model',
    icon: CloudRain
  },
  {
    path: '/compare',
    label: 'Compare Locations',
    description: 'Side-by-side regional benchmark',
    icon: GitCompare
  },
  {
    path: '/education',
    label: 'Pollution Education',
    description: 'Health impacts & valley inversion science',
    icon: BookOpen
  },
  {
    path: '/alerts',
    label: 'Alert Preferences',
    description: 'Custom threshold warnings & quiet hours',
    icon: BellRing
  },
  {
    path: '/about',
    label: 'About ClearSky',
    description: 'Mission, architecture & transparency',
    icon: Info
  }
];
