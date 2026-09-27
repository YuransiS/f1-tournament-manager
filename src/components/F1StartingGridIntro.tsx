import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface F1StartingGridIntroProps {
  roundNumber?: number | string;
  countryName?: string;
  circuitCity?: string;
  onComplete: () => void;
}

export const F1StartingGridIntro: React.FC<F1StartingGridIntroProps> = ({
  roundNumber = 18,
  countryName = 'JAPAN',
  circuitCity = 'Suzuka',
  onComplete
}) => {
  const [isOpening, setIsOpening] = useState(false);

  // Auto-trigger the split-open transition after 2.4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpening(true);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  // When opening starts, notify parent after curtain completes
  useEffect(() => {
    if (isOpening) {
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 700);
      return () => clearTimeout(exitTimer);
    }
  }, [isOpening, onComplete]);

  const handleTriggerOpen = () => {
    if (!isOpening) {
      setIsOpening(true);
    }
  };

  return (
    <div
      onClick={handleTriggerOpen}
      className="absolute inset-0 z-50 overflow-hidden select-none cursor-pointer bg-black"
      style={{ fontFamily: "'Titillium Web', 'Inter', sans-serif" }}
    >
      {/* ============================================================= */}
      {/* SPLIT SHUTTER CURTAINS: Zero central border/line when idle! */}
      {/* w-[50.5%] ensures a seamless subpixel overlap with 0 line */}
      {/* ============================================================= */}

      {/* LEFT HALF CURTAIN */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isOpening ? '-105%' : 0 }}
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-0 bottom-0 left-0 w-[50.5%] overflow-hidden bg-gradient-to-br from-[#0c072b] via-[#140b3b] to-[#07041a] z-20"
      >
        {/* Left Side Content & Background Mirroring */}
        <div className="absolute top-0 bottom-0 left-0 w-[200%] overflow-hidden pointer-events-none">
          {/* Diagonal Neon Streaks */}
          <div className="absolute inset-0 opacity-80">
            {[
              { top: '15%', left: '10%', w: '140px', color: '#00d2ff', delay: 0.1 },
              { top: '35%', left: '20%', w: '110px', color: '#ffffff', delay: 0.05 },
              { top: '48%', left: '5%', w: '160px', color: '#ff9500', delay: 0.3 },
              { top: '68%', left: '25%', w: '200px', color: '#a855f7', delay: 0.25 },
              { top: '85%', left: '15%', w: '240px', color: '#00d2ff', delay: 0.35 },
              { top: '22%', left: '42%', w: '120px', color: '#ffffff', delay: 0.12 }
            ].map((streak, i) => (
              <motion.div
                key={`left-streak-${i}`}
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: [0, 0.95, 0.4], x: [-80, 0, 50] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: streak.delay, ease: 'easeInOut' }}
                className="absolute h-[3px] rounded-full"
                style={{
                  top: streak.top,
                  left: streak.left,
                  width: streak.w,
                  backgroundColor: streak.color,
                  boxShadow: `0 0 14px ${streak.color}`,
                  transform: 'rotate(-35deg)'
                }}
              />
            ))}
          </div>

          {/* Top-Left Official F1 White Logo */}
          <div className="absolute top-6 left-8 sm:left-12 z-30">
            <img
              src="/F1-logo.png"
              alt="Formula 1"
              className="h-7 sm:h-9 object-contain filter drop-shadow-[0_2px_14px_rgba(255,255,255,0.6)]"
            />
          </div>

          {/* Center Graphic Mirror (Left portion of centered elements) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex flex-col items-center text-center px-4 max-w-[950px]">
              {/* Upper Twin Red Pillar */}
              <div className="flex gap-2.5 mb-3">
                <div
                  className="w-4 sm:w-5 h-18 sm:h-24 bg-[#E10600] shadow-[0_0_20px_#E10600]"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 72%)' }}
                />
                <div
                  className="w-4 sm:w-5 h-18 sm:h-24 bg-[#E10600] shadow-[0_0_20px_#E10600]"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 72%)' }}
                />
              </div>

              {/* Center F1 Red Logo */}
              <div className="my-2">
                <img
                  src="/F1-logo.png"
                  alt="F1"
                  className="h-10 sm:h-16 object-contain filter drop-shadow-[0_0_28px_rgba(225,6,0,1)]"
                />
              </div>

              {/* ROUND X · COUNTRY */}
              <div className="text-xs sm:text-base md:text-lg font-black tracking-[0.42em] text-neutral-200 uppercase font-['Titillium_Web'] mt-2 drop-shadow">
                ROUND {roundNumber} · {countryName}
              </div>

              {/* STARTING GRID */}
              <div className="relative mt-2 flex flex-col items-center">
                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black italic tracking-[0.06em] text-white uppercase font-['Titillium_Web'] drop-shadow-[0_4px_35px_rgba(255,255,255,0.5)] leading-none select-none">
                  STARTING GRID
                </h1>

                {/* Circuit City Cursive Script */}
                {circuitCity && (
                  <span className="text-4xl sm:text-6xl md:text-7xl text-[#ff3838] font-['Caveat'] font-bold drop-shadow-[0_2px_14px_rgba(225,6,0,0.95)] -mt-4 sm:-mt-6 select-none -rotate-2">
                    {circuitCity}
                  </span>
                )}
              </div>

              {/* Lower Twin Red Pillar */}
              <div className="flex gap-2.5 mt-5 sm:mt-8">
                <div
                  className="w-4 sm:w-5 h-18 sm:h-24 bg-[#E10600] shadow-[0_0_20px_#E10600]"
                  style={{ clipPath: 'polygon(0 28%, 100% 0, 100% 100%, 0 100%)' }}
                />
                <div
                  className="w-4 sm:w-5 h-18 sm:h-24 bg-[#E10600] shadow-[0_0_20px_#E10600]"
                  style={{ clipPath: 'polygon(0 28%, 100% 0, 100% 100%, 0 100%)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* RIGHT HALF CURTAIN */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isOpening ? '105%' : 0 }}
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-0 bottom-0 right-0 w-[50.5%] overflow-hidden bg-gradient-to-bl from-[#0c072b] via-[#140b3b] to-[#07041a] z-20"
      >
        {/* Right Side Content & Background Mirroring */}
        <div className="absolute top-0 bottom-0 right-0 w-[200%] overflow-hidden pointer-events-none">
          {/* Diagonal Neon Streaks */}
          <div className="absolute inset-0 opacity-80">
            {[
              { top: '25%', left: '70%', w: '180px', color: '#ff2d55', delay: 0.2 },
              { top: '55%', left: '80%', w: '220px', color: '#00d2ff', delay: 0.15 },
              { top: '75%', left: '60%', w: '150px', color: '#ff2d55', delay: 0.1 },
              { top: '80%', left: '85%', w: '170px', color: '#ff9500', delay: 0.18 },
              { top: '38%', left: '65%', w: '130px', color: '#ffffff', delay: 0.28 }
            ].map((streak, i) => (
              <motion.div
                key={`right-streak-${i}`}
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: [0, 0.95, 0.4], x: [-80, 0, 50] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: streak.delay, ease: 'easeInOut' }}
                className="absolute h-[3px] rounded-full"
                style={{
                  top: streak.top,
                  left: streak.left,
                  width: streak.w,
                  backgroundColor: streak.color,
                  boxShadow: `0 0 14px ${streak.color}`,
                  transform: 'rotate(-35deg)'
                }}
              />
            ))}
          </div>

          {/* Center Graphic Mirror (Right portion of centered elements) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex flex-col items-center text-center px-4 max-w-[950px]">
              {/* Upper Twin Red Pillar */}
              <div className="flex gap-2.5 mb-3">
                <div
                  className="w-4 sm:w-5 h-18 sm:h-24 bg-[#E10600] shadow-[0_0_20px_#E10600]"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 72%)' }}
                />
                <div
                  className="w-4 sm:w-5 h-18 sm:h-24 bg-[#E10600] shadow-[0_0_20px_#E10600]"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 72%)' }}
                />
              </div>

              {/* Center F1 Red Logo */}
              <div className="my-2">
                <img
                  src="/F1-logo.png"
                  alt="F1"
                  className="h-10 sm:h-16 object-contain filter drop-shadow-[0_0_28px_rgba(225,6,0,1)]"
                />
              </div>

              {/* ROUND X · COUNTRY */}
              <div className="text-xs sm:text-base md:text-lg font-black tracking-[0.42em] text-neutral-200 uppercase font-['Titillium_Web'] mt-2 drop-shadow">
                ROUND {roundNumber} · {countryName}
              </div>

              {/* STARTING GRID */}
              <div className="relative mt-2 flex flex-col items-center">
                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black italic tracking-[0.06em] text-white uppercase font-['Titillium_Web'] drop-shadow-[0_4px_35px_rgba(255,255,255,0.5)] leading-none select-none">
                  STARTING GRID
                </h1>

                {/* Circuit City Cursive Script */}
                {circuitCity && (
                  <span className="text-4xl sm:text-6xl md:text-7xl text-[#ff3838] font-['Caveat'] font-bold drop-shadow-[0_2px_14px_rgba(225,6,0,0.95)] -mt-4 sm:-mt-6 select-none -rotate-2">
                    {circuitCity}
                  </span>
                )}
              </div>

              {/* Lower Twin Red Pillar */}
              <div className="flex gap-2.5 mt-5 sm:mt-8">
                <div
                  className="w-4 sm:w-5 h-18 sm:h-24 bg-[#E10600] shadow-[0_0_20px_#E10600]"
                  style={{ clipPath: 'polygon(0 28%, 100% 0, 100% 100%, 0 100%)' }}
                />
                <div
                  className="w-4 sm:w-5 h-18 sm:h-24 bg-[#E10600] shadow-[0_0_20px_#E10600]"
                  style={{ clipPath: 'polygon(0 28%, 100% 0, 100% 100%, 0 100%)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* SEAM LIGHT BEAM (Bursts only when opening begins) */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            initial={{ opacity: 1, scaleY: 1, scaleX: 1 }}
            animate={{ opacity: [1, 0.8, 0], scaleX: [1, 20, 60] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 bg-white z-40 shadow-[0_0_60px_#ffffff,0_0_120px_#E10600] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Click hint before opening */}
      {!isOpening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.85, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 text-[10px] sm:text-xs font-mono font-bold tracking-widest text-neutral-300 uppercase pointer-events-none"
        >
          CLICK TO ENTER BROADCAST • SPACE TO SKIP
        </motion.div>
      )}
    </div>
  );
};

export default F1StartingGridIntro;
