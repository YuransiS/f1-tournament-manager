import React from 'react';
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
        <div className="px-6 py-4 rounded-xl border border-dashed border-white/20 bg-black/40 backdrop-blur-sm flex flex-col items-center">
          <span className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">
            VACANT GRID POSITION
          </span>
        </div>
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
        } z-10 pointer-events-none opacity-20 sm:opacity-30 transition-opacity`}
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
      {/* UPPER FOREGROUND (z-30): Driver Identity Header */}
      {/* ------------------------------------------------------------- */}
      <div className={`relative z-30 flex flex-col ${isLeft ? 'items-start' : 'items-end'}`}>
        {/* First name, Flag & Number Badge */}
        <div className={`flex items-center gap-2.5 sm:gap-3 ${isLeft ? '' : 'flex-row-reverse'}`}>
          {firstName && (
            <span className="text-base sm:text-lg md:text-xl font-bold text-neutral-200 tracking-wide uppercase font-['Titillium_Web'] drop-shadow">
              {firstName}
            </span>
          )}
          {pilot.countryFlagUrl && (
            <div className="rounded overflow-hidden shadow-lg border border-white/30 flex-shrink-0">
              <FlagIcon countryCode={pilot.countryFlagUrl} style={{ width: '28px', height: '18px' }} />
            </div>
          )}
          {/* Driver Race Number Badge */}
          <span
            className="text-xs sm:text-sm font-mono font-black px-2 py-0.5 rounded text-white bg-black/80 border border-white/25 shadow"
            style={{ borderLeftColor: teamPrimaryColor, borderLeftWidth: '4px' }}
          >
            #{pilot.driverNumber}
          </span>
        </div>

        {/* Big Bold Surname (Significantly Enlarged) */}
        <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase text-white tracking-tight leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mt-1 font-['Titillium_Web']">
          {lastName}
        </h3>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MIDDLE LAYER (z-20): Large Heroic 9:16 Driver Cutout */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-x-0 bottom-0 top-12 sm:top-16 flex items-end justify-center z-20 pointer-events-none">
        <div className="relative w-full max-w-[420px] sm:max-w-[500px] md:max-w-[620px] lg:max-w-[740px] xl:max-w-[840px] h-full flex items-end justify-center pb-0">
          {!hasImageError && pilot.avatarUrl ? (
            <img
              src={pilot.avatarUrl}
              alt={pilot.nickname}
              onError={() => onImageError && onImageError(pilot.id)}
              className="max-h-[98%] max-w-full h-auto w-auto object-contain object-bottom filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.98)] select-none"
            />
          ) : (
            <DriverAvatarFallback pilot={pilot} isRight={!isLeft} />
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* LOWER FOREGROUND (z-30): Authentic Broadcast Lower-Third Plates */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`relative z-30 flex flex-col gap-2 mt-auto select-none ${
          isLeft ? 'items-start' : 'items-end'
        }`}
      >
        {/* Team Branding Pill */}
        <div
          className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-black/80 border border-white/20 backdrop-blur-md shadow-lg ${
            isLeft ? 'border-l-4' : 'border-r-4 flex-row-reverse'
          }`}
          style={
            isLeft
              ? { borderLeftColor: teamPrimaryColor }
              : { borderRightColor: teamPrimaryColor }
          }
        >
          <TeamLogo teamId={pilot.team.id} size="md" />
          <span className="text-xs sm:text-sm md:text-base font-bold text-neutral-100 tracking-wider uppercase drop-shadow font-['Titillium_Web']">
            {pilot.team.name}
          </span>
        </div>

        {/* Telemetry Lap Time or Interval Delta Plate */}
        <div
          className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-black/90 border border-white/25 backdrop-blur-md shadow-2xl ${
            isLeft ? 'border-l-4' : 'border-r-4 flex-row-reverse'
          }`}
          style={
            isLeft
              ? { borderLeftColor: isPole ? '#FFD700' : teamPrimaryColor }
              : { borderRightColor: teamPrimaryColor }
          }
        >
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
            {isPole ? 'POLE TIME' : 'INTERVAL'}
          </span>
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono font-black text-white tracking-wider drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {pilot.lapTimeOrDelta}
          </span>
        </div>
      </div>
    </div>
  );
};

export default F1GridDriverCard;
