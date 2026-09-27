import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TeamLogo from './TeamLogo';
import DriverAvatarFallback from './DriverAvatarFallback';
import { GridPilot } from './F1StartingGrid';

interface F1GridDriverCardProps {
  pilot: GridPilot | null;
  align: 'left' | 'right';
  hasImageError?: boolean;
  onImageError?: (id: string) => void;
}

export function formatF1PositionOrdinal(n: number): { num: number; suffix: string } {
  const s = ['TH', 'ST', 'ND', 'RD'];
  const v = n % 100;
  const suffix = s[(v - 20) % 10] || s[v] || s[0];
  return { num: n, suffix };
}

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

// Authentic F1 TV broadcast vertical gradient pairings for constructor identities
export function getTeamGradient(teamId: string, fallbackColor: string): [string, string] {
  const tid = (teamId || '').toLowerCase();
  if (tid.includes('ferrari')) return ['#ff4d4d', '#b30000'];
  if (tid.includes('mercedes')) return ['#00f5df', '#008779'];
  if (tid.includes('red-bull')) return ['#3b82f6', '#1d4ed8'];
  if (tid.includes('mclaren')) return ['#ff9f43', '#ea580c'];
  if (tid.includes('aston-martin')) return ['#00e6a8', '#005940'];
  if (tid.includes('alpine')) return ['#38bdf8', '#0284c7'];
  if (tid.includes('williams')) return ['#60a5fa', '#1e40af'];
  if (tid.includes('alfa-romeo') || tid.includes('sauber')) return ['#4ade80', '#15803d'];
  if (tid.includes('haas')) return ['#ffffff', '#E6002B']; // Haas White to bright Haas Red
  if (tid.includes('alphatauri') || tid.includes('rb')) return ['#93c5fd', '#1e3a8a'];
  return [fallbackColor || '#ffffff', fallbackColor || '#E10600'];
}

export const F1GridDriverCard: React.FC<F1GridDriverCardProps> = ({
  pilot,
  align,
  hasImageError,
  onImageError
}) => {
  const isLeft = align === 'left';

  if (!pilot) {
    return (
      <div className={`relative w-full h-full flex flex-col justify-center items-center p-6 ${isLeft ? 'items-start' : 'items-end'}`}>
        <span className="text-xs font-mono font-bold tracking-widest text-neutral-600 uppercase">
          VACANT GRID POSITION
        </span>
      </div>
    );
  }

  const { num, suffix } = formatF1PositionOrdinal(pilot.position);
  const { firstName, lastName } = parseDriverName(pilot.realName || '', pilot.nickname);
  const teamPrimaryColor = pilot.team.primaryColor || '#E10600';
  const [gradTop, gradBottom] = getTeamGradient(pilot.team.id, teamPrimaryColor);

  return (
    <div className="relative w-full h-full flex select-none overflow-hidden">
      {/* ============================================================= */}
      {/* 1. OUTER EDGE: CONSTRUCTOR NAME + LOGO IMMEDIATELY BELOW */}
      {/* ============================================================= */}
      <div
        className={`relative z-30 w-12 sm:w-14 lg:w-16 h-full flex flex-col items-center justify-center py-6 bg-black/60 backdrop-blur-md border-neutral-800/80 flex-shrink-0 gap-4 ${
          isLeft ? 'order-1 border-r' : 'order-3 border-l'
        }`}
      >
        {/* Top Accent Dot in Team Color */}
        <div
          className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor] mb-1"
          style={{ backgroundColor: gradTop, color: gradTop }}
        />

        {/* Grouped Constructor Identity: Name + Logo immediately below */}
        <div className="flex flex-col items-center justify-center gap-3.5 my-auto">
          {/* Rotated Constructor Name */}
          <span
            className="text-xs sm:text-sm lg:text-base font-black tracking-[0.32em] text-white/90 uppercase font-['Titillium_Web'] whitespace-nowrap select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            style={{
              writingMode: 'vertical-rl',
              transform: isLeft ? 'rotate(180deg)' : 'none'
            }}
          >
            {pilot.team.name}
          </span>

          {/* Team Logo immediately below the constructor name */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mt-1">
            <TeamLogo teamId={pilot.team.id} size="md" />
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 2. MAIN DRIVER STAGE: BUST Framing, Staggered Position & Gradient */}
      {/* ============================================================= */}
      <div className={`relative flex-1 h-full overflow-hidden order-2 ${!isLeft ? 'translate-y-2' : ''}`}>
        {/* ----------------------------------------------------------- */}
        {/* DRIVER POSITION BADGE: Beside head, facing center */}
        {/* STAGGER: Even position is offset downwards (top-12 vs top-7) */}
        {/* ----------------------------------------------------------- */}
        <motion.div
          key={`pos-badge-${pilot.id}-${pilot.position}`}
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute z-35 flex items-start pointer-events-none ${
            isLeft
              ? 'top-7 sm:top-10 right-6 sm:right-10 lg:right-14'
              : 'top-12 sm:top-16 left-6 sm:left-10 lg:left-14'
          }`}
        >
          <div className="flex items-baseline">
            <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black italic text-white font-['Titillium_Web'] leading-none drop-shadow-[0_4px_28px_rgba(0,0,0,0.98)]">
              {num}
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black italic text-white font-['Titillium_Web'] ml-1 leading-none drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
              {suffix}
            </span>
          </div>
        </motion.div>

        {/* ----------------------------------------------------------- */}
        {/* BUST PORTRAIT CONTAINER: Head, Shoulders, Upper Chest only */}
        {/* ----------------------------------------------------------- */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none overflow-hidden z-20 pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`pilot-portrait-${pilot.id}`}
              initial={{
                scaleY: 0.02,
                opacity: 0,
                filter: 'brightness(3.5) contrast(1.8)'
              }}
              animate={{
                scaleY: 1,
                opacity: 1,
                filter: 'brightness(1) contrast(1)'
              }}
              exit={{
                opacity: 0,
                scaleY: 0.05,
                filter: 'brightness(2)'
              }}
              transition={{
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="relative w-full h-full max-w-[500px] sm:max-w-[580px] md:max-w-[680px] lg:max-w-[780px] flex items-end justify-center pb-2"
            >
              {/* 1. Team-Color Halftone LED Dot Matrix Materialization Flash (Fully fades to 0) */}
              <motion.div
                initial={{ opacity: 0.95 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.48, ease: 'easeOut' }}
                className="absolute inset-0 pointer-events-none z-10 mix-blend-screen"
                style={{
                  backgroundImage: `radial-gradient(circle, ${gradTop} 2px, transparent 2px)`,
                  backgroundSize: '6px 6px'
                }}
              />

              {/* 2. CRT Scanline Raster Flash */}
              <motion.div
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 pointer-events-none z-15 bg-gradient-to-b from-white/35 via-transparent to-white/15"
              />

              {/* 3. Diagonal Neon Laser Streaks */}
              <motion.div
                initial={{ x: isLeft ? -120 : 120, opacity: 0.95 }}
                animate={{ x: 0, opacity: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="absolute inset-0 pointer-events-none z-15 overflow-hidden"
              >
                <div
                  className="absolute top-1/4 left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_14px_#00d2ff] opacity-85"
                  style={{ transform: 'rotate(-35deg) scaleX(2)' }}
                />
                <div
                  className="absolute top-1/2 left-0 right-0 h-1.5 shadow-[0_0_18px_currentColor] opacity-90"
                  style={{
                    backgroundColor: gradTop,
                    color: gradTop,
                    transform: 'rotate(-35deg) scaleX(2)'
                  }}
                />
                <div
                  className="absolute top-3/4 left-0 right-0 h-1 bg-pink-500 shadow-[0_0_14px_#ec4899] opacity-80"
                  style={{ transform: 'rotate(-35deg) scaleX(2)' }}
                />
              </motion.div>

              {/* Driver BUST Cutout (1:1 aspect ratio bust photo from Drivers tab) */}
              {!hasImageError && pilot.avatarUrl ? (
                <img
                  src={pilot.avatarUrl}
                  alt={pilot.nickname}
                  onError={() => onImageError && onImageError(pilot.id)}
                  className="max-h-[92%] sm:max-h-[96%] w-auto max-w-full object-contain object-bottom filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.98)] select-none relative z-5 scale-[1.12] origin-bottom"
                />
              ) : (
                <DriverAvatarFallback pilot={pilot} isRight={!isLeft} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* LOWER CHEST TYPOGRAPHY: Number centered directly under surname! */}
        {/* ----------------------------------------------------------- */}
        <div
          className="absolute bottom-6 sm:bottom-10 inset-x-4 sm:inset-x-8 z-35 flex flex-col items-center justify-center text-center pointer-events-none select-none"
        >
          {/* Cursive First Name in White Handwriting Script */}
          {firstName && (
            <motion.span
              key={`first-name-${pilot.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="text-4xl sm:text-5xl md:text-6xl text-white font-['Caveat',_'Dancing_Script',_cursive] font-bold drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)] -mb-2 sm:-mb-3.5 select-none tracking-wide text-center"
            >
              {firstName}
            </motion.span>
          )}

          {/* Big Bold Surname with Team Vertical Gradient Fill */}
          <motion.h2
            key={`last-name-${pilot.id}`}
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight leading-none font-['Titillium_Web'] select-none text-center"
            style={{
              background: `linear-gradient(180deg, ${gradTop} 0%, ${gradBottom} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 4px 24px rgba(0,0,0,0.98)) drop-shadow(0 0 16px ${gradTop}50)`
            }}
          >
            {lastName}
          </motion.h2>

          {/* Driver Race Number Centered Directly Under Surname */}
          <motion.div
            key={`drv-num-${pilot.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-['Chakra_Petch'] leading-none mt-1 select-none text-center mx-auto"
            style={{
              background: `linear-gradient(180deg, ${gradTop} 0%, ${gradBottom} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 4px 20px rgba(0,0,0,0.98)) drop-shadow(0 0 12px ${gradTop}45)`
            }}
          >
            {pilot.driverNumber}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default F1GridDriverCard;
