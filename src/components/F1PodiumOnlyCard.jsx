import React, { useRef, useState } from 'react';
import { Camera, Sparkles, Trophy } from 'lucide-react';
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import FlagIcon from './FlagIcon';

export default function F1PodiumOnlyCard({ raceTitle, trackImage, fullResults }) {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  if (!fullResults || fullResults.length < 3) return null;

  const first = fullResults[0];
  const second = fullResults[1];
  const third = fullResults[2];

  const handleReplayAnimation = () => {
    setAnimationKey(prev => prev + 1);
    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#FFD700', '#C0C0C0', '#CD7F32', '#E10600']
      });
    } catch (e) {
      // ignore
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.98, cacheBust: true });
      const link = document.createElement('a');
      link.download = `F1_${raceTitle.replace(/\s+/g, '_')}_Top3_Podium.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export podium photo:', err);
      alert('Ошибка экспорта скриншота подиума!');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: '900', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={22} style={{ color: 'var(--f1-gold)' }} />
          🏆 Подиум ТОП-3 (F1 Broadcast Animation)
        </h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-sm"
            onClick={handleReplayAnimation}
            style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', fontWeight: '800' }}
          >
            🎬 Воспроизвести Анимацию 💥
          </button>
          <button
            className="btn btn-primary"
            onClick={handleDownload}
            disabled={isExporting}
            style={{ boxShadow: '0 4px 16px rgba(225,6,0,0.6)', padding: '10px 20px', fontWeight: '800', fontSize: '0.95rem' }}
          >
            <Camera size={18} /> {isExporting ? 'Экспорт PNG...' : '📸 Скачать Скриншот ТОП-3 (PNG)'}
          </button>
        </div>
      </div>

      {/* Scroll Wrapper for Mobile Responsiveness */}
      <div className="broadcast-card-scroll-wrapper">
        {/* Large 16:9 Broadcast Canvas */}
        <div
          key={animationKey}
          ref={cardRef}
          style={{
            width: '100%',
            minWidth: '920px',
            aspectRatio: '16 / 9',
            minHeight: '580px',
            background: '#131620',
            backgroundImage: `
              linear-gradient(135deg, rgba(22, 26, 38, 0.98) 0%, rgba(10, 12, 18, 0.99) 100%),
              repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0, rgba(255,255,255,0.015) 12px, transparent 12px, transparent 24px)
            `,
            borderRadius: '16px',
            border: '3px solid #282E40',
            padding: '28px 36px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 30px 70px rgba(0,0,0,0.9)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            color: '#FFF'
          }}
        >
          {/* Background Red Ambient Glow behind Winner */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '650px',
            height: '650px',
            background: 'radial-gradient(circle, rgba(225,6,0,0.22) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 1
          }} />

          {/* Track Outline Silhouette Watermark (Subtle Background) */}
          {trackImage && (
            <img
              src={trackImage}
              alt="Track Layout"
              style={{
                position: 'absolute',
                top: '15%',
                left: '50%',
                transform: 'translateX(-50%)',
                height: '65%',
                opacity: 0.08,
                filter: 'invert(1) drop-shadow(0 0 20px rgba(255,255,255,0.5))',
                pointerEvents: 'none',
                zIndex: 1
              }}
            />
          )}

          {/* Top Header Bar */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 }}
          >
            <div style={{
              background: '#FFFFFF',
              padding: '8px 24px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 4px 18px rgba(255,255,255,0.4)'
            }}>
              <img src="/F1-logo.png" alt="F1" style={{ height: '30px', objectFit: 'contain' }} />
            </div>

            <div style={{
              fontFamily: 'var(--font-f1)',
              fontSize: '1.45rem',
              fontWeight: '900',
              fontStyle: 'italic',
              color: '#FFF',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              {trackImage && <img src={trackImage} alt="Track" style={{ height: '24px', filter: 'invert(1) opacity(0.8)' }} />}
              FORMULA 1 • {raceTitle.toUpperCase()}
            </div>

            <div style={{
              background: '#FFFFFF',
              padding: '8px 24px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 4px 18px rgba(255,255,255,0.4)'
            }}>
              <img src="/F1-logo.png" alt="F1" style={{ height: '30px', objectFit: 'contain' }} />
            </div>
          </motion.div>

          {/* 3RD PLACE BAM (Appears 1st: delay 0.2s) */}
          <motion.div
            initial={{ x: 120, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.175, 0.885, 0.32, 1.275] }}
            style={{ position: 'absolute', top: '16%', right: '5%', textAlign: 'right', zIndex: 10 }}
          >
            <div style={{ fontFamily: 'var(--font-f1)', fontSize: '3.8rem', fontWeight: '900', color: 'var(--f1-bronze)', lineHeight: 0.9, textShadow: '0 4px 12px rgba(0,0,0,0.9)' }}>
              3<span style={{ fontSize: '1.7rem', verticalAlign: 'top', fontStyle: 'italic' }}>RD</span>
            </div>
            <div style={{ marginTop: '4px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#D1D5DB' }}>
                {third.driver.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: third.team.color, textTransform: 'uppercase', fontStyle: 'italic', lineHeight: 1 }}>
                {third.driver.name.split(' ').slice(1).join(' ') || third.driver.name}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', marginTop: '2px' }}>
                {third.team.name}
              </div>
            </div>
          </motion.div>

          {/* 2ND PLACE BAM (Appears 2nd: delay 0.5s) */}
          <motion.div
            initial={{ x: -120, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
            style={{ position: 'absolute', top: '16%', left: '5%', zIndex: 10 }}
          >
            <div style={{ fontFamily: 'var(--font-f1)', fontSize: '3.8rem', fontWeight: '900', color: 'var(--f1-silver)', lineHeight: 0.9, textShadow: '0 4px 12px rgba(0,0,0,0.9)' }}>
              2<span style={{ fontSize: '1.7rem', verticalAlign: 'top', fontStyle: 'italic' }}>ND</span>
            </div>
            <div style={{ marginTop: '4px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#D1D5DB' }}>
                {second.driver.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: second.team.color, textTransform: 'uppercase', fontStyle: 'italic', lineHeight: 1 }}>
                {second.driver.name.split(' ').slice(1).join(' ') || second.driver.name}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', marginTop: '2px' }}>
                {second.team.name}
              </div>
            </div>
          </motion.div>

          {/* 3D LAYERED STANDING DRIVER CUTOUTS */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: '10%', zIndex: 2, pointerEvents: 'none' }}>
            {/* Layer 2: 3rd Place Driver (Staggers in with 3rd place text) */}
            {third.driver.avatar && (
              <motion.img
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                src={third.driver.avatar}
                alt={third.driver.name}
                style={{
                  position: 'absolute',
                  right: '2%',
                  bottom: 0,
                  height: '76%',
                  objectFit: 'contain',
                  zIndex: 2,
                  filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.95))'
                }}
              />
            )}

            {/* Layer 2: 2nd Place Driver (Staggers in with 2nd place text) */}
            {second.driver.avatar && (
              <motion.img
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                src={second.driver.avatar}
                alt={second.driver.name}
                style={{
                  position: 'absolute',
                  left: '2%',
                  bottom: 0,
                  height: '76%',
                  objectFit: 'contain',
                  zIndex: 2,
                  filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.95))'
                }}
              />
            )}

            {/* Layer 4: 1st Place WINNER (Drops down 3rd: delay 0.9s with explosive spring BAM!) */}
            {first.driver.avatar && (
              <motion.img
                initial={{ y: -180, opacity: 0, scale: 1.1 }}
                animate={{ y: 0, opacity: 1, scale: 1.4 }}
                transition={{ duration: 0.6, delay: 0.9, type: 'spring', stiffness: 180, damping: 14 }}
                src={first.driver.avatar}
                alt={first.driver.name}
                style={{
                  position: 'absolute',
                  left: '50%',
                  transformOrigin: 'bottom center',
                  bottom: 0,
                  height: '78%',
                  objectFit: 'contain',
                  zIndex: 5,
                  filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.95))'
                }}
              />
            )}
          </div>

          {/* FOREGROUND WINNER DUUUUMM OVERLAY (Explodes in: delay 1.1s!) */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1, type: 'spring', stiffness: 220, damping: 15 }}
            style={{
              position: 'absolute',
              bottom: '6%',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              zIndex: 15,
              width: '100%',
              pointerEvents: 'none'
            }}
          >
            <div style={{
              fontFamily: 'var(--font-f1)',
              fontSize: '5.5rem',
              fontWeight: '900',
              fontStyle: 'italic',
              color: '#FFFFFF',
              lineHeight: 0.85,
              letterSpacing: '4px',
              textShadow: '0 8px 30px rgba(0,0,0,0.95), 0 0 25px rgba(0,0,0,0.95)'
            }}>
              WINNER
            </div>

            <div style={{
              fontFamily: 'cursive, sans-serif',
              fontSize: '2rem',
              color: '#FFD700',
              marginTop: '-18px',
              marginBottom: '-6px',
              textShadow: '0 4px 12px rgba(0,0,0,0.95)',
              fontWeight: '700'
            }}>
              {first.driver.name}
            </div>

            <div style={{
              fontFamily: 'var(--font-f1)',
              fontSize: '3rem',
              fontWeight: '900',
              color: first.team.accentColor || '#FF8000',
              textTransform: 'uppercase',
              lineHeight: 1,
              textShadow: '0 6px 20px rgba(0,0,0,0.95)',
              letterSpacing: '1px'
            }}>
              {first.driver.name.split(' ').pop()}
            </div>

            <div style={{
              fontSize: '1.1rem',
              fontWeight: '800',
              color: '#FFF',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginTop: '2px',
              textShadow: '0 2px 8px rgba(0,0,0,0.9)'
            }}>
              {first.team.name}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
