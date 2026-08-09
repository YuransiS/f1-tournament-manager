export const DEFAULT_TEAMS = [
  { id: 'alphatauri', name: 'AlphaTauri', color: '#00293B', accentColor: '#4E7C9B', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/alphatauri-logo.png' },
  { id: 'aston-martin', name: 'Aston Martin', color: '#006F62', accentColor: '#00D2BE', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/aston-martin-logo.png' },
  { id: 'williams', name: 'Williams Racing', color: '#00A0DE', accentColor: '#005AFF', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/williams-logo.png' },
  { id: 'alpine', name: 'Alpine', color: '#0090FF', accentColor: '#FF87BC', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/alpine-logo.png' },
  { id: 'mclaren', name: 'McLaren', color: '#FF8000', accentColor: '#FF9E1B', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/mclaren-logo.png' },
  { id: 'haas', name: 'Haas', color: '#B6BABD', accentColor: '#E6002B', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/haas-logo.png' },
  { id: 'alfa-romeo', name: 'Alfa Romeo KICK', color: '#900000', accentColor: '#C92D2D', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/alfa-romeo-logo.png' },
  { id: 'mercedes', name: 'Mercedes-AMG Petronas', color: '#00A19B', accentColor: '#6CD3BF', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/mercedes-logo.png' },
  { id: 'ferrari', name: 'Ferrari', color: '#E80020', accentColor: '#FFF200', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/ferrari-logo.png' },
  { id: 'red-bull', name: 'Red Bull', color: '#1E41FF', accentColor: '#FF0000', logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/red-bull-racing-logo.png' }
];

export const DEFAULT_DRIVERS = [
  { id: 'drv-1', name: 'Yurii ZAKHARCHUK', country: 'UA', flag: '🇺🇦', teamId: 'alphatauri', isAi: false, avatar: '/portraits/yura.png' },
  { id: 'drv-2', name: 'Fernando ALONSO', country: 'ES', flag: '🇪🇸', teamId: 'aston-martin', isAi: true, avatar: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png' },
  { id: 'drv-3', name: 'Logan SARGEANT', country: 'US', flag: '🇺🇸', teamId: 'williams', isAi: true, avatar: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LOGSAR01_Logan_Sargeant/logsar01.png' },
  { id: 'drv-4', name: 'Alexander ALBON', country: 'TH', flag: '🇹🇭', teamId: 'williams', isAi: true, avatar: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png' },
  { id: 'drv-5', name: 'Pierre GASLY', country: 'FR', flag: '🇫🇷', teamId: 'alpine', isAi: true, avatar: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png' },
  { id: 'drv-6', name: 'Mykola YAREMA', country: 'UA', flag: '🇺🇦', teamId: 'alphatauri', isAi: false, avatar: '/portraits/kolya.png' },
  { id: 'drv-7', name: 'Lando NORRIS', country: 'GB', flag: '🇬🇧', teamId: 'mclaren', isAi: true, avatar: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png' },
  { id: 'drv-8', name: 'Nico HULKENBERG', country: 'DE', flag: '🇩🇪', teamId: 'haas', isAi: true, avatar: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png' },
  { id: 'drv-9', name: 'Valtteri BOTTAS', country: 'FI', flag: '🇫🇮', teamId: 'alfa-romeo', isAi: true, avatar: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png' },
  { id: 'drv-10', name: 'Lance STROLL', country: 'CA', flag: '🇨🇦', teamId: 'aston-martin', isAi: true, avatar: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png' },
  { id: 'drv-11', name: 'Alexsandr GROMOV', country: 'UA', flag: '🇺🇦', teamId: 'mercedes', isAi: false, avatar: '/portraits/sashko.png' },
  { id: 'drv-12', name: 'Kevin MAGNUSSEN', country: 'DK', flag: '🇩🇰', teamId: 'haas', isAi: true, avatar: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/K/KEVMAG01_Kevin_Magnussen/kevmag01.png' },
  { id: 'drv-13', name: 'Esteban OCON', country: 'FR', flag: '🇫🇷', teamId: 'alpine', isAi: true, avatar: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png' },
  { id: 'drv-14', name: 'Carlos SAINZ', country: 'ES', flag: '🇪🇸', teamId: 'ferrari', isAi: true, avatar: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png' },
  { id: 'drv-15', name: 'Sergio PÉREZ', country: 'MX', flag: '🇲🇽', teamId: 'red-bull', isAi: true, avatar: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png' },
  { id: 'drv-16', name: 'Charles LECLERC', country: 'MC', flag: '🇲🇨', teamId: 'ferrari', isAi: true, avatar: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png' },
  { id: 'drv-17', name: 'Denys KOVALENKO', country: 'UA', flag: '🇺🇦', teamId: 'mercedes', isAi: false, avatar: '/portraits/denya.png' },
  { id: 'drv-18', name: 'Max VERSTAPPEN', country: 'NL', flag: '🇳🇱', teamId: 'red-bull', isAi: true, avatar: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png' },
  { id: 'drv-19', name: 'Oscar PIASTRI', country: 'AU', flag: '🇦🇺', teamId: 'mclaren', isAi: true, avatar: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png' },
  { id: 'drv-20', name: 'ZHOU Guanyu', country: 'CN', flag: '🇨🇳', teamId: 'alfa-romeo', isAi: true, avatar: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GUAZHO01_Zhou_Guanyu/guazho01.png' }
];

export const DEFAULT_POINTS_MAP = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
export const SPRINT_POINTS_MAP = [8, 7, 6, 5, 4, 3, 2, 1];

export const DEFAULT_RACES = [
  {
    id: 'race-1',
    title: 'Bahrain Grand Prix',
    subtitle: 'BAHRAIN INTERNATIONAL CIRCUIT - RACE 1',
    date: '2026-03-02',
    status: 'completed',
    fastestLapDriverId: 'drv-11', // Alexsandr GROMOV (1:33.942)
    results: [
      { driverId: 'drv-1', grid: 8, stops: 1, bestLap: '1:34.565', totalTime: '50:18.047', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-2', grid: 3, stops: 1, bestLap: '1:35.044', totalTime: '+1.116', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-3', grid: 4, stops: 1, bestLap: '1:34.852', totalTime: '+1.463', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-17', grid: 20, stops: 1, bestLap: '1:34.295', totalTime: '+2.565', penaltySeconds: 0, penaltyLabel: '⚙️ Телепорт/Глитч', status: 'FINISHED' },
      { driverId: 'drv-5', grid: 16, stops: 1, bestLap: '1:36.142', totalTime: '+4.788', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-7', grid: 5, stops: 1, bestLap: '1:35.434', totalTime: '+6.879', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-8', grid: 17, stops: 1, bestLap: '1:35.909', totalTime: '+7.838', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-9', grid: 9, stops: 1, bestLap: '1:35.807', totalTime: '+8.527', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-10', grid: 18, stops: 1, bestLap: '1:36.060', totalTime: '+9.085', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-11', grid: 1, stops: 2, bestLap: '1:33.942', totalTime: '+10.111', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-6', grid: 2, stops: 3, bestLap: '1:34.220', totalTime: '+5.500', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-12', grid: 14, stops: 1, bestLap: '1:36.044', totalTime: '+10.676', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-13', grid: 19, stops: 1, bestLap: '1:36.445', totalTime: '+11.148', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-14', grid: 15, stops: 1, bestLap: '1:36.218', totalTime: '+11.571', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-15', grid: 10, stops: 1, bestLap: '1:35.943', totalTime: '+12.437', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-16', grid: 11, stops: 1, bestLap: '1:35.699', totalTime: '+13.559', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-4', grid: 7, stops: 1, bestLap: '1:35.403', totalTime: '+14.295', penaltySeconds: 0, penaltyLabel: '⚙️ Техн. Баг', status: 'FINISHED' },
      { driverId: 'drv-18', grid: 13, stops: 1, bestLap: '1:36.280', totalTime: 'DNF', penaltySeconds: 0, penaltyLabel: '', status: 'DNF' },
      { driverId: 'drv-19', grid: 12, stops: 1, bestLap: '1:35.943', totalTime: 'DNF', penaltySeconds: 0, penaltyLabel: '', status: 'DNF' },
      { driverId: 'drv-20', grid: 6, stops: 0, bestLap: '1:36.139', totalTime: 'DNF', penaltySeconds: 0, penaltyLabel: '', status: 'DNF' }
    ]
  },
  {
    id: 'race-2',
    title: 'Saudi Arabian Grand Prix',
    subtitle: 'JEDDAH CORNICHE CIRCUIT - RACE 2',
    date: '2026-03-09',
    status: 'completed',
    fastestLapDriverId: 'drv-1', // Yurii ZAKHARCHUK (1:31.976)
    results: [
      { driverId: 'drv-1', grid: 1, stops: 2, bestLap: '1:31.976', totalTime: '50:02.104', penaltySeconds: 3, penaltyLabel: 'x1 (+3 secs.)', status: 'FINISHED' },
      { driverId: 'drv-16', grid: 5, stops: 1, bestLap: '1:33.930', totalTime: '+1.845', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-15', grid: 4, stops: 1, bestLap: '1:34.393', totalTime: '+2.065', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-18', grid: 3, stops: 1, bestLap: '1:34.219', totalTime: '+4.687', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-7', grid: 9, stops: 1, bestLap: '1:34.142', totalTime: '+10.465', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-19', grid: 10, stops: 1, bestLap: '1:33.788', totalTime: '+11.282', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-13', grid: 7, stops: 1, bestLap: '1:34.327', totalTime: '+11.474', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-5', grid: 8, stops: 1, bestLap: '1:34.006', totalTime: '+14.623', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-4', grid: 19, stops: 1, bestLap: '1:35.057', totalTime: '+22.105', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-8', grid: 16, stops: 1, bestLap: '1:34.729', totalTime: '+22.257', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-9', grid: 11, stops: 1, bestLap: '1:34.539', totalTime: '+25.508', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-11', grid: 2, stops: 2, bestLap: '1:33.658', totalTime: '+45.638', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-10', grid: 14, stops: 2, bestLap: '1:35.282', totalTime: '+46.895', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-3', grid: 20, stops: 1, bestLap: '1:34.400', totalTime: '+47.183', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-2', grid: 13, stops: 2, bestLap: '1:34.300', totalTime: '+47.331', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-20', grid: 12, stops: 3, bestLap: '1:33.839', totalTime: '+1:14.937', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-17', grid: 17, stops: 3, bestLap: '1:34.027', totalTime: '+1 Lap', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-14', grid: 6, stops: 1, bestLap: '1:34.432', totalTime: 'DNF', penaltySeconds: 0, penaltyLabel: '', status: 'DNF' },
      { driverId: 'drv-12', grid: 15, stops: 1, bestLap: '1:35.092', totalTime: 'DNF', penaltySeconds: 0, penaltyLabel: '', status: 'DNF' },
      { driverId: 'drv-6', grid: 18, stops: 1, bestLap: '1:33.763', totalTime: 'x1 (+3 secs.)', penaltySeconds: 3, penaltyLabel: 'x1 (+3 secs.)', status: 'FINISHED' }
    ]
  },
  {
    id: 'race-3',
    title: 'Australian Grand Prix',
    subtitle: 'ALBERT PARK CIRCUIT - RACE 3',
    date: '2026-03-16',
    status: 'completed',
    fastestLapDriverId: 'drv-1', // Yurii ZAKHARCHUK (1:21.421)
    results: [
      { driverId: 'drv-1', grid: 2, stops: 1, bestLap: '1:21.421', totalTime: '40:49.466', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-6', grid: 1, stops: 1, bestLap: '1:22.703', totalTime: '+10.309', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-4', grid: 5, stops: 1, bestLap: '1:22.530', totalTime: '+25.648', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-7', grid: 6, stops: 1, bestLap: '1:22.721', totalTime: '+27.336', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-19', grid: 9, stops: 1, bestLap: '1:23.194', totalTime: '+28.664', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-20', grid: 8, stops: 1, bestLap: '1:23.750', totalTime: '+40.547', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-2', grid: 4, stops: 1, bestLap: '1:23.681', totalTime: '+44.139', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-16', grid: 10, stops: 1, bestLap: '1:23.877', totalTime: '+45.137', penaltySeconds: 5, penaltyLabel: 'x1 (+5 secs.)', status: 'FINISHED' },
      { driverId: 'drv-15', grid: 11, stops: 1, bestLap: '1:24.105', totalTime: '+47.849', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-5', grid: 12, stops: 1, bestLap: '1:23.963', totalTime: '+49.718', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-13', grid: 13, stops: 1, bestLap: '1:23.444', totalTime: '+50.277', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-18', grid: 16, stops: 1, bestLap: '1:22.961', totalTime: '+50.566', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-3', grid: 17, stops: 1, bestLap: '1:24.138', totalTime: '+51.013', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-12', grid: 18, stops: 1, bestLap: '1:24.197', totalTime: '+51.221', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-10', grid: 19, stops: 1, bestLap: '1:23.926', totalTime: '+51.754', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-14', grid: 14, stops: 1, bestLap: '1:23.965', totalTime: '+52.124', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-11', grid: 3, stops: 2, bestLap: '1:21.743', totalTime: '+1:01.763', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-17', grid: 20, stops: 2, bestLap: '1:22.608', totalTime: '+1 Lap', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-8', grid: 15, stops: 1, bestLap: '1:23.913', totalTime: 'DNF', penaltySeconds: 0, penaltyLabel: '', status: 'DNF' },
      { driverId: 'drv-9', grid: 7, stops: 0, bestLap: '1:30.788', totalTime: 'DNF', penaltySeconds: 0, penaltyLabel: '', status: 'DNF' }
    ]
  },
  {
    id: 'race-4',
    title: 'Azerbaijan Grand Prix',
    subtitle: 'BAKU CITY CIRCUIT - CANCELLED GRAND PRIX',
    date: '2026-03-23',
    status: 'cancelled',
    isCancelled: true,
    isSprint: true,
    fastestLapDriverId: '',
    results: [
      { driverId: 'drv-18', grid: 1, stops: 0, bestLap: '1:42.100', totalTime: '24:15.102', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-4', grid: 2, stops: 0, bestLap: '1:42.500', totalTime: '+1.200', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-20', grid: 3, stops: 0, bestLap: '1:42.800', totalTime: '+3.100', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-15', grid: 4, stops: 0, bestLap: '1:42.600', totalTime: '+4.500', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-19', grid: 5, stops: 0, bestLap: '1:43.000', totalTime: '+6.200', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-9', grid: 6, stops: 0, bestLap: '1:43.100', totalTime: '+7.800', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-8', grid: 7, stops: 0, bestLap: '1:43.300', totalTime: '+9.100', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-5', grid: 8, stops: 0, bestLap: '1:43.400', totalTime: '+10.500', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-7', grid: 9, stops: 0, bestLap: '1:43.500', totalTime: '+11.800', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-11', grid: 10, stops: 0, bestLap: '1:43.700', totalTime: '+12.400', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-13', grid: 11, stops: 0, bestLap: '1:43.800', totalTime: '+13.100', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-14', grid: 12, stops: 0, bestLap: '1:43.900', totalTime: '+14.200', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-16', grid: 13, stops: 0, bestLap: '1:44.000', totalTime: '+15.000', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-10', grid: 14, stops: 0, bestLap: '1:44.200', totalTime: '+16.100', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-2', grid: 15, stops: 0, bestLap: '1:44.300', totalTime: '+17.300', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
      { driverId: 'drv-3', grid: 16, stops: 0, bestLap: '1:44.500', totalTime: 'DNF', penaltySeconds: 0, penaltyLabel: '', status: 'DNF' },
      { driverId: 'drv-17', grid: 17, stops: 0, bestLap: '1:44.700', totalTime: 'DNF', penaltySeconds: 0, penaltyLabel: '', status: 'DNF' },
      { driverId: 'drv-12', grid: 18, stops: 0, bestLap: '1:44.900', totalTime: 'DNF', penaltySeconds: 0, penaltyLabel: '', status: 'DNF' },
      { driverId: 'drv-1', grid: 19, stops: 0, bestLap: '1:45.100', totalTime: 'DNF', penaltySeconds: 0, penaltyLabel: '', status: 'DNF' },
      { driverId: 'drv-6', grid: 20, stops: 0, bestLap: '1:45.500', totalTime: 'DNF', penaltySeconds: 0, penaltyLabel: '', status: 'DNF' }
    ]
  },
  {
    id: 'race-5',
    title: 'Miami Grand Prix',
    subtitle: 'MIAMI INTERNATIONAL AUTODROME - RACE 5',
    date: '2026-05-03',
    status: 'completed',
    fastestLapDriverId: 'drv-1', // Yurii ZAKHARCHUK (1:32.243)
    hasPenaltyAnnouncement: true,
    results: [
      { driverId: 'drv-6', grid: 1, stops: 1, bestLap: '1:32.323', totalTime: '48:03.537', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' }, // Mykola YAREMA (WINNER - 25 pts)
      { driverId: 'drv-18', grid: 4, stops: 1, bestLap: '1:33.366', totalTime: '+2.141', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' }, // Verstappen (18 pts)
      { driverId: 'drv-15', grid: 5, stops: 1, bestLap: '1:33.491', totalTime: '+2.189', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' }, // Perez (15 pts)
      { driverId: 'drv-1', grid: 2, stops: 2, bestLap: '1:32.243', totalTime: '+2.515', penaltySeconds: 3, penaltyLabel: 'x1 (+3 secs.)', status: 'FINISHED' }, // Yurii ZAKHARCHUK (12 pts + 1 FL = 13 pts)
      { driverId: 'drv-7', grid: 10, stops: 1, bestLap: '1:33.456', totalTime: '+2.515', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' }, // Norris (10 pts)
      { driverId: 'drv-16', grid: 6, stops: 1, bestLap: '1:34.120', totalTime: '+5.615', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' }, // Leclerc (8 pts)
      { driverId: 'drv-9', grid: 12, stops: 1, bestLap: '1:33.820', totalTime: '+6.059', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' }, // Bottas (6 pts)
      { driverId: 'drv-5', grid: 9, stops: 1, bestLap: '1:34.740', totalTime: '+7.017', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' }, // Gasly (4 pts)
      { driverId: 'drv-2', grid: 14, stops: 1, bestLap: '1:34.039', totalTime: '+7.386', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' }, // Alonso (2 pts)
      { driverId: 'drv-12', grid: 16, stops: 1, bestLap: '1:33.737', totalTime: '+8.169', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' }, // Magnussen (1 pt)
      { driverId: 'drv-19', grid: 11, stops: 1, bestLap: '1:34.259', totalTime: '+8.702', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' }, // Piastri
      { driverId: 'drv-4', grid: 18, stops: 1, bestLap: '1:33.968', totalTime: '+10.165', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' }, // Albon
      { driverId: 'drv-20', grid: 13, stops: 1, bestLap: '1:34.058', totalTime: '+11.249', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' }, // Zhou
      { driverId: 'drv-10', grid: 15, stops: 1, bestLap: '1:34.337', totalTime: '+11.994', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' }, // Stroll
      { driverId: 'drv-8', grid: 17, stops: 1, bestLap: '1:33.920', totalTime: '+12.394', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' }, // Hulkenberg
      { driverId: 'drv-14', grid: 7, stops: 1, bestLap: '1:34.285', totalTime: '+13.941', penaltySeconds: 10, penaltyLabel: '⚠️ +10 sec (Убийство Сашка)', status: 'FINISHED' }, // Carlos SAINZ (+10s penalty)
      { driverId: 'drv-17', grid: 20, stops: 1, bestLap: '1:33.802', totalTime: '+15.926', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' }, // Denys KOVALENKO
      { driverId: 'drv-13', grid: 8, stops: 1, bestLap: '1:34.119', totalTime: '+1 Lap', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' }, // Ocon
      { driverId: 'drv-3', grid: 19, stops: 1, bestLap: '1:33.994', totalTime: 'DNF', penaltySeconds: 0, penaltyLabel: '', status: 'DNF' }, // Sargeant
      { driverId: 'drv-11', grid: 3, stops: 1, bestLap: '1:32.956', totalTime: 'DNF', penaltySeconds: 0, penaltyLabel: '💥 Terminal Damage (Crash w/ Sainz)', status: 'DNF' } // Alexsandr GROMOV (PABV)
    ]
  }
];

export const DEFAULT_PENALTIES = [
  { id: 'pen-2', driverId: 'drv-17', raceId: 'race-1', type: 'TIME', value: 3, reason: 'Track limits / penalty (x1)', date: '2026-03-02' },
  { id: 'pen-3', driverId: 'drv-1', raceId: 'race-2', type: 'TIME', value: 3, reason: 'Track limits warning (x1)', date: '2026-03-09' },
  { id: 'pen-4', driverId: 'drv-6', raceId: 'race-2', type: 'TIME', value: 3, reason: 'Track limits warning (x1)', date: '2026-03-09' },
  { id: 'pen-5', driverId: 'drv-16', raceId: 'race-3', type: 'TIME', value: 5, reason: 'Track limits warning x1 (+5 secs.)', date: '2026-03-16' },
  { id: 'pen-6', driverId: 'drv-14', raceId: 'race-5', type: 'TIME', value: 10, reason: 'Штраф +10 сек за столкновение и уничтожение болида Alexsandr GROMOV (Terminal Damage)', date: '2026-05-03' }
];
