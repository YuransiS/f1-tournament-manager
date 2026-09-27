import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, Maximize2, Minimize2, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import F1GridDriverCard from './F1GridDriverCard';
import F1StartingGridSlotDisplay from './F1StartingGridSlotDisplay';

export interface GridPilot {
  id: string;
  position: number;
  realName?: string;
  nickname: string;
  driverNumber: number;
  avatarUrl: string;
  countryFlagUrl?: string; // e.g. "NL", "IT", "GB", "UA"
  lapTimeOrDelta: string; // "1:28.997" or "+0.055"
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
  countryCode?: string; // Host country code (e.g. 'jp', 'bh', 'it', 'us', 'sa', 'sg')
  flagGifUrl?: string; // Optional custom flag GIF URL
  flagVideoId?: string; // Optional YouTube video ID override
  cycleIntervalMs?: number;
  autoPlay?: boolean;
  onClose?: () => void;
  className?: string;
}

// Map of host countries to 4K / HD looping waving flag animation video IDs
export const COUNTRY_FLAG_YOUTUBE_MAP: Record<string, string> = {
  bh: 'EY_88yHI9Uc', // Bahrain
  sa: 'eDBnesS7_BY', // Saudi Arabia
  au: 'oh_a7IR9wBQ', // Australia
  az: '7upmTbfsa90', // Azerbaijan
  us: 'O1TWZ_OOHMU', // USA (Miami & Austin)
  it: 'frO_J_MubJY', // Italy (Imola & Monza)
  mc: 'OFVVct6DVyw', // Monaco
  es: 't-JBSXdJnR8', // Spain
  ca: '7Ry6UhLNOaI', // Canada
  at: 'vBIHzWBmcCU', // Austria
  gb: 'v7w4CMPkJsA', // Great Britain
  hu: 'qvym0lkBL2s', // Hungary
  be: 'RuhgyWAIMnQ', // Belgium
  nl: 'u2P2xBi6ygg', // Netherlands
  sg: 'WqwBlGrAf6A', // Singapore
  jp: 'x0Za2ghUHvw', // Japan
};

export const F1StartingGrid: React.FC<F1StartingGridProps> = ({
  pilots = [],
  eventTitle = 'GULF AIR BAHRAIN GRAND PRIX',
  trackName = 'BAHRAIN INTERNATIONAL CIRCUIT',
  countryCode = 'jp',
  flagGifUrl,
  flagVideoId,
  cycleIntervalMs = 2800,
  autoPlay = true,
  onClose,
  className = ''
}) => {
  const activeCountryCode = (countryCode || 'jp').toLowerCase();
  const activeVideoId = flagVideoId || COUNTRY_FLAG_YOUTUBE_MAP[activeCountryCode] || 'x0Za2ghUHvw';
  const flagGifSrc = flagGifUrl || `/flags/animated/${activeCountryCode}.gif`;

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

  const [activePairIndex, setActivePairIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIntroActive, setIsIntroActive] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPairs = pairs.length;
  const currentPair = pairs[activePairIndex] || [null, null];
  const [leftPilot, rightPilot] = currentPair;

  // -------------------------------------------------------------------------
  // F1 BROADCAST AUDIO CONTROLLER
  // Persistent singleton audio instance that doesn't reset on row cycle or prop change
  // -------------------------------------------------------------------------
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const initAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio('/audio/f1_starting_grid.mp3');
      audio.loop = true;
      audio.volume = 0.45;
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

  // Keep pair index bounded when pilot list changes
  useEffect(() => {
    if (activePairIndex >= totalPairs && totalPairs > 0) {
      setActivePairIndex(0);
    }
  }, [activePairIndex, totalPairs]);

  const handleNext = useCallback(() => {
    setActivePairIndex((prev) => (prev + 1) % Math.max(1, totalPairs));
  }, [totalPairs]);

  const handlePrev = useCallback(() => {
    setActivePairIndex((prev) => (prev - 1 + totalPairs) % Math.max(1, totalPairs));
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

  const replayIntro = useCallback(() => {
    setIsIntroActive(true);
    setActivePairIndex(0);
    setTimeout(() => {
      setIsIntroActive(false);
    }, 900);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
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
  }, [togglePlay, handleNext, handlePrev, toggleFullscreen, replayIntro, toggleMute, onClose]);

  // Sync fullscreen change listener
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Automatic cycle timer
  useEffect(() => {
    if (!isPlaying || isIntroActive || totalPairs <= 1) return;

    const timer = setInterval(() => {
      setActivePairIndex((prev) => (prev + 1) % totalPairs);
    }, cycleIntervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, isIntroActive, totalPairs, cycleIntervalMs]);

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
      className={`relative w-full h-full min-h-[560px] bg-[#07090E] text-white overflow-hidden select-none flex flex-col justify-between ${className}`}
      style={{
        fontFamily: "'Titillium Web', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* ===================================================================== */}
      {/* BACKGROUND LAYER: Dynamic Flag Video / Looping GIF + Cinematic Vignette */}
      {/* ===================================================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#07090E]">
        {/* Offline & Instant Fallback GIF */}
        <img
          src={flagGifSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-35 filter blur-[0.5px] scale-105 pointer-events-none"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Dynamic 4K/HD Video Background */}
        {activeVideoId && (
          <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center pointer-events-none">
            <iframe
              key={activeVideoId}
              src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${activeVideoId}&playsinline=1&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0`}
              className="pointer-events-none border-0 select-none"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(1.3)',
                width: 'max(100%, 178vh, 178%)',
                height: 'max(100%, 56.25vw, 56.25%)',
                minWidth: '100%',
                minHeight: '100%',
                backgroundColor: '#07090E',
                filter: 'brightness(0.85) contrast(1.1)'
              }}
              allow="autoplay; encrypted-media; picture-in-picture"
              tabIndex={-1}
              title="Host Country Flag Video Animation"
            />
          </div>
        )}

        {/* Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040508] via-[#040508]/40 to-[#040508]/60 pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040508]/70 via-transparent to-[#040508]/70 pointer-events-none z-[1]" />

        {/* Dynamic Ambient Team Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 z-[2] transition-colors duration-700"
          style={{
            background: `radial-gradient(circle at 20% 50%, ${leftPilot.team.primaryColor}55 0%, transparent 60%), radial-gradient(circle at 80% 50%, ${
              rightPilot ? rightPilot.team.primaryColor : '#ffffff'
            }55 0%, transparent 60%)`
          }}
        />

        {/* F1 Red Top Accent Line */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-[#E10600] z-40 shadow-[0_0_12px_#E10600]" />

        {/* F1 Official Logo Watermark in bottom left */}
        <div className="absolute bottom-3 left-4 sm:left-6 opacity-60 pointer-events-none z-10">
          <img src="/F1-logo.png" alt="F1" className="h-3.5 sm:h-4 object-contain drop-shadow" />
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TOP BROADCAST BAR: F1 Badge (Left) & Controls (Right) */}
      {/* ===================================================================== */}
      <header className="relative z-40 w-full h-14 sm:h-16 px-4 sm:px-8 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-black/40 flex-shrink-0">
        {/* Left: Event & Track Badge */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg border border-white/20 bg-black/60 shadow max-w-[340px] sm:max-w-[560px] lg:max-w-[720px]">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-[#E10600] uppercase font-['Titillium_Web'] leading-none">
                FORMULA 1
              </span>
              {trackName && (
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider hidden sm:inline truncate">
                  • {trackName}
                </span>
              )}
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-wide text-neutral-100 uppercase truncate leading-tight mt-0.5 font-['Titillium_Web']">
              {eventTitle}
            </span>
          </div>
        </div>

        {/* Right: Broadcast HUD Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={replayIntro}
            title="Replay Intro Sequence (R)"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded border border-white/20 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-200" />
            <span className="hidden md:inline">INTRO</span>
          </button>

          <button
            type="button"
            onClick={togglePlay}
            title={isPlaying ? 'Pause Cycle (Space)' : 'Start Auto Cycle (Space)'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded border border-white/20 transition-all cursor-pointer"
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

          {/* Stepper Buttons */}
          <div className="flex items-center bg-white/10 rounded border border-white/20 overflow-hidden">
            <button
              type="button"
              onClick={handlePrev}
              title="Previous Row (←)"
              className="p-1.5 hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <div className="w-[1px] h-4 bg-white/20" />
            <button
              type="button"
              onClick={handleNext}
              title="Next Row (→)"
              className="p-1.5 hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleMute}
            title={isMuted ? 'Включить звук темы F1 (M)' : 'Выключить звук (M)'}
            className={`p-1.5 rounded border transition-all cursor-pointer flex items-center gap-1 ${
              isMuted
                ? 'bg-white/10 text-neutral-400 border-white/20 hover:text-white'
                : 'bg-[#E10600]/30 text-white border-[#E10600]/60 shadow-[0_0_10px_rgba(225,6,0,0.5)]'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#00d2ff]" />}
            <span className="text-[10px] font-bold uppercase hidden lg:inline">
              {isMuted ? 'MUTE' : 'AUDIO'}
            </span>
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            title="Fullscreen Toggle (F)"
            className="p-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded border border-white/20 transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Close (Esc)"
              className="px-2 py-1 bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs uppercase rounded border border-red-500/50 transition-all cursor-pointer ml-1"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* ===================================================================== */}
      {/* MAIN STAGE: LEFT DRIVER CARD | CENTRAL WIREFRAME SLOTS | RIGHT DRIVER CARD */}
      {/* Clean 3-zone layout with dedicated center lane for zero overlap collisions */}
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
            {/* LEFT DRIVER CARD (Odd Position: P1, P3, P5...) */}
            <div className="w-[42%] h-full flex flex-col justify-between">
              <F1GridDriverCard
                pilot={leftPilot}
                align="left"
                hasImageError={imgErrors[leftPilot.id]}
                onImageError={handleImageError}
              />
            </div>

            {/* CENTER ZONE: Track Slot Display Graphic */}
            <div className="w-[16%] flex flex-col items-center justify-center z-35 px-1">
              <F1StartingGridSlotDisplay
                pairs={pairs}
                activePairIndex={activePairIndex}
                onSelectPair={(idx) => setActivePairIndex(idx)}
              />
            </div>

            {/* RIGHT DRIVER CARD (Even Position: P2, P4, P6...) */}
            <div className="w-[42%] h-full flex flex-col justify-between">
              <F1GridDriverCard
                pilot={rightPilot}
                align="right"
                hasImageError={rightPilot ? imgErrors[rightPilot.id] : false}
                onImageError={handleImageError}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Intro sequence overlay */}
        <AnimatePresence>
          {isIntroActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
            >
              <div className="px-8 py-5 rounded-2xl border-2 border-white/40 bg-gradient-to-b from-[#161a24] to-[#080a0f] shadow-2xl flex flex-col items-center">
                <span className="text-xs font-black tracking-[0.35em] text-[#E10600] uppercase font-['Titillium_Web'] mb-1">
                  OFFICIAL BROADCAST
                </span>
                <span className="text-3xl sm:text-5xl font-black italic tracking-[0.2em] text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                  STARTING GRID
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default F1StartingGrid;
