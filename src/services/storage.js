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
