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

  return (
    <div className="relative w-full h-full flex select-none overflow-hidden">
      {/* ============================================================= */}
      {/* 1. OUTER EDGE: ROTATED CONSTRUCTOR BAR + TEAM LOGO AT BOTTOM */}
      {/* ============================================================= */}
      <div
        className={`relative z-30 w-11 sm:w-14 lg:w-16 h-full flex flex-col items-center justify-between py-6 bg-black/60 backdrop-blur-md border-neutral-800/80 flex-shrink-0 ${
          isLeft ? 'order-1 border-r' : 'order-3 border-l'
        }`}
      >
        {/* Top Accent Dot in Team Color */}
        <div
          className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor]"
          style={{ backgroundColor: teamPrimaryColor, color: teamPrimaryColor }}
        />

        {/* Rotated Constructor Name (Wide tracked uppercase) */}
        <div className="flex-1 flex items-center justify-center my-4 overflow-hidden">
          <span
            className="text-xs sm:text-sm lg:text-base font-black tracking-[0.32em] text-white/90 uppercase font-['Titillium_Web'] whitespace-nowrap select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            style={{
              writingMode: 'vertical-rl',
              transform: isLeft ? 'rotate(180deg)' : 'none'
            }}
          >
            {pilot.team.name}
          </span>
        </div>

        {/* Team Logo at the bottom of the outer strip */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          <TeamLogo teamId={pilot.team.id} size="md" />
        </div>
      </div>

      {/* ============================================================= */}
      {/* 2. MAIN DRIVER STAGE (Portrait, Position Watermark, Chest Typography) */}
      {/* ============================================================= */}
      <div className={`relative flex-1 h-full overflow-hidden ${isLeft ? 'order-2' : 'order-2'}`}>
        {/* ----------------------------------------------------------- */}
        {/* DRIVER POSITION BADGE: Beside head, facing center */}
        {/* Left card: on inner right side; Right card: on inner left side */}
        {/* ----------------------------------------------------------- */}
        <motion.div
          key={`pos-badge-${pilot.id}-${pilot.position}`}
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute top-8 sm:top-12 z-35 flex items-start pointer-events-none ${
            isLeft ? 'right-4 sm:right-8 lg:right-12' : 'left-4 sm:left-8 lg:left-12'
          }`}
        >
          <div className="flex items-baseline">
            <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black italic text-white font-['Titillium_Web'] leading-none drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)]">
              {num}
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black italic text-white font-['Titillium_Web'] ml-1 leading-none drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
              {suffix}
            </span>
          </div>
        </motion.div>

        {/* ----------------------------------------------------------- */}
        {/* MATERIALIZATION CONTAINER: Driver Cutout + CRT + LED Dots */}
        {/* ----------------------------------------------------------- */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none overflow-hidden z-20">
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
              className="relative w-full h-full max-w-[480px] sm:max-w-[560px] md:max-w-[660px] lg:max-w-[760px] flex items-end justify-center"
            >
              {/* 1. Team-Color Halftone LED Dot Matrix Overlay (Flashes on enter) */}
              <motion.div
                initial={{ opacity: 0.95 }}
                animate={{ opacity: 0.12 }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
                className="absolute inset-0 pointer-events-none z-10 mix-blend-screen"
                style={{
                  backgroundImage: `radial-gradient(circle, ${teamPrimaryColor} 2.5px, transparent 2.5px)`,
                  backgroundSize: '7px 7px'
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
                    backgroundColor: teamPrimaryColor,
                    color: teamPrimaryColor,
                    transform: 'rotate(-35deg) scaleX(2)'
                  }}
                />
                <div
                  className="absolute top-3/4 left-0 right-0 h-1 bg-pink-500 shadow-[0_0_14px_#ec4899] opacity-80"
                  style={{ transform: 'rotate(-35deg) scaleX(2)' }}
                />
              </motion.div>

              {/* Driver Cutout Portrait */}
              {!hasImageError && pilot.avatarUrl ? (
                <img
                  src={pilot.avatarUrl}
                  alt={pilot.nickname}
                  onError={() => onImageError && onImageError(pilot.id)}
                  className="max-h-[96%] max-w-full h-auto w-auto object-contain object-bottom filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.98)] select-none relative z-5"
                />
              ) : (
                <DriverAvatarFallback pilot={pilot} isRight={!isLeft} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* LOWER CHEST TYPOGRAPHY: Cursive First Name + Surname + Number */}
        {/* ----------------------------------------------------------- */}
        <div
          className={`absolute bottom-6 sm:bottom-10 z-35 flex flex-col pointer-events-none select-none ${
            isLeft ? 'left-6 sm:left-10 lg:left-14 items-start' : 'right-6 sm:right-10 lg:right-14 items-end text-right'
          }`}
        >
          {/* Cursive First Name in White script */}
          {firstName && (
            <motion.span
              key={`first-name-${pilot.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-['Caveat'] font-bold drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)] -mb-2 sm:-mb-3 select-none"
            >
              {firstName}
            </motion.span>
          )}

          {/* Big Bold Surname in Team Color */}
          <motion.h2
            key={`last-name-${pilot.id}`}
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight leading-none drop-shadow-[0_6px_28px_rgba(0,0,0,0.98)] font-['Titillium_Web'] select-none"
            style={{ color: teamPrimaryColor }}
          >
            {lastName}
          </motion.h2>

          {/* Driver Race Number in Team Color */}
          <motion.div
            key={`drv-num-${pilot.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-['Chakra_Petch'] leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)] mt-1 select-none"
            style={{ color: teamPrimaryColor }}
          >
            {pilot.driverNumber}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default F1GridDriverCard;
