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

// Authentic F1 TV broadcast high-contrast vertical gradient pairings for constructor identities
// All gradients start with crisp white (#ffffff) to ensure 100% legibility on dark/flag backgrounds
export function getTeamGradient(teamId: string, fallbackColor: string): [string, string] {
  const tid = (teamId || '').toLowerCase();
  if (tid.includes('mercedes')) return ['#ffffff', '#00d2be']; // White to Petronas turquoise
  if (tid.includes('red-bull')) return ['#ffffff', '#ff1801']; // White to Red Bull racing red
  if (tid.includes('ferrari')) return ['#ffffff', '#e10600']; // White to Ferrari scarlet
  if (tid.includes('mclaren')) return ['#ffffff', '#ff8000']; // White to Papaya orange
  if (tid.includes('aston-martin')) return ['#ffffff', '#00a382']; // White to Aston teal
  if (tid.includes('alpine')) return ['#ffffff', '#0090ff']; // White to Alpine bright blue
  if (tid.includes('williams')) return ['#ffffff', '#00a0de']; // White to Williams light blue
  if (tid.includes('alfa-romeo') || tid.includes('sauber') || tid.includes('kick')) return ['#ffffff', '#52e252']; // White to Kick neon green
  if (tid.includes('haas')) return ['#ffffff', '#e6002b']; // White to bright Haas red
  if (tid.includes('alphatauri') || tid.includes('rb') || tid.includes('racing-bulls')) return ['#ffffff', '#6692ff']; // White to RB bright cobalt
  return ['#ffffff', fallbackColor || '#e10600'];
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
      {/* 1. OUTER EDGE: SLIM CONSTRUCTOR STRIP + LOGO IMMEDIATELY BELOW */}
      {/* ============================================================= */}
      <div
        className={`relative z-30 w-9 sm:w-11 lg:w-12 h-full flex flex-col items-center justify-center py-6 bg-black/50 backdrop-blur-md flex-shrink-0 gap-3 ${
          isLeft ? 'order-1 border-r border-white/10' : 'order-3 border-l border-white/10'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-3.5 my-auto">
          {/* Rotated Constructor Name */}
          <span
            className="text-[10px] sm:text-xs lg:text-sm font-black tracking-[0.25em] text-white/80 uppercase font-['Titillium_Web'] whitespace-nowrap select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            style={{
              writingMode: 'vertical-rl',
              transform: isLeft ? 'rotate(180deg)' : 'none'
            }}
          >
            {pilot.team.name}
          </span>

          {/* Team Logo immediately below the constructor name */}
          <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mt-1">
            <TeamLogo teamId={pilot.team.id} size="sm" />
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 2. MAIN DRIVER STAGE: BUST Framing, Staggered Position & Gradient */}
      {/* ============================================================= */}
      <div className={`relative flex-1 h-full overflow-hidden order-2 ${!isLeft ? 'translate-y-2' : ''}`}>
        {/* ----------------------------------------------------------- */}
        {/* DRIVER POSITION BADGE: Beside chin/neck facing center (11TH / 12TH) */}
        {/* Crisp solid white with brilliant glow, exactly as on TV broadcast   */}
        {/* ----------------------------------------------------------- */}
        <motion.div
          key={`pos-badge-${pilot.id}-${pilot.position}`}
          initial={{ opacity: 0, scale: 0.85, y: -15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute z-35 flex items-start pointer-events-none ${
            isLeft
              ? 'top-[36%] right-3 sm:right-6 lg:right-8'
              : 'top-[36%] left-3 sm:left-6 lg:left-8'
          }`}
        >
          <div className="flex items-baseline select-none">
            <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black italic text-white font-['Titillium_Web'] leading-none drop-shadow-[0_0_24px_rgba(255,255,255,0.7)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)]">
              {num}
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black italic text-white font-['Titillium_Web'] ml-1 leading-none drop-shadow-[0_0_16px_rgba(255,255,255,0.6)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              {suffix}
            </span>
          </div>
        </motion.div>

        {/* ----------------------------------------------------------- */}
        {/* BUST PORTRAIT CONTAINER: Heroic 1:1 scale filling the screen */}
        {/* ----------------------------------------------------------- */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none overflow-hidden z-20 pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`pilot-portrait-${pilot.id}`}
              initial={{
                opacity: 0,
                y: 35,
                scale: 0.96
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }}
              exit={{
                opacity: 0,
                y: -20,
                scale: 0.98
              }}
              transition={{
                duration: 0.38,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="relative w-full h-full max-w-[850px] flex items-end justify-center pb-0"
              style={{
                maskImage: 'linear-gradient(to top, transparent 0%, black 14%, black 100%)',
                WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 14%, black 100%)'
              }}
            >
              {/* 1. Team-Color Halftone LED Dot Matrix Materialization Flash (Fully fades to 0) */}
              <motion.div
                initial={{ opacity: 0.95 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.48, ease: 'easeOut' }}
                className="absolute inset-0 pointer-events-none z-10 mix-blend-screen"
                style={{
                  backgroundImage: `radial-gradient(circle, ${gradBottom} 2px, transparent 2px)`,
                  backgroundSize: '6px 6px'
                }}
              />

              {/* 2. CRT Scanline Raster Flash */}
              <motion.div
                initial={{ opacity: 0.85 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 pointer-events-none z-15 bg-gradient-to-b from-white/30 via-transparent to-white/10"
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
                    backgroundColor: gradBottom,
                    color: gradBottom,
                    transform: 'rotate(-35deg) scaleX(2)'
                  }}
                />
                <div
                  className="absolute top-3/4 left-0 right-0 h-1 bg-pink-500 shadow-[0_0_14px_#ec4899] opacity-80"
                  style={{ transform: 'rotate(-35deg) scaleX(2)' }}
                />
              </motion.div>

              {/* Driver BUST Cutout (Heroic proportions, 1:1 bust photo from Drivers tab) */}
              {!hasImageError && pilot.avatarUrl ? (
                <img
                  src={pilot.avatarUrl}
                  alt={pilot.nickname}
                  onError={() => onImageError && onImageError(pilot.id)}
                  className="h-[88%] sm:h-[92%] lg:h-[96%] w-auto max-w-[98%] object-contain object-bottom filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.98)] select-none relative z-5"
                />
              ) : (
                <DriverAvatarFallback pilot={pilot} isRight={!isLeft} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* LOWER CHEST TYPOGRAPHY: Number centered directly under surname */}
        {/* ----------------------------------------------------------- */}
        <div
          className="absolute bottom-5 sm:bottom-8 inset-x-2 sm:inset-x-4 z-35 flex flex-col items-center justify-center text-center pointer-events-none select-none"
        >
          {/* Cursive First Name in White Handwriting Script */}
          {firstName && (
            <motion.span
              key={`first-name-${pilot.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-['Caveat',_'Dancing_Script',_cursive] font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] -mb-1 select-none tracking-wide text-center"
            >
              {firstName}
            </motion.span>
          )}

          {/* Big Bold Surname with Team Vertical Gradient Fill - Responsive Clamp to prevent ANY truncation */}
          <motion.h2
            key={`last-name-${pilot.id}`}
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full text-center font-black uppercase tracking-tight leading-none font-['Titillium_Web'] select-none px-2 whitespace-nowrap overflow-visible"
            style={{
              fontSize:
                lastName.length > 9
                  ? 'clamp(2.2rem, 4.4vw, 4.2rem)'
                  : lastName.length > 6
                  ? 'clamp(2.6rem, 5.2vw, 5.2rem)'
                  : 'clamp(3.2rem, 6.2vw, 6.4rem)',
              background: `linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 28%, ${gradBottom} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 4px 24px rgba(0,0,0,0.98)) drop-shadow(0 0 16px ${gradBottom}70)`
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
            className="text-4xl sm:text-5xl md:text-6xl font-black font-['Chakra_Petch'] leading-none mt-1 select-none text-center mx-auto"
            style={{
              background: `linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 30%, ${gradBottom} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 4px 20px rgba(0,0,0,0.98)) drop-shadow(0 0 14px ${gradBottom}60)`
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
