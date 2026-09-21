import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, Maximize2, Minimize2, RotateCcw, Flag } from 'lucide-react';

export interface GridPilot {
  id: string;
  position: number; // 1, 2, 3 ... 20
  realName?: string; // e.g. "Max Verstappen"
  nickname: string; // e.g. "SUPERMAX" or "VERSTAPPEN"
  driverNumber: number; // e.g. 1, 16, 44, 77
  avatarUrl: string; // Transparent PNG / SVG of avatar
  countryFlagUrl?: string; // Country flag URL or emoji
  lapTimeOrDelta: string; // Pole time ("1:21.083") or delta ("+0.055")
  team: {
    id: string;
    name: string; // e.g. "Oracle Red Bull Racing"
    shortCode: string; // e.g. "VER", "ALB", "HAM" (for central grid)
    primaryColor: string; // HEX for accents and background (e.g. "#00327D")
    secondaryColor: string; // HEX secondary (e.g. "#EF1A2D")
    logoUrl: string; // Vector or transparent team logo
    backgroundPatternUrl?: string; // Carbon / chevron / texture
  };
}

export interface F1StartingGridProps {
  pilots: GridPilot[];
  eventTitle?: string;
  sessionSubtitle?: string;
  cycleIntervalMs?: number;
  autoPlay?: boolean;
  onClose?: () => void;
  className?: string;
}

// Ordinal suffix helper (1 -> 1ST, 2 -> 2ND, 3 -> 3RD, 4 -> 4TH)
function getOrdinalSuffix(n: number): string {
  const s = ['TH', 'ST', 'ND', 'RD'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Fallback driver avatar SVG when image fails to load or during offline dev
const DriverAvatarFallback: React.FC<{ pilot: GridPilot; isRight?: boolean }> = ({ pilot, isRight }) => {
  return (
    <div className="w-full h-full flex items-end justify-center relative select-none pointer-events-none">
      <svg
        viewBox="0 0 400 600"
        className={`w-full max-h-[85vh] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] ${
          isRight ? 'scale-x-[-1]' : ''
        }`}
      >
        <defs>
          <linearGradient id={`suitGrad-${pilot.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={pilot.team.primaryColor} />
            <stop offset="60%" stopColor="#111622" />
            <stop offset="100%" stopColor="#06080d" />
          </linearGradient>
          <linearGradient id={`accentGrad-${pilot.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={pilot.team.secondaryColor || '#ffffff'} />
            <stop offset="100%" stopColor={pilot.team.primaryColor} />
          </linearGradient>
        </defs>

        {/* Silhouette body & racing overalls */}
        <path
          d="M110,600 C110,480 130,420 150,380 C130,340 120,310 120,270 C120,180 160,130 200,130 C240,130 280,180 280,270 C280,310 270,340 250,380 C270,420 290,480 290,600 Z"
          fill={`url(#suitGrad-${pilot.id})`}
        />
        {/* Racing suit shoulder stripes */}
        <path
          d="M130,400 L150,380 L165,420 L145,440 Z"
          fill={`url(#accentGrad-${pilot.id})`}
          opacity="0.85"
        />
        <path
          d="M270,400 L250,380 L235,420 L255,440 Z"
          fill={`url(#accentGrad-${pilot.id})`}
          opacity="0.85"
        />
        {/* Helmet / Visor */}
        <ellipse cx="200" cy="220" rx="60" ry="75" fill="#181c24" stroke={pilot.team.secondaryColor} strokeWidth="3" />
        <path
          d="M150,210 Q200,195 250,210 Q240,240 200,245 Q160,240 150,210 Z"
          fill="#00e5ff"
          opacity="0.75"
        />
        {/* Driver number on suit */}
        <text
          x="200"
          y="490"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="48"
          fontWeight="900"
          fontFamily="'Titillium Web', sans-serif"
          opacity="0.3"
        >
          {pilot.driverNumber}
        </text>
      </svg>
    </div>
  );
};

export const F1StartingGrid: React.FC<F1StartingGridProps> = ({
  pilots = [],
  eventTitle = "FORMULA 1 GRAN PREMIO D'ITALIA 2026",
  sessionSubtitle = "STARTING GRID • PROVISIONAL CLASSIFICATION",
  cycleIntervalMs = 4500,
  autoPlay = true,
  onClose,
  className = ""
}) => {
  // Sort pilots by position ascending (1, 2, 3...)
  const sortedPilots = React.useMemo(() => {
    return [...pilots].sort((a, b) => a.position - b.position);
  }, [pilots]);

  // Pair up pilots: Row 1 = [P1, P2], Row 2 = [P3, P4], etc.
  const pairs = React.useMemo(() => {
    const list: [GridPilot, GridPilot | null][] = [];
    for (let i = 0; i < sortedPilots.length; i += 2) {
      list.push([sortedPilots[i], sortedPilots[i + 1] || null]);
    }
    return list;
  }, [sortedPilots]);

  const [activePairIndex, setActivePairIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPairs = pairs.length;
  const currentPair = pairs[activePairIndex] || [null, null];
  const [leftPilot, rightPilot] = currentPair;

  // Next / Prev navigation
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

  // Keyboard navigation (Space to pause/play, Arrows for next/prev, F for fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

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
      } else if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, handleNext, handlePrev, toggleFullscreen, onClose]);

  // Fullscreen change listener
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Timer loop for automatic cycling
  useEffect(() => {
    if (!isPlaying || totalPairs <= 1) return;

    const timer = setInterval(() => {
      setActivePairIndex((prev) => (prev + 1) % totalPairs);
    }, cycleIntervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, totalPairs, cycleIntervalMs, activePairIndex]);

  const handleImageError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  if (!leftPilot) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-neutral-950 text-white font-mono p-8">
        No pilots available for starting grid.
      </div>
    );
  }

  // Row number (1-indexed)
  const currentRowNumber = activePairIndex + 1;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-screen min-h-[680px] bg-[#05070B] text-white overflow-hidden select-none font-sans flex flex-col justify-between ${className}`}
      style={{
        fontFamily: "'Titillium Web', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* ========================================================================= */}
      {/* TOP BROADCAST HEADER (Section В) */}
      {/* ========================================================================= */}
      <header className="relative z-30 w-full px-6 py-4 flex items-center justify-between border-b border-white/10 bg-gradient-to-b from-black/90 via-black/60 to-transparent backdrop-blur-sm">
        {/* Left: Official F1 Event Branding */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-[#E10600] rounded-sm shadow-[0_0_20px_rgba(225,6,0,0.5)]">
            <span className="font-black italic tracking-tighter text-lg leading-none text-white font-['Titillium_Web']">
              F1
            </span>
          </div>

          <div className="flex flex-col">
            <h1 className="text-sm md:text-base lg:text-lg font-black tracking-wider uppercase text-white drop-shadow-md">
              {eventTitle}
            </h1>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-neutral-400 uppercase">
              <span className="text-[#E10600] font-black tracking-normal">●</span>
              <span>{sessionSubtitle}</span>
              <span className="text-white/30">•</span>
              <span className="text-amber-400 font-bold">
                ROW {currentRowNumber} OF {totalPairs}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Streamer / Broadcast Controls */}
        <div className="flex items-center gap-2.5">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold uppercase tracking-wider rounded-sm border border-white/20 transition-all cursor-pointer backdrop-blur-md"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">AUTOPLAY</span>
              </>
            )}
          </button>

          {/* Prev / Next controls */}
          <div className="flex items-center bg-white/10 rounded-sm border border-white/20 overflow-hidden">
            <button
              onClick={handlePrev}
              title="Previous Pair (Left Arrow)"
              className="p-1.5 hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <div className="w-[1px] h-4 bg-white/20" />
            <button
              onClick={handleNext}
              title="Next Pair (Right Arrow)"
              className="p-1.5 hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen (F)"
            className="p-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-sm border border-white/20 transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Optional Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              title="Close (Esc)"
              className="px-2.5 py-1 bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs uppercase rounded-sm border border-red-500/50 transition-all cursor-pointer ml-1"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Cycle Progress Bar (animates smoothly across cycleIntervalMs) */}
      <div className="relative z-30 w-full h-[3px] bg-white/10 overflow-hidden">
        {isPlaying && (
          <motion.div
            key={activePairIndex}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: cycleIntervalMs / 1000, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-red-600 via-amber-400 to-white shadow-[0_0_8px_#ffffff]"
          />
        )}
      </div>

      {/* ========================================================================= */}
      {/* MAIN SPLIT-SCREEN CARDS (Section А) */}
      {/* ========================================================================= */}
      <div className="relative flex-1 w-full h-full flex overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`pair-${activePairIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            className="absolute inset-0 w-full h-full flex"
          >
            {/* ------------------------------------------------------------- */}
            {/* LEFT PILOT CARD (Odd Position: 1, 3, 5...) */}
            {/* ------------------------------------------------------------- */}
            <div className="relative w-1/2 h-full flex flex-col justify-between overflow-hidden border-r border-white/15">
              {/* Background gradient & team glow */}
              <div
                className="absolute inset-0 transition-colors duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 15% 40%, ${leftPilot.team.primaryColor}88 0%, ${leftPilot.team.primaryColor}33 35%, #06080D 85%)`
                }}
              />

              {/* High-tech racing grid / carbon fiber texture */}
              <div
                className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 24px)`
                }}
              />

              {/* Giant team watermark logo */}
              {leftPilot.team.logoUrl && (
                <div className="absolute -left-16 top-1/4 w-[480px] h-[480px] opacity-[0.07] pointer-events-none select-none flex items-center justify-center">
                  <img
                    src={leftPilot.team.logoUrl}
                    alt=""
                    className="w-full h-full object-contain filter grayscale invert"
                  />
                </div>
              )}

              {/* Vertical Team Name Strip along outer left edge */}
              <div className="absolute left-2 top-0 bottom-0 z-10 flex items-center justify-center pointer-events-none select-none">
                <div
                  className="text-xs lg:text-sm font-black tracking-[0.35em] text-white/30 uppercase whitespace-nowrap"
                  style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)'
                  }}
                >
                  {leftPilot.team.name}
                </div>
              </div>

              {/* Pilot Avatar / 3D Cutout Layer */}
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 bottom-0 flex items-end justify-center z-10 pointer-events-none"
              >
                {!imgErrors[leftPilot.id] && leftPilot.avatarUrl ? (
                  <img
                    src={leftPilot.avatarUrl}
                    alt={leftPilot.nickname}
                    onError={() => handleImageError(leftPilot.id)}
                    className="max-h-[85vh] w-auto max-w-[85%] object-contain object-bottom drop-shadow-[0_25px_35px_rgba(0,0,0,0.95)] transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <DriverAvatarFallback pilot={leftPilot} isRight={false} />
                )}
              </motion.div>

              {/* Top info section: Position Badge */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="relative z-20 pt-8 pl-12 pr-6 flex items-start justify-between"
              >
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black italic tracking-tighter leading-none text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]"
                    style={{
                      fontFamily: "'Chakra Petch', 'Titillium Web', sans-serif"
                    }}
                  >
                    {getOrdinalSuffix(leftPilot.position)}
                  </span>
                </div>

                {/* Country Flag Badge */}
                {leftPilot.countryFlagUrl && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-md border border-white/20 shadow-lg">
                    {leftPilot.countryFlagUrl.length <= 4 ? (
                      <span className="text-2xl">{leftPilot.countryFlagUrl}</span>
                    ) : (
                      <img src={leftPilot.countryFlagUrl} alt="flag" className="h-5 w-7 object-cover rounded-sm" />
                    )}
                  </div>
                )}
              </motion.div>

              {/* Bottom info section: Signature, Nickname, Driver Number & Timing Strip */}
              <div className="relative z-20 pl-12 pr-6 pb-6 mt-auto">
                {/* Decorative Handwritten Signature (Layer 1) */}
                <motion.div
                  initial={{ scale: 0.85, opacity: 0, rotate: -6 }}
                  animate={{ scale: 1, opacity: 1, rotate: -6 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="mb-[-12px] ml-4 pointer-events-none select-none"
                  style={{
                    fontFamily: "'Caveat', cursive",
                    color: leftPilot.team.secondaryColor || '#FDE047',
                    textShadow: `0 0 20px ${leftPilot.team.secondaryColor || '#FDE047'}66`
                  }}
                >
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide">
                    {leftPilot.realName || leftPilot.nickname}
                  </span>
                </motion.div>

                {/* Driver Nickname & Real Name (Layer 2) */}
                <motion.div
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="relative flex flex-col"
                >
                  <h2
                    className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black italic uppercase tracking-tighter text-white leading-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]"
                    style={{
                      fontFamily: "'Chakra Petch', 'Titillium Web', sans-serif"
                    }}
                  >
                    {leftPilot.nickname}
                  </h2>
                  {leftPilot.realName && leftPilot.realName.toUpperCase() !== leftPilot.nickname.toUpperCase() && (
                    <span className="text-xs sm:text-sm font-semibold tracking-widest text-neutral-300 uppercase mt-1">
                      {leftPilot.realName}
                    </span>
                  )}
                </motion.div>

                {/* Big Driver Number & Timing Banner */}
                <div className="mt-4 flex items-end justify-between gap-4">
                  {/* Footer Timing & Team Card */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    className="flex items-center gap-3.5 px-4 py-2.5 bg-black/75 backdrop-blur-md rounded-md border border-white/20 shadow-2xl"
                  >
                    {leftPilot.team.logoUrl && (
                      <img
                        src={leftPilot.team.logoUrl}
                        alt={leftPilot.team.name}
                        className="h-8 w-8 sm:h-10 sm:w-10 object-contain filter drop-shadow"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                        {leftPilot.team.name}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-sm sm:text-base font-black tracking-wider px-2 py-0.5 rounded text-white ${
                            leftPilot.position === 1
                              ? 'bg-[#E10600] shadow-[0_0_12px_rgba(225,6,0,0.6)]'
                              : 'bg-white/20'
                          }`}
                        >
                          {leftPilot.position === 1 ? `POLE • ${leftPilot.lapTimeOrDelta}` : leftPilot.lapTimeOrDelta}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Giant Racing Number */}
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.45, delay: 0.2 }}
                    className="flex items-baseline pr-4"
                  >
                    <span
                      className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black italic tracking-tighter leading-none text-white/90 drop-shadow-[0_10px_20px_rgba(0,0,0,0.95)]"
                      style={{
                        fontFamily: "'Chakra Petch', 'Titillium Web', sans-serif",
                        WebkitTextStroke: `2px ${leftPilot.team.primaryColor}`
                      }}
                    >
                      {leftPilot.driverNumber}
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* RIGHT PILOT CARD (Even Position: 2, 4, 6...) */}
            {/* ------------------------------------------------------------- */}
            <div className="relative w-1/2 h-full flex flex-col justify-between overflow-hidden">
              {rightPilot ? (
                <>
                  {/* Background gradient & team glow */}
                  <div
                    className="absolute inset-0 transition-colors duration-700 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 85% 40%, ${rightPilot.team.primaryColor}88 0%, ${rightPilot.team.primaryColor}33 35%, #06080D 85%)`
                    }}
                  />

                  {/* High-tech racing grid / carbon fiber texture */}
                  <div
                    className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none"
                    style={{
                      backgroundImage: `repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 24px)`
                    }}
                  />

                  {/* Giant team watermark logo */}
                  {rightPilot.team.logoUrl && (
                    <div className="absolute -right-16 top-1/4 w-[480px] h-[480px] opacity-[0.07] pointer-events-none select-none flex items-center justify-center">
                      <img
                        src={rightPilot.team.logoUrl}
                        alt=""
                        className="w-full h-full object-contain filter grayscale invert"
                      />
                    </div>
                  )}

                  {/* Vertical Team Name Strip along outer right edge */}
                  <div className="absolute right-2 top-0 bottom-0 z-10 flex items-center justify-center pointer-events-none select-none">
                    <div
                      className="text-xs lg:text-sm font-black tracking-[0.35em] text-white/30 uppercase whitespace-nowrap"
                      style={{
                        writingMode: 'vertical-rl'
                      }}
                    >
                      {rightPilot.team.name}
                    </div>
                  </div>

                  {/* Pilot Avatar / 3D Cutout Layer */}
                  <motion.div
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 30, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 bottom-0 flex items-end justify-center z-10 pointer-events-none"
                  >
                    {!imgErrors[rightPilot.id] && rightPilot.avatarUrl ? (
                      <img
                        src={rightPilot.avatarUrl}
                        alt={rightPilot.nickname}
                        onError={() => handleImageError(rightPilot.id)}
                        className="max-h-[85vh] w-auto max-w-[85%] object-contain object-bottom drop-shadow-[0_25px_35px_rgba(0,0,0,0.95)] transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <DriverAvatarFallback pilot={rightPilot} isRight={true} />
                    )}
                  </motion.div>

                  {/* Top info section: Position Badge */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="relative z-20 pt-8 pl-6 pr-12 flex items-start justify-between flex-row-reverse"
                  >
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black italic tracking-tighter leading-none text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]"
                        style={{
                          fontFamily: "'Chakra Petch', 'Titillium Web', sans-serif"
                        }}
                      >
                        {getOrdinalSuffix(rightPilot.position)}
                      </span>
                    </div>

                    {/* Country Flag Badge */}
                    {rightPilot.countryFlagUrl && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-md border border-white/20 shadow-lg">
                        {rightPilot.countryFlagUrl.length <= 4 ? (
                          <span className="text-2xl">{rightPilot.countryFlagUrl}</span>
                        ) : (
                          <img src={rightPilot.countryFlagUrl} alt="flag" className="h-5 w-7 object-cover rounded-sm" />
                        )}
                      </div>
                    )}
                  </motion.div>

                  {/* Bottom info section: Signature, Nickname, Driver Number & Timing Strip */}
                  <div className="relative z-20 pl-6 pr-12 pb-6 mt-auto">
                    {/* Decorative Handwritten Signature (Layer 1) */}
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0, rotate: 6 }}
                      animate={{ scale: 1, opacity: 1, rotate: 6 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="mb-[-12px] ml-4 pointer-events-none select-none text-right pr-4"
                      style={{
                        fontFamily: "'Caveat', cursive",
                        color: rightPilot.team.secondaryColor || '#FDE047',
                        textShadow: `0 0 20px ${rightPilot.team.secondaryColor || '#FDE047'}66`
                      }}
                    >
                      <span className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide">
                        {rightPilot.realName || rightPilot.nickname}
                      </span>
                    </motion.div>

                    {/* Driver Nickname & Real Name (Layer 2) */}
                    <motion.div
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                      className="relative flex flex-col items-end text-right"
                    >
                      <h2
                        className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black italic uppercase tracking-tighter text-white leading-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]"
                        style={{
                          fontFamily: "'Chakra Petch', 'Titillium Web', sans-serif"
                        }}
                      >
                        {rightPilot.nickname}
                      </h2>
                      {rightPilot.realName && rightPilot.realName.toUpperCase() !== rightPilot.nickname.toUpperCase() && (
                        <span className="text-xs sm:text-sm font-semibold tracking-widest text-neutral-300 uppercase mt-1">
                          {rightPilot.realName}
                        </span>
                      )}
                    </motion.div>

                    {/* Big Driver Number & Timing Banner */}
                    <div className="mt-4 flex items-end justify-between gap-4 flex-row-reverse">
                      {/* Footer Timing & Team Card */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.25 }}
                        className="flex items-center gap-3.5 px-4 py-2.5 bg-black/75 backdrop-blur-md rounded-md border border-white/20 shadow-2xl flex-row-reverse text-right"
                      >
                        {rightPilot.team.logoUrl && (
                          <img
                            src={rightPilot.team.logoUrl}
                            alt={rightPilot.team.name}
                            className="h-8 w-8 sm:h-10 sm:w-10 object-contain filter drop-shadow"
                          />
                        )}
                        <div className="flex flex-col">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                            {rightPilot.team.name}
                          </span>
                          <div className="flex items-center justify-end gap-2 mt-0.5">
                            <span className="text-sm sm:text-base font-black tracking-wider px-2 py-0.5 rounded text-white bg-white/20">
                              {rightPilot.lapTimeOrDelta}
                            </span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Giant Racing Number */}
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.45, delay: 0.2 }}
                        className="flex items-baseline pl-4"
                      >
                        <span
                          className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black italic tracking-tighter leading-none text-white/90 drop-shadow-[0_10px_20px_rgba(0,0,0,0.95)]"
                          style={{
                            fontFamily: "'Chakra Petch', 'Titillium Web', sans-serif",
                            WebkitTextStroke: `2px ${rightPilot.team.primaryColor}`
                          }}
                        >
                          {rightPilot.driverNumber}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-600 font-mono text-sm">
                  EMPTY GRID SLOT
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* CENTRAL STARTING GRID LADDER / POSITION TOWER (Section Б) */}
        {/* ========================================================================= */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 z-40 w-[96px] sm:w-[110px] md:w-[124px] pointer-events-none flex flex-col items-center justify-center">
          {/* Ladder Header Badge */}
          <div className="pointer-events-auto mb-2 px-2.5 py-1 bg-black/90 border border-white/30 rounded shadow-2xl backdrop-blur-md flex items-center gap-1.5 text-center">
            <span className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse" />
            <span className="text-[10px] md:text-[11px] font-black tracking-widest text-white uppercase font-['Titillium_Web']">
              STARTING GRID
            </span>
          </div>

          {/* Staggered Vertical Positions Ladder */}
          <div className="pointer-events-auto flex flex-col gap-1 w-full max-h-[75vh] overflow-y-auto no-scrollbar py-2 px-1">
            {pairs.map((pair, pIdx) => {
              const [pA, pB] = pair;
              const isActive = pIdx === activePairIndex;

              return (
                <div
                  key={`ladder-pair-${pIdx}`}
                  onClick={() => setActivePairIndex(pIdx)}
                  className={`group relative flex items-center justify-between p-1 rounded cursor-pointer transition-all duration-300 ${
                    isActive
                      ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.7)] scale-105 z-10'
                      : 'bg-black/60 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  {/* Left Slot (e.g. 1 | VER) */}
                  <div className="flex items-center gap-1 flex-1">
                    {/* Team Color Pill */}
                    <span
                      className="w-1.5 h-5 rounded-full"
                      style={{ backgroundColor: pA.team.primaryColor }}
                    />
                    <span
                      className={`text-xs font-black ${
                        isActive ? 'text-black' : 'text-neutral-400'
                      }`}
                    >
                      {pA.position}
                    </span>
                    <span
                      className={`text-xs font-bold tracking-tight uppercase ${
                        isActive ? 'text-black font-black' : 'text-white'
                      }`}
                    >
                      {pA.team.shortCode || pA.nickname.slice(0, 3)}
                    </span>
                  </div>

                  {/* Staggered divider */}
                  <div
                    className={`w-[1px] h-4 mx-0.5 ${
                      isActive ? 'bg-black/40' : 'bg-white/20'
                    }`}
                  />

                  {/* Right Slot (e.g. 2 | NOR) */}
                  {pB ? (
                    <div className="flex items-center justify-end gap-1 flex-1">
                      <span
                        className={`text-xs font-bold tracking-tight uppercase ${
                          isActive ? 'text-black font-black' : 'text-white'
                        }`}
                      >
                        {pB.team.shortCode || pB.nickname.slice(0, 3)}
                      </span>
                      <span
                        className={`text-xs font-black ${
                          isActive ? 'text-black' : 'text-neutral-400'
                        }`}
                      >
                        {pB.position}
                      </span>
                      {/* Team Color Pill */}
                      <span
                        className="w-1.5 h-5 rounded-full"
                        style={{ backgroundColor: pB.team.primaryColor }}
                      />
                    </div>
                  ) : (
                    <div className="flex-1 text-center text-[10px] text-neutral-500">—</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default F1StartingGrid;
