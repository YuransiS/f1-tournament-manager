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
  const ROW_HEIGHT = 50; // Total height per pair item (38px bracket + 12px gap)
  const CENTER_ANCHOR = 210; // Vertical center anchor for active row in the reel

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center select-none overflow-hidden py-4 pointer-events-auto">
      {/* ------------------------------------------------------------- */}
      {/* 1. UPPER TWIN RED BARS (Continuous Slanted Diagonal Cut \ )   */}
      {/* Matches official broadcast: parallel diagonal slice           */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-0 bottom-[54%] left-1/2 -translate-x-1/2 flex gap-2 sm:gap-2.5 pointer-events-none z-10">
        {/* Left Bar (ends higher) */}
        <div
          className="w-4 sm:w-5 lg:w-6 h-full bg-[#E10600] shadow-[0_0_24px_#E10600,0_0_40px_rgba(225,6,0,0.6)]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), 0 calc(100% - 28px))' }}
        />
        {/* Right Bar (ends lower, completing single continuous diagonal cut \) */}
        <div
          className="w-4 sm:w-5 lg:w-6 h-full bg-[#E10600] shadow-[0_0_24px_#E10600,0_0_40px_rgba(225,6,0,0.6)]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 14px))' }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. LOWER TWIN RED BARS (Parallel Slanted Diagonal Cut \ )     */}
      {/* Parallel to the upper cut: starts higher on left, lower right */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-[54%] bottom-0 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-2.5 pointer-events-none z-10">
        {/* Left Bar (starts higher) */}
        <div
          className="w-4 sm:w-5 lg:w-6 h-full bg-[#E10600] shadow-[0_0_24px_#E10600,0_0_40px_rgba(225,6,0,0.6)]"
          style={{ clipPath: 'polygon(0 0, 100% 14px, 100% 100%, 0 100%)' }}
        />
        {/* Right Bar (starts lower, completing continuous parallel diagonal cut \) */}
        <div
          className="w-4 sm:w-5 lg:w-6 h-full bg-[#E10600] shadow-[0_0_24px_#E10600,0_0_40px_rgba(225,6,0,0.6)]"
          style={{ clipPath: 'polygon(0 14px, 100% 28px, 100% 100%, 0 100%)' }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. CENTER YELLOW VERTICAL TEXT: STARTING GRID                 */}
      {/* Pure broadcast styling: floating neon text between red bars   */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none z-15 flex flex-col items-center justify-center">
        <span
          className="text-xs sm:text-sm font-black tracking-[0.45em] text-[#FFD700] uppercase font-['Titillium_Web'] drop-shadow-[0_0_16px_rgba(255,215,0,0.95)] select-none"
          style={{ writingMode: 'vertical-rl' }}
        >
          STARTING GRID
        </span>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. VERTICAL CAROUSEL REEL: True F1 Asphalt Starting Grid Boxes */}
      {/* Open semi-rectangle brackets looking upwards ( |_| )           */}
      {/* ------------------------------------------------------------- */}
      <div
        className="relative w-full h-[520px] overflow-hidden flex flex-col items-center justify-start z-20 pointer-events-auto"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)'
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
                    ? 'opacity-100 scale-[1.03]'
                    : isRevealed
                    ? 'opacity-85 hover:opacity-100'
                    : 'opacity-25 hover:opacity-40'
                }`}
                style={{ height: '38px' }}
              >
                {/* ========================================================= */}
                {/* Left Slot (Odd Grid Position - Stepped forward on track)  */}
                {/* Real F1 tarmac open bracket: border-l-2, border-b-2, border-r-2, border-t-0 */}
                {/* ========================================================= */}
                <div
                  className={`w-[110px] sm:w-[125px] lg:w-[140px] h-[34px] sm:h-[38px] flex items-center justify-between px-2.5 transition-all duration-300 rounded-b-[2px] ${
                    isActive
                      ? 'border-2 border-white border-t-0 bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.95),inset_0_0_10px_rgba(255,255,255,0.25)]'
                      : isRevealed
                      ? 'border-[1.5px] border-white/55 border-t-0 bg-black/45 backdrop-blur-xs text-neutral-200'
                      : 'border-[1.5px] border-white/20 border-t-0 bg-black/25 text-neutral-400'
                  }`}
                >
                  {/* Grid Starting Position Number (P1, P3, P11, etc. - NOT car number!) */}
                  <span className="w-6 text-left text-xs sm:text-sm font-mono font-black text-white drop-shadow">
                    {pA?.position}
                  </span>

                  {/* Team Constructor Logo */}
                  <div className="w-7 h-5 flex items-center justify-center mx-1 filter drop-shadow">
                    {pA?.team.id && <TeamLogo teamId={pA.team.id} size="sm" />}
                  </div>

                  {/* Driver 3-Letter Code (SAI, VER, TSU...) */}
                  <span className="w-9 text-right text-xs sm:text-sm font-black tracking-wider text-white font-['Titillium_Web'] drop-shadow">
                    {codeA}
                  </span>
                </div>

                {/* Center Gap Spacer for Twin Red Pillars */}
                <div className="w-12 sm:w-14 lg:w-18 flex-shrink-0" />

                {/* ========================================================= */}
                {/* Right Slot (Even Grid Position - Staggered back on track) */}
                {/* Real F1 tarmac open bracket: border-l-2, border-b-2, border-r-2, border-t-0 */}
                {/* ========================================================= */}
                <div
                  className={`w-[110px] sm:w-[125px] lg:w-[140px] h-[34px] sm:h-[38px] flex items-center justify-between px-2.5 transition-all duration-300 rounded-b-[2px] translate-y-3.5 ${
                    isActive
                      ? 'border-2 border-white border-t-0 bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.95),inset_0_0_10px_rgba(255,255,255,0.25)]'
                      : isRevealed
                      ? 'border-[1.5px] border-white/55 border-t-0 bg-black/45 backdrop-blur-xs text-neutral-200'
                      : 'border-[1.5px] border-white/20 border-t-0 bg-black/25 text-neutral-400'
                  }`}
                >
                  {/* Grid Starting Position Number (P2, P4, P12, etc. - NOT car number!) */}
                  <span className="w-6 text-left text-xs sm:text-sm font-mono font-black text-white drop-shadow">
                    {pB?.position || '—'}
                  </span>

                  {/* Team Constructor Logo */}
                  <div className="w-7 h-5 flex items-center justify-center mx-1 filter drop-shadow">
                    {pB?.team.id && <TeamLogo teamId={pB.team.id} size="sm" />}
                  </div>

                  {/* Driver 3-Letter Code (BOR, NOR, RIC...) */}
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
