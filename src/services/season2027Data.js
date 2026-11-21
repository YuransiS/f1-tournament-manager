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
      return {
        ...d,
        teamId: 'williams',
        driverNumber: 67,
        isAi: false,
        avatar: '/portraits/kolya_williams_nobg.png',
        avatarFullWithBg: '/portraits/kolya_williams_nobg.png',
        avatarFullNoBg: '/portraits/kolya_williams_nobg.png'
      };
    }
    if (d.id === 'drv-17') {
      return {
        ...d,
        teamId: 'williams',
        driverNumber: 88,
        isAi: false,
        avatar: '/portraits/denya_williams_nobg.png',
        avatarFullWithBg: '/portraits/denya_williams_nobg.png',
        avatarFullNoBg: '/portraits/denya_williams_nobg.png'
      };
    }
    if (d.id === 'drv-1') {
      return {
        ...d,
        teamId: 'aston-martin',
        driverNumber: 69,
        isAi: false,
        avatar: '/portraits/yura_aston_nobg.png',
        avatarFullWithBg: '/portraits/yura_aston_standing.jpg',
        avatarFullNoBg: '/portraits/yura_aston_standing_nobg.png'
      };
    }
    if (d.id === 'drv-11') {
      return {
        ...d,
        teamId: 'aston-martin',
        driverNumber: 95,
        isAi: false,
        avatar: '/portraits/sashko_aston_nobg.png',
        avatarFullWithBg: '/portraits/sashko_aston_standing.jpg',
        avatarFullNoBg: '/portraits/sashko_aston_standing_nobg.png'
      };
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

const HUNGARY_RACE_2027_RESULTS = [
  { driverId: 'drv-11', grid: 3, stops: 2, qualiTime: '1:17.299', qualiGap: '+0.195', bestLap: '1:19.634', totalTime: '52:25.596', penaltySeconds: 0, penaltyLabel: '🏆 Победа + Fastest Lap (1:19.634)! Вторая победа Сашка подряд!', status: 'FINISHED' },
  { driverId: 'drv-17', grid: 5, stops: 1, qualiTime: '1:18.332', qualiGap: '+1.228', bestLap: '1:20.743', totalTime: '+7.635', penaltySeconds: 0, penaltyLabel: '🥈 Первый подиум Дениса за Williams (стратегия 1 пит-стопа)!', status: 'FINISHED' },
  { driverId: 'drv-1', grid: 1, stops: 2, qualiTime: '1:17.104', qualiGap: '-', bestLap: '1:19.798', totalTime: '+7.995', penaltySeconds: 0, penaltyLabel: '🥉 Подиум с поула — двойной подиум Aston Martin!', status: 'FINISHED' },
  { driverId: 'drv-23', grid: 2, stops: 2, qualiTime: '1:17.259', qualiGap: '+0.155', bestLap: '1:20.342', totalTime: '+8.517', penaltySeconds: 0, penaltyLabel: 'P4 в плотной борьбе за подиум (Ferrari)', status: 'FINISHED' },
  { driverId: 'drv-18', grid: 6, stops: 2, qualiTime: '1:18.732', qualiGap: '+1.628', bestLap: '1:21.239', totalTime: '+26.400', penaltySeconds: 5, penaltyLabel: '⚠️ Штраф x1 (+5 secs.)', status: 'FINISHED' },
  { driverId: 'drv-16', grid: 8, stops: 2, qualiTime: '1:18.344', qualiGap: '+1.240', bestLap: '1:21.188', totalTime: '+29.904', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-25', grid: 9, stops: 2, qualiTime: '1:18.366', qualiGap: '+1.262', bestLap: '1:20.942', totalTime: '+34.602', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-6', grid: 4, stops: 3, qualiTime: '1:17.895', qualiGap: '+0.791', bestLap: '1:19.996', totalTime: '+1:17.835', penaltySeconds: 0, penaltyLabel: '3 пит-стопа • P8 для Williams Racing', status: 'FINISHED' },
  { driverId: 'drv-15', grid: 7, stops: 2, qualiTime: '1:18.308', qualiGap: '+1.204', bestLap: '1:21.816', totalTime: '+1 Lap', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-21', grid: 20, stops: 2, qualiTime: '1:18.827', qualiGap: '+1.723', bestLap: '1:20.974', totalTime: '+1 Lap', penaltySeconds: 0, penaltyLabel: '⚡ Прорыв P20 → P10 (+10 позиций) — очко для AlphaTauri!', status: 'FINISHED' },
  { driverId: 'drv-20', grid: 16, stops: 2, qualiTime: '1:18.513', qualiGap: '+1.409', bestLap: '1:20.965', totalTime: '+1 Lap', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-12', grid: 17, stops: 2, qualiTime: '1:18.663', qualiGap: '+1.559', bestLap: '1:21.288', totalTime: '+1 Lap', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-22', grid: 19, stops: 2, qualiTime: '1:18.385', qualiGap: '+1.281', bestLap: '1:21.545', totalTime: '+1 Lap', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-5', grid: 12, stops: 2, qualiTime: '1:18.832', qualiGap: '+1.728', bestLap: '1:21.822', totalTime: '+1 Lap', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-26', grid: 10, stops: 2, qualiTime: '1:18.424', qualiGap: '+1.320', bestLap: '1:21.910', totalTime: '+1 Lap', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-7', grid: 11, stops: 2, qualiTime: '1:18.463', qualiGap: '+1.359', bestLap: '1:22.045', totalTime: '+1 Lap', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-8', grid: 13, stops: 2, qualiTime: '1:18.498', qualiGap: '+1.394', bestLap: '1:22.180', totalTime: '+1 Lap', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-9', grid: 14, stops: 2, qualiTime: '1:18.536', qualiGap: '+1.432', bestLap: '1:22.310', totalTime: '+1 Lap', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-19', grid: 15, stops: 2, qualiTime: '1:18.624', qualiGap: '+1.520', bestLap: '1:22.490', totalTime: '+1 Lap', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-13', grid: 18, stops: 2, qualiTime: '1:18.706', qualiGap: '+1.602', bestLap: '1:22.640', totalTime: '+2 Laps', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' }
];

const FRANCE_RACE_2027_RESULTS = [
  { driverId: 'drv-1', grid: 1, stops: 1, bestLap: '1:33.732', totalTime: '45:27.129', penaltySeconds: 0, penaltyLabel: '🏆 Победа с поула + Fastest Lap! Первый триумф Юры в сезоне!', status: 'FINISHED' },
  { driverId: 'drv-23', grid: 3, stops: 1, bestLap: '1:34.038', totalTime: '+3.410', penaltySeconds: 0, penaltyLabel: '🥈 Второй подиум подряд за Ferrari!', status: 'FINISHED' },
  { driverId: 'drv-11', grid: 2, stops: 2, bestLap: '1:34.677', totalTime: '+8.150', penaltySeconds: 3, penaltyLabel: '🥉 Двойной подиум Aston Martin (P3) • ⚠️ Штраф +3 сек', status: 'FINISHED' },
  { driverId: 'drv-17', grid: 4, stops: 2, bestLap: '1:35.341', totalTime: '+12.840', penaltySeconds: 0, penaltyLabel: 'P4 за Williams Racing!', status: 'FINISHED' },
  { driverId: 'drv-6', grid: 5, stops: 1, bestLap: '1:35.315', totalTime: '+15.620', penaltySeconds: 0, penaltyLabel: 'Топ-5 для Williams Racing', status: 'FINISHED' },
  { driverId: 'drv-26', grid: 9, stops: 1, bestLap: '1:35.268', totalTime: '+22.584', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-22', grid: 11, stops: 1, bestLap: '1:35.272', totalTime: '+23.298', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-5', grid: 8, stops: 1, bestLap: '1:35.683', totalTime: '+24.592', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-12', grid: 15, stops: 1, bestLap: '1:35.721', totalTime: '+25.035', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-20', grid: 6, stops: 1, bestLap: '1:35.718', totalTime: '+25.529', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-21', grid: 13, stops: 1, bestLap: '1:35.758', totalTime: '+25.944', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-18', grid: 16, stops: 1, bestLap: '1:35.932', totalTime: '+28.886', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-15', grid: 17, stops: 1, bestLap: '1:35.955', totalTime: '+34.344', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-16', grid: 19, stops: 1, bestLap: '1:35.741', totalTime: '+34.973', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-8', grid: 10, stops: 1, bestLap: '1:35.810', totalTime: '+36.210', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-13', grid: 14, stops: 1, bestLap: '1:35.990', totalTime: '+38.450', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-19', grid: 12, stops: 1, bestLap: '1:36.020', totalTime: '+40.120', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-7', grid: 20, stops: 1, bestLap: '1:35.890', totalTime: '+42.780', penaltySeconds: 0, penaltyLabel: '', status: 'FINISHED' },
  { driverId: 'drv-9', grid: 18, stops: 1, bestLap: '1:36.138', totalTime: 'DNF', penaltySeconds: 0, penaltyLabel: '🚨 Сход (DNF)', status: 'DNF' },
  { driverId: 'drv-25', grid: 7, stops: 1, bestLap: '1:35.339', totalTime: 'DNF', penaltySeconds: 0, penaltyLabel: '🚨 Сход (DNF)', status: 'DNF' }
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
  const isRound3 = cal.round === 3;

  events.push({
    ...baseFields,
    id: `2027-race-${cal.round}`,
    title: cal.name,
    subtitle: `${cal.circuit.toUpperCase()} - ROUND ${cal.round}${cal.hasSprint ? ' (MAIN RACE)' : ''}`,
    status: isRound1 || isRound2 || isRound3 ? 'completed' : 'upcoming',
    isSprint: false,
    fastestLapDriverId: isRound1 ? 'drv-1' : isRound2 ? 'drv-11' : isRound3 ? 'drv-1' : '',
    driverOfTheDayId: isRound1 ? 'drv-23' : isRound2 ? 'drv-11' : isRound3 ? 'drv-1' : '',
    incidentNote: isRound1
      ? '🇦🇹 Гран-при Австрии 2027-1 (Red Bull Ring — Основная гонка): Драматичный финал уик-энда! Сашко Громов/Писаренко (PABV) приносит Aston Martin сенсационную победу (старт P5 → P1)! Вадим Манштейн (_erich_manstein_, Ferrari) совершил невероятный прорыв с 15-го места и финишировал 2-м всего в 1.512с от лидера! Юки Цунода (AlphaTauri) взял второй подиум за уик-энд (P3). Денис Коваленко (ProstoDenya, Williams) прорвался с последнего 20-го места на 6-е (+14 позиций)! Обладатель поула Микола Ярема (kolyacoolguy, Williams) и Серхио Перес (Red Bull) сошли с дистанции (DNF). Юрий Захарчук (KillerplautzeGer, Aston Martin) поставил абсолютный лучший круг гонки (1:07.035), но финишировал 15-м после 2 пит-стопов (без бонусного очка).'
      : isRound2
        ? '🇭🇺 Гран-при Венгрии 2027-1 (Hungaroring): Вторая победа подряд Сашка Писаренко (PABV, Aston Martin) + Fastest Lap (1:19.634, 26 очков)! Денис Коваленко (ProstoDenya, Williams Racing) на стратегии одного пит-стопа прорвался с 5-го на 2-е место (+7.635с). Обладатель поула Юрий Захарчук (KillerplautzeGer) принёс Aston Martin двойной подиум (P3), а Вадим Манштейн (_erich_manstein_, Ferrari) финишировал 4-м. Макс Ферстаппен (P5) получил штраф +5 сек, Микола Ярема после 3 пит-стопов стал 8-м.'
        : isRound3
          ? '🇫🇷 Гран-при Франции 2027-1 (Circuit Paul Ricard): Полное доминирование украинских пилотов! Юрий Захарчук (KillerplautzeGer, Aston Martin) конвертировал поул-позицию в уверенную победу с лучшим кругом (1:33.732, 26 очков)! Вадим Манштейн (_erich_manstein_, Ferrari) финишировал 2-м, а Сашко Писаренко (PABV, Aston Martin) несмотря на штраф +3 сек забрал 3-е место и двойной подиум для Aston Martin! Денис Коваленко (P4) и Микола Ярема (P5) из Williams Racing замкнули топ-5.'
          : '',
    results: isRound1
      ? AUSTRIA_RACE_2027_RESULTS
      : isRound2
        ? HUNGARY_RACE_2027_RESULTS
        : isRound3
          ? FRANCE_RACE_2027_RESULTS
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
    image: '/portraits/kolya_williams_nobg.png',
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
    driverName: 'Вадим Манштейн (_erich_manstein_)',
    type: 'EXTENDED',
    title: 'Scuderia Ferrari продлила контракт с Вадимом Манштейном на сезон 2027-1!',
    subtitle: 'После сенсационной победы в Абу-Даби команда из Маранелло продлила контракт с Вадимом Манштейном (#5) на новый сезон в паре с Шарлем Леклером!',
    image: '/announcements/manstein_ferrari.jpg',
    fromTeam: 'Scuderia Ferrari',
    toTeam: 'Scuderia Ferrari',
    badgeText: 'CONTRACT EXTENDED'
  },
  {
    id: 'tr-2027-4',
    driverName: 'Льюис Хэмилтон & Джордж Расселл',
    type: 'TRANSFERRED',
    title: 'Mercedes-AMG Petronas подписала Хэмилтона (#44) и Расселла (#63)',
    subtitle: 'После ухода Юрия Захарчука и Сашка Писаренко в Aston Martin команда Mercedes была вынуждена искать новых пилотов и сделала ставку на британский дуэт.',
    image: '/portraits/standing/hamilton.webp',
    fromTeam: 'Free Agents',
    toTeam: 'Mercedes-AMG Petronas',
    badgeText: 'MERCEDES NEW LINEUP'
  },
  {
    id: 'tr-2027-5',
    driverName: 'Макс Ферстаппен & Серхио Перес',
    type: 'TRANSFERRED',
    title: 'Red Bull Racing подписала Ферстаппена (#1) и Переса (#11)',
    subtitle: 'Из-за перехода Миколы Яремы и Дениса Коваленко в Williams Racing команда Red Bull также оказалась вынуждена полностью обновить состав пилотов.',
    image: '/portraits/standing/verstappen.webp',
    fromTeam: 'Free Agents',
    toTeam: 'Red Bull Racing',
    badgeText: 'RED BULL NEW LINEUP'
  }
];

export const DEFAULT_PENALTIES_2027_1 = [
  { id: 'pen-2027-1', driverId: 'drv-11', raceId: '2027-race-3', type: 'TIME', value: 3, reason: 'Track limits warning x1 (+3 secs.)', date: '2027-04-25' },
  { id: 'pen-2027-2', driverId: 'drv-18', raceId: '2027-race-2', type: 'TIME', value: 5, reason: 'Time penalty x1 (+5 secs.)', date: '2027-04-11' }
];

export const SEASON_2027_1_DATA = {
  seasonId: '2027-1',
  seasonName: 'Сезон 2027-1',
  year: 2027,
  teams: DEFAULT_TEAMS,
  drivers: DEFAULT_DRIVERS_2027_1,
  races: DEFAULT_RACES_2027_1,
  penalties: DEFAULT_PENALTIES_2027_1,
  pointsMap: DEFAULT_POINTS_MAP,
  fastestLapPoints: 1,
  transfers: DEFAULT_TRANSFERS_2027_1
};
