import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
function getTeamNeonColor(teamId: string, fallbackColor: string): string {
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
    <div className="relative w-full h-full flex flex-col justify-end select-none overflow-hidden">
      {/* ============================================================= */}
      {/* 1. DRIVER BUST PORTRAIT: 1:1 Bust filling half-screen         */}
      {/* Offset slightly away from the central grid tower              */}
      {/* ============================================================= */}
      <div
        className={`absolute inset-0 flex items-end justify-center pointer-events-none overflow-hidden z-20 pb-0 ${
          isLeft ? 'pr-[18%] sm:pr-[22%] lg:pr-[24%]' : 'pl-[18%] sm:pl-[22%] lg:pl-[24%]'
        }`}
      >
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
            {!hasImageError && pilot.avatarUrl ? (
              <img
                src={pilot.avatarUrl}
                alt={pilot.nickname}
                onError={() => onImageError && onImageError(pilot.id)}
                className="h-[92%] sm:h-[94%] lg:h-[96%] w-auto max-w-full object-contain object-bottom select-none relative z-5 filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.98)]"
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
      {/* 2. LOWER CHEST TYPOGRAPHY: First Name, Surname, Car Number    */}
      {/* ============================================================= */}
      <div
        className={`absolute bottom-3 sm:bottom-5 lg:bottom-7 inset-x-2 sm:inset-x-4 z-35 flex flex-col items-center justify-center text-center pointer-events-none select-none ${
          isLeft ? 'pr-[18%] sm:pr-[22%] lg:pr-[24%]' : 'pl-[18%] sm:pl-[22%] lg:pl-[24%]'
        }`}
      >
        {/* Cursive First Name in White Handwriting Script ("Nico", "Yuki", "Fernando") */}
        {firstName && (
          <motion.span
            key={`first-name-${pilot.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className="text-3xl sm:text-4xl lg:text-5xl text-white font-['Caveat',_'Dancing_Script',_cursive] font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] -mb-1 select-none tracking-wide text-center"
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
                ? 'clamp(1.75rem, 1rem + 2.4vw, 3.6rem)'
                : lastName.length > 6
                ? 'clamp(2.1rem, 1.1rem + 3.0vw, 4.4rem)'
                : 'clamp(2.5rem, 1.2rem + 3.6vw, 5.2rem)',
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
          className="text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-black font-['Chakra_Petch'] leading-none mt-1 select-none text-center mx-auto"
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
  );
};

export default F1GridDriverCard;
