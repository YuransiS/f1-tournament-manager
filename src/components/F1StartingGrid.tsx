import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import FlagIcon from './FlagIcon';

export interface GridPilot {
  id: string;
  position: number;
  realName?: string;
  nickname: string;
  driverNumber: number;
  avatarUrl: string;
  countryFlagUrl?: string; // e.g. "NL", "IT", "GB", "UA"
  lapTimeOrDelta: string; // "1:21.083" or "+0.055"
  team: {
    id: string;
    name: string;
    shortCode: string; // e.g. "VER", "ALB", "HAM"
    primaryColor: string; // Hex
    secondaryColor: string; // Hex
    logoUrl: string;
    backgroundPatternUrl?: string;
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

// Ordinal suffix helper (1 -> 1ST, 2 -> 2ND, 3 -> 3RD, 4 -> 4TH...)
function getOrdinalSuffix(n: number): string {
  const s = ['TH', 'ST', 'ND', 'RD'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Crisp stylized SVG fallback when driver portrait fails or during offline mode
const DriverAvatarFallback: React.FC<{ pilot: GridPilot; isRight?: boolean }> = ({ pilot, isRight }) => {
  return (
    <div className="w-full h-full flex items-end justify-center relative select-none pointer-events-none pb-2">
      <svg
        viewBox="0 0 400 620"
        className={`w-full max-h-[78vh] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] ${
          isRight ? 'scale-x-[-1]' : ''
        }`}
      >
        <defs>
          <linearGradient id={`suitGrad-${pilot.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={pilot.team.primaryColor} />
            <stop offset="55%" stopColor="#141923" />
            <stop offset="100%" stopColor="#080a0f" />
          </linearGradient>
          <linearGradient id={`accentGrad-${pilot.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={pilot.team.secondaryColor || '#ffffff'} />
            <stop offset="100%" stopColor={pilot.team.primaryColor} />
          </linearGradient>
          <linearGradient id={`visorGrad-${pilot.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d2ff" />
            <stop offset="50%" stopColor="#3a7bd5" />
            <stop offset="100%" stopColor="#9d50bb" />
          </linearGradient>
        </defs>

        {/* Torso / Racing Suit */}
        <path
          d="M90,620 C90,490 120,410 150,370 C130,335 120,300 120,250 C120,165 160,115 200,115 C240,115 280,165 280,250 C280,300 270,335 250,370 C280,410 310,490 310,620 Z"
          fill={`url(#suitGrad-${pilot.id})`}
        />
        {/* Suit shoulder and collar stripes */}
        <path d="M125,400 L150,370 L170,415 L145,445 Z" fill={`url(#accentGrad-${pilot.id})`} opacity="0.9" />
        <path d="M275,400 L250,370 L230,415 L255,445 Z" fill={`url(#accentGrad-${pilot.id})`} opacity="0.9" />
        <rect x="175" y="325" width="50" height="295" rx="3" fill="#000000" opacity="0.25" />

        {/* F1 Helmet */}
        <ellipse cx="200" cy="210" rx="64" ry="78" fill="#1b202a" stroke={pilot.team.secondaryColor} strokeWidth="3.5" />
        {/* Helmet Top Aero Stripe */}
        <path d="M185,135 Q200,130 215,135 L218,175 Q200,172 182,175 Z" fill={pilot.team.secondaryColor} opacity="0.8" />
        {/* Iridescent Visor */}
        <path
          d="M146,200 Q200,185 254,200 Q244,232 200,238 Q156,232 146,200 Z"
          fill={`url(#visorGrad-${pilot.id})`}
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.85"
        />
        <ellipse cx="195" cy="204" rx="20" ry="3" fill="#ffffff" opacity="0.5" />

        {/* Driver number embossed on chest */}
        <text
          x="200"
          y="490"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="52"
          fontWeight="900"
          fontFamily="'Titillium Web', sans-serif"
          opacity="0.25"
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
  cycleIntervalMs = 3000,
  autoPlay = true,
  onClose,
  className = ""
}) => {
  const sortedPilots = React.useMemo(() => {
    return [...pilots].sort((a, b) => a.position - b.position);
  }, [pilots]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Automatic cycle timer (no progress bar)
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
      <div className="flex items-center justify-center h-full min-h-[500px] bg-neutral-950 text-white font-mono">
        No pilots available for starting grid.
      </div>
    );
  }

  const currentRowNumber = activePairIndex + 1;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[640px] bg-[#05070B] text-white overflow-hidden select-none flex flex-col justify-between ${className}`}
      style={{
        fontFamily: "'Titillium Web', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* ========================================================================= */}
      {/* TOP BROADCAST HEADER (Section В) */}
      {/* ========================================================================= */}
      <header className="relative z-30 w-full px-5 py-3.5 flex items-center justify-between border-b border-white/10 bg-gradient-to-b from-black/95 via-black/75 to-transparent backdrop-blur-md">
        {/* Left: Official F1 Event Branding */}
        <div className="flex items-center gap-3.5">
          <div className="px-3 py-1 bg-[#E10600] rounded-sm shadow-[0_0_16px_rgba(225,6,0,0.6)]">
            <span className="font-black italic tracking-tighter text-base sm:text-lg leading-none text-white font-['Titillium_Web']">
              F1
            </span>
          </div>

          <div className="flex flex-col">
            <h1 className="text-xs sm:text-sm md:text-base font-black tracking-wider uppercase text-white drop-shadow-md">
              {eventTitle}
            </h1>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-widest text-neutral-400 uppercase">
              <span className="text-[#E10600] font-black">●</span>
              <span>{sessionSubtitle}</span>
              <span className="text-white/30">•</span>
              <span className="text-amber-400 font-bold">
                ROW {currentRowNumber} OF {totalPairs}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Broadcast Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 active:scale-95 text-[11px] font-bold uppercase tracking-wider rounded border border-white/20 transition-all cursor-pointer backdrop-blur-md"
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

          <div className="flex items-center bg-white/10 rounded border border-white/20 overflow-hidden">
            <button
              onClick={handlePrev}
              title="Previous Row (Left Arrow)"
              className="p-1.5 hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-white" />
            </button>
            <div className="w-[1px] h-3.5 bg-white/20" />
            <button
              onClick={handleNext}
              title="Next Row (Right Arrow)"
              className="p-1.5 hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen (F)"
            className="p-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded border border-white/20 transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              title="Close (Esc)"
              className="px-2 py-1 bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs uppercase rounded border border-red-500/50 transition-all cursor-pointer ml-1"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN SPLIT-SCREEN CARDS (Section А) */}
      {/* ========================================================================= */}
      <div className="relative flex-1 w-full h-full flex overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`pair-${activePairIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="absolute inset-0 w-full h-full flex"
          >
            {/* ------------------------------------------------------------- */}
            {/* LEFT PILOT CARD (Odd Position: 1, 3, 5...) */}
            {/* ------------------------------------------------------------- */}
            <div className="relative w-1/2 h-full flex flex-col justify-between overflow-hidden border-r border-white/10">
              {/* Background gradient & team glow */}
              <div
                className="absolute inset-0 transition-colors duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 20% 45%, ${leftPilot.team.primaryColor}77 0%, ${leftPilot.team.primaryColor}22 45%, #05070B 85%)`
                }}
              />

              {/* High-tech racing grid texture */}
              <div
                className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 20px)`
                }}
              />

              {/* Giant watermark logo */}
              {leftPilot.team.logoUrl && (
                <div className="absolute -left-12 top-1/4 w-[420px] h-[420px] opacity-[0.06] pointer-events-none select-none flex items-center justify-center">
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
                  className="text-[10px] lg:text-xs font-black tracking-[0.35em] text-white/25 uppercase whitespace-nowrap"
                  style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)'
                  }}
                >
                  {leftPilot.team.name}
                </div>
              </div>

              {/* Giant Stylized Driver Number (Watermark on OUTER LEFT) */}
              <div className="absolute left-10 lg:left-14 bottom-4 z-10 pointer-events-none select-none">
                <span
                  className="text-7xl sm:text-8xl lg:text-9xl font-black italic tracking-tighter leading-none text-white/10 drop-shadow-2xl"
                  style={{
                    fontFamily: "'Chakra Petch', 'Titillium Web', sans-serif",
                    WebkitTextStroke: `2px ${leftPilot.team.primaryColor}88`
                  }}
                >
                  {leftPilot.driverNumber}
                </span>
              </div>

              {/* Pilot Avatar / 3D Cutout Layer */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 25, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 bottom-0 flex items-end justify-center z-15 pointer-events-none"
              >
                {!imgErrors[leftPilot.id] && leftPilot.avatarUrl ? (
                  <img
                    src={leftPilot.avatarUrl}
                    alt={leftPilot.nickname}
                    onError={() => handleImageError(leftPilot.id)}
                    className="max-h-[78vh] w-auto max-w-[82%] object-contain object-bottom drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)]"
                  />
                ) : (
                  <DriverAvatarFallback pilot={leftPilot} isRight={false} />
                )}
              </motion.div>

              {/* Top info: Position & Country Flag (OUTER LEFT ONLY) */}
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="relative z-20 pt-6 pl-10 lg:pl-14 flex items-center gap-3.5"
              >
                <span
                  className="text-5xl sm:text-6xl lg:text-7xl font-black italic tracking-tighter leading-none text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.95)]"
                  style={{
                    fontFamily: "'Chakra Petch', 'Titillium Web', sans-serif"
                  }}
                >
                  {getOrdinalSuffix(leftPilot.position)}
                </span>

                {leftPilot.countryFlagUrl && (
                  <div className="flex items-center rounded overflow-hidden shadow-lg border border-white/20">
                    <FlagIcon countryCode={leftPilot.countryFlagUrl} style={{ width: '28px', height: '18px' }} />
                  </div>
                )}
              </motion.div>

              {/* Bottom info section: Signature, Nickname, Team & Timing */}
              <div className="relative z-20 pl-10 lg:pl-14 pr-16 lg:pr-20 pb-5 mt-auto">
                {/* Decorative Signature (Layer 1) */}
                <motion.div
                  initial={{ scale: 0.85, opacity: 0, rotate: -4 }}
                  animate={{ scale: 1, opacity: 1, rotate: -4 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                  className="mb-[-8px] ml-2 pointer-events-none select-none"
                  style={{
                    fontFamily: "'Caveat', cursive",
                    color: leftPilot.team.secondaryColor || '#FDE047',
                    textShadow: `0 0 16px ${leftPilot.team.secondaryColor || '#FDE047'}66`
                  }}
                >
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide">
                    {leftPilot.realName || leftPilot.nickname}
                  </span>
                </motion.div>

                {/* Nickname (Layer 2) */}
                <motion.div
                  initial={{ x: -35, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="relative flex flex-col"
                >
                  <h2
                    className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black italic uppercase tracking-tighter text-white leading-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.95)]"
                    style={{
                      fontFamily: "'Chakra Petch', 'Titillium Web', sans-serif"
                    }}
                  >
                    {leftPilot.nickname}
                  </h2>
                  {leftPilot.realName && leftPilot.realName.toUpperCase() !== leftPilot.nickname.toUpperCase() && (
                    <span className="text-xs font-semibold tracking-widest text-neutral-300 uppercase mt-0.5">
                      {leftPilot.realName}
                    </span>
                  )}
                </motion.div>

                {/* Team & Lap Time Strip */}
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.2 }}
                  className="mt-3 inline-flex items-center gap-3 px-3.5 py-2 bg-black/80 backdrop-blur-md rounded border border-white/20 shadow-xl"
                >
                  {leftPilot.team.logoUrl && (
                    <img
                      src={leftPilot.team.logoUrl}
                      alt=""
                      className="h-6 w-6 sm:h-8 sm:w-8 object-contain filter drop-shadow"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs font-bold uppercase text-neutral-300">
                      {leftPilot.team.name}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-xs sm:text-sm font-black tracking-wider px-2 py-0.5 rounded text-white ${
                          leftPilot.position === 1
                            ? 'bg-[#E10600] shadow-[0_0_10px_rgba(225,6,0,0.6)]'
                            : 'bg-white/20'
                        }`}
                      >
                        {leftPilot.position === 1 ? `POLE • ${leftPilot.lapTimeOrDelta}` : leftPilot.lapTimeOrDelta}
                      </span>
                    </div>
                  </div>
                </motion.div>
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
                      background: `radial-gradient(circle at 80% 45%, ${rightPilot.team.primaryColor}77 0%, ${rightPilot.team.primaryColor}22 45%, #05070B 85%)`
                    }}
                  />

                  {/* High-tech racing grid texture */}
                  <div
                    className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
                    style={{
                      backgroundImage: `repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 20px)`
                    }}
                  />

                  {/* Giant watermark logo */}
                  {rightPilot.team.logoUrl && (
                    <div className="absolute -right-12 top-1/4 w-[420px] h-[420px] opacity-[0.06] pointer-events-none select-none flex items-center justify-center">
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
                      className="text-[10px] lg:text-xs font-black tracking-[0.35em] text-white/25 uppercase whitespace-nowrap"
                      style={{
                        writingMode: 'vertical-rl'
                      }}
                    >
                      {rightPilot.team.name}
                    </div>
                  </div>

                  {/* Giant Stylized Driver Number (Watermark on OUTER RIGHT) */}
                  <div className="absolute right-10 lg:right-14 bottom-4 z-10 pointer-events-none select-none">
                    <span
                      className="text-7xl sm:text-8xl lg:text-9xl font-black italic tracking-tighter leading-none text-white/10 drop-shadow-2xl"
                      style={{
                        fontFamily: "'Chakra Petch', 'Titillium Web', sans-serif",
                        WebkitTextStroke: `2px ${rightPilot.team.primaryColor}88`
                      }}
                    >
                      {rightPilot.driverNumber}
                    </span>
                  </div>

                  {/* Pilot Avatar / 3D Cutout Layer */}
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 25, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 bottom-0 flex items-end justify-center z-15 pointer-events-none"
                  >
                    {!imgErrors[rightPilot.id] && rightPilot.avatarUrl ? (
                      <img
                        src={rightPilot.avatarUrl}
                        alt={rightPilot.nickname}
                        onError={() => handleImageError(rightPilot.id)}
                        className="max-h-[78vh] w-auto max-w-[82%] object-contain object-bottom drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)]"
                      />
                    ) : (
                      <DriverAvatarFallback pilot={rightPilot} isRight={true} />
                    )}
                  </motion.div>

                  {/* Top info: Position & Country Flag (OUTER RIGHT ONLY) */}
                  <motion.div
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                    className="relative z-20 pt-6 pr-10 lg:pr-14 flex items-center gap-3.5 flex-row-reverse"
                  >
                    <span
                      className="text-5xl sm:text-6xl lg:text-7xl font-black italic tracking-tighter leading-none text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.95)]"
                      style={{
                        fontFamily: "'Chakra Petch', 'Titillium Web', sans-serif"
                      }}
                    >
                      {getOrdinalSuffix(rightPilot.position)}
                    </span>

                    {rightPilot.countryFlagUrl && (
                      <div className="flex items-center rounded overflow-hidden shadow-lg border border-white/20">
                        <FlagIcon countryCode={rightPilot.countryFlagUrl} style={{ width: '28px', height: '18px' }} />
                      </div>
                    )}
                  </motion.div>

                  {/* Bottom info section: Signature, Nickname, Team & Timing */}
                  <div className="relative z-20 pr-10 lg:pr-14 pl-16 lg:pl-20 pb-5 mt-auto flex flex-col items-end text-right">
                    {/* Decorative Signature (Layer 1) */}
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0, rotate: 4 }}
                      animate={{ scale: 1, opacity: 1, rotate: 4 }}
                      transition={{ duration: 0.35, delay: 0.15 }}
                      className="mb-[-8px] mr-2 pointer-events-none select-none"
                      style={{
                        fontFamily: "'Caveat', cursive",
                        color: rightPilot.team.secondaryColor || '#FDE047',
                        textShadow: `0 0 16px ${rightPilot.team.secondaryColor || '#FDE047'}66`
                      }}
                    >
                      <span className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide">
                        {rightPilot.realName || rightPilot.nickname}
                      </span>
                    </motion.div>

                    {/* Nickname (Layer 2) */}
                    <motion.div
                      initial={{ x: 35, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.35, delay: 0.1 }}
                      className="relative flex flex-col items-end"
                    >
                      <h2
                        className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black italic uppercase tracking-tighter text-white leading-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.95)]"
                        style={{
                          fontFamily: "'Chakra Petch', 'Titillium Web', sans-serif"
                        }}
                      >
                        {rightPilot.nickname}
                      </h2>
                      {rightPilot.realName && rightPilot.realName.toUpperCase() !== rightPilot.nickname.toUpperCase() && (
                        <span className="text-xs font-semibold tracking-widest text-neutral-300 uppercase mt-0.5">
                          {rightPilot.realName}
                        </span>
                      )}
                    </motion.div>

                    {/* Team & Lap Time Strip */}
                    <motion.div
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.35, delay: 0.2 }}
                      className="mt-3 inline-flex items-center gap-3 px-3.5 py-2 bg-black/80 backdrop-blur-md rounded border border-white/20 shadow-xl flex-row-reverse"
                    >
                      {rightPilot.team.logoUrl && (
                        <img
                          src={rightPilot.team.logoUrl}
                          alt=""
                          className="h-6 w-6 sm:h-8 sm:w-8 object-contain filter drop-shadow"
                        />
                      )}
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] sm:text-xs font-bold uppercase text-neutral-300">
                          {rightPilot.team.name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs sm:text-sm font-black tracking-wider px-2 py-0.5 rounded text-white bg-white/20">
                            {rightPilot.lapTimeOrDelta}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-600 font-mono text-xs">
                  EMPTY GRID SLOT
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* CENTRAL STARTING GRID LADDER / POSITION TOWER (Section Б) */}
        {/* ========================================================================= */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-40 w-[114px] sm:w-[122px] pointer-events-none flex flex-col items-center">
          {/* Ladder Header Badge */}
          <div className="pointer-events-auto mb-1.5 px-2 py-0.5 bg-black/95 border border-white/30 rounded shadow-2xl backdrop-blur-md flex items-center gap-1.5 text-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
            <span className="text-[9px] font-black tracking-widest text-white uppercase font-['Titillium_Web']">
              STARTING GRID
            </span>
          </div>

          {/* Staggered Vertical Positions Ladder */}
          <div className="pointer-events-auto flex flex-col gap-1 w-full max-h-[70vh] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1 px-1">
            {pairs.map((pair, pIdx) => {
              const [pA, pB] = pair;
              const isActive = pIdx === activePairIndex;

              return (
                <div
                  key={`ladder-pair-${pIdx}`}
                  onClick={() => setActivePairIndex(pIdx)}
                  className={`group relative flex items-center justify-between p-1 rounded cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-black font-black border-2 border-white shadow-[0_0_18px_rgba(255,255,255,0.9)] scale-105 z-10'
                      : 'bg-black/80 text-white/90 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  {/* Left Slot (e.g. 1 | VER) */}
                  <div className="flex items-center gap-1 flex-1 overflow-hidden">
                    <span
                      className="w-1.5 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: pA.team.primaryColor }}
                    />
                    <span
                      className={`text-[11px] font-black leading-none ${
                        isActive ? 'text-black' : 'text-neutral-400'
                      }`}
                    >
                      {pA.position}
                    </span>
                    <span
                      className={`text-[11px] tracking-tight uppercase leading-none truncate ${
                        isActive ? 'text-black font-black' : 'text-white font-bold'
                      }`}
                    >
                      {pA.team.shortCode || pA.nickname.slice(0, 3)}
                    </span>
                  </div>

                  {/* Divider */}
                  <div
                    className={`w-[1px] h-3.5 mx-0.5 flex-shrink-0 ${
                      isActive ? 'bg-black/30' : 'bg-white/20'
                    }`}
                  />

                  {/* Right Slot (e.g. 2 | NOR) */}
                  {pB ? (
                    <div className="flex items-center justify-end gap-1 flex-1 overflow-hidden">
                      <span
                        className={`text-[11px] tracking-tight uppercase leading-none truncate ${
                          isActive ? 'text-black font-black' : 'text-white font-bold'
                        }`}
                      >
                        {pB.team.shortCode || pB.nickname.slice(0, 3)}
                      </span>
                      <span
                        className={`text-[11px] font-black leading-none ${
                          isActive ? 'text-black' : 'text-neutral-400'
                        }`}
                      >
                        {pB.position}
                      </span>
                      <span
                        className="w-1.5 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: pB.team.primaryColor }}
                      />
                    </div>
                  ) : (
                    <div className="flex-1 text-center text-[9px] text-neutral-500">—</div>
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
