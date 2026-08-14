import React, { useRef, useState } from 'react';
import { Camera, Award, Star, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';
import FlagIcon from './FlagIcon';

export default function F1DriverOfTheDayCard({ raceTitle, trackImage, fullResults, defaultDriverId }) {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  // Auto-select driver with highest position gains (or winner if equal)
  const bestGainDriver = [...fullResults].sort((a, b) => b.posDiff - a.posDiff)[0] || fullResults[0];
  const [selectedDriverId, setSelectedDriverId] = useState(defaultDriverId || bestGainDriver.driverId);

  const selectedResult = fullResults.find(r => r.driverId === selectedDriverId) || bestGainDriver;
  const { driver, team, finishPos, gridPos, posDiff } = selectedResult;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.98, cacheBust: true });
      const link = document.createElement('a');
      link.download = `F1_Driver_Of_The_Day_${driver.name.replace(/\s+/g, '_')}_${raceTitle.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export Driver of the Day card:', err);
      alert('Ошибка экспорта карточки Гоночного Дня!');
    } finally {
      setIsExporting(false);
    }
  };

  const luxuryEase = [0.16, 1, 0.3, 1];

  return (
    <div style={{ marginBottom: '36px' }}>
      {/* Control Header & Driver Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge badge-gold" style={{ padding: '6px 14px', fontSize: '0.85rem', fontWeight: '900', letterSpacing: '1px' }}>
            🌟 OFFICIAL F1 FAN VOTE
          </span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '900', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            🏆 Гоночный Гонщик Дня (Driver of the Day)
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Driver Selector dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#9CA3AF' }}>
            <span>Выбрать пилота:</span>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className="form-control"
              style={{ padding: '6px 12px', background: '#1A1E2B', border: '1px solid var(--border-color)', color: '#FFF', borderRadius: '8px', fontWeight: '700' }}
            >
              {fullResults.map(r => (
                <option key={r.driverId} value={r.driverId}>
                  P{r.finishPos} — {r.driver.name} ({r.team.name}) {r.posDiff > 0 ? `[▲+${r.posDiff}]` : ''}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleDownload}
            disabled={isExporting}
            style={{ boxShadow: '0 4px 20px rgba(225,6,0,0.7)', padding: '10px 20px', fontWeight: '800', fontSize: '0.95rem' }}
          >
            <Camera size={18} /> {isExporting ? 'Экспорт PNG...' : '📸 Скачать Скриншот (PNG)'}
          </button>
        </div>
      </div>

      {/* Target Canvas matching Official F1 TV Graphic */}
      <div className="broadcast-card-scroll-wrapper">
        <motion.div
          key={selectedDriverId}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, ease: luxuryEase }}
          ref={cardRef}
          style={{
            width: '100%',
            minWidth: '940px',
            aspectRatio: '16 / 9',
            minHeight: '560px',
            background: '#0B0D13',
            borderRadius: '16px',
            border: '2px solid #282E40',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.95)',
            display: 'grid',
            gridTemplateColumns: '50% 50%',
            color: '#FFF'
          }}
        >
          {/* Left Panel: Team Vibrant Gradient Backdrop */}
          <div style={{
            background: `linear-gradient(135deg, ${team.color} 0%, ${team.accentColor || team.color} 100%)`,
            padding: '36px 44px',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            position: 'relative',
            zIndex: 2,
            clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)',
            marginRight: '-10%'
          }}>
            {/* Halftone / Speed Diagonal Pattern Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'repeating-linear-gradient(-45deg, rgba(0,0,0,0.08) 0, rgba(0,0,0,0.08) 8px, transparent 8px, transparent 16px)',
              pointerEvents: 'none'
            }} />

            {/* Top Left F1 Logo & DRIVER OF THE DAY Banner */}
            <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <img src="/F1-logo.png" alt="F1" style={{ height: '36px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              </div>

              <div style={{
                fontFamily: 'var(--font-f1)',
                fontSize: '3.6rem',
                fontWeight: '900',
                fontStyle: 'italic',
                color: '#FFFFFF',
                lineHeight: 0.88,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                textShadow: '0 4px 18px rgba(0,0,0,0.4)'
              }}>
                DRIVER<br />
                OF THE<br />
                DAY
              </div>
            </div>

            {/* Bottom Left Team Logo + Driver Name + Circuit Badge */}
            <div style={{ position: 'relative', zIndex: 10 }}>
              {/* Team Name / Logo Badge */}
              <div style={{
                fontSize: '1.1rem',
                fontWeight: '900',
                color: 'rgba(255,255,255,0.9)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '4px'
              }}>
                {team.name}
              </div>

              {/* Driver Big Name */}
              <div style={{
                fontFamily: 'var(--font-f1)',
                fontSize: '2.6rem',
                fontWeight: '900',
                fontStyle: 'italic',
                color: '#FFFFFF',
                lineHeight: 0.95,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                textShadow: '0 4px 16px rgba(0,0,0,0.5)'
              }}>
                {driver.name}
              </div>

              {/* Flag + Track Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' }}>
                <FlagIcon countryCode={driver.country} style={{ width: '26px', height: '18px', borderRadius: '2px', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }} />
                <span style={{ fontSize: '1rem', fontWeight: '900', color: '#FFF', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  {raceTitle.replace(/Grand Prix/i, '').trim().toUpperCase()}
                </span>
                {posDiff > 0 && (
                  <span style={{ background: '#10B981', color: '#FFF', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '900' }}>
                    ▲ +{posDiff} POS GAINED
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Track Atmosphere / Action Background */}
          <div style={{
            position: 'relative',
            background: '#0F121C',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            {/* Background Track Map Silhouette */}
            {trackImage && (
              <img
                src={trackImage}
                alt="Track"
                style={{
                  position: 'absolute',
                  width: '90%',
                  height: '80%',
                  opacity: 0.12,
                  filter: 'invert(1)',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              />
            )}

            {/* Subtle Gradient Glow */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 60% 50%, ${team.color}40 0%, rgba(11,13,19,0.95) 75%)`,
              zIndex: 2
            }} />
          </div>

          {/* Center Overlay: Standing Driver Cutout */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justify: 'center',
            alignItems: 'flex-end',
            zIndex: 5,
            pointerEvents: 'none'
          }}>
            {driver.avatar ? (
              <motion.img
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: luxuryEase }}
                src={driver.avatar}
                alt={driver.name}
                style={{
                  height: '470px',
                  maxHeight: '115%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.95))'
                }}
              />
            ) : (
              <div style={{ fontSize: '6rem', marginBottom: '80px' }}>🏎️</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
