import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GridPilot } from './F1StartingGrid';
import TeamLogo from './TeamLogo';

interface StartingGridSlotDisplayProps {
  pairs: [GridPilot, GridPilot | null][];
  activePairIndex: number;
  onSelectPair: (idx: number) => void;
}

export const F1StartingGridSlotDisplay: React.FC<StartingGridSlotDisplayProps> = ({
  pairs,
  activePairIndex,
  onSelectPair
}) => {
  const currentPair = pairs[activePairIndex] || [null, null];
  const nextPair = pairs[activePairIndex + 1] || null;
  const prevPair = activePairIndex > 0 ? pairs[activePairIndex - 1] : null;

  const [pA, pB] = currentPair;
  const leftCode = pA?.nickname ? pA.nickname.slice(0, 3).toUpperCase() : (pA?.team.shortCode || 'DRV');
  const rightCode = pB
    ? (pB.nickname ? pB.nickname.slice(0, 3).toUpperCase() : (pB.team.shortCode || 'DRV'))
    : '—';

  const nextLeftCode = nextPair && nextPair[0]
    ? (nextPair[0].nickname ? nextPair[0].nickname.slice(0, 3).toUpperCase() : '')
    : '';
  const nextRightCode = nextPair && nextPair[1]
    ? (nextPair[1].nickname ? nextPair[1].nickname.slice(0, 3).toUpperCase() : '')
    : '';

  const prevLeftCode = prevPair && prevPair[0]
    ? (prevPair[0].nickname ? prevPair[0].nickname.slice(0, 3).toUpperCase() : '')
    : '';
  const prevRightCode = prevPair && prevPair[1]
    ? (prevPair[1].nickname ? prevPair[1].nickname.slice(0, 3).toUpperCase() : '')
    : '';

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center select-none pointer-events-auto">
      {/* ------------------------------------------------------------- */}
      {/* CENTRAL VERTICAL SPINE (Authentic F1 TV Broadcast Divider) */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-[#E10600] to-transparent shadow-[0_0_12px_#E10600] pointer-events-none z-10" />

      {/* Vertical STARTING GRID Title running along the spine */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
        <span
          className="text-[11px] sm:text-xs font-black tracking-[0.45em] text-amber-300 uppercase drop-shadow-[0_0_10px_rgba(252,211,77,0.8)] font-['Titillium_Web']"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          STARTING GRID
        </span>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* VERTICAL PELOTON CAROUSEL CONVEYOR */}
      {/* Previous row slides up, new row rises from bottom */}
      {/* ------------------------------------------------------------- */}
      <div className="relative w-full max-w-[260px] h-[220px] flex items-center justify-center overflow-visible">
        {/* PREVIOUS ROW (Ghost above, clicks step back) */}
        {prevPair && (
          <button
            type="button"
            onClick={() => onSelectPair(activePairIndex - 1)}
            className="absolute top-2 w-full flex items-center justify-between px-2 opacity-25 hover:opacity-75 transition-opacity cursor-pointer scale-85 z-15"
            title={`Row ${activePairIndex} (${(activePairIndex - 1) * 2 + 1} - ${(activePairIndex - 1) * 2 + 2})`}
          >
            <div className="w-[84px] h-[28px] rounded bg-black/60 border border-dashed border-white/40 flex items-center justify-between px-2 shadow">
              <span className="text-[10px] font-mono font-bold text-neutral-400">#{prevPair[0]?.driverNumber}</span>
              <span className="text-[11px] font-bold text-white/70 font-['Titillium_Web']">{prevLeftCode}</span>
            </div>
            <div className="w-[84px] h-[28px] rounded bg-black/60 border border-dashed border-white/40 flex items-center justify-between px-2 mt-3 shadow">
              <span className="text-[10px] font-mono font-bold text-neutral-400">#{prevPair[1]?.driverNumber}</span>
              <span className="text-[11px] font-bold text-white/70 font-['Titillium_Web']">{prevRightCode}</span>
            </div>
          </button>
        )}

        {/* ACTIVE ROW (Vertical Sliding Carousel with AnimatePresence) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`carousel-row-${activePairIndex}`}
            initial={{ opacity: 0, y: 35, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -35, scale: 0.94 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full flex items-center justify-between px-1 z-25"
          >
            {/* Left Car Slot (Odd / Pole stepped forward) */}
            <div
              className="w-[96px] sm:w-[108px] h-[36px] sm:h-[40px] rounded-sm bg-black/85 backdrop-blur-md flex items-center justify-between px-2 sm:px-2.5 shadow-[0_0_16px_rgba(255,255,255,0.25)] border-t border-b border-r border-white/30"
              style={{
                borderLeft: `5px solid ${pA?.team.primaryColor || '#E10600'}`
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] sm:text-xs font-mono font-black text-white/80">
                  {pA?.position}
                </span>
                {pA?.team.id && <TeamLogo teamId={pA.team.id} size="sm" />}
              </div>
              <span className="text-xs sm:text-sm font-black text-white tracking-wider font-['Titillium_Web'] drop-shadow">
                {leftCode}
              </span>
            </div>

            {/* F1 Grid Stagger Line & Sensor */}
            <div className="flex-1 mx-2 relative h-10 flex items-center justify-center pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 60 40" fill="none">
                <path
                  d="M0,14 L30,14 L30,26 L60,26"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
                <circle cx="30" cy="20" r="3" fill="#E10600" />
              </svg>
            </div>

            {/* Right Car Slot (Even position stepped back) */}
            <div
              className="w-[96px] sm:w-[108px] h-[36px] sm:h-[40px] rounded-sm bg-black/85 backdrop-blur-md flex items-center justify-between px-2 sm:px-2.5 shadow-[0_0_16px_rgba(255,255,255,0.25)] border-t border-b border-l border-white/30 mt-5 sm:mt-6"
              style={{
                borderRight: `5px solid ${pB?.team.primaryColor || '#ffffff'}`
              }}
            >
              <span className="text-xs sm:text-sm font-black text-white tracking-wider font-['Titillium_Web'] drop-shadow">
                {rightCode}
              </span>
              <div className="flex items-center gap-1.5">
                {pB?.team.id && <TeamLogo teamId={pB.team.id} size="sm" />}
                <span className="text-[11px] sm:text-xs font-mono font-black text-white/80">
                  {pB?.position}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* NEXT ROW (Ghost below, ready to rise on carousel step) */}
        {nextPair && (
          <button
            type="button"
            onClick={() => onSelectPair(activePairIndex + 1)}
            className="absolute bottom-2 w-full flex items-center justify-between px-2 opacity-30 hover:opacity-75 transition-opacity cursor-pointer scale-85 z-15"
            title={`Row ${activePairIndex + 2} (${(activePairIndex + 1) * 2 + 1} - ${(activePairIndex + 1) * 2 + 2})`}
          >
            <div className="w-[84px] h-[28px] rounded bg-black/60 border border-white/30 flex items-center justify-between px-2 shadow">
              <span className="text-[10px] font-mono font-bold text-neutral-400">#{nextPair[0]?.driverNumber}</span>
              <span className="text-[11px] font-bold text-white/70 font-['Titillium_Web']">{nextLeftCode || '—'}</span>
            </div>
            <div className="w-[84px] h-[28px] rounded bg-black/60 border border-white/30 flex items-center justify-between px-2 mt-3 shadow">
              <span className="text-[10px] font-mono font-bold text-neutral-400">#{nextPair[1]?.driverNumber}</span>
              <span className="text-[11px] font-bold text-white/70 font-['Titillium_Web']">{nextRightCode || '—'}</span>
            </div>
          </button>
        )}
      </div>

      {/* Row Indicator Badge at bottom of the spine */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded bg-black/80 border border-white/15 backdrop-blur-md shadow">
        <span className="text-[10px] font-mono font-black tracking-widest text-neutral-300 uppercase">
          ROW {activePairIndex + 1} / {pairs.length}
        </span>
      </div>
    </div>
  );
};

export default F1StartingGridSlotDisplay;
