import React, { useEffect, useRef } from 'react';

export const COUNTRY_FLAG_YOUTUBE_MAP: Record<string, string> = {
  bh: 'EY_88yHI9Uc', // Bahrain
  sa: 'eDBnesS7_BY', // Saudi Arabia
  au: 'oh_a7IR9wBQ', // Australia
  az: '7upmTbfsa90', // Azerbaijan
  us: 'O1TWZ_OOHMU', // USA (Miami & Austin)
  it: 'frO_J_MubJY', // Italy (Imola & Monza)
  mc: 'OFVVct6DVyw', // Monaco
  es: 't-JBSXdJnR8', // Spain
  ca: '7Ry6UhLNOaI', // Canada
  at: 'vBIHzWBmcCU', // Austria
  gb: 'v7w4CMPkJsA', // Great Britain
  hu: 'qvym0lkBL2s', // Hungary
  be: 'RuhgyWAIMnQ', // Belgium
  nl: 'u2P2xBi6ygg', // Netherlands
  sg: 'WqwBlGrAf6A', // Singapore
  jp: 'x0Za2ghUHvw', // Japan
};

interface F1FlagVideoBackgroundProps {
  countryCode?: string;
  flagGifUrl?: string;
  flagVideoId?: string;
}

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const F1FlagVideoBackground: React.FC<F1FlagVideoBackgroundProps> = ({
  countryCode = 'jp',
  flagGifUrl,
  flagVideoId
}) => {
  const activeCountryCode = (countryCode || 'jp').toLowerCase();
  const activeVideoId = flagVideoId || COUNTRY_FLAG_YOUTUBE_MAP[activeCountryCode] || 'x0Za2ghUHvw';
  const flagGifSrc = flagGifUrl || `/flags/animated/${activeCountryCode}.gif`;

  const playerRef = useRef<any>(null);
  const containerId = useRef(`f1-flag-player-${Math.random().toString(36).substring(2, 9)}`).current;

  useEffect(() => {
    let isCancelled = false;

    if (!window.YT) {
      const existingScript = document.getElementById('yt-iframe-api-script');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }
    }

    const initPlayer = () => {
      if (isCancelled || !window.YT || !window.YT.Player) return;

      const domEl = document.getElementById(containerId);
      if (!domEl) return;

      try {
        if (playerRef.current) {
          playerRef.current.destroy();
        }

        playerRef.current = new window.YT.Player(containerId, {
          videoId: activeVideoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            iv_load_policy: 3,
            origin: window.location.origin
          },
          events: {
            onReady: (e: any) => {
              e.target.mute();
              e.target.playVideo();
            },
            onStateChange: (e: any) => {
              // Seamless Rewind on end without playlist OSD or black screen
              if (e.data === window.YT.PlayerState.ENDED) {
                e.target.seekTo(0, true);
                e.target.playVideo();
              }
              // Immediately resume if paused by any outside factor to prevent pause overlay
              if (e.data === window.YT.PlayerState.PAUSED) {
                e.target.playVideo();
              }
            }
          }
        });
      } catch (err) {
        console.warn('YouTube Iframe Player init error:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };
      const checkTimer = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkTimer);
          initPlayer();
        }
      }, 200);
      return () => {
        isCancelled = true;
        clearInterval(checkTimer);
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch {}
          playerRef.current = null;
        }
      };
    }

    return () => {
      isCancelled = true;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
      }
    };
  }, [activeVideoId, containerId]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-[#07090E]">
      <style>{`
        #${containerId}, #${containerId} iframe, iframe[id^="f1-flag-player"] {
          pointer-events: none !important;
          user-select: none !important;
          border: none !important;
        }
      `}</style>

      {/* 1. Underlying Animated Fallback GIF (guarantees full coverage and zero black flicker) */}
      <img
        src={flagGifSrc}
        alt=""
        className="absolute inset-0 w-full h-full object-cover filter contrast-110 scale-105 pointer-events-none select-none z-0"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />

      {/* 2. Full-bleed video iframe container (uses 200% with scale(1.4) to eliminate any side bars) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center pointer-events-none select-none z-[1]"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          id={containerId}
          className="pointer-events-none select-none border-0"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1.45)',
            width: '200%',
            height: '200%',
            minWidth: '100%',
            minHeight: '100%',
            pointerEvents: 'none',
            userSelect: 'none',
            filter: 'brightness(0.9) contrast(1.08)',
            border: 'none'
          }}
        />
      </div>

      {/* 3. True Pointer-Event Blocker over video: absorbs any stray hover or click so YouTube never sees it */}
      <div
        className="absolute inset-0 pointer-events-auto cursor-default z-[2]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    </div>
  );
};

export default F1FlagVideoBackground;
