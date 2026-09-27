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
  startWithSound?: boolean;
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
  startWithSound = false,
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
  const [isMuted, setIsMuted] = useState(!startWithSound);

  const initAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio('/audio/f1_starting_grid.mp3');
      audio.loop = true;
      audio.volume = 0.20; // Exactly 20% volume per user instruction
      audio.muted = !startWithSound;
      audioRef.current = audio;
    }
  }, [startWithSound]);

  useEffect(() => {
    initAudio();
    if (startWithSound && audioRef.current) {
      audioRef.current.muted = false;
      setIsMuted(false);
      audioRef.current.play().catch(() => {
        // Fallback if browser blocks sound
        setIsMuted(true);
      });
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [initAudio, startWithSound]);

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

      {/* Deep Broadcast Indigo/Violet Overlay (captures all mouse movement to shield YouTube iframe) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c072b]/80 via-[#160a3a]/75 to-[#0a041f]/85 pointer-events-auto z-[2]" />

      {/* Official F1 Broadcast Diagonal Neon Speed Laser Streaks (-35deg) matching media_1790524589122.png */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-80 z-[3]">
        {[
          { top: '15%', left: '8%', w: '130px', color: '#ff2d55' },
          { top: '22%', left: '36%', w: '150px', color: '#00d2ff' },
          { top: '48%', left: '32%', w: '95px', color: '#00d2ff' },
          { top: '32%', left: '60%', w: '140px', color: '#ec4899' },
          { top: '16%', left: '80%', w: '160px', color: '#00d2ff' },
          { top: '45%', left: '84%', w: '120px', color: '#ff2d55' }
        ].map((s, i) => (
          <div
            key={`f1-bg-laser-${i}`}
            className="absolute h-[3px] rounded-full"
            style={{
              top: s.top,
              left: s.left,
              width: s.w,
              backgroundColor: s.color,
              boxShadow: `0 0 12px ${s.color}, 0 0 20px ${s.color}`,
              transform: 'rotate(-35deg)'
            }}
          />
        ))}
      </div>

      {/* F1 Red Top Accent Line */}
      <div className="absolute top-0 inset-x-0 h-[3.5px] bg-[#E10600] z-40 shadow-[0_0_14px_#E10600]" />

      {/* ===================================================================== */}
      {/* 3. FLOATING OVERLAYS: Top-Left Event Badge & Top-Right Controls Strip  */}
      {/* Takes 0px from layout height, freeing 100% space for 1:1 pilots        */}
      {/* ===================================================================== */}
      <div className="absolute top-3 left-4 sm:top-4 sm:left-8 z-40 flex items-center gap-3 sm:gap-4 select-none pointer-events-none">
        <img
          src="/F1-logo.png"
          alt="Formula 1"
          className="h-6 sm:h-8 lg:h-9 object-contain drop-shadow-[0_2px_14px_rgba(255,255,255,0.45)]"
        />
        <div className="h-6 sm:h-8 w-[2px] bg-white/30 rounded-full" />
        <div className="flex flex-col">
          <h1 className="text-base sm:text-2xl lg:text-3xl font-black italic tracking-wide text-white uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] font-['Titillium_Web'] leading-none">
            {activeEventTitle}
          </h1>
          {activeTrackName && (
            <span className="text-[10px] sm:text-xs lg:text-sm font-bold tracking-widest text-neutral-300 uppercase mt-0.5 drop-shadow">
              {activeTrackName}
            </span>
          )}
        </div>
      </div>

      {/* Top-Right: Controls Strip (Hidden by default (opacity-0), reveals on hover) */}
      <div className="absolute top-3 right-4 sm:top-4 sm:right-8 z-50 flex items-center gap-1.5 sm:gap-2 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 p-1.5 rounded-xl bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/10 hover:border-white/25 shadow-2xl pointer-events-auto">
        <button
          type="button"
          onClick={replayIntro}
          title="Replay Intro Sequence (R)"
          className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold uppercase tracking-wider rounded-lg border border-white/15 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-neutral-200" />
          <span className="hidden md:inline">INTRO</span>
        </button>

        <button
          type="button"
          onClick={togglePlay}
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold uppercase tracking-wider rounded-lg border border-white/15 transition-all cursor-pointer"
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
          className={`px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
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
            className="px-2.5 py-1.5 bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs uppercase rounded-lg border border-red-500/50 transition-all cursor-pointer ml-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 4. MAIN STAGE: 50/50 FULL-SCREEN DRIVER DIVISION + CENTER OVERLAY     */}
      {/* Left 50% Pilot | Right 50% Pilot | Center Layered Grid Overlay       */}
      {/* ===================================================================== */}
      <main className="relative flex-1 w-full h-full overflow-hidden min-h-0">
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
            className="absolute inset-0 w-full h-full"
          >
            {/* LEFT DRIVER CARD: Takes full left 50% of the screen */}
            <div className="absolute left-0 top-0 bottom-0 w-1/2 flex flex-col justify-end overflow-hidden z-10">
              <F1GridDriverCard
                pilot={leftPilot}
                align="left"
                hasImageError={imgErrors[leftPilot.id]}
                onImageError={handleImageError}
              />
            </div>

            {/* RIGHT DRIVER CARD: Takes full right 50% of the screen */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 flex flex-col justify-end overflow-hidden z-10">
              <F1GridDriverCard
                pilot={rightPilot}
                align="right"
                hasImageError={rightPilot ? imgErrors[rightPilot.id] : false}
                onImageError={handleImageError}
              />
            </div>

            {/* CENTER ZONE: Layered over the drivers down the center */}
            <div className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-[520px] sm:w-[580px] lg:w-[660px] 2xl:w-[740px] flex flex-col items-center justify-center z-30 px-1 py-2 pointer-events-auto">
              <F1StartingGridSlotDisplay
                pairs={pairs}
                activePairIndex={activePairIndex}
                revealedIndices={revealedIndices}
                onSelectPair={handleSelectPair}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default F1StartingGrid;
