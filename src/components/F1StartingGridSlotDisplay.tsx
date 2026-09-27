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
  const ROW_HEIGHT = 48; // Total height per pair item (36px card + 12px gap)
  const CENTER_ANCHOR = 220; // Exact vertical center anchor for the active pair

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center select-none overflow-hidden py-4 pointer-events-auto">
      {/* ------------------------------------------------------------- */}
      {/* 1. UPPER TWIN THICK RED PILLARS (Chevron 45-deg angled cut)  */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-0 bottom-[54%] left-1/2 -translate-x-1/2 flex gap-2 sm:gap-2.5 pointer-events-none z-10">
        <div
          className="w-5 sm:w-6 lg:w-7 h-full bg-[#E10600] shadow-[0_0_24px_#E10600,0_0_40px_rgba(225,6,0,0.6)]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 74%)' }}
        />
        <div
          className="w-5 sm:w-6 lg:w-7 h-full bg-[#E10600] shadow-[0_0_24px_#E10600,0_0_40px_rgba(225,6,0,0.6)]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 74%)' }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. LOWER TWIN THICK RED PILLARS (Chevron 45-deg angled cut)  */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-[54%] bottom-0 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-2.5 pointer-events-none z-10">
        <div
          className="w-5 sm:w-6 lg:w-7 h-full bg-[#E10600] shadow-[0_0_24px_#E10600,0_0_40px_rgba(225,6,0,0.6)]"
          style={{ clipPath: 'polygon(0 26%, 100% 0, 100% 100%, 0 100%)' }}
        />
        <div
          className="w-5 sm:w-6 lg:w-7 h-full bg-[#E10600] shadow-[0_0_24px_#E10600,0_0_40px_rgba(225,6,0,0.6)]"
          style={{ clipPath: 'polygon(0 26%, 100% 0, 100% 100%, 0 100%)' }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. CENTER FLOATING YELLOW VERTICAL TEXT: STARTING GRID        */}
      {/* Real broadcast styling: NO BOX, NO BORDER, clean neon text!   */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none z-15 flex flex-col items-center justify-center">
        <span
          className="text-xs sm:text-sm font-black tracking-[0.45em] text-[#ffd700] uppercase font-['Titillium_Web'] drop-shadow-[0_0_14px_rgba(255,215,0,0.95)] select-none"
          style={{ writingMode: 'vertical-rl' }}
        >
          STARTING GRID
        </span>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. VERTICAL CAROUSEL REEL: Smooth upward transition           */}
      {/* Past rows glide up, upcoming rows glide into spotlight       */}
      {/* ------------------------------------------------------------- */}
      <div
        className="relative w-full h-[480px] overflow-hidden flex flex-col items-center justify-start z-20 pointer-events-auto"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)'
        }}
      >
        <motion.div
          animate={{ y: CENTER_ANCHOR - (activePairIndex * ROW_HEIGHT) }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col gap-3 items-center"
        >
          {pairs.map((pair, pairIndex) => {
            const [pA, pB] = pair;
            const isRevealed = revealedIndices.has(pairIndex);
            const isActive = pairIndex === activePairIndex;
            const codeA = getDriver3LetterCode(pA);
            const codeB = getDriver3LetterCode(pB);

            return (
              <motion.div
                key={`grid-peloton-row-${pairIndex}`}
                onClick={() => onSelectPair(pairIndex)}
                className={`flex items-center justify-between w-full cursor-pointer transition-all duration-300 ${
                  isActive
                    ? 'opacity-100 scale-[1.04]'
                    : isRevealed
                    ? 'opacity-85 hover:opacity-100'
                    : 'opacity-20 hover:opacity-40'
                }`}
                style={{ height: '36px' }}
              >
                {/* Left Slot (Odd position - Higher / stepped forward) */}
                <div
                  className={`w-[115px] sm:w-[130px] lg:w-[145px] h-[34px] sm:h-[36px] rounded-[3px] flex items-center justify-between px-2.5 transition-all duration-300 ${
                    isActive
                      ? 'bg-white/25 border-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.95),inset_0_0_10px_rgba(255,255,255,0.25)]'
                      : 'bg-black/50 backdrop-blur-xs border border-white/35 hover:border-white/70 text-neutral-200'
                  }`}
                >
                  <span className="w-6 text-left text-xs sm:text-sm font-mono font-black text-white/95">
                    {pA?.position}
                  </span>
                  <div className="w-7 h-5 flex items-center justify-center mx-1 filter drop-shadow">
                    {pA?.team.id && <TeamLogo teamId={pA.team.id} size="sm" />}
                  </div>
                  <span className="w-9 text-right text-xs sm:text-sm font-black tracking-wider text-white font-['Titillium_Web'] drop-shadow">
                    {codeA}
                  </span>
                </div>

                {/* Center Gap Spacer for 2x Thicker Twin Red Pillars */}
                <div className="w-14 sm:w-16 lg:w-20 flex-shrink-0" />

                {/* Right Slot (Even position - Staggered downwards by ~12px) */}
                <div
                  className={`w-[115px] sm:w-[130px] lg:w-[145px] h-[34px] sm:h-[36px] rounded-[3px] flex items-center justify-between px-2.5 transition-all duration-300 translate-y-3 sm:translate-y-3.5 ${
                    isActive
                      ? 'bg-white/25 border-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.95),inset_0_0_10px_rgba(255,255,255,0.25)]'
                      : 'bg-black/50 backdrop-blur-xs border border-white/35 hover:border-white/70 text-neutral-200'
                  }`}
                >
                  <span className="w-6 text-left text-xs sm:text-sm font-mono font-black text-white/95">
                    {pB?.position || '—'}
                  </span>
                  <div className="w-7 h-5 flex items-center justify-center mx-1 filter drop-shadow">
                    {pB?.team.id && <TeamLogo teamId={pB.team.id} size="sm" />}
                  </div>
                  <span className="w-9 text-right text-xs sm:text-sm font-black tracking-wider text-white font-['Titillium_Web'] drop-shadow">
                    {codeB}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default F1StartingGridSlotDisplay;
