import {
  DEFAULT_TEAMS,
  DEFAULT_DRIVERS,
  DEFAULT_RACES,
  DEFAULT_PENALTIES,
  DEFAULT_POINTS_MAP,
  SPRINT_POINTS_MAP,
  BREAKING_TRANSFERS
} from './initialData.js';

import {
  SEASON_2027_1_DATA,
  DEFAULT_DRIVERS_2027_1,
  DEFAULT_RACES_2027_1,
  DEFAULT_TRANSFERS_2027_1
} from './season2027Data.js';

export const SEASONS = [
  { id: '2027-1', name: 'Сезон 2027-1', year: 2027, status: 'active', isCurrent: true, label: '🔥 Сезон 2027-1 (Старт)' },
  { id: '2026', name: 'Сезон 2026', year: 2026, status: 'completed', isCurrent: false, label: '🏆 Сезон 2026 (Архив)' }
];

const STORAGE_KEY_LEGACY = 'f1_tournament_data_v1';
const STORAGE_KEY_2026 = 'f1_tournament_data_2026';
const STORAGE_KEY_2027_1 = 'f1_tournament_data_2027_1';
const ACTIVE_SEASON_KEY = 'f1_active_season';

export function getActiveSeason() {
  try {
    const saved = localStorage.getItem(ACTIVE_SEASON_KEY);
    if (saved === '2026' || saved === '2027-1') return saved;
  } catch {}
  return '2027-1'; // Default to next season
}

export function setActiveSeason(seasonId) {
  try {
    localStorage.setItem(ACTIVE_SEASON_KEY, seasonId);
  } catch {}
  return seasonId;
}

export function getTournamentData(seasonId = getActiveSeason()) {
  try {
    if (seasonId === '2026') {
      let raw = localStorage.getItem(STORAGE_KEY_2026);
      if (!raw) {
        raw = localStorage.getItem(STORAGE_KEY_LEGACY);
      }
      if (!raw) {
        const initial2026 = {
          seasonId: '2026',
          seasonName: 'Сезон 2026',
          year: 2026,
          teams: DEFAULT_TEAMS,
          drivers: DEFAULT_DRIVERS,
          races: DEFAULT_RACES,
          penalties: DEFAULT_PENALTIES,
          pointsMap: DEFAULT_POINTS_MAP,
          fastestLapPoints: 1,
          transfers: BREAKING_TRANSFERS
        };
        saveTournamentData(initial2026, '2026');
        return initial2026;
      }
      const parsed = JSON.parse(raw);
      parsed.seasonId = '2026';
      parsed.seasonName = 'Сезон 2026';
      parsed.year = 2026;

      // Sync updated teams (with logos)
      if (parsed.teams) {
        parsed.teams = parsed.teams.map(t => {
          const def = DEFAULT_TEAMS.find(dt => dt.id === t.id);
          return def ? { ...t, name: def.name || t.name, logo: def.logo || t.logo } : t;
        });
      }

      // Sync updated drivers & their new team transfers!
      if (parsed.drivers) {
        DEFAULT_DRIVERS.forEach(def => {
          if (!parsed.drivers.some(d => d.id === def.id)) {
            parsed.drivers.push(def);
          }
        });
        parsed.drivers = parsed.drivers.map(d => {
          const def = DEFAULT_DRIVERS.find(dd => dd.id === d.id);
          if (def) {
            return {
              ...d,
              driverNumber: def.driverNumber,
              teamId: def.teamId,
              name: def.name || d.name,
              country: d.id === 'drv-1' || d.id === 'drv-3' || d.id === 'drv-6' || d.id === 'drv-11' || d.id === 'drv-17' || d.id === 'drv-23' ? 'UA' : d.country,
              isAi: def.isAi !== undefined ? def.isAi : d.isAi,
              avatar: def.avatar || d.avatar,
              avatarFullWithBg: def.avatarFullWithBg || def.avatar || d.avatar,
              avatarFullNoBg: def.avatarFullNoBg || def.avatar || d.avatar,
              avatarChampion: def.avatarChampion || d.avatarChampion,
              avatarViceChampion: def.avatarViceChampion || d.avatarViceChampion,
              avatarBronzeChampion: def.avatarBronzeChampion || d.avatarBronzeChampion
            };
          }
          return d;
        });
      }

      // Sync races & penalties from DEFAULT_RACES & DEFAULT_PENALTIES
      if (parsed.races) {
        parsed.races = DEFAULT_RACES;
      }
      parsed.penalties = DEFAULT_PENALTIES;
      parsed.transfers = BREAKING_TRANSFERS;

      saveTournamentData(parsed, '2026');
      return parsed;
    }

    // Default: Season 2027-1
    const raw2027 = localStorage.getItem(STORAGE_KEY_2027_1);
    if (!raw2027) {
      saveTournamentData(SEASON_2027_1_DATA, '2027-1');
      return SEASON_2027_1_DATA;
    }
    const parsed2027 = JSON.parse(raw2027);
    parsed2027.seasonId = '2027-1';
    parsed2027.seasonName = 'Сезон 2027-1';
    parsed2027.year = 2027;

    parsed2027.teams = DEFAULT_TEAMS;
    parsed2027.drivers = DEFAULT_DRIVERS_2027_1;
    if (!parsed2027.races || parsed2027.races.length === 0) {
      parsed2027.races = DEFAULT_RACES_2027_1;
    }
    parsed2027.transfers = DEFAULT_TRANSFERS_2027_1;
    saveTournamentData(parsed2027, '2027-1');
    return parsed2027;
  } catch (err) {
    console.error('Failed to load tournament data from localStorage:', err);
    return seasonId === '2026'
      ? {
          seasonId: '2026',
          teams: DEFAULT_TEAMS,
          drivers: DEFAULT_DRIVERS,
          races: DEFAULT_RACES,
          penalties: DEFAULT_PENALTIES,
          pointsMap: DEFAULT_POINTS_MAP,
          fastestLapPoints: 1,
          transfers: BREAKING_TRANSFERS
        }
      : SEASON_2027_1_DATA;
  }
}

export function saveTournamentData(data, seasonId = getActiveSeason()) {
  try {
    const key = seasonId === '2026' ? STORAGE_KEY_2026 : STORAGE_KEY_2027_1;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save tournament data:', err);
  }
}

export function resetToDefaultData(seasonId = getActiveSeason()) {
  if (seasonId === '2026') {
    const initial = {
      seasonId: '2026',
      teams: DEFAULT_TEAMS,
      drivers: DEFAULT_DRIVERS,
      races: DEFAULT_RACES,
      penalties: DEFAULT_PENALTIES,
      pointsMap: DEFAULT_POINTS_MAP,
      fastestLapPoints: 1,
      transfers: BREAKING_TRANSFERS
    };
    saveTournamentData(initial, '2026');
    return initial;
  }
  saveTournamentData(SEASON_2027_1_DATA, '2027-1');
  return SEASON_2027_1_DATA;
}

export function exportDataAsJSON(data, seasonId = getActiveSeason()) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `f1_season_${seasonId || 'active'}_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportFullArchiveJSON() {
  const data2026 = getTournamentData('2026');
  const data2027 = getTournamentData('2027-1');
  const fullArchive = {
    exportedAt: new Date().toISOString(),
    activeSeason: getActiveSeason(),
    seasons: {
      '2026': data2026,
      '2027-1': data2027
    }
  };
  const jsonStr = JSON.stringify(fullArchive, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `f1_tournament_all_seasons_archive_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importDataFromJSON(jsonText) {
  const parsed = JSON.parse(jsonText);
  if (!parsed.drivers || !parsed.races) {
    throw new Error('Некорректный формат файла Бэкапа!');
  }
  saveTournamentData(parsed);
  return parsed;
}

export function calculateRacePoints(position, isFastestLap, pointsMap = DEFAULT_POINTS_MAP, fastestLapPoints = 1, isSprint = false) {
  const activeMap = isSprint ? SPRINT_POINTS_MAP : pointsMap;
  if (position < 1 || position > activeMap.length) {
    return !isSprint && isFastestLap && position <= 10 ? fastestLapPoints : 0;
  }
  let pts = activeMap[position - 1] || 0;
  if (!isSprint && isFastestLap && position <= 10) {
    pts += fastestLapPoints;
  }
  return pts;
}

/**
 * Resolves the team ID a driver was competing for in a specific race.
 * Accounts for mid-season reserve/substitute stints (e.g. Vadim Manstein
 * driving for Red Bull in Monza, Singapore and Japan, and Ferrari afterwards).
 */
export function getDriverTeamId(res, driver, raceId) {
  if (res && res.teamId) return res.teamId;
  if (driver?.id === 'drv-23' || res?.driverId === 'drv-23') {
    if (raceId === 'race-16' || raceId === 'race-17' || raceId === 'race-18') {
      return 'red-bull';
    }
    return 'ferrari';
  }
  return driver?.teamId || 'unknown';
}

export function calculateStandings(data) {
  const { drivers = [], teams = [], races = [], penalties = [], pointsMap = DEFAULT_POINTS_MAP, fastestLapPoints = 1 } = data;

  const driverStatsMap = {};
  drivers.forEach(d => {
    driverStatsMap[d.id] = {
      driver: d,
      team: teams.find(t => t.id === d.teamId) || { name: 'Unknown Team', color: '#666' },
      totalPoints: 0,
      wins: 0,
      podiums: 0,
      fastestLaps: 0,
      racesCount: 0,
      dnfs: 0,
      penaltiesDeductions: 0,
      raceHistory: []
    };
  });

  // Calculate Constructors Standings per race results
  const constructorStatsMap = {};
  teams.forEach(t => {
    constructorStatsMap[t.id] = {
      team: t,
      totalPoints: 0,
      wins: 0,
      podiums: 0,
      drivers: drivers.filter(d => d.teamId === t.id)
    };
  });

  races.forEach(race => {
    if (race.status === 'cancelled' && !race.isSprint) return;
    if (race.status !== 'completed' && race.status !== 'FINISHED' && race.status !== 'cancelled') return;

    race.results.forEach((res, idx) => {
      const stats = driverStatsMap[res.driverId];
      if (!stats) return;

      stats.racesCount += 1;

      if (res.status === 'DNF') {
        stats.dnfs += 1;
        stats.raceHistory.push({ raceId: race.id, raceTitle: race.title, pos: 'DNF', pts: 0 });
        return;
      }

      const position = idx + 1;
      const isFastestLap = !race.isSprint && race.fastestLapDriverId === res.driverId;
      const pts = calculateRacePoints(position, isFastestLap, pointsMap, fastestLapPoints, race.isSprint);

      // Driver personal stats
      stats.totalPoints += pts;
      if (position === 1) stats.wins += 1;
      if (position <= 3) stats.podiums += 1;
      if (isFastestLap) stats.fastestLaps += 1;

      stats.raceHistory.push({ raceId: race.id, raceTitle: race.title, pos: position, pts, isFastestLap });

      // Constructor stats: attribute points to the team driven for in THIS race
      const teamId = getDriverTeamId(res, stats.driver, race.id);
      const cStats = constructorStatsMap[teamId];
      if (cStats) {
        cStats.totalPoints += pts;
        if (position === 1) cStats.wins += 1;
        if (position <= 3) cStats.podiums += 1;
      }
    });
  });

  // Deduct manual points penalties if any
  (penalties || []).forEach(p => {
    if (p.type === 'POINTS' && driverStatsMap[p.driverId]) {
      const deduction = Number(p.value || 0);
      driverStatsMap[p.driverId].totalPoints = Math.max(0, driverStatsMap[p.driverId].totalPoints - deduction);
      driverStatsMap[p.driverId].penaltiesDeductions += deduction;
      const d = driverStatsMap[p.driverId].driver;
      if (d && constructorStatsMap[d.teamId]) {
        constructorStatsMap[d.teamId].totalPoints = Math.max(0, constructorStatsMap[d.teamId].totalPoints - deduction);
      }
    }
  });

  const driverStandings = Object.values(driverStatsMap).sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.podiums - a.podiums;
  });

  const constructorStandings = Object.values(constructorStatsMap).sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    return b.wins - a.wins;
  });

  return {
    driverStandings,
    constructorStandings
  };
}

export function calculatePointsProgression(data) {
  const { drivers = [], teams = [], races = [], penalties = [], pointsMap = DEFAULT_POINTS_MAP, fastestLapPoints = 1 } = data;

  // Filter completed/finished races
  const completedRaces = races.filter(race => {
    if (race.status === 'cancelled' && !race.isSprint) return false;
    return race.status === 'completed' || race.status === 'FINISHED' || race.status === 'cancelled';
  });

  if (completedRaces.length === 0) {
    return {
      stages: [],
      driverSeries: [],
      constructorSeries: [],
      leaderHistoryDrivers: [],
      leaderHistoryConstructors: []
    };
  }

  const getShortTitle = (title, isSprint) => {
    if (title.includes('Azerbaijan') || title.includes('Baku')) return isSprint ? 'Баку Спринт' : 'Баку';
    if (title.includes('Belgian') || title.includes('Belgium') || title.includes('Spa')) return isSprint ? 'Спа Спринт' : 'Спа';
    if (title.includes('Austrian') || title.includes('Austria')) return isSprint ? 'Австрия Спринт' : 'Австрия';
    if (title.includes('Bahrain')) return 'Бахрейн';
    if (title.includes('Saudi')) return 'Джидда';
    if (title.includes('Australian') || title.includes('Australia')) return 'Мельбурн';
    if (title.includes('Miami')) return 'Майами';
    if (title.includes('Emilia') || title.includes('Imola')) return 'Имола';
    if (title.includes('Monaco')) return 'Монако';
    if (title.includes('Spanish') || title.includes('Spain')) return 'Испания';
    if (title.includes('Canadian') || title.includes('Canada')) return 'Монреаль';
    if (title.includes('British') || title.includes('Silverstone')) return 'Сильверстоун';
    if (title.includes('Hungarian') || title.includes('Hungary')) return 'Венгрия';
    if (title.includes('Dutch') || title.includes('Zandvoort') || title.includes('Netherlands')) return 'Зандворт';
    if (title.includes('Italian') || title.includes('Monza')) return 'Монца';
    if (title.includes('Singapore') || title.includes('Marina Bay')) return 'Сингапур';
    if (title.includes('Japan') || title.includes('Suzuka')) return 'Сузука';
    if (title.includes('Qatar') || title.includes('Lusail')) return isSprint ? 'Катар Спринт' : 'Катар';
    if (title.includes('United States') || title.includes('Austin') || title.includes('Texas') || title.includes('COTA')) return isSprint ? 'Остин Спринт' : 'Остин';
    if (title.includes('Mexico') || title.includes('Hermanos')) return 'Мексика';
    if (title.includes('São Paulo') || title.includes('Sao Paulo') || title.includes('Brazil') || title.includes('Interlagos')) return isSprint ? 'Интерлагос Спринт' : 'Интерлагос';
    if (title.includes('Las Vegas') || title.includes('Vegas')) return 'Лас-Вегас';
    if (title.includes('China') || title.includes('Chinese') || title.includes('Shanghai')) return 'Шанхай';
    if (title.includes('Abu Dhabi') || title.includes('Yas Marina')) return 'Абу-Даби';
    return isSprint ? `${title.replace(/Grand Prix/i, '').trim()} Спринт` : title.replace('Grand Prix', 'GP').trim();
  };

  // Build stages: Stage 0 is Start at 0 points
  const stages = [
    {
      id: 'stage-0',
      stageIndex: 0,
      title: 'Старт сезона 2026',
      shortTitle: 'СТАРТ',
      code: 'START',
      date: '',
      isSprint: false
    }
  ];

  completedRaces.forEach((race, idx) => {
    stages.push({
      id: race.id,
      stageIndex: idx + 1,
      title: race.title,
      subtitle: race.subtitle,
      shortTitle: getShortTitle(race.title, race.isSprint),
      code: `GP ${idx + 1}`,
      date: race.date,
      isSprint: Boolean(race.isSprint)
    });
  });

  // Track progression for all drivers
  const driverTrackers = {};
  drivers.forEach(d => {
    const team = teams.find(t => t.id === d.teamId) || { id: 'unknown', name: 'Unknown Team', color: '#888' };
    driverTrackers[d.id] = {
      driver: d,
      team,
      cumulative: 0,
      pointsHistory: [0], // At stage 0 = 0 points
      cumulativeHistory: [0],
      raceResults: [{ pos: null, pts: 0, isFastestLap: false, status: 'START' }]
    };
  });

  // Track progression for all teams
  const teamTrackers = {};
  teams.forEach(t => {
    teamTrackers[t.id] = {
      team: t,
      cumulative: 0,
      pointsHistory: [0],
      cumulativeHistory: [0],
      racePointsList: [0]
    };
  });

  // Step through each completed race
  completedRaces.forEach((race) => {
    const currentRaceTeamPts = {};
    teams.forEach(t => { currentRaceTeamPts[t.id] = 0; });

    // Calculate points for this race for each driver
    const driverRacePts = {};
    drivers.forEach(d => { driverRacePts[d.id] = { pts: 0, pos: null, isFastestLap: false, status: 'DNS' }; });

    race.results.forEach((res, pIdx) => {
      if (!driverTrackers[res.driverId]) return;
      if (res.status === 'DNF') {
        driverRacePts[res.driverId] = { pts: 0, pos: 'DNF', isFastestLap: false, status: 'DNF' };
        return;
      }
      const position = pIdx + 1;
      const isFastestLap = !race.isSprint && race.fastestLapDriverId === res.driverId;
      const pts = calculateRacePoints(position, isFastestLap, pointsMap, fastestLapPoints, race.isSprint);
      driverRacePts[res.driverId] = { pts, pos: position, isFastestLap, status: 'FINISHED' };

      // Add to team points for this specific race
      const driver = driverTrackers[res.driverId]?.driver;
      const teamId = getDriverTeamId(res, driver, race.id);
      currentRaceTeamPts[teamId] = (currentRaceTeamPts[teamId] || 0) + pts;
    });

    // Update cumulative for drivers
    drivers.forEach(d => {
      const tracker = driverTrackers[d.id];
      const res = driverRacePts[d.id];
      tracker.cumulative += res.pts;
      tracker.pointsHistory.push(res.pts);
      tracker.cumulativeHistory.push(tracker.cumulative);
      tracker.raceResults.push(res);
    });

    // Update cumulative for teams
    teams.forEach(t => {
      const tracker = teamTrackers[t.id];
      const pts = currentRaceTeamPts[t.id] || 0;
      tracker.cumulative += pts;
      tracker.pointsHistory.push(pts);
      tracker.cumulativeHistory.push(tracker.cumulative);
      tracker.racePointsList.push(pts);
    });
  });

  // Apply penalties to driver cumulative points if needed
  (penalties || []).forEach(p => {
    if (p.type === 'POINTS' && driverTrackers[p.driverId]) {
      const deduction = Number(p.value || 0);
      const tracker = driverTrackers[p.driverId];
      tracker.cumulative = Math.max(0, tracker.cumulative - deduction);
      if (tracker.cumulativeHistory.length > 0) {
        const lastIdx = tracker.cumulativeHistory.length - 1;
        tracker.cumulativeHistory[lastIdx] = tracker.cumulative;
      }
    }
  });

  // Sort drivers by final total points descending
  const driverSeries = Object.values(driverTrackers).sort((a, b) => b.cumulative - a.cumulative);
  driverSeries.forEach((item, index) => {
    item.currentRank = index + 1;
  });

  // Sort teams by final total points descending
  const constructorSeries = Object.values(teamTrackers).sort((a, b) => b.cumulative - a.cumulative);
  constructorSeries.forEach((item, index) => {
    item.currentRank = index + 1;
  });

  // Track who was leading at each stage
  const leaderHistoryDrivers = stages.map((stg, stgIdx) => {
    if (stgIdx === 0) return { stageIndex: 0, driver: null, team: null, points: 0 };
    let leader = null;
    let maxPts = -1;
    driverSeries.forEach(ds => {
      const pts = ds.cumulativeHistory[stgIdx] || 0;
      if (pts > maxPts) {
        maxPts = pts;
        leader = ds;
      }
    });
    return {
      stageIndex: stgIdx,
      driver: leader ? leader.driver : null,
      team: leader ? leader.team : null,
      points: maxPts
    };
  });

  const leaderHistoryConstructors = stages.map((stg, stgIdx) => {
    if (stgIdx === 0) return { stageIndex: 0, team: null, points: 0 };
    let leaderTeam = null;
    let maxPts = -1;
    constructorSeries.forEach(cs => {
      const pts = cs.cumulativeHistory[stgIdx] || 0;
      if (pts > maxPts) {
        maxPts = pts;
        leaderTeam = cs;
      }
    });
    return {
      stageIndex: stgIdx,
      team: leaderTeam ? leaderTeam.team : null,
      points: maxPts
    };
  });

  const maxDriverPoints = Math.max(...driverSeries.map(d => d.cumulative), 25);
  const maxConstructorPoints = Math.max(...constructorSeries.map(c => c.cumulative), 50);

  return {
    stages,
    driverSeries,
    constructorSeries,
    maxDriverPoints,
    maxConstructorPoints,
    leaderHistoryDrivers,
    leaderHistoryConstructors
  };
}

