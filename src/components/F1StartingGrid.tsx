import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, Maximize2, Minimize2, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import F1GridDriverCard from './F1GridDriverCard';
import F1StartingGridSlotDisplay from './F1StartingGridSlotDisplay';
import F1FlagVideoBackground, { COUNTRY_FLAG_YOUTUBE_MAP } from './F1FlagVideoBackground';

export { COUNTRY_FLAG_YOUTUBE_MAP };

export interface GridPilot {
  id: string;
  position: number;
  realName?: string;
  nickname: string;
  driverNumber: number;
  avatarUrl: string;
  countryFlagUrl?: string;
  lapTimeOrDelta: string;
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
  flagGifUrl?: string;
  flagVideoId?: string;
  cycleIntervalMs?: number;
  autoPlay?: boolean;
  onClose?: () => void;
  className?: string;
}

export const F1StartingGrid: React.FC<F1StartingGridProps> = ({
  pilots = [],
  eventTitle = 'JAPANESE GRAND PRIX',
  trackName = 'SUZUKA INTERNATIONAL RACING COURSE',
  countryCode = 'jp',
  flagGifUrl,
  flagVideoId,
  cycleIntervalMs = 2800,
  autoPlay = true,
  onClose,
  className = ''
}) => {
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

  // Authentic 3-stage F1 TV intro state machine: 'pill' -> 'beam' -> 'broadcast'
  const [introStage, setIntroStage] = useState<'pill' | 'beam' | 'broadcast'>('pill');
  const [activePairIndex, setActivePairIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPairs = pairs.length;
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
      audio.volume = 0.20; // 20% volume as requested
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

  // -------------------------------------------------------------------------
  // AUTHENTIC INTRO TIMELINE (Pill -> Visor Beam -> Full Television Broadcast)
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (introStage === 'broadcast') return;

    if (introStage === 'pill') {
      const t1 = setTimeout(() => setIntroStage('beam'), 800);
      return () => clearTimeout(t1);
    } else if (introStage === 'beam') {
      const t2 = setTimeout(() => setIntroStage('broadcast'), 550);
      return () => clearTimeout(t2);
    }
  }, [introStage]);

  const replayIntro = useCallback(() => {
    setIntroStage('pill');
    setActivePairIndex(0);
  }, []);

  const skipIntro = useCallback(() => {
    setIntroStage('broadcast');
  }, []);

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (introStage !== 'broadcast') {
          skipIntro();
        } else {
          togglePlay();
        }
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
  }, [introStage, skipIntro, togglePlay, handleNext, handlePrev, toggleFullscreen, replayIntro, toggleMute, onClose]);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Automatic cycle timer (only active once in full broadcast stage)
  useEffect(() => {
    if (introStage !== 'broadcast' || !isPlaying || totalPairs <= 1) return;

    const timer = setInterval(() => {
      setActivePairIndex((prev) => (prev + 1) % totalPairs);
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
      onClick={introStage !== 'broadcast' ? skipIntro : undefined}
    >
      {/* ===================================================================== */}
      {/* BACKGROUND: Full-Bleed Waving Flag Video with Zero UI & Zero Controls */}
      {/* ===================================================================== */}
      <F1FlagVideoBackground
        countryCode={countryCode}
        flagGifUrl={flagGifUrl}
        flagVideoId={flagVideoId}
      />

      {/* Cinematic Vignette Overlay & Accent Lighting */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#040508] via-[#040508]/30 to-[#040508]/60 pointer-events-none z-[2]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#040508]/75 via-transparent to-[#040508]/75 pointer-events-none z-[2]" />

      {/* Ambient Team Glows */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 z-[3] transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at 18% 50%, ${leftPilot.team.primaryColor}66 0%, transparent 60%), radial-gradient(circle at 82% 50%, ${
            rightPilot ? rightPilot.team.primaryColor : '#ffffff'
          }66 0%, transparent 60%)`
        }}
      />

      {/* F1 Red Top Accent Line */}
      <div className="absolute top-0 inset-x-0 h-[3.5px] bg-[#E10600] z-40 shadow-[0_0_14px_#E10600]" />

      {/* F1 Official Logo Watermark in bottom left */}
      <div className="absolute bottom-3 left-6 opacity-60 pointer-events-none z-10">
        <img src="/F1-logo.png" alt="F1" className="h-4 object-contain drop-shadow" />
      </div>

      {/* ===================================================================== */}
      {/* INTRO STAGE 1: INTRO PILL */}
      {/* ===================================================================== */}
      {introStage === 'pill' && (
        <motion.div
          key="frame-1-pill"
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.15, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-50 flex items-center justify-center select-none cursor-pointer"
        >
          <div className="relative px-12 sm:px-16 py-6 sm:py-8 rounded-2xl bg-gradient-to-b from-[#161a24]/95 to-[#080a0f]/98 border-2 border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 inset-x-0 h-[4px] bg-[#E10600] shadow-[0_0_16px_#E10600]" />
            <span className="text-xs sm:text-sm font-black tracking-[0.35em] text-neutral-300 uppercase font-['Titillium_Web'] mb-1">
              STARTING
            </span>
            <span className="text-4xl sm:text-6xl font-black italic tracking-[0.15em] text-white uppercase font-['Titillium_Web'] drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              GRID
            </span>
          </div>
        </motion.div>
      )}

      {/* ===================================================================== */}
      {/* INTRO STAGE 2: HORIZONTAL VISOR BEAM EXPANSION */}
      {/* ===================================================================== */}
      {introStage === 'beam' && (
        <motion.div
          key="frame-2-beam"
          initial={{ scaleX: 0.25, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-50 h-24 bg-gradient-to-r from-transparent via-[#0e121a]/95 to-transparent border-y-2 border-white/50 flex items-center justify-center overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-[3px] bg-[#E10600] shadow-[0_0_20px_#E10600]" />
          <svg className="absolute -top-3 left-1/4 w-12 h-6" viewBox="0 0 50 25" fill="none">
            <path d="M5,20 C15,5 35,5 45,20" stroke="#00d2ff" strokeWidth="3" opacity="0.9" />
          </svg>
          <svg className="absolute -top-3 right-1/4 w-12 h-6" viewBox="0 0 50 25" fill="none">
            <path d="M5,20 C15,5 35,5 45,20" stroke="#E10600" strokeWidth="3" opacity="0.9" />
          </svg>
          <span className="text-2xl sm:text-4xl font-black italic tracking-[0.3em] text-white uppercase font-['Titillium_Web'] drop-shadow-[0_0_25px_rgba(255,255,255,0.7)]">
            STARTING GRID
          </span>
        </motion.div>
      )}

      {/* ===================================================================== */}
      {/* INTRO STAGE 3: FULL BROADCAST STAGE */}
      {/* ===================================================================== */}
      {introStage === 'broadcast' && (
        <motion.div
          key="frame-3-broadcast"
          initial={{ scaleY: 0.1, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30 w-full h-full flex flex-col justify-between"
        >
          {/* ----------------------------------------------------------------- */}
          {/* TOP BROADCAST BAR: F1 Logo + Big Grand Prix Title | Hover Controls */}
          {/* ----------------------------------------------------------------- */}
          <header className="relative z-40 w-full h-16 sm:h-20 px-6 sm:px-10 flex items-center justify-between flex-shrink-0">
            {/* Left: Official F1 Logo + Big Bold Grand Prix Title */}
            <div className="flex items-center gap-3 sm:gap-4 select-none">
              <img
                src="/F1-logo.png"
                alt="Formula 1"
                className="h-7 sm:h-9 object-contain drop-shadow-[0_2px_12px_rgba(225,6,0,0.7)]"
              />
              <div className="h-6 sm:h-8 w-[2px] bg-white/20 rounded-full" />
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black italic tracking-wide text-white uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] font-['Titillium_Web'] leading-none">
                  {eventTitle}
                </h1>
                {trackName && (
                  <span className="text-[11px] sm:text-xs font-bold tracking-widest text-neutral-300 uppercase mt-1 drop-shadow">
                    {trackName}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Controls Strip (Clean glassmorphism, fades in smoothly on hover) */}
            <div className="flex items-center gap-1.5 sm:gap-2 opacity-30 hover:opacity-100 focus-within:opacity-100 transition-all duration-300 p-1.5 rounded-xl bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/10 hover:border-white/25 shadow-2xl">
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
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold uppercase tracking-wider rounded-lg border border-white/15 transition-all cursor-pointer"
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
              <div className="flex items-center bg-white/10 rounded-lg border border-white/15 overflow-hidden">
                <button
                  type="button"
                  onClick={handlePrev}
                  title="Previous Row (←)"
                  className="p-1.5 hover:bg-white/25 active:bg-white/30 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <div className="w-[1px] h-4 bg-white/20" />
                <button
                  type="button"
                  onClick={handleNext}
                  title="Next Row (→)"
                  className="p-1.5 hover:bg-white/25 active:bg-white/30 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
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
          </header>

          {/* ----------------------------------------------------------------- */}
          {/* MAIN STAGE: EXPANDED SCALE (43% Left | 14% Center | 43% Right) */}
          {/* ----------------------------------------------------------------- */}
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
                <div className="w-[43%] h-full flex flex-col justify-between">
                  <F1GridDriverCard
                    pilot={leftPilot}
                    align="left"
                    hasImageError={imgErrors[leftPilot.id]}
                    onImageError={handleImageError}
                  />
                </div>

                {/* CENTER ZONE: Track Slot Display Graphic */}
                <div className="w-[14%] flex flex-col items-center justify-center z-35 px-1">
                  <F1StartingGridSlotDisplay
                    pairs={pairs}
                    activePairIndex={activePairIndex}
                    onSelectPair={(idx) => setActivePairIndex(idx)}
                  />
                </div>

                {/* RIGHT DRIVER CARD (Even Position: P2, P4, P6...) */}
                <div className="w-[43%] h-full flex flex-col justify-between">
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
        </motion.div>
      )}
    </div>
  );
};

export default F1StartingGrid;
