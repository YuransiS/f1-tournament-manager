import React, { useRef, useState } from 'react';
import { Camera, Sparkles, Trophy, Film, Loader2 } from 'lucide-react';
import { toPng, toCanvas } from 'html-to-image';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { motion } from 'framer-motion';
import FlagIcon from './FlagIcon';

export default function F1PodiumOnlyCard({ raceTitle, trackImage, fullResults }) {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isRecordingGif, setIsRecordingGif] = useState(false);
  const [gifProgress, setGifProgress] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  if (!fullResults || fullResults.length < 3) return null;

  const first = fullResults[0];
  const second = fullResults[1];
  const third = fullResults[2];

  const handleReplayAnimation = () => {
    setAnimationKey(prev => prev + 1);
  };

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.98, cacheBust: false });
      const link = document.createElement('a');
      link.download = `F1_${raceTitle.replace(/\s+/g, '_')}_Official_Podium.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export podium photo:', err);
      alert('Ошибка экспорта скриншота подиума!');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportGif = async () => {
    if (!cardRef.current || isRecordingGif) return;
    setIsRecordingGif(true);
    setGifProgress(0);

    try {
      // Restart animation from 0
      setAnimationKey(prev => prev + 1);
      await new Promise(r => setTimeout(r, 120));

      const encoder = GIFEncoder();
      const fps = 8;
      const totalSeconds = 5.4;
      const totalFrames = Math.floor(fps * totalSeconds);
      const frameInterval = 1000 / fps;

      const targetWidth = 640;
      const targetHeight = 360;

      for (let i = 0; i < totalFrames; i++) {
        if (!cardRef.current) break;

        const canvas = await toCanvas(cardRef.current, {
          width: targetWidth,
          height: targetHeight,
          pixelRatio: 1,
          cacheBust: false
        });

        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const palette = quantize(imgData.data, 128);
        const index = applyPalette(imgData.data, palette);

        encoder.writeFrame(index, targetWidth, targetHeight, {
          palette,
          delay: frameInterval,
          transparent: false
        });

        setGifProgress(Math.round(((i + 1) / totalFrames) * 100));
        await new Promise(r => setTimeout(r, frameInterval));
      }

      encoder.finish();
      const rawBytes = encoder.bytesView();
      const blob = new Blob([rawBytes], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = `F1_${raceTitle.replace(/\s+/g, '_')}_Podium.gif`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export GIF:', err);
      alert('Не удалось сформировать GIF. Попробуйте еще раз.');
    } finally {
      setIsRecordingGif(false);
      setGifProgress(0);
    }
  };

  // Ultra-luxurious cinematic timing (Official F1 TV style)
  const luxuryEase = [0.16, 1, 0.3, 1];

  return (
    <div style={{ marginBottom: '36px' }}>
      {/* Top Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: '900', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={22} style={{ color: 'var(--f1-gold)' }} />
          🏆 Официальный Подиум ТОП-3 (F1 TV Broadcast)
        </h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-sm"
            onClick={handleReplayAnimation}
            disabled={isRecordingGif}
            style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', fontWeight: '800' }}
          >
            🎬 Повтор Анимации
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleExportGif}
            disabled={isRecordingGif || isExporting}
            style={{
              background: isRecordingGif ? 'rgba(255,215,0,0.2)' : 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              border: '1.5px solid #FFD700',
              color: '#FFD700',
              boxShadow: '0 4px 16px rgba(255,215,0,0.3)',
              padding: '10px 18px',
              fontWeight: '900',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isRecordingGif ? (
              <>
                <Loader2 size={18} className="spin" />
                <span>Запись GIF {gifProgress}%...</span>
              </>
            ) : (
              <>
                <Film size={18} />
                <span>🎥 Скачать GIF Анимацию</span>
              </>
            )}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleDownloadPng}
            disabled={isExporting || isRecordingGif}
            style={{ boxShadow: '0 4px 16px rgba(225,6,0,0.6)', padding: '10px 20px', fontWeight: '800', fontSize: '0.95rem' }}
          >
            <Camera size={18} /> {isExporting ? 'Экспорт PNG...' : '📸 Скачать Скриншот (PNG)'}
          </button>
        </div>
      </div>

      {/* Touch Scroll Container */}
      <div className="broadcast-card-scroll-wrapper">
        {/* Main 16:9 F1 Broadcast TV Canvas */}
        <div
          key={animationKey}
          ref={cardRef}
          style={{
            width: '100%',
            minWidth: '940px',
            aspectRatio: '16 / 9',
            minHeight: '600px',
            background: '#0B0D14',
            backgroundImage: `
              radial-gradient(circle at 50% 30%, rgba(30, 36, 54, 0.8) 0%, rgba(11, 13, 20, 0.98) 70%),
              repeating-linear-gradient(45deg, rgba(255,255,255,0.012) 0, rgba(255,255,255,0.012) 10px, transparent 10px, transparent 20px)
            `,
            borderRadius: '16px',
            border: '2px solid #282E40',
            padding: '24px 32px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.95)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            color: '#FFF'
          }}
        >
          {/* Subtle Ambient Golden Glow in Center for Winner */}
          <div style={{
            position: 'absolute',
            top: '0%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '500px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(255,215,0,0.12) 0%, rgba(225,6,0,0.08) 50%, transparent 80%)',
            pointerEvents: 'none',
            zIndex: 1
          }} />

          {/* Track Outline Silhouette Background Watermark */}
          {trackImage && (
            <img
              src={trackImage}
              alt="Track Layout"
              style={{
                position: 'absolute',
                top: '12%',
                left: '50%',
                transform: 'translateX(-50%)',
                height: '65%',
                opacity: 0.07,
                filter: 'invert(1)',
                pointerEvents: 'none',
                zIndex: 1
              }}
            />
          )}

          {/* Phase 1: Header Bar (0.0s - 1.2s) */}
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: luxuryEase }}
            style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              zIndex: 20,
              background: 'rgba(18, 22, 34, 0.65)',
              backdropFilter: 'blur(10px)',
              padding: '10px 20px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: '#FFF', padding: '6px 18px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}>
                <img src="/F1-logo.png" alt="F1" style={{ height: '22px', objectFit: 'contain' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--f1-red)', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '1px' }}>
                  FORMULA 1 GRAND PRIX 2026
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '900', fontStyle: 'italic', color: '#FFF', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {raceTitle}
                </h2>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: '800', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <Sparkles size={16} /> OFFICIAL TOP 3 PODIUM
            </div>
          </motion.div>

          {/* Main 3-Column Podium Showcase */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '16px', alignItems: 'flex-end', flex: 1, position: 'relative', zIndex: 10, paddingBottom: '10px' }}>
            
            {/* --- 2ND PLACE (LEFT) - Phase 3 (2.6s - 4.0s) --- */}
            <motion.div
              initial={{ opacity: 0, x: -60, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.4, delay: 2.6, ease: luxuryEase }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              {/* Driver Portrait Cutout */}
              <div style={{ position: 'relative', height: '290px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                {second.driver.avatar ? (
                  <img
                    src={second.driver.avatar}
                    alt={second.driver.name}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.9))'
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '4rem', opacity: 0.5 }}>🏎️</div>
                )}
              </div>

              {/* 2nd Place Pedestal Card */}
              <div style={{
                width: '100%',
                background: 'linear-gradient(180deg, #1C2232 0%, #121622 100%)',
                border: '2px solid var(--f1-silver)',
                borderRadius: '12px 12px 0 0',
                padding: '14px 10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                borderBottom: '4px solid var(--f1-silver)'
              }}>
                <div style={{ fontFamily: 'var(--font-f1)', fontSize: '2rem', fontWeight: '900', color: 'var(--f1-silver)', lineHeight: 1 }}>
                  2ND PLACE
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', margin: '6px 0 2px 0' }}>
                  <FlagIcon countryCode={second.driver.country} style={{ width: '20px', height: '14px' }} />
                  <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#FFF', textTransform: 'uppercase', fontStyle: 'italic' }}>
                    {second.driver.name}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: second.team.color, fontWeight: '800', textTransform: 'uppercase' }}>
                  {second.team.name}
                </div>
                <div style={{ marginTop: '6px', fontSize: '0.85rem', fontWeight: '900', color: 'var(--f1-silver)' }}>
                  +{second.pts} PTS {second.isFastestLap ? '⚡ FL' : ''}
                </div>
              </div>
            </motion.div>

            {/* --- 1ST PLACE WINNER (CENTER) - Phase 4 (4.0s - 5.6s) --- */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.6, delay: 4.0, ease: luxuryEase }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                zIndex: 15
              }}
            >
              {/* Winner Golden Badge */}
              <div style={{
                background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                padding: '6px 18px',
                borderRadius: '20px',
                fontWeight: '900',
                fontSize: '0.85rem',
                letterSpacing: '1px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '8px',
                boxShadow: '0 4px 20px rgba(255,215,0,0.6)'
              }}>
                <Trophy size={16} /> {raceTitle && raceTitle.toLowerCase().includes('sprint') ? 'SPRINT WINNER' : 'RACE WINNER'}
              </div>

              {/* Driver Portrait Cutout (Taller & Prominent) */}
              <div style={{ position: 'relative', height: '330px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                {first.driver.avatar ? (
                  <img
                    src={first.driver.avatar}
                    alt={first.driver.name}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 20px 35px rgba(255,215,0,0.3)) drop-shadow(0 15px 30px rgba(0,0,0,0.95))'
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '5rem' }}>🏆</div>
                )}
              </div>

              {/* 1st Place Golden Pedestal Card */}
              <div style={{
                width: '100%',
                background: 'linear-gradient(180deg, #262112 0%, #15120A 100%)',
                border: '2px solid #FFD700',
                borderRadius: '12px 12px 0 0',
                padding: '16px 12px',
                boxShadow: '0 15px 40px rgba(255,215,0,0.25)',
                borderBottom: '5px solid #FFD700'
              }}>
                <div style={{ fontFamily: 'var(--font-f1)', fontSize: '2.5rem', fontWeight: '900', color: '#FFD700', lineHeight: 1, letterSpacing: '1px' }}>
                  WINNER
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '6px 0 2px 0' }}>
                  <FlagIcon countryCode={first.driver.country} style={{ width: '22px', height: '15px' }} />
                  <span style={{ fontSize: '1.3rem', fontWeight: '900', color: '#FFF', textTransform: 'uppercase', fontStyle: 'italic' }}>
                    {first.driver.name}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: first.team.color, fontWeight: '800', textTransform: 'uppercase' }}>
                  {first.team.name}
                </div>
                <div style={{ marginTop: '6px', fontSize: '1rem', fontWeight: '900', color: '#FFD700' }}>
                  +{first.pts} PTS {first.isFastestLap ? '⚡ FL' : ''}
                </div>
              </div>
            </motion.div>

            {/* --- 3RD PLACE (RIGHT) - Phase 2 (1.2s - 2.6s) --- */}
            <motion.div
              initial={{ opacity: 0, x: 60, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.4, delay: 1.2, ease: luxuryEase }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              {/* Driver Portrait Cutout */}
              <div style={{ position: 'relative', height: '270px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                {third.driver.avatar ? (
                  <img
                    src={third.driver.avatar}
                    alt={third.driver.name}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.9))'
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '4rem', opacity: 0.5 }}>🏎️</div>
                )}
              </div>

              {/* 3rd Place Pedestal Card */}
              <div style={{
                width: '100%',
                background: 'linear-gradient(180deg, #241D17 0%, #16120E 100%)',
                border: '2px solid var(--f1-bronze)',
                borderRadius: '12px 12px 0 0',
                padding: '14px 10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                borderBottom: '4px solid var(--f1-bronze)'
              }}>
                <div style={{ fontFamily: 'var(--font-f1)', fontSize: '2rem', fontWeight: '900', color: 'var(--f1-bronze)', lineHeight: 1 }}>
                  3RD PLACE
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', margin: '6px 0 2px 0' }}>
                  <FlagIcon countryCode={third.driver.country} style={{ width: '20px', height: '14px' }} />
                  <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#FFF', textTransform: 'uppercase', fontStyle: 'italic' }}>
                    {third.driver.name}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: third.team.color, fontWeight: '800', textTransform: 'uppercase' }}>
                  {third.team.name}
                </div>
                <div style={{ marginTop: '6px', fontSize: '0.85rem', fontWeight: '900', color: 'var(--f1-bronze)' }}>
                  +{third.pts} PTS {third.isFastestLap ? '⚡ FL' : ''}
                </div>
              </div>
            </motion.div>

          </div>

          {/* Bottom Broadcast Footer */}
          <div style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '8px',
            zIndex: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '700' }}>
              <div style={{ background: '#FFF', padding: '3px 8px', borderRadius: '4px' }}>
                <img src="/F1-logo.png" alt="F1" style={{ height: '12px', objectFit: 'contain' }} />
              </div>
              <span>OFFICIAL F1 BROADCAST TIMING & PODIUM</span>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '600' }}>
              SEASON 2026 • OFFICIAL STAGE PODIUM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
