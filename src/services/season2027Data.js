import { CALENDAR_2027_1 } from '../data/calendar2027.js';
import {
  DEFAULT_TEAMS,
  DEFAULT_DRIVERS,
  DEFAULT_POINTS_MAP
} from './initialData.js';

// Official confirmed driver line-up for Season 2027-1
export const DEFAULT_DRIVERS_2027_1 = DEFAULT_DRIVERS.map((d) => {
  // Transfer overrides for 2027-1
  if (d.id === 'drv-23') {
    return {
      ...d,
      teamId: 'ferrari',
      driverNumber: 5,
      isAi: false
    };
  }
  if (d.id === 'drv-3') {
    return {
      ...d,
      teamId: 'williams',
      driverNumber: 47,
      isAi: false
    };
  }
  if (d.id === 'drv-6') {
    return {
      ...d,
      teamId: 'red-bull',
      driverNumber: 67,
      isAi: false
    };
  }
  if (d.id === 'drv-17') {
    return {
      ...d,
      teamId: 'red-bull',
      driverNumber: 88,
      isAi: false
    };
  }
  if (d.id === 'drv-1') {
    return {
      ...d,
      teamId: 'mercedes',
      driverNumber: 69,
      isAi: false
    };
  }
  if (d.id === 'drv-11') {
    return {
      ...d,
      teamId: 'mercedes',
      driverNumber: 95,
      isAi: false
    };
  }
  return d;
});

// Official 2027-1 Season Races based on FIA CALENDAR 2027-1 (23 Rounds)
export const DEFAULT_RACES_2027_1 = CALENDAR_2027_1.map((cal, idx) => {
  const isRound1 = idx === 0;

  return {
    id: `2027-race-${cal.round}`,
    round: cal.round,
    title: cal.name,
    subtitle: `${cal.circuit.toUpperCase()} - ROUND ${cal.round}${cal.hasSprint ? ' (SPRINT WEEKEND)' : ''}`,
    officialName: cal.officialName,
    date: cal.dates,
    status: 'upcoming',
    isSprint: Boolean(cal.hasSprint),
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
    fastestLapDriverId: '',
    results: isRound1
      ? [
          // Provisional Official Starting Grid for Round 1 (Austrian GP at Red Bull Ring)
          { driverId: 'drv-6', grid: 1, status: 'UPCOMING' },  // Mykola Yarema #67 (Red Bull) - Reigning World Champion on Pole
          { driverId: 'drv-1', grid: 2, status: 'UPCOMING' },  // Yurii Zakharchuk #69 (Mercedes) - 2026 Vice-Champion P2
          { driverId: 'drv-17', grid: 3, status: 'UPCOMING' }, // Denys Kovalenko #88 (Red Bull) - 2026 Bronze Medalist P3
          { driverId: 'drv-11', grid: 4, status: 'UPCOMING' }, // Alexsandr Pisarenko #95 (Mercedes) - P4 in 2026
          { driverId: 'drv-23', grid: 5, status: 'UPCOMING' }, // Vadim Manstein #5 (Ferrari) - P5
          { driverId: 'drv-3', grid: 6, status: 'UPCOMING' },  // Mark #47 (Williams) - P6
          { driverId: 'drv-7', grid: 7, status: 'UPCOMING' },  // Lando Norris #4 (McLaren)
          { driverId: 'drv-19', grid: 8, status: 'UPCOMING' }, // Oscar Piastri #81 (McLaren)
          { driverId: 'drv-14', grid: 9, status: 'UPCOMING' }, // Carlos Sainz #55 (Ferrari)
          { driverId: 'drv-2', grid: 10, status: 'UPCOMING' }, // Fernando Alonso #14 (Aston Martin)
          { driverId: 'drv-4', grid: 11, status: 'UPCOMING' }, // Alexander Albon #23 (Williams)
          { driverId: 'drv-5', grid: 12, status: 'UPCOMING' }, // Pierre Gasly #10 (Alpine)
          { driverId: 'drv-13', grid: 13, status: 'UPCOMING' },// Esteban Ocon #31 (Alpine)
          { driverId: 'drv-10', grid: 14, status: 'UPCOMING' },// Lance Stroll #18 (Aston Martin)
          { driverId: 'drv-22', grid: 15, status: 'UPCOMING' },// Yuki Tsunoda #22 (Racing Bulls)
          { driverId: 'drv-21', grid: 16, status: 'UPCOMING' },// Daniel Ricciardo #3 (Racing Bulls)
          { driverId: 'drv-9', grid: 17, status: 'UPCOMING' }, // Valtteri Bottas #77 (Kick Sauber)
          { driverId: 'drv-20', grid: 18, status: 'UPCOMING' },// Zhou Guanyu #24 (Kick Sauber)
          { driverId: 'drv-12', grid: 19, status: 'UPCOMING' },// Kevin Magnussen #20 (Haas)
          { driverId: 'drv-8', grid: 20, status: 'UPCOMING' }  // Nico Hulkenberg #27 (Haas)
        ]
      : []
  };
});

export const DEFAULT_TRANSFERS_2027_1 = [
  {
    id: 'tr-2027-1',
    driverName: 'Микола Ярема (kolyacoolguy)',
    type: 'CHAMPION_CONFIRMED',
    title: 'Микола Ярема захищає титул Чемпіона Світу в Red Bull',
    subtitle: 'Після тріумфального титулу 2026 року Микола очолює бойовий склад Red Bull Racing на сезон 2027-1 під номером #67!',
    image: '/portraits/kolya_champion_victory.jpg',
    fromTeam: 'Red Bull Racing',
    toTeam: 'Red Bull Racing',
    badgeText: 'WORLD CHAMPION 2026'
  },
  {
    id: 'tr-2027-2',
    driverName: 'Вадим Манштейн (erich_manstein)',
    type: 'TRANSFERRED',
    title: 'Вадим Манштейн — основний пілот Scuderia Ferrari на сезон 2027-1',
    subtitle: 'Повноцінний контракт з Маранелло після феєричного подіуму в Монці. Вадим розпочинає сезон у червоному комбінезоні під номером #5!',
    image: '/announcements/manstein_ferrari.jpg',
    fromTeam: 'Red Bull Racing (Reserve)',
    toTeam: 'Scuderia Ferrari',
    badgeText: 'FERRARI WORKS DRIVER'
  },
  {
    id: 'tr-2027-3',
    driverName: 'Олександр Писаренко (PABV)',
    type: 'EXTENDED',
    title: 'Олександр Писаренко — напарник Юрія Захарчука в Mercedes-AMG',
    subtitle: 'Срібні Стріли зберегли потужний український дует: Захарчук (#69) та Писаренко (#95) готові боротися за Кубок Конструкторів 2027-1!',
    image: '/announcements/pisarenko_mercedes.png',
    fromTeam: 'Mercedes-AMG Petronas',
    toTeam: 'Mercedes-AMG Petronas',
    badgeText: 'MERCEDES LINEUP'
  },
  {
    id: 'tr-2027-4',
    driverName: 'Марк (ugeto47)',
    type: 'TRANSFERRED',
    title: 'Марк підтверджений основним бойовим пілотом Williams Racing',
    subtitle: 'Марк посідає місце бойового пілота під номером #47 поруч з Алексом Албоном у культовій британській стайні!',
    image: '/portraits/mark.png',
    fromTeam: 'Free Agent',
    toTeam: 'Williams Racing',
    badgeText: 'WILLIAMS WORKS DRIVER'
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
