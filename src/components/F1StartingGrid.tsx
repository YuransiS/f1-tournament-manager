import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronUp, ChevronDown, Maximize2, Minimize2, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import F1GridDriverCard from './F1GridDriverCard';
import F1StartingGridSlotDisplay from './F1StartingGridSlotDisplay';
import F1StartingGridIntro from './F1StartingGridIntro';
import F1FlagVideoBackground, { COUNTRY_FLAG_YOUTUBE_MAP } from './F1FlagVideoBackground';
import { extractF1RaceDetails } from '../utils/f1CircuitHelper';

export { COUNTRY_FLAG_YOUTUBE_MAP };

export interface GridPilot {
  id: string;
  position: number;
  realName?: string;
  nickname: string;
  driverNumber: number;
  avatarUrl: string;
  countryFlagUrl?: string;
  lapTimeOrDelta?: string;
  team: {
    id: string;
    name: string;
    shortCode: string;
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    backgroundPatternUrl?: string;
  };
}

export interface F1StartingGridProps {
  pilots: GridPilot[];
  eventTitle?: string;
  trackName?: string;
  countryCode?: string;
  roundNumber?: number;
  countryName?: string;
  circuitCity?: string;
  flagGifUrl?: string;
  flagVideoId?: string;
  cycleIntervalMs?: number;
  autoPlay?: boolean;
  onClose?: () => void;
  className?: string;
}

export const F1StartingGrid: React.FC<F1StartingGridProps> = ({
  pilots = [],
  eventTitle,
  trackName,
  countryCode,
  roundNumber,
  countryName,
  circuitCity,
  flagGifUrl,
  flagVideoId,
  cycleIntervalMs = 2800,
  autoPlay = true,
  onClose,
  className = ''
}) => {
  // Infer missing metadata from eventTitle/trackName if not provided
  const circuitDetails = useMemo(() => {
    return extractF1RaceDetails({
      title: eventTitle,
      subtitle: trackName
    });
  }, [eventTitle, trackName]);

  const activeRound = roundNumber ?? circuitDetails.roundNumber;
  const activeCountry = countryName ?? circuitDetails.countryName;
  const activeCity = circuitCity ?? circuitDetails.circuitCity;
  const activeCountryCode = countryCode ?? circuitDetails.countryCode;
  const activeEventTitle = eventTitle ?? circuitDetails.eventTitle;
  const activeTrackName = trackName ?? circuitDetails.circuitName;

  const sortedPilots = useMemo(() => {
    return [...pilots].sort((a, b) => a.position - b.position);
  }, [pilots]);

  const pairs = useMemo(() => {
    const list: [GridPilot, GridPilot | null][] = [];
    for (let i = 0; i < sortedPilots.length; i += 2) {
      list.push([sortedPilots[i], sortedPilots[i + 1] || null]);
    }
    return list;
  }, [sortedPilots]);

  const totalPairs = pairs.length;

  // Intro stage: 'intro' -> 'broadcast'
  const [introStage, setIntroStage] = useState<'intro' | 'broadcast'>('intro');

  // Order of presentation: bottom-to-top ("снизу вверх"), starting from the rear of the grid
  const [activePairIndex, setActivePairIndex] = useState(() => Math.max(0, totalPairs - 1));
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Track indices of rows that have been revealed as presentation ascends from rear to front
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(
    () => new Set(totalPairs > 0 ? [totalPairs - 1] : [])
  );

  // Sync index if pairs change
  useEffect(() => {
    if (totalPairs > 0 && activePairIndex >= totalPairs) {
      setActivePairIndex(totalPairs - 1);
    }
  }, [totalPairs, activePairIndex]);

  // Sync revealed rows as activePairIndex changes or ascends
  useEffect(() => {
    if (totalPairs === 0) return;
    setRevealedIndices((prev) => {
      const next = new Set(prev);
      for (let i = activePairIndex; i < totalPairs; i++) {
        next.add(i);
      }
      return next;
    });
  }, [activePairIndex, totalPairs]);

  const currentPair = pairs[activePairIndex] || [null, null];
  const [leftPilot, rightPilot] = currentPair;

  // -------------------------------------------------------------------------
  // F1 BROADCAST AUDIO CONTROLLER: Fixed at 20% volume (0.20)
  // -------------------------------------------------------------------------
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const initAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio('/audio/f1_starting_grid.mp3');
      audio.loop = true;
      audio.volume = 0.20; // Exactly 20% volume per user instruction
      audioRef.current = audio;
    }
  }, []);

  useEffect(() => {
    initAudio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [initAudio]);

  const toggleMute = useCallback(() => {
    initAudio();
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.muted = next;
        if (!next && audioRef.current.paused) {
          audioRef.current.play().catch(() => {});
        }
      }
      return next;
    });
  }, [initAudio]);

  const replayIntro = useCallback(() => {
    setIntroStage('intro');
    const lastIdx = Math.max(0, totalPairs - 1);
    setActivePairIndex(lastIdx);
    setRevealedIndices(new Set(totalPairs > 0 ? [lastIdx] : []));
  }, [totalPairs]);

  const handleSelectPair = useCallback((idx: number) => {
    setActivePairIndex(idx);
    setRevealedIndices((prev) => {
      const next = new Set(prev);
      for (let i = idx; i < totalPairs; i++) {
        next.add(i);
      }
      return next;
    });
  }, [totalPairs]);

  const skipIntro = useCallback(() => {
    setIntroStage('broadcast');
  }, []);

  // Step UP toward Pole Position (Bottom-to-Top progression: index - 1)
  const handleStepUp = useCallback(() => {
    setActivePairIndex((prev) => (prev > 0 ? prev - 1 : totalPairs - 1));
  }, [totalPairs]);

  // Step DOWN toward Rear Grid (index + 1)
  const handleStepDown = useCallback(() => {
    setActivePairIndex((prev) => (prev + 1) % Math.max(1, totalPairs));
  }, [totalPairs]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (introStage === 'intro') {
          skipIntro();
        } else {
          togglePlay();
        }
      } else if (e.code === 'ArrowUp' || e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStepUp(); // Moves up toward Pole
      } else if (e.code === 'ArrowDown' || e.code === 'ArrowRight') {
        e.preventDefault();
        handleStepDown(); // Moves down toward rear
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        replayIntro();
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [introStage, skipIntro, togglePlay, handleStepUp, handleStepDown, toggleFullscreen, replayIntro, toggleMute, onClose]);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Automatic bottom-to-top cycle timer: progresses from rear row towards Pole
  useEffect(() => {
    if (introStage !== 'broadcast' || !isPlaying || totalPairs <= 1) return;

    const timer = setInterval(() => {
      setActivePairIndex((prev) => (prev > 0 ? prev - 1 : totalPairs - 1));
    }, cycleIntervalMs);

    return () => clearInterval(timer);
  }, [introStage, isPlaying, totalPairs, cycleIntervalMs]);

  const handleImageError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  if (!leftPilot) {
    return (
      <div className="flex items-center justify-center h-full min-h-[460px] bg-[#07090E] text-neutral-400 font-mono text-sm">
        No starting grid telemetry data available for this session.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[580px] bg-[#07090E] text-white overflow-hidden select-none flex flex-col justify-between group ${className}`}
      style={{
        fontFamily: "'Titillium Web', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* ===================================================================== */}
      {/* 1. INTRO SCREEN OVERLAY (Split-Open Curtain Wipe Animation) */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {introStage === 'intro' && (
          <F1StartingGridIntro
            roundNumber={activeRound}
            countryName={activeCountry}
            circuitCity={activeCity}
            onComplete={() => setIntroStage('broadcast')}
          />
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* 2. BACKGROUND: Looping Host Country Waving Flag Video (Zero UI) */}
      {/* ===================================================================== */}
      <F1FlagVideoBackground
        countryCode={activeCountryCode}
        flagGifUrl={flagGifUrl}
        flagVideoId={flagVideoId}
      />

      {/* Broadcast Indigo Gradient & Speed Streak Overlay (softened to keep waving flag clearly visible) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060417]/80 via-[#090620]/25 to-[#0b0826]/40 pointer-events-none z-[2]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#040312]/50 via-transparent to-[#040312]/50 pointer-events-none z-[2]" />

      {/* Diagonal Neon Speed Streaks (-35deg) across background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60 z-[3]">
        {[
          { top: '18%', left: '8%', w: '130px', color: '#00d2ff' },
          { top: '28%', left: '72%', w: '160px', color: '#ff2d55' },
          { top: '45%', left: '18%', w: '90px', color: '#ffffff' },
          { top: '65%', left: '82%', w: '180px', color: '#00d2ff' },
          { top: '78%', left: '22%', w: '140px', color: '#ff9500' }
        ].map((s, i) => (
          <div
            key={`grid-bg-streak-${i}`}
            className="absolute h-[2px] rounded-full shadow-lg"
            style={{
              top: s.top,
              left: s.left,
              width: s.w,
              backgroundColor: s.color,
              boxShadow: `0 0 10px ${s.color}`,
              transform: 'rotate(-35deg)'
            }}
          />
        ))}
      </div>

      {/* Active Team Color Ambient Lighting */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 z-[3] transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at 18% 50%, ${leftPilot.team.primaryColor}88 0%, transparent 60%), radial-gradient(circle at 82% 50%, ${
            rightPilot ? rightPilot.team.primaryColor : '#ffffff'
          }88 0%, transparent 60%)`
        }}
      />

      {/* F1 Red Top Accent Line */}
      <div className="absolute top-0 inset-x-0 h-[3.5px] bg-[#E10600] z-40 shadow-[0_0_14px_#E10600]" />

      {/* ===================================================================== */}
      {/* 3. TOP BROADCAST HEADER: Official F1 Logo + Track Name | Clean Controls */}
      {/* ===================================================================== */}
      <header className="relative z-40 w-full h-14 sm:h-18 px-6 sm:px-10 flex items-center justify-between flex-shrink-0">
        {/* Left: Official White F1 Logo + Track & Grand Prix Title */}
        <div className="flex items-center gap-3 sm:gap-4 select-none">
          <img
            src="/F1-logo.png"
            alt="Formula 1"
            className="h-6 sm:h-8 object-contain drop-shadow-[0_2px_12px_rgba(255,255,255,0.4)]"
          />
          <div className="h-6 sm:h-7 w-[1.5px] bg-white/25 rounded-full" />
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-black italic tracking-wide text-white uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] font-['Titillium_Web'] leading-none">
              {activeEventTitle}
            </h1>
            {activeTrackName && (
              <span className="text-[10px] sm:text-xs font-bold tracking-widest text-neutral-300 uppercase mt-0.5 drop-shadow">
                {activeTrackName}
              </span>
            )}
          </div>
        </div>

        {/* Right: Controls Strip (30% opacity by default, 100% on hover) */}
        <div className="flex items-center gap-1.5 sm:gap-2 opacity-30 hover:opacity-100 focus-within:opacity-100 transition-all duration-300 p-1 rounded-xl bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/10 hover:border-white/25 shadow-2xl">
          <button
            type="button"
            onClick={replayIntro}
            title="Replay Intro Sequence (R)"
            className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold uppercase tracking-wider rounded-lg border border-white/15 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-200" />
            <span className="hidden md:inline">INTRO</span>
          </button>

          <button
            type="button"
            onClick={togglePlay}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold uppercase tracking-wider rounded-lg border border-white/15 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">PLAY</span>
              </>
            )}
          </button>

          {/* Stepper Buttons (Up toward Pole / Down toward Rear) */}
          <div className="flex items-center bg-white/10 rounded-lg border border-white/15 overflow-hidden">
            <button
              type="button"
              onClick={handleStepUp}
              title="Previous / Up Toward Pole (↑)"
              className="p-1.5 hover:bg-white/25 active:bg-white/30 transition-colors cursor-pointer"
            >
              <ChevronUp className="w-4 h-4 text-white" />
            </button>
            <div className="w-[1px] h-4 bg-white/20" />
            <button
              type="button"
              onClick={handleStepDown}
              title="Next / Down Toward Rear (↓)"
              className="p-1.5 hover:bg-white/25 active:bg-white/30 transition-colors cursor-pointer"
            >
              <ChevronDown className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Sound Toggle (20% volume) */}
          <button
            type="button"
            onClick={toggleMute}
            title={isMuted ? 'Включить звук темы F1 (M)' : 'Выключить звук (M)'}
            className={`px-2 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              isMuted
                ? 'bg-white/10 text-neutral-400 border-white/15 hover:text-white'
                : 'bg-[#E10600]/30 text-white border-[#E10600]/60 shadow-[0_0_12px_rgba(225,6,0,0.6)]'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#00d2ff]" />}
            <span className="text-[10px] font-bold uppercase hidden lg:inline">
              {isMuted ? 'MUTE' : 'AUDIO (20%)'}
            </span>
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            title="Fullscreen Toggle (F)"
            className="p-1.5 bg-white/10 hover:bg-white/25 active:scale-95 text-white rounded-lg border border-white/15 transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Close (Esc)"
              className="px-2.5 py-1 bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs uppercase rounded-lg border border-red-500/50 transition-all cursor-pointer ml-1"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 4. MAIN STAGE: LEFT CARD (41%) | CENTER PELOTON (18%) | RIGHT CARD (41%) */}
      {/* ===================================================================== */}
      <main className="relative flex-1 w-full flex items-center justify-between overflow-hidden min-h-0">
        {/* Row Switch Broadcast Shutter Flash */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`pair-shutter-${activePairIndex}`}
            initial={{ scaleX: 0, opacity: 0.8 }}
            animate={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-[2px] bg-[#E10600] z-40 pointer-events-none shadow-[0_0_16px_#E10600]"
          />
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`pair-content-${activePairIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 w-full h-full flex items-center justify-between"
          >
            {/* LEFT DRIVER CARD (Odd Position: P1, P3, P5... with outer vertical bar) */}
            <div className="w-[41%] h-full flex flex-col justify-between overflow-hidden">
              <F1GridDriverCard
                pilot={leftPilot}
                align="left"
                hasImageError={imgErrors[leftPilot.id]}
                onImageError={handleImageError}
              />
            </div>

            {/* CENTER ZONE: Dual-Column Peloton Flanking Twin Red Line Spine */}
            <div className="w-[18%] h-full flex flex-col items-center justify-center z-35 px-1 py-1">
              <F1StartingGridSlotDisplay
                pairs={pairs}
                activePairIndex={activePairIndex}
                revealedIndices={revealedIndices}
                onSelectPair={handleSelectPair}
              />
            </div>

            {/* RIGHT DRIVER CARD (Even Position: P2, P4, P6... with outer vertical bar) */}
            <div className="w-[41%] h-full flex flex-col justify-between overflow-hidden">
              <F1GridDriverCard
                pilot={rightPilot}
                align="right"
                hasImageError={rightPilot ? imgErrors[rightPilot.id] : false}
                onImageError={handleImageError}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default F1StartingGrid;
