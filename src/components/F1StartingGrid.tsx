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
  countryCode?: string; // Host country code (e.g. 'jp', 'bh', 'it', 'us', 'sa', 'sg')
  flagGifUrl?: string; // Optional custom flag GIF URL
  flagVideoId?: string; // Optional YouTube video ID override
  cycleIntervalMs?: number;
  autoPlay?: boolean;
  onClose?: () => void;
  className?: string;
}

// Map of host countries to 4K / HD looping waving flag animation video IDs (no player UI, seamless loop)
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
// CENTRAL STARTING GRID SLOT DISPLAY (Authentic F1 TV Wireframe Style)
// Transparent minimalist layout showing active row brackets and next row preview
// =========================================================================
interface StartingGridSlotDisplayProps {
  pairs: [GridPilot, GridPilot | null][];
  activePairIndex: number;
  onSelectPair: (idx: number) => void;
}

const F1StartingGridSlotDisplay: React.FC<StartingGridSlotDisplayProps> = ({
  pairs,
  activePairIndex,
  onSelectPair
}) => {
  const currentPair = pairs[activePairIndex] || [null, null];
  const nextPair = pairs[activePairIndex + 1] || null;
  const prevPair = activePairIndex > 0 ? pairs[activePairIndex - 1] : null;

  const [pA, pB] = currentPair;
  const leftCode = pA?.nickname ? pA.nickname.slice(0, 3).toUpperCase() : (pA?.team.shortCode || 'DRV');
  const rightCode = pB
    ? (pB.nickname ? pB.nickname.slice(0, 3).toUpperCase() : (pB.team.shortCode || 'DRV'))
    : '—';

  const nextLeftCode = nextPair && nextPair[0]
    ? (nextPair[0].nickname ? nextPair[0].nickname.slice(0, 3).toUpperCase() : '')
    : '';
  const nextRightCode = nextPair && nextPair[1]
    ? (nextPair[1].nickname ? nextPair[1].nickname.slice(0, 3).toUpperCase() : '')
    : '';

  const prevLeftCode = prevPair && prevPair[0]
    ? (prevPair[0].nickname ? prevPair[0].nickname.slice(0, 3).toUpperCase() : '')
    : '';
  const prevRightCode = prevPair && prevPair[1]
    ? (prevPair[1].nickname ? prevPair[1].nickname.slice(0, 3).toUpperCase() : '')
    : '';

  return (
    <div className="relative flex flex-col items-center select-none pointer-events-auto">
      {/* Official Broadcast Header: 2026 Grid / STARTING GRID */}
      <div className="flex flex-col items-center mb-2.5">
        <span className="text-xs sm:text-sm font-black italic tracking-widest text-neutral-300 font-['Titillium_Web'] uppercase drop-shadow">
          2026 Grid
        </span>
        <h2 className="text-sm sm:text-lg font-black tracking-[0.25em] text-white uppercase font-['Titillium_Web'] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          STARTING GRID
        </h2>
      </div>

      {/* Grid Graphic Container - Completely Transparent Background */}
      <div className="relative w-[190px] sm:w-[220px] h-[140px] sm:h-[150px] flex items-center justify-center">
        {/* Previous Row Silhouette (Fading up if activePairIndex > 0) */}
        {prevPair && (
          <div
            onClick={() => onSelectPair(activePairIndex - 1)}
            className="absolute -top-2 w-full flex items-center justify-between px-2 opacity-25 hover:opacity-60 transition-opacity cursor-pointer scale-90"
            title="Previous Row"
          >
            <div className="w-[58px] h-[26px] rounded-[3px] border border-dashed border-white/40 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white/60 font-mono">{prevLeftCode}</span>
            </div>
            <div className="w-[58px] h-[26px] rounded-[3px] border border-dashed border-white/40 flex items-center justify-center mt-3">
              <span className="text-[10px] font-bold text-white/60 font-mono">{prevRightCode}</span>
            </div>
          </div>
        )}

        {/* ACTIVE ROW SLOTS (Exact TV broadcast wireframe look) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`slot-row-${activePairIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full flex items-center justify-between px-2 z-20"
          >
            {/* Left Slot (Odd position / Pole stepped forward) */}
            <div
              className="w-[66px] sm:w-[74px] h-[32px] sm:h-[36px] rounded-[4px] border-2 border-white bg-black/50 backdrop-blur-sm flex items-center justify-center shadow-[0_0_16px_rgba(255,255,255,0.45)] transition-all"
              style={{
                borderLeftColor: pA?.team.primaryColor || '#E10600',
                borderLeftWidth: '4px'
              }}
            >
              <span className="text-xs sm:text-sm font-black text-white tracking-widest font-['Titillium_Web'] drop-shadow">
                {leftCode}
              </span>
            </div>

            {/* F1 Asphalt Track Slot Stagger Guide Line */}
            <div className="flex-1 mx-2 relative h-10 flex items-center justify-center pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 60 40" fill="none">
                <path
                  d="M0,14 L30,14 L30,26 L60,26"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
                <circle cx="30" cy="20" r="2.5" fill="#E10600" />
              </svg>
            </div>

            {/* Right Slot (Even position stepped back) */}
            <div
              className="w-[66px] sm:w-[74px] h-[32px] sm:h-[36px] rounded-[4px] border-2 border-white bg-black/50 backdrop-blur-sm flex items-center justify-center shadow-[0_0_16px_rgba(255,255,255,0.45)] mt-4 sm:mt-5 transition-all"
              style={{
                borderRightColor: pB?.team.primaryColor || '#ffffff',
                borderRightWidth: '4px'
              }}
            >
              <span className="text-xs sm:text-sm font-black text-white tracking-widest font-['Titillium_Web'] drop-shadow">
                {rightCode}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* NEXT ROW PREVIEW (Slots behind active row matching TV reference) */}
        {nextPair ? (
          <div
            onClick={() => onSelectPair(activePairIndex + 1)}
            className="absolute bottom-0 w-full flex items-center justify-between px-2 opacity-40 hover:opacity-75 transition-opacity cursor-pointer"
            title="Next Row"
          >
            {/* Slot below Left */}
            <div className="w-[66px] sm:w-[74px] h-[28px] sm:h-[30px] rounded-[4px] border border-white/40 flex items-center justify-center bg-black/30">
              <span className="text-[11px] font-bold text-white/60 font-mono tracking-wider">
                {nextLeftCode || '—'}
              </span>
            </div>

            <div className="flex-1 mx-2 h-[1px] bg-white/10" />

            {/* Slot below Right (Staggered) */}
            <div className="w-[66px] sm:w-[74px] h-[28px] sm:h-[30px] rounded-[4px] border border-white/40 flex items-center justify-center bg-black/30 mt-4 sm:mt-5">
              <span className="text-[11px] font-bold text-white/60 font-mono tracking-wider">
                {nextRightCode || '—'}
              </span>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500 font-mono">
            END OF GRID
          </div>
        )}
      </div>

      {/* Quick Row Navigation Dots */}
      <div className="flex items-center gap-1.5 mt-2">
        {pairs.map((_, i) => (
          <button
            key={`grid-nav-dot-${i}`}
            onClick={() => onSelectPair(i)}
            title={`Row ${i + 1} (${i * 2 + 1} - ${i * 2 + 2})`}
            className={`transition-all rounded-full cursor-pointer ${
              i === activePairIndex
                ? 'w-4 h-1.5 bg-[#E10600] shadow-[0_0_8px_#E10600]'
                : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
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
  countryCode = "jp",
  flagGifUrl,
  flagVideoId,
  cycleIntervalMs = 2800,
  autoPlay = true,
  onClose,
  className = ""
}) => {
  const activeCountryCode = (countryCode || 'jp').toLowerCase();
  const activeVideoId = flagVideoId || COUNTRY_FLAG_YOUTUBE_MAP[activeCountryCode] || 'x0Za2ghUHvw';
  const flagGifSrc = flagGifUrl || `/flags/animated/${activeCountryCode}.gif`;

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
      {/* WAVING FLAG BACKGROUND & WATERMARKS (YouTube 4K Loop & Fallback) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#07090E]">
        {/* Fallback animated GIF underneath while video loads */}
        <img
          src={flagGifSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40 filter blur-[0.5px] saturate-125 scale-105 pointer-events-none"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Dynamic Waving Country Flag 4K/HD Video (Seamless loop, no controls, cropped player) */}
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
                transform: 'translate(-50%, -50%) scale(1.35)',
                width: 'max(100%, 178vh, 178%)',
                height: 'max(100%, 56.25vw, 56.25%)',
                minWidth: '100%',
                minHeight: '100%',
                pointerEvents: 'none',
                userSelect: 'none',
                backgroundColor: '#07090E',
                filter: 'brightness(0.9) contrast(1.08)',
              }}
              allow="autoplay; encrypted-media; picture-in-picture"
              tabIndex={-1}
              title="Host Country Flag Video Animation"
            />
          </div>
        )}

        {/* Cinematic dark broadcast gradient overlay & lighting */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040508] via-[#040508]/40 to-[#040508]/60 mix-blend-multiply pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040508]/75 via-transparent to-[#040508]/75 pointer-events-none z-[1]" />

        {/* Top-center Faint Broadcast Watermark: 2026 Grid */}
        <div className="absolute top-5 sm:top-7 left-1/2 -translate-x-1/2 select-none opacity-20 pointer-events-none z-[2]">
          <span className="text-3xl sm:text-5xl lg:text-6xl font-black italic tracking-widest text-white/30 font-['Titillium_Web'] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            2026 Grid
          </span>
        </div>

        {/* Bottom Left: Official F1 FIA Logo Watermark */}
        <div className="absolute bottom-4 sm:bottom-6 left-6 sm:left-8 opacity-75 select-none pointer-events-none z-[2]">
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
          exit={{ scale: 1.15, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30 flex flex-col items-center select-none cursor-pointer"
        >
          <div className="relative px-10 sm:px-14 py-5 sm:py-6 rounded-2xl bg-gradient-to-b from-[#161a24]/95 to-[#080a0f]/98 border-2 border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 inset-x-0 h-[4px] bg-[#E10600] shadow-[0_0_16px_#E10600]" />
            <span className="text-[11px] sm:text-xs font-black tracking-[0.35em] text-neutral-300 uppercase font-['Titillium_Web'] mb-1">
              STARTING
            </span>
            <span className="text-3xl sm:text-5xl font-black italic tracking-[0.15em] text-white uppercase font-['Titillium_Web'] drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              GRID
            </span>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* FRAME 2: HORIZONTAL VISOR BEAM EXPANSION */}
      {/* ========================================================================= */}
      {introStage === 'beam' && (
        <motion.div
          key="frame-2-beam"
          initial={{ scaleX: 0.25, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30 w-[96%] max-w-[1360px] h-20 bg-gradient-to-r from-transparent via-[#0e121a]/95 to-transparent border-y-2 border-white/50 flex items-center justify-center overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-[3px] bg-[#E10600] shadow-[0_0_20px_#E10600]" />
          <svg className="absolute -top-3 left-1/4 w-12 h-6" viewBox="0 0 50 25" fill="none">
            <path d="M5,20 C15,5 35,5 45,20" stroke="#00d2ff" strokeWidth="3" opacity="0.9" />
          </svg>
          <svg className="absolute -top-3 right-1/4 w-12 h-6" viewBox="0 0 50 25" fill="none">
            <path d="M5,20 C15,5 35,5 45,20" stroke="#E10600" strokeWidth="3" opacity="0.9" />
          </svg>
          <span className="text-xl sm:text-3xl font-black italic tracking-[0.3em] text-white uppercase font-['Titillium_Web'] drop-shadow-[0_0_25px_rgba(255,255,255,0.7)]">
            STARTING GRID
          </span>
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
          className="relative z-20 w-[96%] max-w-[1360px] h-[95%] max-h-[800px] bg-gradient-to-b from-[#0e121a]/84 via-[#090b10]/86 to-[#040508]/90 border-2 border-white/30 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.98)] overflow-hidden flex flex-col justify-between backdrop-blur-md mx-auto"
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
            {/* CENTER: MINIMALIST TV BROADCAST STARTING GRID WIREFRAME SLOTS */}
            {/* Transparent layout matching official Bahrain 2021 F1 broadcast */}
            {/* ============================================================= */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[34%] -translate-y-1/2 z-35 flex flex-col items-center pointer-events-auto">
              <F1StartingGridSlotDisplay
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
