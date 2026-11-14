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

const AUSTRIA_RACE_2027_RESULTS = [
  { driverId: 'drv-11', grid: 5, stops: 1, bestLap: '1:08.079', totalTime: '43:32.963', penaltySeconds: 0, penaltyLabel: '🏆 Победа! Первый триумф Aston Martin в сезоне 2027-1!', status: 'FINISHED' },
  { driverId: 'drv-23', grid: 15, stops: 1, bestLap: '1:08.284', totalTime: '+1.512', penaltySeconds: 0, penaltyLabel: '🥈 Потрясающий прорыв P15 → P2 за Ferrari!', status: 'FINISHED' },
  { driverId: 'drv-22', grid: 2, stops: 1, bestLap: '1:08.896', totalTime: '+21.600', penaltySeconds: 0, penaltyLabel: '🥉 Подиум AlphaTauri (P3)', status: 'FINISHED' },
  { driverId: 'drv-9', grid: 8, stops: 1, bestLap: '1:09.013', totalTime: '+22.051', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-25', grid: 11, stops: 1, bestLap: '1:09.085', totalTime: '+30.842', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-17', grid: 20, stops: 1, bestLap: '1:08.420', totalTime: '+36.956', penaltySeconds: 0, penaltyLabel: '⚡ Прорыв P20 → P6 (+14 позиций) за Williams!', status: 'FINISHED' },
  { driverId: 'drv-12', grid: 13, stops: 1, bestLap: '1:09.229', totalTime: '+38.157', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-26', grid: 4, stops: 1, bestLap: '1:09.063', totalTime: '+38.999', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-18', grid: 19, stops: 1, bestLap: '1:09.243', totalTime: '+39.250', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-19', grid: 18, stops: 1, bestLap: '1:09.379', totalTime: '+40.946', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-21', grid: 16, stops: 1, bestLap: '1:09.653', totalTime: '+41.268', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-16', grid: 9, stops: 1, bestLap: '1:09.505', totalTime: '+41.508', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-20', grid: 10, stops: 1, bestLap: '1:09.568', totalTime: '+41.861', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-7', grid: 6, stops: 1, bestLap: '1:08.915', totalTime: '+42.197', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-1', grid: 7, stops: 2, bestLap: '1:07.035', totalTime: '+43.872', penaltySeconds: 0, penaltyLabel: '⚡ Fastest Lap (1:07.035, вне топ-10 — без бонуса)', status: 'FINISHED' },
  { driverId: 'drv-13', grid: 14, stops: 1, bestLap: '1:09.573', totalTime: '+47.462', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-5', grid: 12, stops: 1, bestLap: '1:09.608', totalTime: '+47.827', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-8', grid: 17, stops: 1, bestLap: '1:09.397', totalTime: '+48.595', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-15', grid: 3, stops: 1, bestLap: '1:08.372', totalTime: 'DNF', penaltySeconds: 0, penaltyLabel: '🚨 Сход (DNF)', status: 'DNF' },
  { driverId: 'drv-6', grid: 1, stops: 0, bestLap: '1:08.075', totalTime: 'DNF', penaltySeconds: 0, penaltyLabel: '🚨 Сход с поула (DNF)', status: 'DNF' }
];

const HUNGARY_QUALIFYING_2027_RESULTS = [
  { driverId: 'drv-1', grid: 1, qualiTime: '1:17.104', qualiGap: '-', bestLap: '1:17.104', status: 'UPCOMING' },
  { driverId: 'drv-23', grid: 2, qualiTime: '1:17.259', qualiGap: '+0.155', bestLap: '1:17.259', status: 'UPCOMING' },
  { driverId: 'drv-11', grid: 3, qualiTime: '1:17.299', qualiGap: '+0.195', bestLap: '1:17.299', status: 'UPCOMING' },
  { driverId: 'drv-6', grid: 4, qualiTime: '1:17.895', qualiGap: '+0.791', bestLap: '1:17.895', status: 'UPCOMING' },
  { driverId: 'drv-15', grid: 5, qualiTime: '1:18.308', qualiGap: '+1.204', bestLap: '1:18.308', status: 'UPCOMING' },
  { driverId: 'drv-17', grid: 6, qualiTime: '1:18.332', qualiGap: '+1.228', bestLap: '1:18.332', status: 'UPCOMING' },
  { driverId: 'drv-16', grid: 7, qualiTime: '1:18.344', qualiGap: '+1.240', bestLap: '1:18.344', status: 'UPCOMING' },
  { driverId: 'drv-25', grid: 8, qualiTime: '1:18.366', qualiGap: '+1.262', bestLap: '1:18.366', status: 'UPCOMING' },
  { driverId: 'drv-22', grid: 9, qualiTime: '1:18.385', qualiGap: '+1.281', bestLap: '1:18.385', status: 'UPCOMING' },
  { driverId: 'drv-26', grid: 10, qualiTime: '1:18.424', qualiGap: '+1.320', bestLap: '1:18.424', status: 'UPCOMING' },
  { driverId: 'drv-7', grid: 11, qualiTime: '1:18.463', qualiGap: '+1.359', bestLap: '1:18.463', status: 'UPCOMING' },
  { driverId: 'drv-8', grid: 12, qualiTime: '1:18.498', qualiGap: '+1.394', bestLap: '1:18.498', status: 'UPCOMING' },
  { driverId: 'drv-20', grid: 13, qualiTime: '1:18.513', qualiGap: '+1.409', bestLap: '1:18.513', status: 'UPCOMING' },
  { driverId: 'drv-9', grid: 14, qualiTime: '1:18.536', qualiGap: '+1.432', bestLap: '1:18.536', status: 'UPCOMING' },
  { driverId: 'drv-19', grid: 15, qualiTime: '1:18.624', qualiGap: '+1.520', bestLap: '1:18.624', status: 'UPCOMING' },
  { driverId: 'drv-12', grid: 16, qualiTime: '1:18.663', qualiGap: '+1.559', bestLap: '1:18.663', status: 'UPCOMING' },
  { driverId: 'drv-13', grid: 17, qualiTime: '1:18.706', qualiGap: '+1.602', bestLap: '1:18.706', status: 'UPCOMING' },
  { driverId: 'drv-18', grid: 18, qualiTime: '1:18.732', qualiGap: '+1.628', bestLap: '1:18.732', status: 'UPCOMING' },
  { driverId: 'drv-21', grid: 19, qualiTime: '1:18.827', qualiGap: '+1.723', bestLap: '1:18.827', status: 'UPCOMING' },
  { driverId: 'drv-5', grid: 20, qualiTime: '1:18.832', qualiGap: '+1.728', bestLap: '1:18.832', status: 'UPCOMING' }
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

  const isRound1 = cal.round === 1;
  const isRound2 = cal.round === 2;

  events.push({
    ...baseFields,
    id: `2027-race-${cal.round}`,
    title: cal.name,
    subtitle: `${cal.circuit.toUpperCase()} - ROUND ${cal.round}${cal.hasSprint ? ' (MAIN RACE)' : ''}`,
    status: isRound1 ? 'completed' : 'upcoming',
    isSprint: false,
    fastestLapDriverId: isRound1 ? 'drv-1' : '',
    driverOfTheDayId: isRound1 ? 'drv-23' : '',
    incidentNote: isRound1
      ? '🇦🇹 Гран-при Австрии 2027-1 (Red Bull Ring — Основная гонка): Драматичный финал уик-энда! Сашко Громов/Писаренко (PABV) приносит Aston Martin сенсационную победу (старт P5 → P1)! Вадим Манштейн (_erich_manstein_, Ferrari) совершил невероятный прорыв с 15-го места и финишировал 2-м всего в 1.512с от лидера! Юки Цунода (AlphaTauri) взял второй подиум за уик-энд (P3). Денис Коваленко (ProstoDenya, Williams) прорвался с последнего 20-го места на 6-е (+14 позиций)! Обладатель поула Микола Ярема (kolyacoolguy, Williams) и Серхио Перес (Red Bull) сошли с дистанции (DNF). Юрий Захарчук (KillerplautzeGer, Aston Martin) поставил абсолютный лучший круг гонки (1:07.035), но финишировал 15-м после 2 пит-стопов (без бонусного очка).'
      : '',
    results: isRound1
      ? AUSTRIA_RACE_2027_RESULTS
      : isRound2
        ? HUNGARY_QUALIFYING_2027_RESULTS
        : []
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
