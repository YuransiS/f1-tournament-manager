import React from 'react';

interface F1FlagVideoBackgroundProps {
  countryCode?: string;
  flagGifUrl?: string;
  flagVideoId?: string;
}

export const F1FlagVideoBackground: React.FC<F1FlagVideoBackgroundProps> = ({
  countryCode = 'jp',
  flagGifUrl
}) => {
  const activeCountryCode = (countryCode || 'jp').toLowerCase();
  const flagGifSrc = flagGifUrl || `/flags/animated/${activeCountryCode}.gif`;
  const localVideoSrc = `/flags/videos/${activeCountryCode}.mp4`;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-[#07090E]">
      {/* 1. Underlying Animated Fallback GIF */}
      <img
        src={flagGifSrc}
        alt=""
        className="absolute inset-0 w-full h-full object-cover filter contrast-110 pointer-events-none select-none z-0"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />

      {/* 2. Hardware-accelerated local MP4 loop (Zero YouTube UI, 100% progressive, zero out-of-screen bleeding) */}
      <video
        key={`local-flag-video-${activeCountryCode}`}
        src={localVideoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover filter brightness-95 contrast-105 pointer-events-none select-none z-[1]"
      />
    </div>
  );
};

export default F1FlagVideoBackground;
