import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GridPilot } from './F1StartingGrid';
import TeamLogo from './TeamLogo';

interface StartingGridSlotDisplayProps {
  pairs: [GridPilot, GridPilot | null][];
  activePairIndex: number;
  revealedIndices: Set<number>;
  onSelectPair: (idx: number) => void;
}

export function formatF1PositionOrdinal(n: number): { num: number; suffix: string } {
  const s = ['TH', 'ST', 'ND', 'RD'];
  const v = n % 100;
  const suffix = s[(v - 20) % 10] || s[v] || s[0];
  return { num: n, suffix };
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
  if (clean === 'COLAPINTO') return 'COL';
  if (clean === 'BEARMAN') return 'BEA';
  if (clean === 'LAWSON') return 'LAW';
  if (clean === 'BORTOLETO') return 'BOR';
  return clean.slice(0, 3) || 'DRV';
}

export const F1StartingGridSlotDisplay: React.FC<StartingGridSlotDisplayProps> = ({
  pairs,
  activePairIndex,
  revealedIndices,
  onSelectPair
}) => {
  const currentPair = pairs[activePairIndex] || [null, null];
  const [leftPilot, rightPilot] = currentPair;

  const leftPos = leftPilot ? formatF1PositionOrdinal(leftPilot.position) : null;
  const rightPos = rightPilot ? formatF1PositionOrdinal(rightPilot.position) : null;

  // Render revealed rows from active down to rear (up to 5 rows visible)
  const visibleRows = pairs
    .map((pair, idx) => ({ pair, idx }))
    .filter(({ idx }) => idx >= activePairIndex && (revealedIndices.has(idx) || idx <= activePairIndex + 3));

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-between select-none overflow-hidden pointer-events-auto">
      {/* ============================================================= */}
      {/* 1. UPPER TWIN RED BARS (Top edge down to ~33% with \ diagonal cut) */}
      {/* ============================================================= */}
      <div className="absolute top-0 bottom-[66%] left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4 lg:gap-5 pointer-events-none z-10">
        {/* Left red stripe (ends slightly higher) */}
        <div
          className="w-4 sm:w-5 lg:w-6 2xl:w-7 h-full bg-[#E10600] shadow-[0_0_24px_#E10600,0_0_40px_#E10600]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 18px), 0 calc(100% - 36px))' }}
        />
        {/* Right red stripe (ends slightly lower, forming single continuous \ diagonal) */}
        <div
          className="w-4 sm:w-5 lg:w-6 2xl:w-7 h-full bg-[#E10600] shadow-[0_0_24px_#E10600,0_0_40px_#E10600]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 18px))' }}
        />
      </div>

      {/* ============================================================= */}
      {/* 2. MID SECTION (y ≈ 33% to 68%): STARTING GRID + 13TH / 14TH */}
      {/* 1-to-1 match with official reference broadcast graphic        */}
      {/* ============================================================= */}
      <div className="absolute top-[32%] bottom-[32%] inset-x-0 flex items-center justify-center pointer-events-none z-25">
        {/* Left Position Number: 13TH */}
        <div className="flex-1 flex justify-end pr-3 sm:pr-6 lg:pr-8">
          <AnimatePresence mode="wait">
            {leftPos && (
              <motion.div
                key={`mid-pos-left-${leftPilot?.id}-${leftPos.num}`}
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex items-baseline select-none"
              >
                <span className="text-7xl sm:text-8xl lg:text-9xl 2xl:text-[10.5rem] font-black italic text-white font-['Titillium_Web'] leading-none drop-shadow-[0_0_28px_rgba(255,255,255,0.75)] drop-shadow-[0_6px_30px_rgba(0,0,0,0.98)]">
                  {leftPos.num}
                </span>
                <span className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black italic text-white font-['Titillium_Web'] ml-1 leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.65)]">
                  {leftPos.suffix}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center Floating Yellow Text: STARTING GRID */}
        <div className="w-14 sm:w-18 lg:w-22 flex flex-col items-center justify-center flex-shrink-0">
          <span
            className="text-xs sm:text-sm lg:text-base 2xl:text-lg font-black tracking-[0.45em] text-[#FFD700] uppercase font-['Titillium_Web'] drop-shadow-[0_0_18px_rgba(255,215,0,0.95)] select-none"
            style={{ writingMode: 'vertical-rl' }}
          >
            STARTING GRID
          </span>
        </div>

        {/* Right Position Number: 14TH */}
        <div className="flex-1 flex justify-start pl-3 sm:pl-6 lg:pl-8">
          <AnimatePresence mode="wait">
            {rightPos && (
              <motion.div
                key={`mid-pos-right-${rightPilot?.id}-${rightPos.num}`}
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex items-baseline select-none"
              >
                <span className="text-7xl sm:text-8xl lg:text-9xl 2xl:text-[10.5rem] font-black italic text-white font-['Titillium_Web'] leading-none drop-shadow-[0_0_28px_rgba(255,255,255,0.75)] drop-shadow-[0_6px_30px_rgba(0,0,0,0.98)]">
                  {rightPos.num}
                </span>
                <span className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black italic text-white font-['Titillium_Web'] ml-1 leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.65)]">
                  {rightPos.suffix}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 3. LOWER TWIN RED BARS (y ≈ 68% down to bottom edge with \ cut) */}
      {/* ============================================================= */}
      <div className="absolute top-[68%] bottom-0 left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4 lg:gap-5 pointer-events-none z-10">
        {/* Left red stripe (starts slightly higher) */}
        <div
          className="w-4 sm:w-5 lg:w-6 2xl:w-7 h-full bg-[#E10600] shadow-[0_0_24px_#E10600,0_0_40px_#E10600]"
          style={{ clipPath: 'polygon(0 0, 100% 18px, 100% 100%, 0 100%)' }}
        />
        {/* Right red stripe (starts slightly lower, forming single continuous parallel \ diagonal) */}
        <div
          className="w-4 sm:w-5 lg:w-6 2xl:w-7 h-full bg-[#E10600] shadow-[0_0_24px_#E10600,0_0_40px_#E10600]"
          style={{ clipPath: 'polygon(0 18px, 100% 36px, 100% 100%, 0 100%)' }}
        />
      </div>

      {/* ============================================================= */}
      {/* 4. LOWER STARTING GRID ASPHALT BOXES: Flanking bottom red bars */}
      {/* Open semi-rectangle tarmac slots ( |_| ) anchored at the bottom */}
      {/* ============================================================= */}
      <div className="absolute top-[70%] bottom-2 inset-x-0 flex flex-col items-center justify-start z-20 overflow-hidden pointer-events-auto px-1 sm:px-2">
        <div className="w-full max-w-[540px] sm:max-w-[640px] lg:max-w-[760px] 2xl:max-w-[840px] flex flex-col gap-2 sm:gap-3 items-center">
          {visibleRows.slice(0, 4).map(({ pair, idx }) => {
            const [pA, pB] = pair;
            const isActive = idx === activePairIndex;
            const codeA = getDriver3LetterCode(pA);
            const codeB = getDriver3LetterCode(pB);

            return (
              <div
                key={`grid-slot-row-${idx}`}
                onClick={() => onSelectPair(idx)}
                className={`flex items-center justify-between w-full cursor-pointer transition-all duration-300 ${
                  isActive ? 'opacity-100 scale-[1.02]' : 'opacity-85 hover:opacity-100'
                }`}
                style={{ height: '46px' }}
              >
                {/* Left Open Bracket: [ 13 (logo) HUL ] */}
                <div
                  className={`w-[140px] sm:w-[180px] lg:w-[230px] 2xl:w-[260px] h-[40px] sm:h-[46px] lg:h-[50px] flex items-center justify-between px-2.5 sm:px-3.5 transition-all duration-300 rounded-b-[4px] ${
                    isActive
                      ? 'border-2 sm:border-[2.5px] lg:border-[3px] border-white border-t-0 bg-white/25 shadow-[0_0_24px_rgba(255,255,255,0.95),inset_0_0_12px_rgba(255,255,255,0.35)]'
                      : 'border-[1.5px] sm:border-2 border-white/55 border-t-0 bg-black/75 backdrop-blur-md text-neutral-200'
                  }`}
                >
                  <span className="w-7 sm:w-9 lg:w-11 text-left text-sm sm:text-base lg:text-xl 2xl:text-2xl font-mono font-black text-white drop-shadow">
                    {pA?.position}
                  </span>
                  <div className="w-8 sm:w-10 lg:w-12 h-6 sm:h-7 lg:h-8 flex items-center justify-center mx-1 filter drop-shadow">
                    {pA?.team.id && <TeamLogo teamId={pA.team.id} size="md" />}
                  </div>
                  <span className="w-10 sm:w-12 lg:w-16 text-right text-sm sm:text-base lg:text-xl 2xl:text-2xl font-black tracking-wider text-white font-['Titillium_Web'] drop-shadow">
                    {codeA}
                  </span>
                </div>

                {/* Center Gap for the Twin Red Bars */}
                <div className="w-14 sm:w-18 lg:w-24 flex-shrink-0" />

                {/* Right Open Bracket: [ 14 (logo) TSU ] (Staggered down) */}
                <div
                  className={`w-[140px] sm:w-[180px] lg:w-[230px] 2xl:w-[260px] h-[40px] sm:h-[46px] lg:h-[50px] flex items-center justify-between px-2.5 sm:px-3.5 transition-all duration-300 rounded-b-[4px] translate-y-2.5 sm:translate-y-3.5 lg:translate-y-4 ${
                    isActive
                      ? 'border-2 sm:border-[2.5px] lg:border-[3px] border-white border-t-0 bg-white/25 shadow-[0_0_24px_rgba(255,255,255,0.95),inset_0_0_12px_rgba(255,255,255,0.35)]'
                      : 'border-[1.5px] sm:border-2 border-white/55 border-t-0 bg-black/75 backdrop-blur-md text-neutral-200'
                  }`}
                >
                  <span className="w-7 sm:w-9 lg:w-11 text-left text-sm sm:text-base lg:text-xl 2xl:text-2xl font-mono font-black text-white drop-shadow">
                    {pB?.position || '—'}
                  </span>
                  <div className="w-8 sm:w-10 lg:w-12 h-6 sm:h-7 lg:h-8 flex items-center justify-center mx-1 filter drop-shadow">
                    {pB?.team.id && <TeamLogo teamId={pB.team.id} size="md" />}
                  </div>
                  <span className="w-10 sm:w-12 lg:w-16 text-right text-sm sm:text-base lg:text-xl 2xl:text-2xl font-black tracking-wider text-white font-['Titillium_Web'] drop-shadow">
                    {codeB}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default F1StartingGridSlotDisplay;
