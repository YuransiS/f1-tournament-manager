import { CALENDAR_2027_1 } from '../data/calendar2027.js';
import {
  DEFAULT_TEAMS,
  DEFAULT_DRIVERS,
  DEFAULT_POINTS_MAP
} from './initialData.js';

const ACTIVE_RETURNING_IDS_2027_1 = new Set([
  'drv-1', 'drv-5', 'drv-6', 'drv-7', 'drv-8', 'drv-9',
  'drv-11', 'drv-12', 'drv-13', 'drv-15', 'drv-16', 'drv-17',
  'drv-18', 'drv-19', 'drv-20', 'drv-21', 'drv-22', 'drv-23'
]);

// Official confirmed driver line-up for Season 2027-1
export const DEFAULT_DRIVERS_2027_1 = [
  ...DEFAULT_DRIVERS.filter((d) => ACTIVE_RETURNING_IDS_2027_1.has(d.id)).map((d) => {
    if (d.id === 'drv-6') {
      return { ...d, teamId: 'williams', driverNumber: 67, isAi: false };
    }
    if (d.id === 'drv-17') {
      return { ...d, teamId: 'williams', driverNumber: 88, isAi: false };
    }
    if (d.id === 'drv-1') {
      return { ...d, teamId: 'aston-martin', driverNumber: 69, isAi: false };
    }
    if (d.id === 'drv-11') {
      return { ...d, teamId: 'aston-martin', driverNumber: 95, isAi: false };
    }
    if (d.id === 'drv-23') {
      return { ...d, teamId: 'ferrari', driverNumber: 5, isAi: false };
    }
    if (d.id === 'drv-16') {
      return { ...d, teamId: 'ferrari', isAi: true };
    }
    if (d.id === 'drv-18') {
      return { ...d, teamId: 'red-bull', isAi: true };
    }
    if (d.id === 'drv-15') {
      return { ...d, teamId: 'red-bull', isAi: true };
    }
    return d;
  }),
  {
    id: 'drv-25',
    name: 'Lewis HAMILTON',
    country: 'GB',
    flag: '🇬🇧',
    driverNumber: 44,
    teamId: 'mercedes',
    isAi: true,
    avatar: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png',
    avatarFullWithBg: '/portraits/standing/hamilton.webp',
    avatarFullNoBg: '/portraits/standing/hamilton.webp'
  },
  {
    id: 'drv-26',
    name: 'George RUSSELL',
    country: 'GB',
    flag: '🇬🇧',
    driverNumber: 63,
    teamId: 'mercedes',
    isAi: true,
    avatar: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png',
    avatarFullWithBg: '/portraits/standing/russell.webp',
    avatarFullNoBg: '/portraits/standing/russell.webp'
  }
];

const AUSTRIA_SPRINT_2027_RESULTS = [
  { driverId: 'drv-6', grid: 3, stops: 0, bestLap: '1:11.413', totalTime: '15:10.541', penaltySeconds: 0, penaltyLabel: '🏆 Победа в спринте! Дебютный триумф за Williams (+12.7с)', status: 'FINISHED' },
  { driverId: 'drv-25', grid: 7, stops: 0, bestLap: '1:13.387', totalTime: '+12.722', penaltySeconds: 0, penaltyLabel: '🥈 Подиум Mercedes (P2)', status: 'FINISHED' },
  { driverId: 'drv-22', grid: 8, stops: 0, bestLap: '1:14.467', totalTime: '+13.577', penaltySeconds: 0, penaltyLabel: '🥉 Подиум AlphaTauri (P3)', status: 'FINISHED' },
  { driverId: 'drv-15', grid: 6, stops: 0, bestLap: '1:14.453', totalTime: '+14.385', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-26', grid: 9, stops: 0, bestLap: '1:13.802', totalTime: '+14.846', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-11', grid: 1, stops: 0, bestLap: '1:13.249', totalTime: '+16.370', penaltySeconds: 0, penaltyLabel: '⚡ Поул в спринт-квалификации (P1 → P6)', status: 'FINISHED' },
  { driverId: 'drv-7', grid: 11, stops: 0, bestLap: '1:13.928', totalTime: '+16.976', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-1', grid: 4, stops: 0, bestLap: '1:12.617', totalTime: '+17.067', penaltySeconds: 0, penaltyLabel: 'Дебютное очко за Aston Martin (P8)', status: 'FINISHED' },
  { driverId: 'drv-19', grid: 12, stops: 0, bestLap: '1:13.712', totalTime: '+18.203', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-9', grid: 15, stops: 0, bestLap: '1:12.981', totalTime: '+20.032', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-16', grid: 10, stops: 0, bestLap: '1:14.161', totalTime: '+20.819', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-20', grid: 16, stops: 0, bestLap: '1:13.144', totalTime: '+22.196', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-21', grid: 19, stops: 0, bestLap: '1:13.633', totalTime: '+24.591', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-5', grid: 17, stops: 0, bestLap: '1:13.217', totalTime: '+24.930', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-12', grid: 20, stops: 0, bestLap: '1:13.851', totalTime: '+26.162', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-13', grid: 18, stops: 0, bestLap: '1:13.237', totalTime: '+26.370', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-23', grid: 2, stops: 0, bestLap: '1:13.600', totalTime: '+28.841', penaltySeconds: 0, penaltyLabel: 'Старт P2 → P17', status: 'FINISHED' },
  { driverId: 'drv-17', grid: 13, stops: 1, bestLap: '1:12.508', totalTime: '+29.880', penaltySeconds: 0, penaltyLabel: '1 пит-стоп в спринте', status: 'FINISHED' },
  { driverId: 'drv-8', grid: 14, stops: 1, bestLap: '1:13.565', totalTime: '+34.330', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-18', grid: 5, stops: 0, bestLap: '1:14.973', totalTime: 'DNF', penaltySeconds: 0, penaltyLabel: '🚨 Сход (DNF)', status: 'DNF' }
];

// Official 2027-1 Season Races based on FIA CALENDAR 2027-1 (23 Rounds + Sprint weekends)
export const DEFAULT_RACES_2027_1 = CALENDAR_2027_1.flatMap((cal) => {
  const baseFields = {
    round: cal.round,
    officialName: cal.officialName,
    date: cal.dates,
    circuit: cal.circuit,
    country: cal.country,
    countryCode: cal.countryCode,
    city: cal.city,
    laps: cal.laps,
    circuitLength: cal.circuitLength,
    raceDistance: cal.raceDistance,
    drsZones: cal.drsZones,
    lapRecord: cal.lapRecord,
    region: cal.region,
    trackMap: cal.trackMap,
    fastestLapDriverId: ''
  };

  const events = [];

  if (cal.hasSprint) {
    const isRound1 = cal.round === 1;
    events.push({
      ...baseFields,
      id: `2027-race-${cal.round}-sprint`,
      title: `${cal.name} Sprint`,
      subtitle: `${cal.circuit.toUpperCase()} - ROUND ${cal.round} (SPRINT)`,
      status: isRound1 ? 'completed' : 'upcoming',
      isSprint: true,
      driverOfTheDayId: isRound1 ? 'drv-6' : '',
      incidentNote: isRound1
        ? '🇦🇹 Открытие сезона 2027-1 в Австрии (Red Bull Ring — Спринт): Действующий чемпион Микола Ярема (kolyacoolguy) в дебютном заезде за Williams Racing стартовал 3-м, прорвался на 1-е место и разгромил пелотон с отрывом +12.722с (лучший круг 1:11.413)! Льюис Хэмилтон (Mercedes) и Юки Цунода (AlphaTauri) на подиуме. Сашко Громов (PABV) взял поул-позицию спринта за Aston Martin и финишировал 6-м, а его напарник Юрий Захарчук (KillerplautzeGer) взял 1 очко (P8). Вадим Манштейн (Ferrari) после старта с P2 опустился на P17, Денис Коваленко (Williams) совершил пит-стоп и стал 18-м. Макс Ферстаппен (Red Bull) сошёл (DNF).'
        : '',
      results: isRound1 ? AUSTRIA_SPRINT_2027_RESULTS : []
    });
  }

  events.push({
    ...baseFields,
    id: `2027-race-${cal.round}`,
    title: cal.name,
    subtitle: `${cal.circuit.toUpperCase()} - ROUND ${cal.round}${cal.hasSprint ? ' (MAIN RACE)' : ''}`,
    status: 'upcoming',
    isSprint: false,
    results: []
  });

  return events;
});

export const DEFAULT_TRANSFERS_2027_1 = [
  {
    id: 'tr-2027-1',
    driverName: 'Микола Ярема & Денис Коваленко',
    type: 'TRANSFERRED',
    title: 'Чемпионский дуэт Red Bull переходит в Williams Racing!',
    subtitle: 'Чемпион мира 2026 Микола Ярема (#67) и бронзовый призёр Денис Коваленко (#88) объединяются в легендарной команде Williams Racing на сезон 2027-1!',
    image: '/portraits/kolya_champion_victory.jpg',
    fromTeam: 'Red Bull Racing',
    toTeam: 'Williams Racing',
    badgeText: 'WILLIAMS LINEUP'
  },
  {
    id: 'tr-2027-2',
    driverName: 'Юрий Захарчук & Сашко Громов',
    type: 'TRANSFERRED',
    title: 'Украинский дуэт Захарчук (#69) и PABV (#95) переходит в Aston Martin!',
    subtitle: 'Бывшие пилоты Mercedes-AMG пересаживаются за руль зелёных болидов Aston Martin и уже в первой квалификации в Австрии берут поул-позицию спринта!',
    image: '/announcements/pisarenko_mercedes.png',
    fromTeam: 'Mercedes-AMG Petronas',
    toTeam: 'Aston Martin',
    badgeText: 'ASTON MARTIN LINEUP'
  },
  {
    id: 'tr-2027-3',
    driverName: 'Вадим Манштейн (erich_manstein)',
    type: 'EXTENDED',
    title: 'Вадим Манштейн — основной пилот Scuderia Ferrari на сезон 2027-1',
    subtitle: 'После сенсационной победы в Абу-Даби Вадим остаётся в Маранелло под номером #5 в паре с Шарлем Леклером!',
    image: '/announcements/manstein_ferrari.jpg',
    fromTeam: 'Scuderia Ferrari',
    toTeam: 'Scuderia Ferrari',
    badgeText: 'FERRARI WORKS DRIVER'
  }
];

export const SEASON_2027_1_DATA = {
  seasonId: '2027-1',
  seasonName: 'Сезон 2027-1',
  year: 2027,
  teams: DEFAULT_TEAMS,
  drivers: DEFAULT_DRIVERS_2027_1,
  races: DEFAULT_RACES_2027_1,
  penalties: [],
  pointsMap: DEFAULT_POINTS_MAP,
  fastestLapPoints: 1,
  transfers: DEFAULT_TRANSFERS_2027_1
};
