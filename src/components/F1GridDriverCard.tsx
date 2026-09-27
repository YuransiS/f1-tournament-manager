import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlagIcon from './FlagIcon';
import TeamLogo from './TeamLogo';
import DriverAvatarFallback from './DriverAvatarFallback';
import { GridPilot } from './F1StartingGrid';

interface F1GridDriverCardProps {
  pilot: GridPilot | null;
  align: 'left' | 'right';
  hasImageError?: boolean;
  onImageError?: (id: string) => void;
}

function getOrdinalParts(n: number): { num: number; suffix: string } {
  const s = ['TH', 'ST', 'ND', 'RD'];
  const v = n % 100;
  const suffix = s[(v - 20) % 10] || s[v] || s[0];
  return { num: n, suffix: suffix.toLowerCase() };
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
      <div className={`relative flex-1 h-full flex flex-col justify-center items-center p-6 ${isLeft ? 'items-start' : 'items-end'}`}>
        <span className="text-xs font-mono font-bold tracking-widest text-neutral-600 uppercase">
          VACANT GRID POSITION
        </span>
      </div>
    );
  }

  const ordinal = getOrdinalParts(pilot.position);
  const { firstName, lastName } = parseDriverName(pilot.realName || '', pilot.nickname);
  const teamPrimaryColor = pilot.team.primaryColor || '#E10600';
  const isPole = pilot.position === 1;

  return (
    <div
      className={`relative flex-1 h-full flex flex-col justify-between pt-2 sm:pt-4 pb-4 select-none ${
        isLeft
          ? 'pl-6 sm:pl-10 lg:pl-14 pr-2 sm:pr-4 items-start'
          : 'pr-6 sm:pr-10 lg:pr-14 pl-2 sm:pl-4 items-end text-right'
      }`}
    >
      {/* ------------------------------------------------------------- */}
      {/* BACKGROUND LAYER (z-10): Giant Heroic Position Watermark */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`absolute top-0 sm:top-2 ${
          isLeft ? 'left-6 sm:left-10 lg:left-14' : 'right-6 sm:right-10 lg:right-14'
        } z-10 pointer-events-none opacity-20 sm:opacity-25 transition-opacity`}
      >
        <div className={`flex items-baseline ${isLeft ? '' : 'flex-row-reverse'}`}>
          <span className="text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] font-black italic text-[#E10600] font-['Chakra_Petch'] leading-none drop-shadow-[0_0_35px_rgba(225,6,0,0.45)]">
            {ordinal.num}
          </span>
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic text-[#E10600] font-['Chakra_Petch'] -ml-1">
            {ordinal.suffix}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* UPPER FOREGROUND (z-30): Clean Typography (NO Clumsy Box Borders) */}
      {/* ------------------------------------------------------------- */}
      <div className={`relative z-30 flex flex-col ${isLeft ? 'items-start' : 'items-end'}`}>
        {/* Driver Number, Flag & First Name (Smooth borderless integration) */}
        <div className={`flex items-center gap-2.5 sm:gap-3 ${isLeft ? '' : 'flex-row-reverse'}`}>
          <span
            className="text-sm sm:text-base md:text-lg font-mono font-black tracking-wider uppercase drop-shadow"
            style={{ color: teamPrimaryColor }}
          >
            #{pilot.driverNumber}
          </span>

          {pilot.countryFlagUrl && (
            <FlagIcon
              countryCode={pilot.countryFlagUrl}
              style={{
                width: '28px',
                height: '18px',
                borderRadius: '3px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.7)',
                border: 'none'
              }}
            />
          )}

          {firstName && (
            <span className="text-base sm:text-lg md:text-xl font-bold text-neutral-200 tracking-wide uppercase font-['Titillium_Web'] drop-shadow">
              {firstName}
            </span>
          )}
        </div>

        {/* Big Bold Surname */}
        <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase text-white tracking-tight leading-none drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)] mt-1 font-['Titillium_Web']">
          {lastName}
        </h3>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MIDDLE LAYER (z-20): Authentic F1 Materialization Animation */}
      {/* Half Team-Color Dot Matrix + Half CRT Old TV Turn-On Expansion */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-x-0 bottom-0 top-10 sm:top-14 flex items-end justify-center z-20 pointer-events-none overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`pilot-portrait-${pilot.id}`}
            initial={{ scaleY: 0.04, opacity: 0, filter: 'brightness(3.5) contrast(1.6)' }}
            animate={{ scaleY: 1, opacity: 1, filter: 'brightness(1) contrast(1)' }}
            exit={{ opacity: 0, scaleY: 0.1, filter: 'brightness(2)' }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[420px] sm:max-w-[500px] md:max-w-[620px] lg:max-w-[740px] xl:max-w-[840px] h-full flex items-end justify-center pb-0"
          >
            {/* 1. Team-Color Halftone LED Dot Matrix Overlay (Flashes and dissolves) */}
            <motion.div
              initial={{ opacity: 0.95 }}
              animate={{ opacity: 0.18 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute inset-0 pointer-events-none z-10 mix-blend-screen"
              style={{
                backgroundImage: `radial-gradient(circle, ${teamPrimaryColor} 2px, transparent 2px)`,
                backgroundSize: '6px 6px'
              }}
            />

            {/* 2. CRT Scanline Raster Flash */}
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 pointer-events-none z-15 bg-gradient-to-b from-white/30 via-transparent to-white/10"
            />

            {/* 3. Diagonal Neon Speed Slashes (as seen in official F1 reference broadcast) */}
            <motion.div
              initial={{ x: isLeft ? -100 : 100, opacity: 0.9 }}
              animate={{ x: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute inset-0 pointer-events-none z-15 overflow-hidden"
            >
              <div
                className="absolute top-1/4 left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_12px_#00d2ff] opacity-80"
                style={{ transform: 'rotate(-32deg) scaleX(1.8)' }}
              />
              <div
                className="absolute top-1/2 left-0 right-0 h-1.5 bg-[#E10600] shadow-[0_0_14px_#E10600] opacity-80"
                style={{ transform: 'rotate(-32deg) scaleX(1.8)' }}
              />
              <div
                className="absolute top-3/4 left-0 right-0 h-1 bg-pink-500 shadow-[0_0_12px_#ec4899] opacity-75"
                style={{ transform: 'rotate(-32deg) scaleX(1.8)' }}
              />
            </motion.div>

            {/* Driver Portrait Image */}
            {!hasImageError && pilot.avatarUrl ? (
              <img
                src={pilot.avatarUrl}
                alt={pilot.nickname}
                onError={() => onImageError && onImageError(pilot.id)}
                className="max-h-[98%] max-w-full h-auto w-auto object-contain object-bottom filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.98)] select-none relative z-5"
              />
            ) : (
              <DriverAvatarFallback pilot={pilot} isRight={!isLeft} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* LOWER FOREGROUND (z-30): Clean Broadcast Plate (NO Box Borders) */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`relative z-30 flex flex-col gap-1 mt-auto select-none ${
          isLeft ? 'items-start' : 'items-end'
        }`}
      >
        {/* Team Logo & Constructor Name (Pure clean layout, no pill borders) */}
        <div className={`flex items-center gap-2.5 ${isLeft ? '' : 'flex-row-reverse'}`}>
          <TeamLogo teamId={pilot.team.id} size="md" />
          <span
            className="text-xs sm:text-sm md:text-base font-bold text-neutral-100 tracking-wider uppercase drop-shadow font-['Titillium_Web']"
          >
            {pilot.team.name}
          </span>
          <div
            className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
            style={{ backgroundColor: teamPrimaryColor, color: teamPrimaryColor }}
          />
        </div>

        {/* Telemetry Lap Time or Interval Delta (Big bold digits, no double pill borders) */}
        <div className={`flex items-baseline gap-2.5 mt-0.5 ${isLeft ? '' : 'flex-row-reverse'}`}>
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono font-black text-white tracking-wider drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] leading-none">
            {pilot.lapTimeOrDelta}
          </span>
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
            {isPole ? 'POLE' : 'INTERVAL'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default F1GridDriverCard;
