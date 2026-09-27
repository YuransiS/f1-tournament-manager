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

// Authentic F1 TV broadcast neon constructor colors matching official broadcast graphics
export function getTeamNeonColor(teamId: string, fallbackColor: string): string {
  const tid = (teamId || '').toLowerCase();
  if (tid.includes('mercedes')) return '#00D2BE'; // Petronas turquoise
  if (tid.includes('red-bull') || tid.includes('red bull')) return '#3671C6'; // Red Bull electric blue
  if (tid.includes('ferrari')) return '#E10600'; // Ferrari scarlet
  if (tid.includes('mclaren')) return '#FF8000'; // Papaya orange
  if (tid.includes('aston-martin') || tid.includes('aston')) return '#00A382'; // Aston teal
  if (tid.includes('alpine')) return '#0090FF'; // Alpine bright blue
  if (tid.includes('williams')) return '#00A0DE'; // Williams light blue
  if (tid.includes('alfa-romeo') || tid.includes('sauber') || tid.includes('kick')) return '#52E252'; // Kick neon green
  if (tid.includes('haas')) return '#E6002B'; // Haas red
  if (tid.includes('alphatauri') || tid.includes('rb') || tid.includes('racing-bulls')) return '#6692FF'; // RB cobalt
  return fallbackColor || '#00A0DE';
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

  const { firstName, lastName } = parseDriverName(pilot.realName || '', pilot.nickname);
  const teamColor = getTeamNeonColor(pilot.team.id, pilot.team.primaryColor);

  return (
    <div className="relative w-full h-full flex select-none overflow-hidden">
      {/* ============================================================= */}
      {/* 1. OUTER SCREEN EDGE: CONSTRUCTOR STRIP + TEAM LOGO AT BOTTOM */}
      {/* Exactly as in official F1 reference media_1790524589122.png  */}
      {/* ============================================================= */}
      <div
        className={`relative z-30 w-10 sm:w-12 lg:w-14 2xl:w-16 h-full flex flex-col items-center justify-between py-8 bg-black/65 backdrop-blur-md flex-shrink-0 ${
          isLeft ? 'order-1 border-r border-white/10' : 'order-3 border-l border-white/10'
        }`}
      >
        {/* Rotated Constructor Name */}
        <div className="flex-1 flex items-center justify-center">
          <span
            className="text-xs sm:text-sm lg:text-base 2xl:text-lg font-black tracking-[0.3em] text-white/95 uppercase font-['Titillium_Web'] whitespace-nowrap select-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
            style={{
              writingMode: 'vertical-rl',
              transform: isLeft ? 'rotate(180deg)' : 'none'
            }}
          >
            {pilot.team.name}
          </span>
        </div>

        {/* Team Logo at bottom of the constructor strip */}
        <div className="w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 flex items-center justify-center filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] mt-3">
          <TeamLogo teamId={pilot.team.id} size="md" />
        </div>
      </div>

      {/* ============================================================= */}
      {/* 2. MAIN DRIVER STAGE: Natural bust framing (No head cropping) */}
      {/* Scaled to fill vertical space majestically without void       */}
      {/* ============================================================= */}
      <div className="relative flex-1 h-full overflow-hidden order-2">
        {/* Driver Bust Portrait Container */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none overflow-hidden z-20 pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`pilot-portrait-${pilot.id}`}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full flex items-end justify-center pb-0"
              style={{
                maskImage: 'linear-gradient(to top, transparent 0%, black 8%, black 100%)',
                WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 8%, black 100%)'
              }}
            >
              {/* Driver BUST Cutout: 1:1 bust centered cleanly in transparent box, fitting screen height naturally */}
              {!hasImageError && pilot.avatarUrl ? (
                <img
                  src={pilot.avatarUrl}
                  alt={pilot.nickname}
                  onError={() => onImageError && onImageError(pilot.id)}
                  className="h-[84%] sm:h-[86%] lg:h-[88%] w-auto max-w-full object-contain object-bottom select-none relative z-5 filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.98)]"
                />
              ) : (
                <div className="w-full h-full flex items-end justify-center">
                  <DriverAvatarFallback pilot={pilot} isRight={!isLeft} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ============================================================= */}
        {/* 3. LOWER CHEST TYPOGRAPHY: First Name, Surname, Car Number    */}
        {/* Exact match with official reference media_1790524589122.png   */}
        {/* ============================================================= */}
        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 inset-x-2 sm:inset-x-4 z-35 flex flex-col items-center justify-center text-center pointer-events-none select-none">
          {/* Cursive First Name in White Handwriting Script ("Nico", "Yuki", "Fernando") */}
          {firstName && (
            <motion.span
              key={`first-name-${pilot.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              className="text-4xl sm:text-5xl lg:text-6xl text-white font-['Caveat',_'Dancing_Script',_cursive] font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] -mb-1 select-none tracking-wide text-center"
            >
              {firstName}
            </motion.span>
          )}

          {/* Big Bold Surname with Team Neon Color ("HULKENBERG", "TSUNODA", "ALONSO") */}
          <motion.h2
            key={`last-name-${pilot.id}`}
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.08 }}
            className="w-full text-center font-black uppercase tracking-tight leading-none font-['Titillium_Web'] select-none px-2 whitespace-nowrap overflow-visible"
            style={{
              fontSize:
                lastName.length > 9
                  ? 'clamp(2.4rem, 4.6vw, 4.8rem)'
                  : lastName.length > 6
                  ? 'clamp(3.0rem, 5.6vw, 6.0rem)'
                  : 'clamp(3.6rem, 6.8vw, 7.2rem)',
              color: teamColor,
              textShadow: `0 4px 24px rgba(0,0,0,0.98), 0 0 35px ${teamColor}90`,
              filter: `drop-shadow(0 4px 24px rgba(0,0,0,0.98)) drop-shadow(0 0 24px ${teamColor}80)`
            }}
          >
            {lastName}
          </motion.h2>

          {/* Driver Race Number Centered Directly Under Surname ("27", "22", "14") */}
          <motion.div
            key={`drv-num-${pilot.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="text-5xl sm:text-6xl lg:text-7xl 2xl:text-8xl font-black font-['Chakra_Petch'] leading-none mt-1 select-none text-center mx-auto"
            style={{
              color: teamColor,
              textShadow: `0 4px 20px rgba(0,0,0,0.98), 0 0 26px ${teamColor}80`,
              filter: `drop-shadow(0 4px 20px rgba(0,0,0,0.98)) drop-shadow(0 0 18px ${teamColor}70)`
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
