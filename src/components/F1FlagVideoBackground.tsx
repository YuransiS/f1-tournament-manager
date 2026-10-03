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
  qa: 'x4z01_B_v9k', // Qatar
  mx: 'wLp9l_N_KkM', // Mexico
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
  const localVideoSrc = `/flags/videos/${activeCountryCode}.mp4`;

  const [useLocalVideo, setUseLocalVideo] = React.useState<boolean>(false);
  const playerRef = useRef<any>(null);
  const containerId = useRef(`f1-flag-player-${Math.random().toString(36).substring(2, 9)}`).current;
  const loopTimerRef = useRef<any>(null);

  // Clean up interval timer on unmount
  useEffect(() => {
    return () => {
      if (loopTimerRef.current) {
        clearInterval(loopTimerRef.current);
        loopTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // If local video is playing cleanly, skip initializing YouTube
    if (useLocalVideo) {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
      }
      return;
    }

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

    const startSeamlessLoopWatcher = (player: any) => {
      if (loopTimerRef.current) {
        clearInterval(loopTimerRef.current);
      }
      // Check every 250ms: rewind 2.5s BEFORE the video reaches end.
      // This mathematically prevents YouTube from ever triggering PlayerState.ENDED,
      // which is what spawns the YouTube player end-screen, recommendations, and reload banner!
      loopTimerRef.current = setInterval(() => {
        if (!player || typeof player.getCurrentTime !== 'function' || typeof player.getDuration !== 'function') {
          return;
        }
        try {
          const cur = player.getCurrentTime();
          const dur = player.getDuration();
          if (dur > 5 && cur >= dur - 2.5) {
            player.seekTo(0.1, true);
          }
        } catch {}
      }, 250);
    };

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
              startSeamlessLoopWatcher(e.target);
            },
            onStateChange: (e: any) => {
              // Safety catch: if ENDED was somehow hit, rewind immediately without showing UI
              if (e.data === window.YT.PlayerState.ENDED) {
                e.target.seekTo(0.1, true);
                e.target.playVideo();
              }
              // Immediately resume if paused by outside factor to prevent pause overlay
              if (e.data === window.YT.PlayerState.PAUSED) {
                e.target.playVideo();
              }
              if (e.data === window.YT.PlayerState.PLAYING) {
                startSeamlessLoopWatcher(e.target);
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
        if (loopTimerRef.current) {
          clearInterval(loopTimerRef.current);
          loopTimerRef.current = null;
        }
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
      if (loopTimerRef.current) {
        clearInterval(loopTimerRef.current);
        loopTimerRef.current = null;
      }
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
      }
    };
  }, [activeVideoId, containerId, useLocalVideo]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-auto select-none z-0 bg-[#07090E]">
      <style>{`
        #${containerId}, #${containerId} iframe, iframe[id^="f1-flag-player"] {
          width: 100% !important;
          height: 100% !important;
          pointer-events: none !important;
          user-select: none !important;
          border: none !important;
          object-fit: cover !important;
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

      {/* 2. Priority Local MP4 Video (Zero UI, 100% hardware acceleration, seamless native loop) */}
      <video
        key={`local-flag-video-${activeCountryCode}`}
        src={localVideoSrc}
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => setUseLocalVideo(true)}
        onError={() => setUseLocalVideo(false)}
        className={`absolute inset-0 w-full h-full object-cover filter brightness-95 contrast-105 pointer-events-none select-none z-[2] transition-opacity duration-500 ${
          useLocalVideo ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 3. Full-bleed YouTube video iframe container (Active when local video is not yet downloaded) */}
      {!useLocalVideo && (
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
              transform: 'translate(-50%, -50%) scale(1.75)',
              width: 'max(100%, 178vh, 178%)',
              height: 'max(100%, 56.25vw, 56.25%)',
              minWidth: '100%',
              minHeight: '100%',
              pointerEvents: 'none',
              userSelect: 'none',
              filter: 'brightness(0.96) contrast(1.06)',
              border: 'none'
            }}
          />
        </div>
      )}

      {/* 3. True Pointer-Event Shield over video: absorbs any stray hover or click so YouTube never sees it */}
      <div
        className="absolute inset-0 pointer-events-auto cursor-default z-[5]"
        onMouseMove={(e) => e.stopPropagation()}
        onMouseEnter={(e) => e.stopPropagation()}
        onMouseOver={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default F1FlagVideoBackground;
