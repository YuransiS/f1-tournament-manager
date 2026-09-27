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

// Authentic Formula 1 Starting Grid slot: Letter П (open at bottom!) matching media_1790535748106.png
// Clean vector bracket with tick marks extending ~65% height
const F1GridSlotBracket: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    preserveAspectRatio="none"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    <path
      d="M 1 65 L 1 1 L 99 1 L 99 65"
      stroke={isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)'}
      strokeWidth={isActive ? 3.5 : 2}
      strokeLinecap="square"
    />
  </svg>
);

// Individual compact Grid Slot centered inside bracket: [ <digit> <logo> <CODE> ]
// Generous balanced padding ensures numbers like 16, 10 never touch the left bracket leg
const GridSlotItem: React.FC<{
  pilot: GridPilot | null;
  isActive: boolean;
}> = ({ pilot, isActive }) => {
  if (!pilot) {
    return (
      <div className="relative flex items-center justify-center min-w-[190px] sm:min-w-[215px] lg:min-w-[235px] h-[48px] sm:h-[50px] lg:h-[52px] px-6 flex-shrink-0 opacity-30">
        <F1GridSlotBracket isActive={false} />
        <span className="font-mono text-sm text-neutral-400">—</span>
      </div>
    );
  }

  const code = getDriver3LetterCode(pilot);

  return (
    <div
      className={`relative flex items-center justify-center gap-2.5 sm:gap-3.5 px-6 sm:px-7 min-w-[190px] sm:min-w-[215px] lg:min-w-[235px] h-[48px] sm:h-[50px] lg:h-[52px] flex-shrink-0 select-none transition-transform duration-200 ${
        isActive ? 'scale-[1.04]' : ''
      }`}
    >
      <F1GridSlotBracket isActive={isActive} />

      {/* 1. Digit: clear, centered, bold monospace with dedicated width */}
      <span className="relative z-10 font-mono font-black text-base sm:text-lg lg:text-xl text-white min-w-[28px] sm:min-w-[32px] text-center">
        {pilot.position}
      </span>

      {/* 2. Immediately next to it: Team Logo */}
      <div className="relative z-10 w-7 h-5 sm:w-8 sm:h-6 lg:w-9 lg:h-7 flex items-center justify-center flex-shrink-0">
        {pilot.team.id && <TeamLogo teamId={pilot.team.id} size="md" />}
      </div>

      {/* 3. Immediately next to it: 3 letters in bold */}
      <span className="relative z-10 font-black tracking-wider text-base sm:text-lg lg:text-xl text-white font-['Titillium_Web']">
        {code}
      </span>
    </div>
  );
};

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

  // 10 pairs total: Top 5 pairs (P1..P10) and Bottom 5 pairs (P11..P20)
  const topRows = pairs.slice(0, 5).map((pair, idx) => ({ pair, idx }));
  const bottomRows = pairs.slice(5, 10).map((pair, offset) => ({ pair, idx: offset + 5 }));

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center gap-4 sm:gap-6 select-none pointer-events-auto py-4">
      {/* ============================================================= */}
      {/* 1. UPPER TWIN RED BARS: Thick authoritative bars (gap: small) */}
      {/* ============================================================= */}
      <div className="absolute top-0 bottom-[56%] left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none z-10">
        <div
          className="w-7 sm:w-8 lg:w-9 h-full bg-[#E10600] shadow-[0_0_24px_#E10600,0_0_40px_rgba(225,6,0,0.6)]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), 0 calc(100% - 48px))' }}
        />
        <div
          className="w-7 sm:w-8 lg:w-9 h-full bg-[#E10600] shadow-[0_0_24px_#E10600,0_0_40px_rgba(225,6,0,0.6)]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 24px))' }}
        />
      </div>

      {/* ============================================================= */}
      {/* 2. TOP GRID SLOTS: Rows 0..4 (Positions 1 to 10)              */}
      {/* Stagger formula: Right slot shifted down 0.5h (25px)          */}
      {/* Interval to next row is exactly 0.5h (25px)                   */}
      {/* ============================================================= */}
      <div className="relative w-full flex flex-col gap-[22px] sm:gap-[25px] items-center z-20 flex-shrink-0">
        {topRows.map(({ pair, idx }) => {
          const [pA, pB] = pair;
          const isActive = idx === activePairIndex;
          const isRevealed = revealedIndices.has(idx);

          if (!isRevealed) {
            return (
              <div
                key={`top-grid-slot-row-${idx}`}
                className="w-full pointer-events-none invisible opacity-0 flex-shrink-0"
                style={{ height: '50px' }}
              />
            );
          }

          return (
            <motion.div
              key={`top-grid-slot-row-${idx}`}
              initial={{ opacity: 0, y: 8, filter: 'brightness(2)' }}
              animate={{ opacity: 1, y: 0, filter: 'brightness(1)' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={() => onSelectPair(idx)}
              className={`flex items-start justify-center w-full cursor-pointer transition-opacity duration-200 flex-shrink-0 ${
                isActive ? 'opacity-100' : 'opacity-85 hover:opacity-100'
              }`}
              style={{ height: '50px' }}
            >
              {/* Left Slot: Odd position (e.g. P1, P3, P5...) */}
              <GridSlotItem pilot={pA} isActive={isActive} />

              {/* Center Gap for the Thick Twin Red Bars */}
              <div className="w-16 sm:w-20 lg:w-24 flex-shrink-0" />

              {/* Right Slot: Even position (Shifted down 0.5 slot height = 25px) */}
              <div className="translate-y-[25px] flex-shrink-0">
                <GridSlotItem pilot={pB} isActive={isActive} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ============================================================= */}
      {/* 3. MID SECTION (Разлом): Staggered Numbers + STARTING GRID     */}
      {/* Left position is HIGHER, Right position is LOWER              */}
      {/* ============================================================= */}
      <div className="relative w-full flex items-center justify-center pointer-events-none z-25 my-2 sm:my-3">
        {/* Left Position Number: Odd position (Stepped higher: translate-y-[-12px]) */}
        <div className="flex-1 flex justify-end pr-3 sm:pr-5 lg:pr-8 -translate-y-3 sm:-translate-y-4">
          <AnimatePresence mode="wait">
            {leftPos && (
              <motion.div
                key={`mid-pos-left-${leftPilot?.id}-${leftPos.num}`}
                initial={{ opacity: 0, x: -15, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex items-baseline select-none"
              >
                <span className="text-6xl sm:text-7xl lg:text-8xl 2xl:text-9xl font-black italic text-white font-['Titillium_Web'] leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)]">
                  {leftPos.num}
                </span>
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black italic text-white font-['Titillium_Web'] ml-1 leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.98)]">
                  {leftPos.suffix}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center Floating Yellow Text: STARTING GRID */}
        <div className="w-12 sm:w-14 lg:w-16 flex flex-col items-center justify-center flex-shrink-0">
          <span
            className="text-xs sm:text-sm lg:text-base font-black tracking-[0.45em] text-[#FFD700] uppercase font-['Titillium_Web'] drop-shadow-[0_0_14px_rgba(255,215,0,0.9)] select-none"
            style={{ writingMode: 'vertical-rl' }}
          >
            STARTING GRID
          </span>
        </div>

        {/* Right Position Number: Even position (Stepped lower: translate-y-[12px]) */}
        <div className="flex-1 flex justify-start pl-3 sm:pl-5 lg:pr-8 translate-y-3 sm:translate-y-4">
          <AnimatePresence mode="wait">
            {rightPos && (
              <motion.div
                key={`mid-pos-right-${rightPilot?.id}-${rightPos.num}`}
                initial={{ opacity: 0, x: 15, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex items-baseline select-none"
              >
                <span className="text-6xl sm:text-7xl lg:text-8xl 2xl:text-9xl font-black italic text-white font-['Titillium_Web'] leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)]">
                  {rightPos.num}
                </span>
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black italic text-white font-['Titillium_Web'] ml-1 leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.98)]">
                  {rightPos.suffix}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 4. LOWER TWIN RED BARS: Thick authoritative bars (gap: small) */}
      {/* ============================================================= */}
      <div className="absolute top-[56%] bottom-0 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none z-10">
        <div
          className="w-7 sm:w-8 lg:w-9 h-full bg-[#E10600] shadow-[0_0_24px_#E10600,0_0_40px_rgba(225,6,0,0.6)]"
          style={{ clipPath: 'polygon(0 0, 100% 24px, 100% 100%, 0 100%)' }}
        />
        <div
          className="w-7 sm:w-8 lg:w-9 h-full bg-[#E10600] shadow-[0_0_24px_#E10600,0_0_40px_rgba(225,6,0,0.6)]"
          style={{ clipPath: 'polygon(0 24px, 100% 48px, 100% 100%, 0 100%)' }}
        />
      </div>

      {/* ============================================================= */}
      {/* 5. BOTTOM GRID SLOTS: Rows 5..9 (Positions 11 to 20)           */}
      {/* Stagger formula: Right slot shifted down 0.5h (25px)          */}
      {/* Interval to next row is exactly 0.5h (25px)                   */}
      {/* ============================================================= */}
      <div className="relative w-full flex flex-col gap-[22px] sm:gap-[25px] items-center z-20 flex-shrink-0">
        {bottomRows.map(({ pair, idx }) => {
          const [pA, pB] = pair;
          const isActive = idx === activePairIndex;
          const isRevealed = revealedIndices.has(idx);

          if (!isRevealed) {
            return (
              <div
                key={`bottom-grid-slot-row-${idx}`}
                className="w-full pointer-events-none invisible opacity-0 flex-shrink-0"
                style={{ height: '50px' }}
              />
            );
          }

          return (
            <motion.div
              key={`bottom-grid-slot-row-${idx}`}
              initial={{ opacity: 0, y: 8, filter: 'brightness(2)' }}
              animate={{ opacity: 1, y: 0, filter: 'brightness(1)' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={() => onSelectPair(idx)}
              className={`flex items-start justify-center w-full cursor-pointer transition-opacity duration-200 flex-shrink-0 ${
                isActive ? 'opacity-100' : 'opacity-85 hover:opacity-100'
              }`}
              style={{ height: '50px' }}
            >
              {/* Left Slot: Odd position (e.g. P11, P13, P15...) */}
              <GridSlotItem pilot={pA} isActive={isActive} />

              {/* Center Gap for the Thick Twin Red Bars */}
              <div className="w-16 sm:w-20 lg:w-24 flex-shrink-0" />

              {/* Right Slot: Even position (Shifted down 0.5 slot height = 25px) */}
              <div className="translate-y-[25px] flex-shrink-0">
                <GridSlotItem pilot={pB} isActive={isActive} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default F1StartingGridSlotDisplay;
