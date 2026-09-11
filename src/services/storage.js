import {
  DEFAULT_TEAMS,
  DEFAULT_DRIVERS,
  DEFAULT_RACES,
  DEFAULT_PENALTIES,
  DEFAULT_POINTS_MAP,
  SPRINT_POINTS_MAP,
  BREAKING_TRANSFERS
} from './initialData';

const STORAGE_KEY = 'f1_tournament_data_v1';

export function getTournamentData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = {
        teams: DEFAULT_TEAMS,
        drivers: DEFAULT_DRIVERS,
        races: DEFAULT_RACES,
        penalties: DEFAULT_PENALTIES,
        pointsMap: DEFAULT_POINTS_MAP,
        fastestLapPoints: 1,
        transfers: BREAKING_TRANSFERS
      };
      saveTournamentData(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);

    // Sync updated teams (with logos)
    if (parsed.teams) {
      parsed.teams = parsed.teams.map(t => {
        const def = DEFAULT_TEAMS.find(dt => dt.id === t.id);
        return def ? { ...t, name: def.name || t.name, logo: def.logo || t.logo } : t;
      });
    }

    // Sync updated drivers & their new team transfers!
    if (parsed.drivers) {
      parsed.drivers = parsed.drivers.map(d => {
        const def = DEFAULT_DRIVERS.find(dd => dd.id === d.id);
        if (def) {
          return {
            ...d,
            teamId: def.teamId, // Update teamId to reflect transfers!
            name: def.name || d.name,
            country: d.id === 'drv-1' || d.id === 'drv-6' || d.id === 'drv-11' || d.id === 'drv-17' ? 'UA' : d.country,
            avatar: def.avatar || d.avatar
          };
        }
        return d;
      });
    }

    // Auto-update check: Always sync races from DEFAULT_RACES!
    if (parsed.races) {
      parsed.races = DEFAULT_RACES;
    }

    // Clean up penalties - filter out pen-1
    if (parsed.penalties) {
      parsed.penalties = parsed.penalties.filter(p => p.id !== 'pen-1');
    }

    parsed.transfers = BREAKING_TRANSFERS;

    saveTournamentData(parsed);
    return parsed;
  } catch (err) {
    console.error('Failed to load tournament data from localStorage:', err);
    return {
      teams: DEFAULT_TEAMS,
      drivers: DEFAULT_DRIVERS,
      races: DEFAULT_RACES,
      penalties: DEFAULT_PENALTIES,
      pointsMap: DEFAULT_POINTS_MAP,
      fastestLapPoints: 1,
      transfers: BREAKING_TRANSFERS
    };
  }
}

export function saveTournamentData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save tournament data:', err);
  }
}

export function resetToDefaultData() {
  const initial = {
    teams: DEFAULT_TEAMS,
    drivers: DEFAULT_DRIVERS,
    races: DEFAULT_RACES,
    penalties: DEFAULT_PENALTIES,
    pointsMap: DEFAULT_POINTS_MAP,
    fastestLapPoints: 1,
    transfers: BREAKING_TRANSFERS
  };
  saveTournamentData(initial);
  return initial;
}

export function exportDataAsJSON(data) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `f1_tournament_backup_${new Date().toISOString().slice(0, 10)}.json`;
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

export function calculateStandings(data) {
  const { drivers, teams, races, penalties, pointsMap = DEFAULT_POINTS_MAP, fastestLapPoints = 1 } = data;

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

      stats.totalPoints += pts;
      if (position === 1) stats.wins += 1;
      if (position <= 3) stats.podiums += 1;
      if (isFastestLap) stats.fastestLaps += 1;

      stats.raceHistory.push({ raceId: race.id, raceTitle: race.title, pos: position, pts, isFastestLap });
    });
  });

  // Deduct manual points penalties if any
  (penalties || []).forEach(p => {
    if (p.type === 'POINTS' && driverStatsMap[p.driverId]) {
      driverStatsMap[p.driverId].totalPoints = Math.max(0, driverStatsMap[p.driverId].totalPoints - Number(p.value || 0));
      driverStatsMap[p.driverId].penaltiesDeductions += Number(p.value || 0);
    }
  });

  const driverStandings = Object.values(driverStatsMap).sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.podiums - a.podiums;
  });

  // Calculate Constructors Standings
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

  driverStandings.forEach(ds => {
    const cStats = constructorStatsMap[ds.driver.teamId];
    if (cStats) {
      cStats.totalPoints += ds.totalPoints;
      cStats.wins += ds.wins;
      cStats.podiums += ds.podiums;
    }
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
  completedRaces.forEach((race, rIdx) => {
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
    });

    // Update cumulative for drivers
    drivers.forEach(d => {
      const tracker = driverTrackers[d.id];
      const res = driverRacePts[d.id];
      tracker.cumulative += res.pts;
      tracker.pointsHistory.push(res.pts);
      tracker.cumulativeHistory.push(tracker.cumulative);
      tracker.raceResults.push(res);

      // Add to team points
      currentRaceTeamPts[d.teamId] = (currentRaceTeamPts[d.teamId] || 0) + res.pts;
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

