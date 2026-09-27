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

// Authentic Formula 1 Starting Grid slot: Letter П (open at bottom!)
const F1GridSlotBracket: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg
    viewBox="0 0 240 44"
    fill="none"
    preserveAspectRatio="none"
    className="absolute inset-0 w-full h-full pointer-events-none"
  >
    {/* Base dark backdrop */}
    <rect
      x="1"
      y="1"
      width="238"
      height="43"
      fill={isActive ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.72)'}
    />
    {/* Letter П open starting grid slot stroke: Left leg -> Top bar -> Right leg (bottom is open!) */}
    <path
      d="M 1.5 44 L 1.5 1.5 L 238.5 1.5 L 238.5 44"
      stroke={isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)'}
      strokeWidth={isActive ? 2.5 : 1.5}
      strokeLinecap="square"
    />
    {/* Active luminous neon glow on the П line */}
    {isActive && (
      <path
        d="M 1.5 44 L 1.5 1.5 L 238.5 1.5 L 238.5 44"
        stroke="#FFFFFF"
        strokeWidth={5}
        strokeLinecap="square"
        opacity={0.65}
        filter="drop-shadow(0 0 6px rgba(255,255,255,0.9))"
      />
    )}
  </svg>
);

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
    <div className="relative h-full w-full flex flex-col items-center justify-between select-none overflow-hidden pointer-events-auto py-2">
      {/* ============================================================= */}
      {/* 1. UPPER TWIN RED BARS (Top edge down to ~40% with \ cut)     */}
      {/* ============================================================= */}
      <div className="absolute top-0 bottom-[59%] left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4 pointer-events-none z-10">
        <div
          className="w-3.5 sm:w-4 lg:w-5 h-full bg-[#E10600] shadow-[0_0_20px_#E10600,0_0_35px_#E10600]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), 0 calc(100% - 32px))' }}
        />
        <div
          className="w-3.5 sm:w-4 lg:w-5 h-full bg-[#E10600] shadow-[0_0_20px_#E10600,0_0_35px_#E10600]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 16px))' }}
        />
      </div>

      {/* ============================================================= */}
      {/* 2. TOP GRID SLOTS: Rows 0..4 (Positions 1 to 10)              */}
      {/* ============================================================= */}
      <div className="relative w-full max-w-[540px] sm:max-w-[620px] lg:max-w-[700px] flex flex-col gap-2 sm:gap-2.5 items-center z-20">
        {topRows.map(({ pair, idx }) => {
          const [pA, pB] = pair;
          const isActive = idx === activePairIndex;
          const isRevealed = revealedIndices.has(idx);
          const codeA = getDriver3LetterCode(pA);
          const codeB = getDriver3LetterCode(pB);

          return (
            <div
              key={`top-grid-slot-row-${idx}`}
              onClick={() => onSelectPair(idx)}
              className={`flex items-center justify-between w-full cursor-pointer transition-all duration-300 ${
                isActive ? 'opacity-100 scale-[1.02]' : isRevealed ? 'opacity-85 hover:opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
              style={{ height: '38px' }}
            >
              {/* Left Slot: Odd position (Stepped forward) */}
              <div className="relative w-[130px] sm:w-[160px] lg:w-[195px] 2xl:w-[220px] h-[36px] sm:h-[38px] flex items-center justify-between px-2 sm:px-3">
                <F1GridSlotBracket isActive={isActive} />
                <span className="relative z-10 w-6 sm:w-7 text-left text-xs sm:text-sm lg:text-base font-mono font-black text-white drop-shadow">
                  {pA?.position}
                </span>
                <div className="relative z-10 w-7 sm:w-9 h-5 sm:h-6 flex items-center justify-center mx-1 filter drop-shadow">
                  {pA?.team.id && <TeamLogo teamId={pA.team.id} size="sm" />}
                </div>
                <span className="relative z-10 w-9 sm:w-11 text-right text-xs sm:text-sm lg:text-base font-black tracking-wider text-white font-['Titillium_Web'] drop-shadow">
                  {codeA}
                </span>
              </div>

              {/* Center Gap for the Twin Red Bars */}
              <div className="w-12 sm:w-16 lg:w-20 flex-shrink-0" />

              {/* Right Slot: Even position (Staggered back on track) */}
              <div className="relative w-[130px] sm:w-[160px] lg:w-[195px] 2xl:w-[220px] h-[36px] sm:h-[38px] flex items-center justify-between px-2 sm:px-3 translate-y-2">
                <F1GridSlotBracket isActive={isActive} />
                <span className="relative z-10 w-6 sm:w-7 text-left text-xs sm:text-sm lg:text-base font-mono font-black text-white drop-shadow">
                  {pB?.position || '—'}
                </span>
                <div className="relative z-10 w-7 sm:w-9 h-5 sm:h-6 flex items-center justify-center mx-1 filter drop-shadow">
                  {pB?.team.id && <TeamLogo teamId={pB.team.id} size="sm" />}
                </div>
                <span className="relative z-10 w-9 sm:w-11 text-right text-xs sm:text-sm lg:text-base font-black tracking-wider text-white font-['Titillium_Web'] drop-shadow">
                  {codeB}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================= */}
      {/* 3. MID SECTION (Разлом): Staggered Numbers + STARTING GRID     */}
      {/* Left position is HIGHER, Right position is LOWER              */}
      {/* ============================================================= */}
      <div className="relative w-full flex items-center justify-center pointer-events-none z-25 my-1 sm:my-2">
        {/* Left Position Number: Odd position (Stepped higher: translate-y-[-14px]) */}
        <div className="flex-1 flex justify-end pr-2 sm:pr-5 lg:pr-7 -translate-y-3 sm:-translate-y-4">
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
                <span className="text-5xl sm:text-7xl lg:text-8xl 2xl:text-9xl font-black italic text-white font-['Titillium_Web'] leading-none drop-shadow-[0_0_24px_rgba(255,255,255,0.75)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)]">
                  {leftPos.num}
                </span>
                <span className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black italic text-white font-['Titillium_Web'] ml-1 leading-none drop-shadow-[0_0_18px_rgba(255,255,255,0.65)]">
                  {leftPos.suffix}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center Floating Yellow Text: STARTING GRID */}
        <div className="w-12 sm:w-16 lg:w-20 flex flex-col items-center justify-center flex-shrink-0">
          <span
            className="text-xs sm:text-sm lg:text-base font-black tracking-[0.45em] text-[#FFD700] uppercase font-['Titillium_Web'] drop-shadow-[0_0_18px_rgba(255,215,0,0.95)] select-none"
            style={{ writingMode: 'vertical-rl' }}
          >
            STARTING GRID
          </span>
        </div>

        {/* Right Position Number: Even position (Stepped lower: translate-y-[14px]) */}
        <div className="flex-1 flex justify-start pl-2 sm:pl-5 lg:pr-7 translate-y-3 sm:translate-y-4">
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
                <span className="text-5xl sm:text-7xl lg:text-8xl 2xl:text-9xl font-black italic text-white font-['Titillium_Web'] leading-none drop-shadow-[0_0_24px_rgba(255,255,255,0.75)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)]">
                  {rightPos.num}
                </span>
                <span className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black italic text-white font-['Titillium_Web'] ml-1 leading-none drop-shadow-[0_0_18px_rgba(255,255,255,0.65)]">
                  {rightPos.suffix}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 4. LOWER TWIN RED BARS (y ≈ 59% down to bottom edge with \ cut) */}
      {/* ============================================================= */}
      <div className="absolute top-[59%] bottom-0 left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4 pointer-events-none z-10">
        <div
          className="w-3.5 sm:w-4 lg:w-5 h-full bg-[#E10600] shadow-[0_0_20px_#E10600,0_0_35px_#E10600]"
          style={{ clipPath: 'polygon(0 0, 100% 16px, 100% 100%, 0 100%)' }}
        />
        <div
          className="w-3.5 sm:w-4 lg:w-5 h-full bg-[#E10600] shadow-[0_0_20px_#E10600,0_0_35px_#E10600]"
          style={{ clipPath: 'polygon(0 16px, 100% 32px, 100% 100%, 0 100%)' }}
        />
      </div>

      {/* ============================================================= */}
      {/* 5. BOTTOM GRID SLOTS: Rows 5..9 (Positions 11 to 20)           */}
      {/* ============================================================= */}
      <div className="relative w-full max-w-[540px] sm:max-w-[620px] lg:max-w-[700px] flex flex-col gap-2 sm:gap-2.5 items-center z-20">
        {bottomRows.map(({ pair, idx }) => {
          const [pA, pB] = pair;
          const isActive = idx === activePairIndex;
          const isRevealed = revealedIndices.has(idx);
          const codeA = getDriver3LetterCode(pA);
          const codeB = getDriver3LetterCode(pB);

          return (
            <div
              key={`bottom-grid-slot-row-${idx}`}
              onClick={() => onSelectPair(idx)}
              className={`flex items-center justify-between w-full cursor-pointer transition-all duration-300 ${
                isActive ? 'opacity-100 scale-[1.02]' : isRevealed ? 'opacity-85 hover:opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
              style={{ height: '38px' }}
            >
              {/* Left Slot: Odd position (Stepped forward) */}
              <div className="relative w-[130px] sm:w-[160px] lg:w-[195px] 2xl:w-[220px] h-[36px] sm:h-[38px] flex items-center justify-between px-2 sm:px-3">
                <F1GridSlotBracket isActive={isActive} />
                <span className="relative z-10 w-6 sm:w-7 text-left text-xs sm:text-sm lg:text-base font-mono font-black text-white drop-shadow">
                  {pA?.position}
                </span>
                <div className="relative z-10 w-7 sm:w-9 h-5 sm:h-6 flex items-center justify-center mx-1 filter drop-shadow">
                  {pA?.team.id && <TeamLogo teamId={pA.team.id} size="sm" />}
                </div>
                <span className="relative z-10 w-9 sm:w-11 text-right text-xs sm:text-sm lg:text-base font-black tracking-wider text-white font-['Titillium_Web'] drop-shadow">
                  {codeA}
                </span>
              </div>

              {/* Center Gap for the Twin Red Bars */}
              <div className="w-12 sm:w-16 lg:w-20 flex-shrink-0" />

              {/* Right Slot: Even position (Staggered back on track) */}
              <div className="relative w-[130px] sm:w-[160px] lg:w-[195px] 2xl:w-[220px] h-[36px] sm:h-[38px] flex items-center justify-between px-2 sm:px-3 translate-y-2">
                <F1GridSlotBracket isActive={isActive} />
                <span className="relative z-10 w-6 sm:w-7 text-left text-xs sm:text-sm lg:text-base font-mono font-black text-white drop-shadow">
                  {pB?.position || '—'}
                </span>
                <div className="relative z-10 w-7 sm:w-9 h-5 sm:h-6 flex items-center justify-center mx-1 filter drop-shadow">
                  {pB?.team.id && <TeamLogo teamId={pB.team.id} size="sm" />}
                </div>
                <span className="relative z-10 w-9 sm:w-11 text-right text-xs sm:text-sm lg:text-base font-black tracking-wider text-white font-['Titillium_Web'] drop-shadow">
                  {codeB}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default F1StartingGridSlotDisplay;
