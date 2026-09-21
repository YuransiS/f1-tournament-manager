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

// Ordinal suffix helper (1 -> 1ST, 2 -> 2ND, 3 -> 3RD, 4 -> 4TH...)
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
// CENTRAL AUTHENTIC F1 STARTING GRID TRACK SLOT DIAGRAM (SVG)
// Matches official broadcast starting grid diagram with staggered pole slot & 2nd slot
// =========================================================================
interface StartingGridSlotDiagramProps {
  leftPilot: GridPilot;
  rightPilot: GridPilot | null;
  nextPair?: [GridPilot, GridPilot | null] | null;
}

const StartingGridSlotDiagram: React.FC<StartingGridSlotDiagramProps> = ({
  leftPilot,
  rightPilot,
  nextPair
}) => {
  const leftCode = leftPilot.team.shortCode || leftPilot.nickname.slice(0, 3).toUpperCase();
  const rightCode = rightPilot
    ? rightPilot.team.shortCode || rightPilot.nickname.slice(0, 3).toUpperCase()
    : '—';

  return (
    <div className="flex flex-col items-center justify-center select-none pointer-events-none">
      <svg
        viewBox="0 0 200 240"
        className="w-36 sm:w-44 md:w-52 h-auto filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]"
      >
        <defs>
          {/* Asphalt grid track texture/glow */}
          <filter id="gridGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ffffff" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Center asphalt dividing track centerline */}
        <line
          x1="100"
          y1="10"
          x2="100"
          y2="230"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="2"
          strokeDasharray="6 6"
        />

        {/* ------------------------------------------------------------- */}
        {/* SLOT 1 (LEFT / POLE POSITION - Stepped Forward, Y: 35) */}
        {/* ------------------------------------------------------------- */}
        <g filter="url(#gridGlow)">
          {/* Slot Box Bracket Outline */}
          <rect
            x="24"
            y="35"
            width="64"
            height="38"
            rx="5"
            fill="#060910"
            stroke="#ffffff"
            strokeWidth="2.5"
          />
          {/* Connecting asphalt starting grid guideline to center track */}
          <path
            d="M 24 73 L 24 90 L 100 90"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.75"
          />
          {/* Team color accent indicator strip */}
          <rect
            x="24"
            y="35"
            width="5"
            height="38"
            rx="2"
            fill={leftPilot.team.primaryColor}
          />
          {/* Driver 3-Letter Shortcode */}
          <text
            x="58"
            y="60"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="15"
            fontWeight="900"
            fontFamily="'Titillium Web', sans-serif"
            letterSpacing="1"
          >
            {leftCode}
          </text>
        </g>

        {/* ------------------------------------------------------------- */}
        {/* SLOT 2 (RIGHT / 2ND POSITION - Stepped Backward, Y: 105) */}
        {/* ------------------------------------------------------------- */}
        {rightPilot && (
          <g filter="url(#gridGlow)">
            {/* Slot Box Bracket Outline */}
            <rect
              x="112"
              y="105"
              width="64"
              height="38"
              rx="5"
              fill="#060910"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            {/* Connecting asphalt starting grid guideline */}
            <path
              d="M 176 143 L 176 160 L 100 160"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeOpacity="0.75"
            />
            {/* Team color accent indicator strip */}
            <rect
              x="171"
              y="105"
              width="5"
              height="38"
              rx="2"
              fill={rightPilot.team.primaryColor}
            />
            {/* Driver 3-Letter Shortcode */}
            <text
              x="142"
              y="130"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="15"
              fontWeight="900"
              fontFamily="'Titillium Web', sans-serif"
              letterSpacing="1"
            >
              {rightCode}
            </text>
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* FAINT RECEDING NEXT ROW PREVIEW (Perspective ladder) */}
        {/* ------------------------------------------------------------- */}
        {nextPair && nextPair[0] && (
          <g opacity="0.32">
            <rect
              x="30"
              y="175"
              width="54"
              height="30"
              rx="4"
              fill="#000000"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            <text
              x="57"
              y="195"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="12"
              fontWeight="700"
              fontFamily="'Titillium Web', sans-serif"
            >
              {nextPair[0].team.shortCode || nextPair[0].nickname.slice(0, 3)}
            </text>

            {nextPair[1] && (
              <>
                <rect
                  x="116"
                  y="210"
                  width="54"
                  height="26"
                  rx="4"
                  fill="#000000"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeDasharray="4 2"
                />
                <text
                  x="143"
                  y="227"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="'Titillium Web', sans-serif"
                >
                  {nextPair[1].team.shortCode || nextPair[1].nickname.slice(0, 3)}
                </text>
              </>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};

// =========================================================================
// MAIN COMPONENT: F1StartingGrid
// Recreates the authentic 4-Frame F1 Broadcast Storyboard Sequence
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

  // Storyboard intro state machine: 'pill' -> 'beam' -> 'reveal' -> 'broadcast'
  const [introStage, setIntroStage] = useState<'pill' | 'beam' | 'reveal' | 'broadcast'>('pill');
  const [activePairIndex, setActivePairIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPairs = pairs.length;
  const currentPair = pairs[activePairIndex] || [null, null];
  const [leftPilot, rightPilot] = currentPair;
  const nextPair = pairs[(activePairIndex + 1) % Math.max(1, totalPairs)] || null;

  // -------------------------------------------------------------------------
  // STORYBOARD INTRO TIMELINE (Frames 1 -> 2 -> 3 -> 4)
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (introStage === 'broadcast') return;

    if (introStage === 'pill') {
      const t1 = setTimeout(() => setIntroStage('beam'), 850);
      return () => clearTimeout(t1);
    } else if (introStage === 'beam') {
      const t2 = setTimeout(() => setIntroStage('reveal'), 700);
      return () => clearTimeout(t2);
    } else if (introStage === 'reveal') {
      const t3 = setTimeout(() => setIntroStage('broadcast'), 750);
      return () => clearTimeout(t3);
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
      {/* WAVED FLAG CLOTH BACKGROUND & WATERMARKS (Present across all frames) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1c0812] via-[#090b12] to-[#14060d] overflow-hidden pointer-events-none">
        {/* Dynamic Bahrain / Track Country Cloth Waves */}
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
          {/* Wave ripples */}
          <path
            d="M 0,0 C 450,160 850,-80 1350,120 C 1650,220 1920,110 1920,110 L 1920,1080 L 0,1080 Z"
            fill="url(#flagWave)"
          />
          <path
            d="M 0,260 C 500,420 950,210 1450,380 C 1780,480 1920,380 1920,380 L 1920,1080 L 0,1080 Z"
            fill="#CE1126"
            opacity="0.1"
          />
          {/* Stylized chevrons (Bahrain flag motif) */}
          <polygon
            points="0,0 220,0 320,108 220,216 320,324 220,432 320,540 220,648 320,756 220,864 320,972 220,1080 0,1080"
            fill="url(#chevronGrad)"
          />
        </svg>

        {/* Top-center Faint Broadcast Watermark: 2026 Grid */}
        <div className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 select-none opacity-45 pointer-events-none">
          <span className="text-3xl sm:text-5xl lg:text-6xl font-black italic tracking-widest text-white/50 font-['Titillium_Web'] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            2026 Grid
          </span>
        </div>

        {/* Top Right: Official F1 TV Watermark */}
        <div className="absolute top-4 sm:top-6 right-6 sm:right-8 flex items-center gap-1.5 opacity-85 select-none z-50">
          <span className="font-black italic text-base sm:text-xl tracking-tighter text-white font-['Titillium_Web']">
            F1
          </span>
          <span className="font-bold text-xs tracking-wider text-white/80 bg-white/10 px-1.5 py-0.5 rounded border border-white/20">
            TV
          </span>
        </div>

        {/* Bottom Left: Official F1 FIA Logo Watermark */}
        <div className="absolute bottom-4 sm:bottom-6 left-6 sm:right-auto sm:left-8 opacity-75 select-none z-50">
          <img
            src="/F1-logo.png"
            alt="F1"
            className="h-4 sm:h-5 object-contain filter drop-shadow-[0_0_10px_rgba(225,6,0,0.7)]"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FRAME 1: INTRO PILL (STARTING GRID metallic badge with red top accent) */}
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
          {/* Sharp bright red top border accent */}
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
      {/* FRAME 2: HORIZONTAL VISOR BEAM EXPANSION with Energy Arcs */}
      {/* ========================================================================= */}
      {introStage === 'beam' && (
        <motion.div
          key="frame-2-beam"
          initial={{ width: 350, height: 94 }}
          animate={{ width: '92vw', maxWidth: 1240, height: 68 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30 bg-black/95 border border-white/30 rounded-md shadow-[0_30px_70px_rgba(0,0,0,0.98)] flex items-center justify-center overflow-visible cursor-pointer"
        >
          {/* Glowing red accent shooting across full width */}
          <motion.div
            initial={{ scaleX: 0.2 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute top-0 inset-x-0 h-[4px] bg-[#E10600] shadow-[0_0_24px_#E10600]"
          />

          {/* Glowing energetic arcs / pips over the line (as seen in storyboard Frame 2) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="absolute -top-3.5 left-[34%] w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-full rotate-45 shadow-[0_0_12px_#00ffff]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
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
      {/* FRAME 3: VERTICAL EXPANSION, RED 1st/2nd POP & DRIVERS RISING */}
      {/* ========================================================================= */}
      {introStage === 'reveal' && (
        <motion.div
          key="frame-3-reveal"
          initial={{ height: 68, opacity: 0.9 }}
          animate={{ height: '82vh', maxHeight: 760, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30 w-[94vw] max-w-[1300px] bg-gradient-to-b from-[#0c0f16] via-[#080a0f] to-[#040508] border-2 border-white/25 rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.98)] flex flex-col justify-between overflow-hidden cursor-pointer"
        >
          {/* Top red accent line */}
          <div className="absolute top-0 inset-x-0 h-[4px] bg-[#E10600] shadow-[0_0_20px_#E10600] z-30" />

          {/* Central Horizontal Band (Frame 3 visor line) with red 1st & 2nd numbers */}
          <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-28 bg-black/90 border-y border-white/20 flex items-center justify-between px-8 sm:px-20 z-20">
            <motion.div
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex items-baseline"
            >
              <span className="text-6xl sm:text-8xl font-black italic text-[#E10600] drop-shadow-[0_0_30px_rgba(225,6,0,0.95)] font-['Chakra_Petch'] leading-none">
                {leftOrdinal.num}
              </span>
              <span className="text-3xl sm:text-4xl font-black italic text-[#E10600] drop-shadow-[0_0_20px_rgba(225,6,0,0.95)] font-['Chakra_Petch'] -ml-1">
                {leftOrdinal.suffix}
              </span>
            </motion.div>

            {rightOrdinal && (
              <motion.div
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex items-baseline"
              >
                <span className="text-6xl sm:text-8xl font-black italic text-[#E10600] drop-shadow-[0_0_30px_rgba(225,6,0,0.95)] font-['Chakra_Petch'] leading-none">
                  {rightOrdinal.num}
                </span>
                <span className="text-3xl sm:text-4xl font-black italic text-[#E10600] drop-shadow-[0_0_20px_rgba(225,6,0,0.95)] font-['Chakra_Petch'] -ml-1">
                  {rightOrdinal.suffix}
                </span>
              </motion.div>
            )}
          </div>

          {/* Rising driver silhouettes / busts */}
          <div className="relative w-full h-full flex items-end justify-between px-6 sm:px-16 pointer-events-none">
            <motion.div
              initial={{ y: 160, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-[45%] max-w-[560px] h-[82%] flex items-end justify-center overflow-hidden"
            >
              <img
                src={leftPilot.avatarUrl}
                alt={leftPilot.nickname}
                className="w-full h-full object-contain object-bottom filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
              />
            </motion.div>

            {rightPilot && (
              <motion.div
                initial={{ y: 160, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-[45%] max-w-[560px] h-[82%] flex items-end justify-center overflow-hidden"
              >
                <img
                  src={rightPilot.avatarUrl}
                  alt={rightPilot.nickname}
                  className="w-full h-full object-contain object-bottom filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* FRAME 4: FULL TELEVISION BROADCAST STARTING GRID FRAME */}
      {/* Metallic Chassis Bezel, Red Position Numbers, Authentic Central Slot SVG, Telemetry */}
      {/* ========================================================================= */}
      {introStage === 'broadcast' && (
        <motion.div
          key="frame-4-broadcast"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-20 w-full max-w-[1340px] h-[96%] max-h-[740px] aspect-[16/9] bg-gradient-to-b from-[#0e121a]/95 via-[#090b10]/95 to-[#040508]/98 border-2 border-white/30 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.98)] overflow-hidden flex flex-col justify-between backdrop-blur-md mx-auto"
        >
          {/* Sharp F1 Red Top Accent Line running across the bezel */}
          <div className="absolute top-0 inset-x-0 h-[3.5px] bg-[#E10600] z-30 shadow-[0_0_14px_#E10600]" />

          {/* Subtle Chassis Texture & Team Glows inside bezel */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: `radial-gradient(circle at 20% 50%, ${leftPilot.team.primaryColor}55 0%, transparent 60%), radial-gradient(circle at 80% 50%, ${
                rightPilot ? rightPilot.team.primaryColor : '#ffffff'
              }55 0%, transparent 60%)`
            }}
          />

          {/* ------------------------------------------------------------- */}
          {/* TOP BAR INSIDE BEZEL: F1 Formula 1 Badge, STARTING GRID, Controls */}
          {/* ------------------------------------------------------------- */}
          <header className="relative z-30 w-full px-5 sm:px-8 pt-4 pb-2 flex items-center justify-between border-b border-white/10">
            {/* Top-Left: Rounded double-outline F1 Badge */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border-2 border-white/35 bg-black/60 shadow-lg backdrop-blur-sm">
              <div className="flex flex-col">
                <span className="text-[11px] font-black tracking-widest text-white uppercase font-['Titillium_Web'] leading-none">
                  FORMULA 1
                </span>
                <span className="text-[11px] sm:text-xs font-bold tracking-wider text-neutral-300 uppercase leading-tight mt-0.5">
                  {eventTitle} {trackName ? `• ${trackName}` : ''}
                </span>
              </div>
            </div>

            {/* Top-Center: Official STARTING GRID broadcast title */}
            <h1 className="text-sm sm:text-base md:text-xl font-black tracking-[0.25em] text-white uppercase font-['Titillium_Web'] drop-shadow-md text-center">
              STARTING GRID
            </h1>

            {/* Top-Right: Broadcast interactive controls */}
            <div className="flex items-center gap-1.5">
              {/* Replay Intro sequence */}
              <button
                onClick={replayIntro}
                title="Replay Intro Sequence (R)"
                className="flex items-center gap-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold uppercase tracking-wider rounded border border-white/20 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-neutral-200" />
                <span className="hidden md:inline">INTRO</span>
              </button>

              {/* Autoplay toggle */}
              <button
                onClick={togglePlay}
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold uppercase tracking-wider rounded border border-white/20 transition-all cursor-pointer"
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

              {/* Prev / Next Pair Buttons */}
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

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                title="Fullscreen (F)"
                className="p-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded border border-white/20 transition-all cursor-pointer"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close button if provided */}
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
          {/* MAIN STAGE: LEFT PILOT | CENTRAL F1 SLOT SVG | RIGHT PILOT */}
          {/* ------------------------------------------------------------- */}
          <div className="relative flex-1 w-full flex overflow-hidden min-h-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={`pair-${activePairIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
                className="absolute inset-0 w-full h-full flex"
              >
                {/* Horizontal Broadcast Shutter / Laser flash on transition */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0.9 }}
                  animate={{ scaleX: 1, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-[2px] bg-[#E10600] z-40 pointer-events-none shadow-[0_0_20px_#E10600]"
                />

                {/* ========================================================= */}
                {/* LEFT DRIVER CARD (Odd Position: 1st, 3rd, 5th...) */}
                {/* ========================================================= */}
                <div className="relative w-1/2 h-full flex flex-col justify-between overflow-hidden px-8 sm:px-12 py-5">
                  {/* Top-Left: Driver Identity Block (First Name, Surname, Flag, Red Position) */}
                  <div className="relative z-25 flex flex-col">
                    <div className="flex items-center gap-3">
                      {leftFirst && (
                        <span className="text-lg sm:text-2xl font-bold text-white tracking-wide">
                          {leftFirst}
                        </span>
                      )}
                      {leftPilot.countryFlagUrl && (
                        <div className="rounded overflow-hidden shadow-md border border-white/20">
                          <FlagIcon
                            countryCode={leftPilot.countryFlagUrl}
                            style={{ width: '28px', height: '18px' }}
                          />
                        </div>
                      )}
                    </div>

                    <span className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-none drop-shadow-xl font-['Titillium_Web'] mt-0.5">
                      {leftLast}
                    </span>

                    {/* Authentic Broadcast Red Position Number (e.g. 1st) */}
                    <div className="mt-2 flex items-baseline">
                      <span className="text-6xl sm:text-8xl lg:text-9xl font-black italic text-[#E10600] drop-shadow-[0_0_24px_rgba(225,6,0,0.9)] font-['Chakra_Petch'] leading-none">
                        {leftOrdinal.num}
                      </span>
                      <span className="text-2xl sm:text-4xl lg:text-5xl font-black italic text-[#E10600] drop-shadow-[0_0_20px_rgba(225,6,0,0.9)] font-['Chakra_Petch'] -ml-1">
                        {leftOrdinal.suffix}
                      </span>
                    </div>
                  </div>

                  {/* Standardized Heroic Portrait Box (Anchored to bottom, zero scale hacks) */}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-center z-15 pointer-events-none">
                    <div className="relative w-[85%] max-w-[500px] h-[72%] max-h-[580px] flex items-end justify-center overflow-hidden">
                      {!imgErrors[leftPilot.id] && leftPilot.avatarUrl ? (
                        <img
                          src={leftPilot.avatarUrl}
                          alt={leftPilot.nickname}
                          onError={() => handleImageError(leftPilot.id)}
                          className="w-full h-full object-contain object-bottom filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.98)]"
                        />
                      ) : (
                        <DriverAvatarFallback pilot={leftPilot} isRight={false} />
                      )}
                    </div>
                  </div>

                  {/* Bottom-Left: Team Logo, Team Constructor Name & Big Monospace Lap Time */}
                  <div className="relative z-30 flex flex-col gap-1 mt-auto">
                    <div className="flex items-center gap-3">
                      <TeamLogo teamId={leftPilot.team.id} size="md" />
                      <span className="text-sm sm:text-base font-bold text-white tracking-wider uppercase drop-shadow">
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
                <div className="relative w-1/2 h-full flex flex-col justify-between overflow-hidden px-8 sm:px-12 py-5 items-end text-right">
                  {rightPilot ? (
                    <>
                      {/* Top-Right: Driver Identity Block */}
                      <div className="relative z-25 flex flex-col items-end">
                        <div className="flex items-center gap-3 flex-row-reverse">
                          {rightFirst && (
                            <span className="text-lg sm:text-2xl font-bold text-white tracking-wide">
                              {rightFirst}
                            </span>
                          )}
                          {rightPilot.countryFlagUrl && (
                            <div className="rounded overflow-hidden shadow-md border border-white/20">
                              <FlagIcon
                                countryCode={rightPilot.countryFlagUrl}
                                style={{ width: '28px', height: '18px' }}
                              />
                            </div>
                          )}
                        </div>

                        <span className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-none drop-shadow-xl font-['Titillium_Web'] mt-0.5">
                          {rightLast}
                        </span>

                        {/* Authentic Broadcast Red Position Number (e.g. 2nd) */}
                        {rightOrdinal && (
                          <div className="mt-2 flex items-baseline flex-row-reverse">
                            <span className="text-2xl sm:text-4xl lg:text-5xl font-black italic text-[#E10600] drop-shadow-[0_0_20px_rgba(225,6,0,0.9)] font-['Chakra_Petch'] -mr-1">
                              {rightOrdinal.suffix}
                            </span>
                            <span className="text-6xl sm:text-8xl lg:text-9xl font-black italic text-[#E10600] drop-shadow-[0_0_24px_rgba(225,6,0,0.9)] font-['Chakra_Petch'] leading-none">
                              {rightOrdinal.num}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Standardized Heroic Portrait Box */}
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center z-15 pointer-events-none">
                        <div className="relative w-[85%] max-w-[500px] h-[72%] max-h-[580px] flex items-end justify-center overflow-hidden">
                          {!imgErrors[rightPilot.id] && rightPilot.avatarUrl ? (
                            <img
                              src={rightPilot.avatarUrl}
                              alt={rightPilot.nickname}
                              onError={() => handleImageError(rightPilot.id)}
                              className="w-full h-full object-contain object-bottom filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.98)]"
                            />
                          ) : (
                            <DriverAvatarFallback pilot={rightPilot} isRight={true} />
                          )}
                        </div>
                      </div>

                      {/* Bottom-Right: Team Logo, Constructor Name & Delta Time */}
                      <div className="relative z-30 flex flex-col items-end gap-1 mt-auto">
                        <div className="flex items-center gap-3 flex-row-reverse">
                          <TeamLogo teamId={rightPilot.team.id} size="md" />
                          <span className="text-sm sm:text-base font-bold text-white tracking-wider uppercase drop-shadow">
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
            {/* CENTER: AUTHENTIC F1 STARTING GRID TRACK SLOT SVG DIAGRAM */}
            {/* Staggered Pole Slot [ VER ] & 2nd Slot [ HAM ] with asphalt gridlines */}
            {/* ============================================================= */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-35 flex flex-col items-center pointer-events-none">
              <StartingGridSlotDiagram
                leftPilot={leftPilot}
                rightPilot={rightPilot}
                nextPair={nextPair}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default F1StartingGrid;
