import React, { useState, useMemo } from 'react';
import F1StartingGrid, { GridPilot } from './F1StartingGrid';
import { Sparkles, Calendar, Gauge } from 'lucide-react';

interface StartingGridViewProps {
  data?: {
    races?: any[];
    drivers?: any[];
    teams?: any[];
  };
}

// Canonical racing numbers for drivers
const DRIVER_NUMBER_MAP: Record<string, number> = {
  'drv-1': 1,    // Yurii ZAKHARCHUK
  'drv-2': 14,   // Fernando ALONSO
  'drv-3': 3,    // MARK
  'drv-4': 23,   // Alexander ALBON
  'drv-5': 10,   // Pierre GASLY
  'drv-6': 6,    // Mykola YAREMA
  'drv-7': 4,    // Lando NORRIS
  'drv-8': 27,   // Nico HULKENBERG
  'drv-9': 77,   // Valtteri BOTTAS
  'drv-10': 18,  // Lance STROLL
  'drv-11': 11,  // Alexsandr GROMOV
  'drv-12': 20,  // Kevin MAGNUSSEN
  'drv-13': 31,  // Esteban OCON
  'drv-14': 55,  // Carlos SAINZ
  'drv-15': 11,  // Sergio PÉREZ
  'drv-16': 16,  // Charles LECLERC
  'drv-17': 17,  // Denys KOVALENKO
  'drv-18': 1,   // Max VERSTAPPEN
  'drv-19': 81,  // Oscar PIASTRI
  'drv-20': 24,  // ZHOU Guanyu
  'drv-21': 3,   // Daniel RICCIARDO
  'drv-22': 22,  // Yuki TSUNODA
  'drv-23': 99   // Vadim MANSTEIN
};

// Avatar scale and vertical offset calibration for unified visual head-size
const DRIVER_AVATAR_CALIBRATION: Record<
  string,
  { scale: number; offsetY?: number; offsetX?: number }
> = {
  'drv-1': { scale: 1.58, offsetY: 10 },    // Yurii ZAKHARCHUK (calibrated to perfectly match Yarema and TV broadcast eye-line)
  'drv-3': { scale: 1.25, offsetY: 0 },     // MARK
  'drv-4': { scale: 1.15, offsetY: 0 },     // Alexander ALBON
  'drv-6': { scale: 1.0, offsetY: 0 },      // Mykola YAREMA (reference standard)
  'drv-11': { scale: 1.2, offsetY: 0 },     // Alexsandr GROMOV
  'drv-17': { scale: 1.15, offsetY: 0 },    // Denys KOVALENKO
  'drv-23': { scale: 1.22, offsetY: 0 },    // Vadim MANSTEIN
};

export default function StartingGridView({ data }: StartingGridViewProps) {
  const races = useMemo(() => data?.races || [], [data]);
  const drivers = useMemo(() => data?.drivers || [], [data]);
  const teams = useMemo(() => data?.teams || [], [data]);

  // Filter races that have results with starting grid info
  const validRaces = useMemo(() => {
    return races.filter(
      (r) => r.results && r.results.length > 0 && r.results.some((res: any) => res.grid && res.grid > 0)
    );
  }, [races]);

  // Default to the last completed race (or first available race)
  const [selectedRaceId, setSelectedRaceId] = useState<string>(() => {
    if (validRaces.length > 0) {
      return validRaces[validRaces.length - 1].id;
    }
    return races[0]?.id || '';
  });

  const [cycleSpeed, setCycleSpeed] = useState(2800);

  const selectedRace = useMemo(() => {
    return validRaces.find((r) => r.id === selectedRaceId) || validRaces[0] || races[0];
  }, [validRaces, races, selectedRaceId]);

  // Transform actual race results into GridPilot[] ordered by starting grid position (1, 2, 3...)
  const activePilots: GridPilot[] = useMemo(() => {
    if (!selectedRace || !selectedRace.results) return [];

    // Filter results that have a valid grid position
    const gridResults = selectedRace.results.filter(
      (res: any) => typeof res.grid === 'number' && res.grid > 0
    );

    // Sort ascending by grid position (1, 2, 3...)
    gridResults.sort((a: any, b: any) => a.grid - b.grid);

    return gridResults.map((res: any) => {
      const driver = drivers.find((d: any) => d.id === res.driverId);
      const team = teams.find((t: any) => t.id === driver?.teamId) || {
        id: 'generic',
        name: 'F1 Team',
        color: '#E10600',
        accentColor: '#FFFFFF',
        logo: '/teams/ferrari.png'
      };

      const fullName = driver?.name || 'Driver';
      const nameParts = fullName.trim().split(' ');
      const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0];

      // Formulate lap time or delta
      let timingDisplay = res.bestLap || '1:21.083';
      if (res.grid > 1) {
        if (res.totalTime && res.totalTime.startsWith('+')) {
          timingDisplay = res.totalTime;
        } else if (res.bestLap) {
          timingDisplay = res.bestLap;
        } else {
          timingDisplay = `+0.${(res.grid * 55).toString().padStart(3, '0')}`;
        }
      }

      const calibration = (driver?.id && DRIVER_AVATAR_CALIBRATION[driver.id]) || { scale: 1.0, offsetY: 0 };

      return {
        id: `grid-${res.driverId}`,
        position: res.grid,
        realName: fullName,
        nickname: surname.toUpperCase(),
        driverNumber: DRIVER_NUMBER_MAP[driver?.id] || res.grid,
        avatarUrl: driver?.avatar || '',
        avatarScale: calibration.scale,
        avatarOffsetY: calibration.offsetY,
        countryFlagUrl: driver?.country || 'UA',
        lapTimeOrDelta: timingDisplay,
        team: {
          id: team.id,
          name: team.name,
          shortCode: surname.slice(0, 3).toUpperCase(),
          primaryColor: team.color || '#E10600',
          secondaryColor: team.accentColor || '#FFFFFF',
          logoUrl: team.logo || ''
        }
      };
    });
  }, [selectedRace, drivers, teams]);

  const activeEventTitle = selectedRace?.title ? selectedRace.title.toUpperCase() : 'GRAND PRIX';
  const activeTrackName = selectedRace?.subtitle ? selectedRace.subtitle.toUpperCase() : 'F1 CIRCUIT';

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Control & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#12141C] border border-[#262B3A] rounded-xl shadow-xl">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#E10600]/20 border border-[#E10600]/40 rounded-lg text-[#E10600]">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black italic tracking-wide text-white uppercase font-['Titillium_Web']">
              Starting Grid (F1 TV Style)
            </h2>
            <p className="text-xs text-neutral-400">
              Стартовая решетка официальных заездов турнира по сохраненным данным
            </p>
          </div>
        </div>

        {/* Filter Controls (Race Selector + Speed) */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Race Select Dropdown */}
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400">
              <Calendar size={14} className="text-[#E10600]" />
              Заезд:
            </span>
            <select
              value={selectedRaceId}
              onChange={(e) => setSelectedRaceId(e.target.value)}
              className="bg-[#0B0D12] text-white text-xs font-bold px-3.5 py-2 rounded-lg border border-[#262B3A] hover:border-[#3D455C] focus:border-[#E10600] outline-none cursor-pointer transition-all shadow-inner"
            >
              {validRaces.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.subtitle?.split('-')[0]?.trim() || r.date})
                </option>
              ))}
            </select>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#0B0D12] rounded-lg border border-[#262B3A] text-xs font-bold text-neutral-300">
            <span className="flex items-center gap-1 text-neutral-400">
              <Gauge size={14} className="text-amber-400" />
              Интервал:
            </span>
            <div className="flex items-center gap-1.5">
              {[2000, 2800, 3600].map((ms) => (
                <button
                  key={ms}
                  onClick={() => setCycleSpeed(ms)}
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                    cycleSpeed === ms
                      ? 'bg-[#E10600] text-white font-black shadow-md'
                      : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {(ms / 1000).toFixed(1)}s
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Starting Grid Viewport Frame */}
      <div className="w-full h-[86vh] min-h-[720px] max-h-[960px] rounded-2xl overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative bg-black">
        <F1StartingGrid
          key={`${selectedRaceId}-${cycleSpeed}`}
          pilots={activePilots}
          eventTitle={activeEventTitle}
          trackName={activeTrackName}
          cycleIntervalMs={cycleSpeed}
          autoPlay={true}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
