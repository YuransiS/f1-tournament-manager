import React from 'react';
import { motion } from 'framer-motion';
import { GridPilot } from './F1StartingGrid';
import TeamLogo from './TeamLogo';

interface StartingGridSlotDisplayProps {
  pairs: [GridPilot, GridPilot | null][];
  activePairIndex: number;
  revealedIndices: Set<number>;
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
  revealedIndices,
  onSelectPair
}) => {
  const total = pairs.length;
  // Divide rows into top group (e.g. rows 1-5, indices 0-4) and bottom group (e.g. rows 6-10, indices 5-9)
  const splitIndex = Math.min(5, Math.ceil(total / 2));
  const topRows = pairs.slice(0, splitIndex);
  const bottomRows = pairs.slice(splitIndex);

  const renderRow = (pair: [GridPilot, GridPilot | null], pairIndex: number) => {
    const [pA, pB] = pair;
    const isRevealed = revealedIndices.has(pairIndex);
    const isActive = pairIndex === activePairIndex;
    const codeA = getDriver3LetterCode(pA);
    const codeB = getDriver3LetterCode(pB);

    // If row hasn't been revealed yet in the bottom-to-top sequence, keep invisible spacer to lock layout
    if (!isRevealed) {
      return (
        <div
          key={`grid-peloton-row-${pairIndex}`}
          className="flex items-center justify-between w-full h-[28px] sm:h-[32px] opacity-0 pointer-events-none"
        >
          <div className="w-[105px] sm:w-[118px] h-[28px] sm:h-[32px]" />
          <div className="w-8 sm:w-10 flex-shrink-0" />
          <div className="w-[105px] sm:w-[118px] h-[28px] sm:h-[32px] translate-y-3.5" />
        </div>
      );
    }

    return (
      <motion.div
        key={`grid-peloton-row-${pairIndex}`}
        initial={{ opacity: 0, scale: 0.88, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => onSelectPair(pairIndex)}
        className="flex items-center justify-between w-full cursor-pointer transition-transform duration-200 group"
      >
        {/* ========================================================= */}
        {/* Left Slot (Odd position - Higher / stepped forward)       */}
        {/* Format: [ Position (left) | Logo (center) | Code (right) ]*/}
        {/* ========================================================= */}
        <div
          className={`w-[105px] sm:w-[118px] h-[28px] sm:h-[32px] rounded-sm flex items-center justify-between px-2 transition-all duration-300 ${
            isActive
              ? 'bg-white/20 border-2 border-white shadow-[0_0_16px_rgba(255,255,255,0.9)] scale-[1.04]'
              : 'bg-[#0a0d18]/90 border border-white/20 group-hover:border-white/50 text-neutral-300'
          }`}
        >
          {/* Position number */}
          <span className="w-5 text-left text-xs font-mono font-black text-white/90">
            {pA?.position}
          </span>

          {/* Cleanly fitted team logo */}
          <div className="w-6 h-5 flex items-center justify-center mx-1 filter drop-shadow">
            {pA?.team.id && <TeamLogo teamId={pA.team.id} size="sm" />}
          </div>

          {/* 3-letter driver code */}
          <span className="w-8 text-right text-xs font-black tracking-wider text-white font-['Titillium_Web'] drop-shadow">
            {codeA}
          </span>
        </div>

        {/* Center Gap Spacer for Twin Thick Red Pillars */}
        <div className="w-8 sm:w-10 flex-shrink-0" />

        {/* ========================================================= */}
        {/* Right Slot (Even position - Staggered DOWNWARDS by ~14px)  */}
        {/* Format: [ Position (left) | Logo (center) | Code (right) ]*/}
        {/* ========================================================= */}
        <div
          className={`w-[105px] sm:w-[118px] h-[28px] sm:h-[32px] rounded-sm flex items-center justify-between px-2 transition-all duration-300 translate-y-3.5 ${
            isActive
              ? 'bg-white/20 border-2 border-white shadow-[0_0_16px_rgba(255,255,255,0.9)] scale-[1.04]'
              : 'bg-[#0a0d18]/90 border border-white/20 group-hover:border-white/50 text-neutral-300'
          }`}
        >
          {/* Position number */}
          <span className="w-5 text-left text-xs font-mono font-black text-white/90">
            {pB?.position || '—'}
          </span>

          {/* Cleanly fitted team logo */}
          <div className="w-6 h-5 flex items-center justify-center mx-1 filter drop-shadow">
            {pB?.team.id && <TeamLogo teamId={pB.team.id} size="sm" />}
          </div>

          {/* 3-letter driver code */}
          <span className="w-8 text-right text-xs font-black tracking-wider text-white font-['Titillium_Web'] drop-shadow">
            {codeB}
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-between select-none py-2 pointer-events-auto">
      {/* ------------------------------------------------------------- */}
      {/* 1. UPPER TWIN THICK RED PILLAR (Chevron 45-degree angled cut) */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-0 bottom-[53%] left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none z-10">
        <div
          className="w-3 sm:w-3.5 h-full bg-[#E10600] shadow-[0_0_18px_#E10600]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 74%)' }}
        />
        <div
          className="w-3 sm:w-3.5 h-full bg-[#E10600] shadow-[0_0_18px_#E10600]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 74%)' }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. LOWER TWIN THICK RED PILLAR (Chevron 45-degree angled cut) */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-[53%] bottom-0 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none z-10">
        <div
          className="w-3 sm:w-3.5 h-full bg-[#E10600] shadow-[0_0_18px_#E10600]"
          style={{ clipPath: 'polygon(0 26%, 100% 0, 100% 100%, 0 100%)' }}
        />
        <div
          className="w-3 sm:w-3.5 h-full bg-[#E10600] shadow-[0_0_18px_#E10600]"
          style={{ clipPath: 'polygon(0 26%, 100% 0, 100% 100%, 0 100%)' }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TOP PELOTON GROUP (Rows 1 to 5: P1 to P10) */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full flex flex-col gap-1.5 sm:gap-2 z-20">
        {topRows.map((pair, idx) => renderRow(pair, idx))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CENTER VERTICAL NEON: STARTING GRID (Between red pillars) */}
      {/* ------------------------------------------------------------- */}
      <motion.div
        animate={{
          opacity: activePairIndex < splitIndex ? 1 : 0.6,
          scale: activePairIndex < splitIndex ? 1.05 : 1
        }}
        transition={{ duration: 0.4 }}
        className="relative z-25 my-1 sm:my-2 px-1 py-1.5 rounded bg-black/85 border border-white/20 flex items-center justify-center pointer-events-none shadow-[0_0_18px_rgba(0,0,0,0.95)]"
      >
        <span
          className="text-[11px] sm:text-xs font-black tracking-[0.38em] text-[#ffd700] uppercase font-['Titillium_Web'] drop-shadow-[0_0_10px_rgba(255,215,0,0.9)]"
          style={{ writingMode: 'vertical-rl' }}
        >
          STARTING GRID
        </span>
      </motion.div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM PELOTON GROUP (Rows 6 to 10+: P11 to P20+) */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full flex flex-col gap-1.5 sm:gap-2 z-20">
        {bottomRows.map((pair, idx) => renderRow(pair, splitIndex + idx))}
      </div>
    </div>
  );
};

export default F1StartingGridSlotDisplay;
