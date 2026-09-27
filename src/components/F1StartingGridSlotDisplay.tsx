import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GridPilot } from './F1StartingGrid';

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
    <div className="relative flex flex-col items-center select-none pointer-events-auto w-full max-w-[210px]">
      {/* Broadcast Header: 2026 Grid / STARTING GRID */}
      <div className="flex flex-col items-center mb-2">
        <span className="text-[10px] sm:text-xs font-black italic tracking-widest text-neutral-400 uppercase">
          2026 Grid
        </span>
        <h2 className="text-xs sm:text-sm md:text-base font-black tracking-[0.2em] text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          STARTING GRID
        </h2>
      </div>

      {/* Grid Wireframe Slot Graphic */}
      <div className="relative w-full h-[120px] sm:h-[135px] flex items-center justify-center">
        {/* Previous Row Ghost (above active) */}
        {prevPair && (
          <button
            type="button"
            onClick={() => onSelectPair(activePairIndex - 1)}
            className="absolute -top-1 w-full flex items-center justify-between px-2 opacity-30 hover:opacity-75 transition-opacity cursor-pointer scale-90"
            title={`Row ${activePairIndex} (${(activePairIndex - 1) * 2 + 1} - ${(activePairIndex - 1) * 2 + 2})`}
          >
            <div className="w-[52px] sm:w-[58px] h-[24px] rounded border border-dashed border-white/40 flex items-center justify-center bg-black/40">
              <span className="text-[10px] font-bold text-white/60 font-mono">{prevLeftCode}</span>
            </div>
            <div className="w-[52px] sm:w-[58px] h-[24px] rounded border border-dashed border-white/40 flex items-center justify-center bg-black/40 mt-3">
              <span className="text-[10px] font-bold text-white/60 font-mono">{prevRightCode}</span>
            </div>
          </button>
        )}

        {/* ACTIVE ROW SLOTS */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`slot-row-${activePairIndex}`}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full flex items-center justify-between px-1 z-20"
          >
            {/* Left Slot (Odd position / Pole stepped forward) */}
            <div
              className="w-[58px] sm:w-[66px] h-[30px] sm:h-[34px] rounded border-2 border-white bg-black/60 backdrop-blur-sm flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.35)] transition-all"
              style={{
                borderLeftColor: pA?.team.primaryColor || '#E10600',
                borderLeftWidth: '4px'
              }}
            >
              <span className="text-xs sm:text-sm font-black text-white tracking-wider drop-shadow">
                {leftCode}
              </span>
            </div>

            {/* Asphalt Track Slot Stagger Guide Line */}
            <div className="flex-1 mx-1.5 relative h-8 flex items-center justify-center pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 60 40" fill="none">
                <path
                  d="M0,14 L30,14 L30,26 L60,26"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
                <circle cx="30" cy="20" r="2.5" fill="#E10600" />
              </svg>
            </div>

            {/* Right Slot (Even position stepped back) */}
            <div
              className="w-[58px] sm:w-[66px] h-[30px] sm:h-[34px] rounded border-2 border-white bg-black/60 backdrop-blur-sm flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.35)] mt-3.5 sm:mt-4 transition-all"
              style={{
                borderRightColor: pB?.team.primaryColor || '#ffffff',
                borderRightWidth: '4px'
              }}
            >
              <span className="text-xs sm:text-sm font-black text-white tracking-wider drop-shadow">
                {rightCode}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Next Row Ghost (below active) */}
        {nextPair ? (
          <button
            type="button"
            onClick={() => onSelectPair(activePairIndex + 1)}
            className="absolute bottom-0 w-full flex items-center justify-between px-2 opacity-35 hover:opacity-75 transition-opacity cursor-pointer scale-90"
            title={`Row ${activePairIndex + 2} (${(activePairIndex + 1) * 2 + 1} - ${(activePairIndex + 1) * 2 + 2})`}
          >
            <div className="w-[52px] sm:w-[58px] h-[24px] rounded border border-white/35 flex items-center justify-center bg-black/40">
              <span className="text-[10px] font-bold text-white/55 font-mono">{nextLeftCode || '—'}</span>
            </div>
            <div className="w-[52px] sm:w-[58px] h-[24px] rounded border border-white/35 flex items-center justify-center bg-black/40 mt-3">
              <span className="text-[10px] font-bold text-white/55 font-mono">{nextRightCode || '—'}</span>
            </div>
          </button>
        ) : (
          <div className="absolute bottom-0 text-[9px] font-bold uppercase tracking-widest text-neutral-500 font-mono">
            END OF GRID
          </div>
        )}
      </div>

      {/* Row Navigation Pips */}
      <div className="flex items-center gap-1.5 mt-2 flex-wrap justify-center max-w-[190px]">
        {pairs.map((_, i) => (
          <button
            type="button"
            key={`grid-pip-${i}`}
            onClick={() => onSelectPair(i)}
            title={`Row ${i + 1} (${i * 2 + 1} - ${i * 2 + 2})`}
            className={`transition-all rounded-full cursor-pointer ${
              i === activePairIndex
                ? 'w-4 h-1.5 bg-[#E10600] shadow-[0_0_8px_#E10600]'
                : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default F1StartingGridSlotDisplay;
