import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import FlagIcon from './FlagIcon';
import TeamLogo from './TeamLogo';

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
  trackName?: string;
  cycleIntervalMs?: number;
  autoPlay?: boolean;
  onClose?: () => void;
  className?: string;
}

// Ordinal suffix helper (1 -> 1st, 2 -> 2nd, 3 -> 3rd, 4 -> 4th...)
function getOrdinalParts(n: number): { num: number; suffix: string } {
  const s = ['TH', 'ST', 'ND', 'RD'];
  const v = n % 100;
  const suffix = s[(v - 20) % 10] || s[v] || s[0];
  return { num: n, suffix: suffix.toLowerCase() };
}

// Split "Max Verstappen" into "Max" and "VERSTAPPEN"
function parseDriverName(fullName: string, nickname: string) {
  const target = (fullName || nickname || '').trim();
  const parts = target.split(' ');
  if (parts.length <= 1) {
    return { firstName: '', lastName: target.toUpperCase() };
  }
  const lastName = parts[parts.length - 1].toUpperCase();
  const firstName = parts.slice(0, -1).join(' ');
  return { firstName, lastName };
}

// Crisp stylized SVG fallback when driver portrait fails or during offline mode
const DriverAvatarFallback: React.FC<{ pilot: GridPilot; isRight?: boolean }> = ({ pilot, isRight }) => {
  return (
    <div className="w-full h-full flex items-end justify-center relative select-none pointer-events-none pb-2">
      <svg
        viewBox="0 0 400 620"
        className={`w-full max-h-full object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] ${
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

        <path
          d="M90,620 C90,490 120,410 150,370 C130,335 120,300 120,250 C120,165 160,115 200,115 C240,115 280,165 280,250 C280,300 270,335 250,370 C280,410 310,490 310,620 Z"
          fill={`url(#suitGrad-${pilot.id})`}
        />
        <path d="M125,400 L150,370 L170,415 L145,445 Z" fill={`url(#accentGrad-${pilot.id})`} opacity="0.9" />
        <path d="M275,400 L250,370 L230,415 L255,445 Z" fill={`url(#accentGrad-${pilot.id})`} opacity="0.9" />
        <rect x="175" y="325" width="50" height="295" rx="3" fill="#000000" opacity="0.25" />

        <ellipse cx="200" cy="210" rx="64" ry="78" fill="#1b202a" stroke={pilot.team.secondaryColor} strokeWidth="3.5" />
        <path d="M185,135 Q200,130 215,135 L218,175 Q200,172 182,175 Z" fill={pilot.team.secondaryColor} opacity="0.8" />
        <path
          d="M146,200 Q200,185 254,200 Q244,232 200,238 Q156,232 146,200 Z"
          fill={`url(#visorGrad-${pilot.id})`}
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.85"
        />
        <ellipse cx="195" cy="204" rx="20" ry="3" fill="#ffffff" opacity="0.5" />

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

// =========================================================================
// CENTRAL DYNAMIC SHIFTING F1 STARTING GRID TRACK
// Shifts vertically to follow the active row down the starting grid list
// =========================================================================
interface StartingGridTrackProps {
  pairs: [GridPilot, GridPilot | null][];
  activePairIndex: number;
  onSelectPair: (idx: number) => void;
}

const StartingGridTrack: React.FC<StartingGridTrackProps> = ({
  pairs,
  activePairIndex,
  onSelectPair
}) => {
  const TRACK_HEIGHT = 320;
  const ROW_HEIGHT = 60;
  const centerY = TRACK_HEIGHT / 2 - ROW_HEIGHT / 2; // 130px

  return (
    <div className="relative w-[210px] sm:w-[240px] h-[320px] overflow-hidden select-none">
      {/* Top & Bottom Vignette masks for smooth track depth */}
      <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-[#0a0d14] via-[#0a0d14]/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-[#040508] via-[#040508]/80 to-transparent z-20 pointer-events-none" />

      {/* Center asphalt dashed track line */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] border-l-2 border-dashed border-white/20 z-0 pointer-events-none" />

      {/* Dynamic Sliding Grid Slots Container */}
      <motion.div
        animate={{ y: centerY - activePairIndex * ROW_HEIGHT }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="absolute top-0 inset-x-0 w-full flex flex-col items-center z-10"
      >
        {pairs.map((pair, pIdx) => {
          const [pA, pB] = pair;
          const isActive = pIdx === activePairIndex;
          const leftCode = pA.nickname ? pA.nickname.slice(0, 3).toUpperCase() : (pA.team.shortCode || 'DRV');
          const rightCode = pB
            ? (pB.nickname ? pB.nickname.slice(0, 3).toUpperCase() : (pB.team.shortCode || 'DRV'))
            : '—';

          return (
            <div
              key={`track-row-${pIdx}`}
              onClick={() => onSelectPair(pIdx)}
              style={{ height: `${ROW_HEIGHT}px` }}
              className={`relative w-full flex items-center justify-between px-2 transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'opacity-100 scale-105 z-30'
                  : 'opacity-35 hover:opacity-75 scale-95 z-10'
              }`}
            >
              {/* Left Slot (Odd, Pole-stepped forward) */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border transition-all ${
                  isActive
                    ? 'bg-[#060910] border-white shadow-[0_0_20px_rgba(255,255,255,0.85)] ring-1 ring-white/60'
                    : 'bg-black/85 border-white/20'
                }`}
                style={{
                  borderLeftColor: pA.team.primaryColor,
                  borderLeftWidth: '4px'
                }}
              >
                <span className="text-xs font-black text-[#E10600] font-mono leading-none">
                  {pA.position}
                </span>
                <span className="text-xs sm:text-sm font-black text-white tracking-wider font-['Titillium_Web'] leading-none">
                  {leftCode}
                </span>
              </div>

              {/* Connecting slot guide line across asphalt */}
              <div
                className={`h-[1px] flex-1 mx-2 transition-colors ${
                  isActive ? 'bg-white/50' : 'bg-white/15'
                }`}
              />

              {/* Right Slot (Even, stepped backward) */}
              {pB ? (
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border transition-all mt-2.5 ${
                    isActive
                      ? 'bg-[#060910] border-white shadow-[0_0_20px_rgba(255,255,255,0.85)] ring-1 ring-white/60'
                      : 'bg-black/85 border-white/20'
                  }`}
                  style={{
                    borderRightColor: pB.team.primaryColor,
                    borderRightWidth: '4px'
                  }}
                >
                  <span className="text-xs sm:text-sm font-black text-white tracking-wider font-['Titillium_Web'] leading-none">
                    {rightCode}
                  </span>
                  <span className="text-xs font-black text-[#E10600] font-mono leading-none">
                    {pB.position}
                  </span>
                </div>
              ) : (
                <div className="w-14 text-center text-xs text-neutral-600 font-bold">—</div>
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

// =========================================================================
// MAIN COMPONENT: F1StartingGrid
// =========================================================================
export const F1StartingGrid: React.FC<F1StartingGridProps> = ({
  pilots = [],
  eventTitle = "GULF AIR BAHRAIN GRAND PRIX 2021",
  trackName = "BAHRAIN INTERNATIONAL CIRCUIT",
  cycleIntervalMs = 2800,
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

  // Clean intro state machine: 'pill' -> 'beam' -> 'broadcast' (no awkward intermediate black bars!)
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
  // INTRO ANIMATION TIMELINE (Frame 1 -> Frame 2 -> Frame 4)
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
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        replayIntro();
      } else if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, handleNext, handlePrev, toggleFullscreen, replayIntro, onClose]);

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
  }, [introStage, isPlaying, totalPairs, cycleIntervalMs, activePairIndex]);

  const handleImageError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  if (!leftPilot) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px] bg-neutral-950 text-white font-mono">
        No pilots available for this starting grid.
      </div>
    );
  }

  const leftOrdinal = getOrdinalParts(leftPilot.position);
  const rightOrdinal = rightPilot ? getOrdinalParts(rightPilot.position) : null;

  const { firstName: leftFirst, lastName: leftLast } = parseDriverName(
    leftPilot.realName || '',
    leftPilot.nickname
  );
  const { firstName: rightFirst, lastName: rightLast } = rightPilot
    ? parseDriverName(rightPilot.realName || '', rightPilot.nickname)
    : { firstName: '', lastName: '' };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[640px] bg-[#07090E] text-white overflow-hidden select-none flex items-center justify-center ${className}`}
      style={{
        fontFamily: "'Titillium Web', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
      onClick={introStage !== 'broadcast' ? skipIntro : undefined}
    >
      {/* ========================================================================= */}
      {/* WAVED FLAG CLOTH BACKGROUND & WATERMARKS (Non-interfering z-index) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1c0812] via-[#090b12] to-[#14060d] overflow-hidden pointer-events-none z-0">
        {/* Dynamic Bahrain / Country Cloth Waves */}
        <svg
          className="absolute inset-0 w-full h-full opacity-35 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1920 1080"
        >
          <defs>
            <linearGradient id="flagWave" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CE1126" stopOpacity="0.45" />
              <stop offset="45%" stopColor="#400b14" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0B0D12" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="chevronGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#CE1126" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M 0,0 C 450,160 850,-80 1350,120 C 1650,220 1920,110 1920,110 L 1920,1080 L 0,1080 Z"
            fill="url(#flagWave)"
          />
          <path
            d="M 0,260 C 500,420 950,210 1450,380 C 1780,480 1920,380 1920,380 L 1920,1080 L 0,1080 Z"
            fill="#CE1126"
            opacity="0.1"
          />
          <polygon
            points="0,0 220,0 320,108 220,216 320,324 220,432 320,540 220,648 320,756 220,864 320,972 220,1080 0,1080"
            fill="url(#chevronGrad)"
          />
        </svg>

        {/* Top-center Faint Broadcast Watermark: 2026 Grid */}
        <div className="absolute top-5 sm:top-7 left-1/2 -translate-x-1/2 select-none opacity-40 pointer-events-none">
          <span className="text-3xl sm:text-5xl lg:text-6xl font-black italic tracking-widest text-white/40 font-['Titillium_Web'] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            2026 Grid
          </span>
        </div>

        {/* Bottom Left: Official F1 FIA Logo Watermark */}
        <div className="absolute bottom-4 sm:bottom-6 left-6 sm:left-8 opacity-75 select-none pointer-events-none">
          <img
            src="/F1-logo.png"
            alt="F1"
            className="h-4 sm:h-5 object-contain filter drop-shadow-[0_0_10px_rgba(225,6,0,0.7)]"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FRAME 1: INTRO PILL */}
      {/* ========================================================================= */}
      {introStage === 'pill' && (
        <motion.div
          key="frame-1-pill"
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative z-30 w-[280px] sm:w-[350px] h-[78px] sm:h-[94px] bg-[#0c0f16] border border-white/25 rounded-md shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col items-center justify-center overflow-hidden cursor-pointer"
        >
          <div className="absolute top-0 inset-x-0 h-[4px] bg-[#E10600] shadow-[0_0_14px_#E10600]" />
          <span className="text-[11px] sm:text-xs font-black tracking-[0.45em] text-white/90 uppercase mb-0.5">
            STARTING
          </span>
          <span className="text-3xl sm:text-4xl font-black italic tracking-[0.22em] text-white uppercase font-['Titillium_Web'] leading-none">
            GRID
          </span>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* FRAME 2: HORIZONTAL VISOR BEAM EXPANSION */}
      {/* ========================================================================= */}
      {introStage === 'beam' && (
        <motion.div
          key="frame-2-beam"
          initial={{ width: 350, height: 94 }}
          animate={{ width: '92vw', maxWidth: 1240, height: 68 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30 bg-black/95 border border-white/30 rounded-md shadow-[0_30px_70px_rgba(0,0,0,0.98)] flex items-center justify-center overflow-visible cursor-pointer"
        >
          <motion.div
            initial={{ scaleX: 0.2 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute top-0 inset-x-0 h-[4px] bg-[#E10600] shadow-[0_0_24px_#E10600]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="absolute -top-3.5 left-[34%] w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-full rotate-45 shadow-[0_0_12px_#00ffff]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="absolute -top-3.5 right-[34%] w-4 h-4 border-t-2 border-r-2 border-[#E10600] rounded-full -rotate-45 shadow-[0_0_12px_#E10600]"
          />
          <div className="flex items-center gap-6 sm:gap-14">
            <span className="text-xs sm:text-sm font-black tracking-[0.45em] text-white/80 uppercase">
              STARTING
            </span>
            <span className="text-2xl sm:text-3xl font-black italic tracking-[0.25em] text-white uppercase font-['Titillium_Web']">
              GRID
            </span>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* FRAME 4: FULL TELEVISION BROADCAST STARTING GRID FRAME */}
      {/* Opens smoothly from beam without awkward intermediate black bars */}
      {/* ========================================================================= */}
      {introStage === 'broadcast' && (
        <motion.div
          key="frame-4-broadcast"
          initial={{ scaleY: 0.1, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 w-[96%] max-w-[1360px] h-[95%] max-h-[800px] bg-gradient-to-b from-[#0e121a]/95 via-[#090b10]/95 to-[#040508]/98 border-2 border-white/30 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.98)] overflow-hidden flex flex-col justify-between backdrop-blur-md mx-auto"
        >
          {/* Sharp F1 Red Top Accent Line */}
          <div className="absolute top-0 inset-x-0 h-[3.5px] bg-[#E10600] z-40 shadow-[0_0_14px_#E10600]" />

          {/* Subtle Ambient Team Glows inside chassis */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 z-0"
            style={{
              background: `radial-gradient(circle at 18% 50%, ${leftPilot.team.primaryColor}55 0%, transparent 60%), radial-gradient(circle at 82% 50%, ${
                rightPilot ? rightPilot.team.primaryColor : '#ffffff'
              }55 0%, transparent 60%)`
            }}
          />

          {/* ------------------------------------------------------------- */}
          {/* TOP BAR: F1 Badge (Left), STARTING GRID (Center), Controls (Right) */}
          {/* ------------------------------------------------------------- */}
          <header className="relative z-40 w-full h-16 px-6 sm:px-10 flex items-center justify-between border-b border-white/10 flex-shrink-0">
            {/* Top-Left: Rounded double-outline F1 Badge */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg border-2 border-white/35 bg-black/70 shadow-lg backdrop-blur-sm max-w-[240px] sm:max-w-[340px] md:max-w-[420px]">
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-[#E10600] uppercase font-['Titillium_Web'] leading-none">
                  FORMULA 1
                </span>
                <span className="text-xs sm:text-sm font-bold tracking-wide text-neutral-200 uppercase truncate leading-tight mt-0.5">
                  {eventTitle} {trackName ? `• ${trackName}` : ''}
                </span>
              </div>
            </div>

            {/* Top-Center: Official STARTING GRID broadcast title (Guaranteed centered) */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none select-none text-center">
              <h1 className="text-sm sm:text-base md:text-xl font-black tracking-[0.3em] text-white uppercase font-['Titillium_Web'] drop-shadow-md">
                STARTING GRID
              </h1>
            </div>

            {/* Top-Right: Broadcast interactive controls & F1 TV logo */}
            <div className="flex items-center gap-2 flex-shrink-0 z-50">
              <button
                onClick={replayIntro}
                title="Replay Intro Sequence (R)"
                className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold uppercase tracking-wider rounded border border-white/20 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-neutral-200" />
                <span className="hidden md:inline">INTRO</span>
              </button>

              <button
                onClick={togglePlay}
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold uppercase tracking-wider rounded border border-white/20 transition-all cursor-pointer"
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

              <div className="flex items-center bg-white/10 rounded border border-white/20 overflow-hidden">
                <button
                  onClick={handlePrev}
                  title="Previous Row (←)"
                  className="p-1.5 hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <div className="w-[1px] h-4 bg-white/20" />
                <button
                  onClick={handleNext}
                  title="Next Row (→)"
                  className="p-1.5 hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>

              <button
                onClick={toggleFullscreen}
                title="Fullscreen (F)"
                className="p-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded border border-white/20 transition-all cursor-pointer"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* F1 TV Watermark Badge */}
              <div className="hidden sm:flex items-center gap-1 opacity-80 select-none ml-1">
                <span className="font-black italic text-sm tracking-tighter text-white font-['Titillium_Web']">
                  F1
                </span>
                <span className="font-bold text-[10px] tracking-wider text-white/80 bg-white/15 px-1 py-0.5 rounded border border-white/20">
                  TV
                </span>
              </div>

              {onClose && (
                <button
                  onClick={onClose}
                  title="Close (Esc)"
                  className="px-2.5 py-1 bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs uppercase rounded border border-red-500/50 transition-all cursor-pointer ml-1"
                >
                  ✕
                </button>
              )}
            </div>
          </header>

          {/* ------------------------------------------------------------- */}
          {/* MAIN STAGE: LEFT DRIVER | CENTRAL SHIFTING GRID TRACK | RIGHT DRIVER */}
          {/* ------------------------------------------------------------- */}
          <div className="relative flex-1 w-full flex overflow-hidden min-h-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={`pair-${activePairIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="absolute inset-0 w-full h-full flex"
              >
                {/* Clean Horizontal Broadcast Shutter flash on row change */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0.8 }}
                  animate={{ scaleX: 1, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-[2px] bg-[#E10600] z-40 pointer-events-none shadow-[0_0_16px_#E10600]"
                />

                {/* ========================================================= */}
                {/* LEFT DRIVER CARD (Odd Position: 1st, 3rd, 5th...) */}
                {/* ========================================================= */}
                <div className="relative w-1/2 h-full flex flex-col justify-between overflow-hidden pl-10 sm:pl-14 lg:pl-16 pr-4 pt-5 pb-6">
                  {/* Top-Left: Driver Identity Block (First Name, Surname, Flag, Red Position) */}
                  <div className="relative z-30 flex flex-col">
                    <div className="flex items-center gap-3">
                      {leftFirst && (
                        <span className="text-base sm:text-xl lg:text-2xl font-bold text-neutral-200 tracking-wide">
                          {leftFirst}
                        </span>
                      )}
                      {leftPilot.countryFlagUrl && (
                        <div className="rounded overflow-hidden shadow-md border border-white/25">
                          <FlagIcon
                            countryCode={leftPilot.countryFlagUrl}
                            style={{ width: '28px', height: '18px' }}
                          />
                        </div>
                      )}
                    </div>

                    <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-none drop-shadow-xl font-['Titillium_Web'] mt-1">
                      {leftLast}
                    </span>

                    {/* Authentic Broadcast Red Position Number (e.g. 1st) */}
                    <div className="mt-2 flex items-baseline select-none">
                      <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black italic text-[#E10600] drop-shadow-[0_0_24px_rgba(225,6,0,0.85)] font-['Chakra_Petch'] leading-none">
                        {leftOrdinal.num}
                      </span>
                      <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black italic text-[#E10600] drop-shadow-[0_0_16px_rgba(225,6,0,0.85)] font-['Chakra_Petch'] -ml-1">
                        {leftOrdinal.suffix}
                      </span>
                    </div>
                  </div>

                  {/* Standardized Heroic Portrait Box (Anchored to bottom, zero scale hacks) */}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-center z-10 pointer-events-none">
                    <div className="relative w-[85%] max-w-[460px] md:max-w-[500px] h-[72%] max-h-[540px] flex items-end justify-center overflow-hidden">
                      {!imgErrors[leftPilot.id] && leftPilot.avatarUrl ? (
                        <img
                          src={leftPilot.avatarUrl}
                          alt={leftPilot.nickname}
                          onError={() => handleImageError(leftPilot.id)}
                          className="w-full h-full object-contain object-bottom filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.98)]"
                        />
                      ) : (
                        <DriverAvatarFallback pilot={leftPilot} isRight={false} />
                      )}
                    </div>
                  </div>

                  {/* Bottom-Left: Team Logo, Constructor Name & Big Monospace Lap Time */}
                  <div className="relative z-30 flex flex-col gap-1.5 mt-auto select-none">
                    <div className="flex items-center gap-2.5">
                      <TeamLogo teamId={leftPilot.team.id} size="md" />
                      <span className="text-xs sm:text-sm md:text-base font-bold text-neutral-200 tracking-wider uppercase drop-shadow">
                        {leftPilot.team.name}
                      </span>
                    </div>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black text-white tracking-wider drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                      {leftPilot.lapTimeOrDelta}
                    </div>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* RIGHT DRIVER CARD (Even Position: 2nd, 4th, 6th...) */}
                {/* ========================================================= */}
                <div className="relative w-1/2 h-full flex flex-col justify-between overflow-hidden pr-10 sm:pr-14 lg:pr-16 pl-4 pt-5 pb-6 items-end text-right">
                  {rightPilot ? (
                    <>
                      {/* Top-Right: Driver Identity Block */}
                      <div className="relative z-30 flex flex-col items-end">
                        <div className="flex items-center gap-3 flex-row-reverse">
                          {rightFirst && (
                            <span className="text-base sm:text-xl lg:text-2xl font-bold text-neutral-200 tracking-wide">
                              {rightFirst}
                            </span>
                          )}
                          {rightPilot.countryFlagUrl && (
                            <div className="rounded overflow-hidden shadow-md border border-white/25">
                              <FlagIcon
                                countryCode={rightPilot.countryFlagUrl}
                                style={{ width: '28px', height: '18px' }}
                              />
                            </div>
                          )}
                        </div>

                        <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-none drop-shadow-xl font-['Titillium_Web'] mt-1">
                          {rightLast}
                        </span>

                        {/* Authentic Broadcast Red Position Number (e.g. 2nd) */}
                        {rightOrdinal && (
                          <div className="mt-2 flex items-baseline flex-row-reverse select-none">
                            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black italic text-[#E10600] drop-shadow-[0_0_16px_rgba(225,6,0,0.85)] font-['Chakra_Petch'] -mr-1">
                              {rightOrdinal.suffix}
                            </span>
                            <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black italic text-[#E10600] drop-shadow-[0_0_24px_rgba(225,6,0,0.85)] font-['Chakra_Petch'] leading-none">
                              {rightOrdinal.num}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Standardized Heroic Portrait Box */}
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center z-10 pointer-events-none">
                        <div className="relative w-[85%] max-w-[460px] md:max-w-[500px] h-[72%] max-h-[540px] flex items-end justify-center overflow-hidden">
                          {!imgErrors[rightPilot.id] && rightPilot.avatarUrl ? (
                            <img
                              src={rightPilot.avatarUrl}
                              alt={rightPilot.nickname}
                              onError={() => handleImageError(rightPilot.id)}
                              className="w-full h-full object-contain object-bottom filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.98)]"
                            />
                          ) : (
                            <DriverAvatarFallback pilot={rightPilot} isRight={true} />
                          )}
                        </div>
                      </div>

                      {/* Bottom-Right: Team Logo, Constructor Name & Delta Time */}
                      <div className="relative z-30 flex flex-col items-end gap-1.5 mt-auto select-none">
                        <div className="flex items-center gap-2.5 flex-row-reverse">
                          <TeamLogo teamId={rightPilot.team.id} size="md" />
                          <span className="text-xs sm:text-sm md:text-base font-bold text-neutral-200 tracking-wider uppercase drop-shadow">
                            {rightPilot.team.name}
                          </span>
                        </div>
                        <div className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black text-white tracking-wider drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                          {rightPilot.lapTimeOrDelta}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-neutral-500 font-bold uppercase tracking-widest text-sm">
                      Empty Grid Slot
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* ============================================================= */}
            {/* CENTER: DYNAMIC SHIFTING F1 STARTING GRID TRACK */}
            {/* Smoothly moves and shifts down the grid to spotlight active row */}
            {/* ============================================================= */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-35 flex flex-col items-center pointer-events-auto">
              <StartingGridTrack
                pairs={pairs}
                activePairIndex={activePairIndex}
                onSelectPair={(idx) => setActivePairIndex(idx)}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default F1StartingGrid;
