import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DriverAvatarFallback from './DriverAvatarFallback';
import TeamLogo from './TeamLogo';
import { GridPilot } from './F1StartingGrid';

interface F1GridDriverCardProps {
  pilot: GridPilot | null;
  nextPilot?: GridPilot | null;
  align: 'left' | 'right';
  hasImageError?: boolean;
  onImageError?: (id: string) => void;
}

function parseDriverName(fullName: string, nickname: string) {
  const target = (fullName || nickname || '').trim();
  const parts = target.split(' ');
  if (parts.length <= 1) {
    return { firstName: '', lastName: target.toUpperCase() };
  }
  const lastName = parts[parts.length - 1].toUpperCase();
  const firstName = parts.slice(0, -1).join(' ');
  return { firstName, lastName };
}

// Authentic F1 TV broadcast neon constructor colors matching official broadcast graphics
function getTeamNeonColor(teamId: string, fallbackColor: string): string {
  const tid = (teamId || '').toLowerCase();
  if (tid.includes('mercedes')) return '#00D2BE'; // Petronas turquoise
  if (tid.includes('red-bull') || tid.includes('red bull')) return '#3671C6'; // Red Bull electric blue
  if (tid.includes('ferrari')) return '#E10600'; // Ferrari scarlet
  if (tid.includes('mclaren')) return '#FF8000'; // Papaya orange
  if (tid.includes('aston-martin') || tid.includes('aston')) return '#00A382'; // Aston teal
  if (tid.includes('alpine')) return '#0090FF'; // Alpine bright blue
  if (tid.includes('williams')) return '#00A0DE'; // Williams light blue
  if (tid.includes('alfa-romeo') || tid.includes('sauber') || tid.includes('kick')) return '#52E252'; // Kick neon green
  if (tid.includes('haas')) return '#E6002B'; // Haas red
  if (tid.includes('alphatauri') || tid.includes('rb') || tid.includes('racing-bulls')) return '#6692FF'; // RB cobalt
  return fallbackColor || '#00A0DE';
}

interface HalftoneOverlayProps {
  pilotId: string;
  fromColor: string;
  toColor: string;
  isLeft: boolean;
}

// Official F1 Broadcast Halftone Dot-Matrix Transition Effect (media_1792865475012_e333f9b7.jpg & media_1792865484764_d87537c1.jpg)
// Frameless, vibrant neon glowing dots transitioning from current team to next team
const HalftoneTransitionOverlay: React.FC<HalftoneOverlayProps> = ({
  pilotId,
  fromColor,
  toColor,
  isLeft
}) => {
  const blocks = [
    { top: '8%', height: '16%', width: '84%', alignLeft: isLeft, delay: 0.0 },
    { top: '23%', height: '19%', width: '96%', alignLeft: !isLeft, delay: 0.04 },
    { top: '41%', height: '22%', width: '90%', alignLeft: isLeft, delay: 0.08 },
    { top: '61%', height: '18%', width: '95%', alignLeft: !isLeft, delay: 0.12 },
    { top: '77%', height: '16%', width: '80%', alignLeft: isLeft, delay: 0.16 }
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`halftone-wrap-${pilotId}`}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
        className="absolute inset-0 z-30 pointer-events-none overflow-hidden"
      >
        {blocks.map((b, idx) => (
          <motion.div
            key={idx}
            initial={{
              scaleX: 1,
              opacity: 1,
              x: b.alignLeft ? -25 : 25
            }}
            animate={{
              scaleX: [1, 1.05, 0],
              opacity: [1, 0.95, 0],
              x: 0
            }}
            transition={{
              duration: 0.46,
              delay: b.delay,
              ease: [0.22, 1, 0.36, 1]
            }}
            style={{
              position: 'absolute',
              top: b.top,
              height: b.height,
              width: b.width,
              left: b.alignLeft ? 0 : 'auto',
              right: b.alignLeft ? 'auto' : 0,
              transformOrigin: b.alignLeft ? 'left center' : 'right center'
            }}
            className="overflow-hidden"
          >
            {/* Vibrant Halftone Dot Matrix with seamless color shift from current to next team (Zero borders) */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(${b.alignLeft ? '90deg' : '270deg'}, ${fromColor} 0%, ${toColor} 100%)`,
                WebkitMaskImage: 'radial-gradient(circle, black 3.2px, transparent 3.2px)',
                maskImage: 'radial-gradient(circle, black 3.2px, transparent 3.2px)',
                WebkitMaskSize: '10px 10px',
                maskSize: '10px 10px',
                filter: `drop-shadow(0 0 8px ${fromColor}) drop-shadow(0 0 16px ${toColor})`
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export const F1GridDriverCard: React.FC<F1GridDriverCardProps> = ({
  pilot,
  nextPilot,
  align,
  hasImageError,
  onImageError
}) => {
  const isLeft = align === 'left';
  const currentTeamColor = pilot
    ? getTeamNeonColor(pilot.team.id, pilot.team.primaryColor)
    : '#00A0DE';
  const nextTeamColor = nextPilot
    ? getTeamNeonColor(nextPilot.team.id, nextPilot.team.primaryColor)
    : currentTeamColor;

  const prevTeamColorRef = React.useRef(currentTeamColor);
  React.useEffect(() => {
    prevTeamColorRef.current = currentTeamColor;
  }, [currentTeamColor]);

  const fromColor = prevTeamColorRef.current || currentTeamColor;
  const toColor = nextTeamColor || currentTeamColor;

  if (!pilot) {
    return (
      <div className={`relative w-full h-full flex flex-col justify-center items-center p-6 ${isLeft ? 'items-start' : 'items-end'}`}>
        <span className="text-xs font-mono font-bold tracking-widest text-neutral-600 uppercase">
          VACANT GRID POSITION
        </span>
      </div>
    );
  }

  const { firstName, lastName } = parseDriverName(pilot.realName || '', pilot.nickname);

  return (
    <div className="relative w-full h-full flex select-none overflow-hidden">
      {/* ============================================================= */}
      {/* 1. SIDE CONSTRUCTOR STRIP WITH ROTATED TEAM NAME & LOGO      */}
      {/* Matching media_1792864447265_486e7cd6.jpg                    */}
      {/* ============================================================= */}
      <div
        className={`relative z-30 w-9 sm:w-11 lg:w-12 h-full flex flex-col items-center justify-between py-6 sm:py-8 bg-black/60 backdrop-blur-md flex-shrink-0 ${
          isLeft ? 'order-1 border-r border-white/10' : 'order-3 border-l border-white/10'
        }`}
      >
        {/* Rotated Constructor Name */}
        <div className="flex-1 flex items-center justify-center">
          <span
            className="text-[11px] sm:text-xs lg:text-sm font-black tracking-[0.28em] text-white/95 uppercase font-['Titillium_Web'] whitespace-nowrap select-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
            style={{
              writingMode: 'vertical-rl',
              transform: isLeft ? 'rotate(180deg)' : 'none'
            }}
          >
            {pilot.team.name}
          </span>
        </div>

        {/* Team Logo at bottom of constructor strip */}
        <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] mt-3">
          <TeamLogo teamId={pilot.team.id} size="sm" />
        </div>
      </div>

      {/* ============================================================= */}
      {/* 2. DRIVER STAGE: 1:1 Torso Portrait & Lower Overlay           */}
      {/* ============================================================= */}
      <div className="relative flex-1 h-full overflow-hidden order-2">
        {/* Halftone Dot Matrix Transition Overlay: Frameless & Bright Neon Color-Morph */}
        <HalftoneTransitionOverlay
          pilotId={pilot.id}
          fromColor={fromColor}
          toColor={toColor}
          isLeft={isLeft}
        />

        {/* 1:1 Torso Portrait (50:50 Screen Ratio): 1:1 aspect ratio with natural headroom, bottom-cropped if tall */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none overflow-hidden z-20 pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`pilot-portrait-${pilot.id}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full flex items-end justify-center pb-0"
              style={{
                maskImage: 'linear-gradient(to top, transparent 0%, black 6%, black 100%)',
                WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 6%, black 100%)'
              }}
            >
              {!hasImageError && pilot.avatarUrl ? (
                <div className="relative aspect-square h-[86%] sm:h-[88%] lg:h-[92%] max-w-full flex items-end justify-center overflow-hidden">
                  <img
                    src={pilot.avatarUrl}
                    alt={pilot.nickname}
                    onError={() => onImageError && onImageError(pilot.id)}
                    className="w-full h-full object-cover object-top select-none relative z-5 filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.98)]"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-end justify-center">
                  <DriverAvatarFallback pilot={pilot} isRight={!isLeft} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Lower Chest / Torso Typography: Raised higher up and increased size by 5-6pt */}
        <div className="absolute bottom-10 sm:bottom-14 lg:bottom-18 xl:bottom-20 inset-x-2 sm:inset-x-4 z-35 flex flex-col items-center justify-center text-center pointer-events-none select-none">
          {/* Cursive First Name in White Script */}
          {firstName && (
            <motion.span
              key={`first-name-${pilot.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white font-['Caveat',_'Dancing_Script',_cursive] font-bold drop-shadow-[0_2px_14px_rgba(0,0,0,0.98)] -mb-1 select-none tracking-wide text-center"
            >
              {firstName}
            </motion.span>
          )}

          {/* Big Bold Surname with Team Neon Color */}
          <motion.h2
            key={`last-name-${pilot.id}`}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.08 }}
            className="w-full text-center font-black uppercase tracking-tight leading-none font-['Titillium_Web'] select-none px-2 whitespace-nowrap overflow-visible"
            style={{
              fontSize:
                lastName.length > 9
                  ? 'clamp(2.4rem, 1.4rem + 2.8vw, 4.2rem)'
                  : lastName.length > 6
                  ? 'clamp(3.0rem, 1.7rem + 3.4vw, 5.2rem)'
                  : 'clamp(3.6rem, 2.0rem + 4.2vw, 6.2rem)',
              color: teamColor,
              textShadow: `0 4px 28px rgba(0,0,0,0.98), 0 0 35px ${teamColor}95`,
              filter: `drop-shadow(0 4px 28px rgba(0,0,0,0.98)) drop-shadow(0 0 24px ${teamColor}85)`
            }}
          >
            {lastName}
          </motion.h2>

          {/* Driver Race Number */}
          <motion.div
            key={`drv-num-${pilot.id}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="text-5xl sm:text-6xl lg:text-7xl 2xl:text-8xl font-black font-['Chakra_Petch'] leading-none mt-2 select-none text-center mx-auto"
            style={{
              color: teamColor,
              textShadow: `0 4px 24px rgba(0,0,0,0.98), 0 0 28px ${teamColor}85`,
              filter: `drop-shadow(0 4px 24px rgba(0,0,0,0.98)) drop-shadow(0 0 20px ${teamColor}75)`
            }}
          >
            {pilot.driverNumber}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default F1GridDriverCard;
