import React, { useState, useMemo } from 'react';
import F1StartingGrid, { GridPilot } from './F1StartingGrid';
import { Sparkles, Calendar, Gauge, Play, Volume2, Trophy, Square, Tv } from 'lucide-react';
import { extractF1RaceDetails } from '../utils/f1CircuitHelper';

interface StartingGridViewProps {
  data?: {
    races?: any[];
    drivers?: any[];
    teams?: any[];
  };
}

// Canonical racing numbers for drivers
const DRIVER_NUMBER_MAP: Record<string, number> = {
  'drv-1': 67,   // Yurii ZAKHARCHUK (67)
  'drv-2': 14,   // Fernando ALONSO
  'drv-3': 3,    // MARK
  'drv-4': 23,   // Alexander ALBON
  'drv-5': 10,   // Pierre GASLY
  'drv-6': 69,   // Mykola YAREMA (69)
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

// Mapping of Grand Prix event to ISO 2-letter country code for host country waving flags
export function getRaceCountryCode(race?: any): string {
  if (!race) return 'jp';
  const text = `${race.title || ''} ${race.subtitle || ''} ${race.circuitName || ''}`.toLowerCase();
  if (text.includes('japan') || text.includes('suzuka')) return 'jp';
  if (text.includes('bahrain') || text.includes('sakhir')) return 'bh';
  if (text.includes('saudi') || text.includes('jeddah')) return 'sa';
  if (text.includes('australia') || text.includes('albert park') || text.includes('melbourne')) return 'au';
  if (text.includes('azerbaijan') || text.includes('baku')) return 'az';
  if (text.includes('china') || text.includes('shanghai')) return 'cn';
  if (text.includes('miami') || text.includes('united states') || text.includes('usa') || text.includes('austin')) return 'us';
  if (text.includes('imola') || text.includes('emilia') || text.includes('monza') || text.includes('italy') || text.includes('italian')) return 'it';
  if (text.includes('monaco') || text.includes('monte carlo')) return 'mc';
  if (text.includes('canada') || text.includes('montreal') || text.includes('gilles')) return 'ca';
  if (text.includes('spain') || text.includes('spanish') || text.includes('barcelona') || text.includes('catalunya')) return 'es';
  if (text.includes('austria') || text.includes('red bull ring') || text.includes('spielberg')) return 'at';
  if (text.includes('silverstone') || text.includes('british') || text.includes('united kingdom') || text.includes('uk')) return 'gb';
  if (text.includes('hungary') || text.includes('hungaroring') || text.includes('budapest')) return 'hu';
  if (text.includes('belgian') || text.includes('belgium') || text.includes('spa')) return 'be';
  if (text.includes('netherlands') || text.includes('dutch') || text.includes('zandvoort')) return 'nl';
  if (text.includes('singapore') || text.includes('marina bay')) return 'sg';
  return 'jp';
}

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
  const [isBroadcastActive, setIsBroadcastActive] = useState(false);
  const [startWithAudio, setStartWithAudio] = useState(true);

  const handleStartBroadcast = (withAudio: boolean) => {
    setStartWithAudio(withAudio);
    setIsBroadcastActive(true);
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {}
  };

  const handleCloseBroadcast = () => {
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    } catch {}
    setIsBroadcastActive(false);
  };

  const selectedRace = useMemo(() => {
    return validRaces.find((r) => r.id === selectedRaceId) || validRaces[0] || races[0];
  }, [validRaces, races, selectedRaceId]);

  const raceDetails = useMemo(() => extractF1RaceDetails(selectedRace), [selectedRace]);
  const hostCountryCode = raceDetails.countryCode;

  // Transform actual race results into GridPilot[] ordered by starting grid position (1, 2, 3...)
  const activePilots: GridPilot[] = useMemo(() => {
    if (!selectedRace || !selectedRace.results) return [];

    // Filter results that have a valid grid position
    const gridResults = selectedRace.results.filter(
      (res: any) => typeof res.grid === 'number' && res.grid > 0
    );

    // Sort ascending by grid position (1, 2, 3...)
    gridResults.sort((a: any, b: any) => a.grid - b.grid);

    // Extract pole reference time if available
    const poleLap = gridResults[0]?.bestLap || '1:32.010';

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

      // Pole time for P1, strictly monotonic delta to pole (+X.XXX) for P2+
      let timingDisplay = poleLap;
      if (res.grid > 1) {
        const deltaSec = 0.125 * (res.grid - 1) + (((res.grid * 37) % 60) / 1000);
        timingDisplay = `+${deltaSec.toFixed(3)}`;
      }

      return {
        id: `grid-${res.driverId}`,
        position: res.grid,
        realName: fullName,
        nickname: surname.toUpperCase(),
        driverNumber: DRIVER_NUMBER_MAP[driver?.id] || res.grid,
        avatarUrl: driver?.avatar || driver?.avatarFullNoBg || '',
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
    <div className="w-full flex flex-col gap-4">
      {/* Control & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#12141C] border border-[#262B3A] rounded-xl shadow-lg">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#E10600]/20 border border-[#E10600]/40 rounded-lg text-[#E10600]">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black italic tracking-wide text-white uppercase font-['Titillium_Web']">
              Starting Grid (F1 Broadcast)
            </h2>
            <p className="text-xs text-neutral-400">
              Стартовая решетка заездов чемпионата в официальном формате ТВ-трансляции
            </p>
          </div>
        </div>

        {/* Filter Controls (Race Selector + Speed) */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Race Select Dropdown */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400">
              <Calendar size={14} className="text-[#E10600]" />
              Заезд:
            </span>
            <select
              value={selectedRaceId}
              onChange={(e) => setSelectedRaceId(e.target.value)}
              className="bg-[#0B0D12] text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-[#262B3A] hover:border-[#3D455C] focus:border-[#E10600] outline-none cursor-pointer transition-all shadow-inner"
            >
              {validRaces.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.subtitle?.split('-')[0]?.trim() || r.date})
                </option>
              ))}
            </select>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-2 px-3 py-1 bg-[#0B0D12] rounded-lg border border-[#262B3A] text-xs font-bold text-neutral-300">
            <span className="flex items-center gap-1 text-neutral-400">
              <Gauge size={14} className="text-amber-400" />
              Интервал:
            </span>
            <div className="flex items-center gap-1">
              {[2000, 2800, 3600].map((ms) => (
                <button
                  type="button"
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

          {/* Broadcast Quick Launch / Stop Action Button */}
          {isBroadcastActive ? (
            <button
              type="button"
              onClick={handleCloseBroadcast}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/30 hover:bg-red-600/50 text-red-300 hover:text-white border border-red-500/40 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer shadow-md"
            >
              <Square size={13} fill="currentColor" />
              <span>Стоп эфир</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleStartBroadcast(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E10600] hover:bg-[#ff1a14] active:scale-95 text-white border border-[#ff4d4d]/50 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_16px_rgba(225,6,0,0.5)]"
            >
              <Play size={13} fill="currentColor" />
              <span>В эфир (20%)</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. Fullscreen Broadcast Mode: 100vw x 100vh true full-bleed F1 Broadcast */}
      {isBroadcastActive && (
        <div className="fixed inset-0 z-[99999] w-screen h-screen bg-[#07090E] overflow-hidden flex flex-col justify-between">
          <F1StartingGrid
            pilots={activePilots}
            eventTitle={raceDetails.eventTitle}
            trackName={raceDetails.circuitName}
            countryCode={raceDetails.countryCode}
            roundNumber={raceDetails.roundNumber}
            countryName={raceDetails.countryName}
            circuitCity={raceDetails.circuitCity}
            cycleIntervalMs={cycleSpeed}
            autoPlay={true}
            startWithSound={startWithAudio}
            onClose={handleCloseBroadcast}
            className="w-full h-full"
          />
        </div>
      )}

      {/* 2. Live Broadcast Feed in Dashboard Tab (Zero empty void, 100% interactive) */}
      <div className="w-full aspect-[16/9] min-h-[580px] max-h-[85vh] rounded-2xl overflow-hidden border border-[#262B3A] shadow-[0_24px_60px_rgba(0,0,0,0.95)] relative bg-[#07090E]">
        <F1StartingGrid
          key={`tab-grid-${selectedRaceId}`}
          pilots={activePilots}
          eventTitle={raceDetails.eventTitle}
          trackName={raceDetails.circuitName}
          countryCode={raceDetails.countryCode}
          roundNumber={raceDetails.roundNumber}
          countryName={raceDetails.countryName}
          circuitCity={raceDetails.circuitCity}
          cycleIntervalMs={cycleSpeed}
          autoPlay={true}
          startWithSound={false}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
