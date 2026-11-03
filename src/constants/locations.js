/**
 * Initial Nepal location suggestions
 * Note: These are city references with geographical coordinates for Part 1 architecture,
 * awaiting real station sensor synchronization in Part 2.
 */
export const NEPAL_LOCATIONS = [
  {
    id: 'kathmandu',
    name: 'Kathmandu',
    nepaliName: 'काठमाडौं',
    province: 'Bagmati Province',
    district: 'Kathmandu',
    lat: 27.7172,
    lng: 85.3240,
    elevation: '1,400 m',
    description: 'Capital city in the bowl-shaped Kathmandu Valley, prone to atmospheric temperature inversions during winter months.',
    monitoringStations: [
      { id: 'ktm-ratnapark', name: 'Ratna Park Station', type: 'Urban Background', status: 'Awaiting Sensor Link' },
      { id: 'ktm-us-embassy', name: 'Maharajgunj Air Monitor', type: 'Diplomatic / Reference', status: 'Awaiting Sensor Link' },
      { id: 'ktm-bhotahiti', name: 'Asan - Bhotahiti Monitor', type: 'High Traffic Commercial', status: 'Awaiting Sensor Link' }
    ]
  },
  {
    id: 'lalitpur',
    name: 'Lalitpur',
    nepaliName: 'ललितपुर',
    province: 'Bagmati Province',
    district: 'Lalitpur',
    lat: 27.6644,
    lng: 85.3188,
    elevation: '1,350 m',
    description: 'Patan and southern Kathmandu Valley metropolitan region, monitoring brick kiln corridors and urban traffic.',
    monitoringStations: [
      { id: 'lal-pulchowk', name: 'Pulchowk Campus Station', type: 'Academic / Urban', status: 'Awaiting Sensor Link' },
      { id: 'lal-satdobato', name: 'Satdobato Ring Road Monitor', type: 'Traffic Corridor', status: 'Awaiting Sensor Link' }
    ]
  },
  {
    id: 'bhaktapur',
    name: 'Bhaktapur',
    nepaliName: 'भक्तपुर',
    province: 'Bagmati Province',
    district: 'Bhaktapur',
    lat: 27.6710,
    lng: 85.4298,
    elevation: '1,401 m',
    description: 'Eastern rim of Kathmandu valley with historical settlements and traditional brick manufacturing zones.',
    monitoringStations: [
      { id: 'bkt-durbar', name: 'Bhaktapur Durbar Monitor', type: 'Cultural / Heritage', status: 'Awaiting Sensor Link' },
      { id: 'bkt-sallaghari', name: 'Sallaghari Valley Outflow', type: 'Suburban Corridor', status: 'Awaiting Sensor Link' }
    ]
  },
  {
    id: 'pokhara',
    name: 'Pokhara',
    nepaliName: 'पोखरा',
    province: 'Gandaki Province',
    district: 'Kaski',
    lat: 28.2096,
    lng: 83.9856,
    elevation: '822 m',
    description: 'Valley surrounded by the Annapurna Range, experiencing seasonal biomass smoke transport and haze accumulation.',
    monitoringStations: [
      { id: 'pkr-lakeside', name: 'Phewa Lakeside Station', type: 'Environmental Baseline', status: 'Awaiting Sensor Link' },
      { id: 'pkr-prithvichowk', name: 'Prithvi Chowk Monitor', type: 'Urban Commercial', status: 'Awaiting Sensor Link' }
    ]
  },
  {
    id: 'bharatpur',
    name: 'Bharatpur',
    nepaliName: 'भरतपुर',
    province: 'Bagmati Province',
    district: 'Chitwan',
    lat: 27.6806,
    lng: 84.4300,
    elevation: '208 m',
    description: 'Major commercial hub in Chitwan inner Terai valley with agricultural burning and highway transit corridors.',
    monitoringStations: [
      { id: 'bht-chaubiskothi', name: 'Chaubiskothi Central', type: 'Highway Transit', status: 'Awaiting Sensor Link' }
    ]
  },
  {
    id: 'biratnagar',
    name: 'Biratnagar',
    nepaliName: 'विराटनगर',
    province: 'Koshi Province',
    district: 'Morang',
    lat: 26.4525,
    lng: 87.2718,
    elevation: '80 m',
    description: 'Eastern industrial belt with manufacturing facilities, cross-border freight traffic and high particulate matter.',
    monitoringStations: [
      { id: 'brt-rani', name: 'Rani Customs Station', type: 'Industrial / Cross-border', status: 'Awaiting Sensor Link' }
    ]
  },
  {
    id: 'birgunj',
    name: 'Birgunj',
    nepaliName: 'वीरगञ्ज',
    province: 'Madhesh Province',
    district: 'Parsa',
    lat: 27.0104,
    lng: 84.8774,
    elevation: '80 m',
    description: 'Primary inland port and trade gateway of Nepal, experiencing dense diesel exhaust and industrial emissions.',
    monitoringStations: [
      { id: 'brg-dryport', name: 'Dry Port Cargo Station', type: 'Heavy Commercial', status: 'Awaiting Sensor Link' }
    ]
  },
  {
    id: 'butwal',
    name: 'Butwal',
    nepaliName: 'बुटवल',
    province: 'Lumbini Province',
    district: 'Rupandehi',
    lat: 27.7006,
    lng: 83.4484,
    elevation: '205 m',
    description: 'Foothill transit hub connecting the Chure hills to the Terai plains along Siddhartha and Mahendra highways.',
    monitoringStations: [
      { id: 'btw-trafficchowk', name: 'Traffic Chowk Sensor', type: 'Urban Transit', status: 'Awaiting Sensor Link' }
    ]
  },
  {
    id: 'nepalgunj',
    name: 'Nepalgunj',
    nepaliName: 'नेपालगञ्ज',
    province: 'Lumbini Province',
    district: 'Banke',
    lat: 28.0500,
    lng: 81.6167,
    elevation: '150 m',
    description: 'Mid-Western Terai gateway, prone to hot-season dust storms and transboundary Indo-Gangetic haze episodes.',
    monitoringStations: [
      { id: 'npj-dhamboji', name: 'Dhamboji Chowk Station', type: 'Regional Baseline', status: 'Awaiting Sensor Link' }
    ]
  },
  {
    id: 'dharan',
    name: 'Dharan',
    nepaliName: 'धरान',
    province: 'Koshi Province',
    district: 'Sunsari',
    lat: 26.8124,
    lng: 87.2834,
    elevation: '349 m',
    description: 'Sub-tropical foothill city at the base of the Mahabharat range with relatively cleaner mountain valley air.',
    monitoringStations: [
      { id: 'dhn-bpkihs', name: 'BPKIHS Medical Zone Monitor', type: 'Public Health Sentinel', status: 'Awaiting Sensor Link' }
    ]
  }
];

export const DEFAULT_LOCATION = NEPAL_LOCATIONS[0]; // Kathmandu
