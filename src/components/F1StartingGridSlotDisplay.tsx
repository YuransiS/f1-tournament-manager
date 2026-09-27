import React from 'react';
import { motion } from 'framer-motion';
import { GridPilot } from './F1StartingGrid';
import TeamLogo from './TeamLogo';

interface StartingGridSlotDisplayProps {
  pairs: [GridPilot, GridPilot | null][];
  activePairIndex: number;
  onSelectPair: (idx: number) => void;
}

export function getDriver3LetterCode(pilot?: GridPilot | null): string {
  if (!pilot) return '—';
  const name = (pilot.nickname || pilot.realName || '').trim();
  const parts = name.split(' ');
  const surname = parts.length > 1 ? parts[parts.length - 1] : parts[0];
  const clean = surname.toUpperCase().replace(/[^A-Z]/g, '');
  if (clean === 'MARK') return 'MRK';
  if (clean === 'ZAKHARCHUK') return 'ZAK';
  if (clean === 'YAREMA') return 'YAR';
  if (clean === 'GROMOV') return 'GRO';
  if (clean === 'KOVALENKO') return 'KOV';
  if (clean === 'MANSTEIN') return 'MAN';
  if (clean === 'ALONSO') return 'ALO';
  if (clean === 'RUSSELL') return 'RUS';
  if (clean === 'VERSTAPPEN') return 'VER';
  if (clean === 'LECLERC') return 'LEC';
  if (clean === 'NORRIS') return 'NOR';
  if (clean === 'HAMILTON') return 'HAM';
  if (clean === 'SAINZ') return 'SAI';
  if (clean === 'PIASTRI') return 'PIA';
  if (clean === 'GASLY') return 'GAS';
  if (clean === 'ALBON') return 'ALB';
  if (clean === 'HULKENBERG') return 'HUL';
  if (clean === 'BOTTAS') return 'BOT';
  if (clean === 'STROLL') return 'STR';
  if (clean === 'PEREZ') return 'PER';
  if (clean === 'OCON') return 'OCO';
  if (clean === 'TSUNODA') return 'TSU';
  if (clean === 'ZHOU') return 'ZHO';
  if (clean === 'RICCIARDO') return 'RIC';
  if (clean === 'MAGNUSSEN') return 'MAG';
  return clean.slice(0, 3) || 'DRV';
}

export const F1StartingGridSlotDisplay: React.FC<StartingGridSlotDisplayProps> = ({
  pairs,
  activePairIndex,
  onSelectPair
}) => {
  const total = pairs.length;
  // Divide rows into top group (rows 1-5, e.g. indices 0-4) and bottom group (rows 6-10, e.g. indices 5-9)
  const splitIndex = Math.min(5, Math.ceil(total / 2));
  const topRows = pairs.slice(0, splitIndex);
  const bottomRows = pairs.slice(splitIndex);

  const renderRow = (pair: [GridPilot, GridPilot | null], pairIndex: number) => {
    const [pA, pB] = pair;
    const isActive = pairIndex === activePairIndex;
    const codeA = getDriver3LetterCode(pA);
    const codeB = getDriver3LetterCode(pB);

    return (
      <div
        key={`grid-peloton-row-${pairIndex}`}
        onClick={() => onSelectPair(pairIndex)}
        className="flex items-center justify-between w-full gap-2 cursor-pointer transition-transform duration-200 group"
      >
        {/* Left Slot (Odd position) */}
        <div
          className={`flex-1 h-6 sm:h-7 rounded-sm flex items-center justify-between px-1.5 sm:px-2 transition-all duration-300 ${
            isActive
              ? 'bg-white/20 border-2 border-white shadow-[0_0_14px_rgba(255,255,255,0.85)] scale-[1.03]'
              : 'bg-black/75 border border-white/20 group-hover:border-white/50 text-neutral-300'
          }`}
        >
          <span className="text-[10px] sm:text-xs font-mono font-black text-white/90">
            {pA?.position}
          </span>
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center">
            {pA?.team.id && <TeamLogo teamId={pA.team.id} size="sm" />}
          </div>
          <span className="text-[10px] sm:text-xs font-black tracking-wider text-white font-['Titillium_Web']">
            {codeA}
          </span>
        </div>

        {/* Center Gap Spacer for Twin Red Line Spine */}
        <div className="w-4 sm:w-5 flex-shrink-0" />

        {/* Right Slot (Even position) */}
        <div
          className={`flex-1 h-6 sm:h-7 rounded-sm flex items-center justify-between px-1.5 sm:px-2 transition-all duration-300 ${
            isActive
              ? 'bg-white/20 border-2 border-white shadow-[0_0_14px_rgba(255,255,255,0.85)] scale-[1.03]'
              : 'bg-black/75 border border-white/20 group-hover:border-white/50 text-neutral-300'
          }`}
        >
          <span className="text-[10px] sm:text-xs font-mono font-black text-white/90">
            {pB?.position || '—'}
          </span>
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center">
            {pB?.team.id && <TeamLogo teamId={pB.team.id} size="sm" />}
          </div>
          <span className="text-[10px] sm:text-xs font-black tracking-wider text-white font-['Titillium_Web']">
            {codeB}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-between select-none py-2 pointer-events-auto">
      {/* ------------------------------------------------------------- */}
      {/* CENTRAL TWIN RED STRIPES (Exact F1 Broadcast Twin Red Pillars) */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none z-10">
        <div className="w-[3px] bg-[#E10600] shadow-[0_0_10px_#E10600]" />
        <div className="w-[3px] bg-[#E10600] shadow-[0_0_10px_#E10600]" />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TOP PELOTON GROUP (Rows 1 to 5: P1 to P10) */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full flex flex-col gap-1 sm:gap-1.5 z-20">
        {topRows.map((pair, idx) => renderRow(pair, idx))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CENTER VERTICAL NEON: STARTING GRID (Between red lines) */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-25 my-1 sm:my-2 px-1 py-1 rounded bg-black/80 border border-white/15 flex items-center justify-center pointer-events-none shadow-[0_0_15px_rgba(0,0,0,0.9)]">
        <span
          className="text-[10px] sm:text-[11px] font-black tracking-[0.45em] text-[#ffd700] uppercase font-['Titillium_Web'] drop-shadow-[0_0_8px_rgba(255,215,0,0.85)]"
          style={{ writingMode: 'vertical-rl' }}
        >
          STARTING GRID
        </span>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM PELOTON GROUP (Rows 6 to 10+: P11 to P20+) */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full flex flex-col gap-1 sm:gap-1.5 z-20">
        {bottomRows.map((pair, idx) => renderRow(pair, splitIndex + idx))}
      </div>
    </div>
  );
};

export default F1StartingGridSlotDisplay;
