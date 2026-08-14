import React, { useRef, useState } from 'react';
import { Camera, Star } from 'lucide-react';
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';
import FlagIcon from './FlagIcon';

// Real F1 Track Action Photos for Right Side Background
const REAL_TRACK_PHOTOS = {
  'race-1': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop', // Bahrain night race
  'race-2': 'https://images.unsplash.com/photo-1541348263662-e08266f92f0a?q=80&w=1200&auto=format&fit=crop', // Jeddah street circuit
  'race-3': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop', // Australia park
  'race-4': 'https://images.unsplash.com/photo-1541348263662-e08266f92f0a?q=80&w=1200&auto=format&fit=crop', // Baku city
  'race-5': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop', // Miami stadium
  'race-6': 'https://images.unsplash.com/photo-1541348263662-e08266f92f0a?q=80&w=1200&auto=format&fit=crop', // Imola historic track
  'race-7': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop', // Monaco harbor
  'race-8': 'https://images.unsplash.com/photo-1541348263662-e08266f92f0a?q=80&w=1200&auto=format&fit=crop'  // Spain Barcelona Catalunya
};

const DEFAULT_TRACK_PHOTO = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop';

export default function F1DriverOfTheDayCard({ raceTitle, trackImage, fullResults, defaultDriverId, activeRaceId }) {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  // Auto-select driver with highest position gains (or winner if equal)
  const bestGainDriver = [...fullResults].sort((a, b) => b.posDiff - a.posDiff)[0] || fullResults[0];
  const [selectedDriverId, setSelectedDriverId] = useState(defaultDriverId || bestGainDriver.driverId);

  const selectedResult = fullResults.find(r => r.driverId === selectedDriverId) || bestGainDriver;
  const { driver, team, posDiff } = selectedResult;

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

  const trackPhoto = REAL_TRACK_PHOTOS[activeRaceId] || DEFAULT_TRACK_PHOTO;
  const luxuryEase = [0.16, 1, 0.3, 1];

  // Map team colors for vibrant gradient
  const teamPrimaryColor = team.color || '#E10600';
  const teamAccentColor = team.accentColor || teamPrimaryColor;

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

      {/* Target 16:9 Canvas matching Official F1 TV Poster (Lando Norris Imola style) */}
      <div className="broadcast-card-scroll-wrapper">
        <motion.div
          key={selectedDriverId}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, ease: luxuryEase }}
          ref={cardRef}
          style={{
            width: '100%',
            minWidth: '960px',
            aspectRatio: '16 / 9',
            minHeight: '580px',
            background: '#0B0D13',
            borderRadius: '16px',
            border: '2px solid #282E40',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.95)',
            color: '#FFF'
          }}
        >
          {/* Layer 1: Right Side Real Track Photo (55% width) */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '58%',
            overflow: 'hidden',
            zIndex: 1
          }}>
            <img
              src={trackPhoto}
              alt="F1 Track Action"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.85) contrast(1.15) sepia(0.15)',
                transform: 'scale(1.05)'
              }}
            />

            {/* Dark Vignette Gradient on Right Edge */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)'
            }} />
          </div>

          {/* Layer 2: Left Side Team Gradient Panel (45% width with Diagonal Slant Slash) */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '48%',
            background: `linear-gradient(135deg, ${teamPrimaryColor} 0%, ${teamAccentColor} 100%)`,
            clipPath: 'polygon(0 0, 100% 0, 84% 100%, 0 100%)',
            zIndex: 2,
            padding: '36px 42px',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            boxShadow: '10px 0 30px rgba(0,0,0,0.5)'
          }}>
            {/* Diagonal Speed Lines / Halftone Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'repeating-linear-gradient(-45deg, rgba(0,0,0,0.06) 0, rgba(0,0,0,0.06) 10px, transparent 10px, transparent 20px)',
              pointerEvents: 'none'
            }} />

            {/* TOP LEFT: F1 LOGO & DRIVER OF THE DAY HEADER */}
            <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <img src="/F1-logo.png" alt="F1" style={{ height: '36px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              </div>

              <div style={{
                fontFamily: 'var(--font-f1)',
                fontSize: '3.8rem',
                fontWeight: '900',
                fontStyle: 'italic',
                color: '#FFFFFF',
                lineHeight: 0.86,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                textShadow: '0 4px 18px rgba(0,0,0,0.4)'
              }}>
                DRIVER<br />
                OF THE<br />
                DAY
              </div>
            </div>

            {/* BOTTOM LEFT: TEAM BADGE + DRIVER NAME + CIRCUIT LOCATION */}
            <div style={{ position: 'relative', zIndex: 10 }}>
              {/* Team Logo / Badge */}
              {team.logo && (
                <div style={{ marginBottom: '6px' }}>
                  <img src={team.logo} alt={team.name} style={{ height: '26px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }} />
                </div>
              )}

              {/* Team Name */}
              <div style={{
                fontSize: '0.95rem',
                fontWeight: '800',
                color: 'rgba(255,255,255,0.9)',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginBottom: '2px'
              }}>
                {team.name}
              </div>

              {/* Driver Name */}
              <div style={{
                fontFamily: 'var(--font-f1)',
                fontSize: '2.8rem',
                fontWeight: '900',
                fontStyle: 'italic',
                color: '#FFFFFF',
                lineHeight: 0.95,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                textShadow: '0 4px 16px rgba(0,0,0,0.6)'
              }}>
                {driver.name}
              </div>

              {/* Country Flag + Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
                <FlagIcon countryCode={driver.country} style={{ width: '26px', height: '18px', borderRadius: '3px', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }} />
                <span style={{ fontSize: '1rem', fontWeight: '900', color: '#FFF', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  {raceTitle.replace(/Grand Prix/i, '').trim().toUpperCase()}
                </span>
                {posDiff > 0 && (
                  <span style={{ background: '#10B981', color: '#FFF', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '900' }}>
                    ▲ +{posDiff} POS
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Layer 3: CENTER STANDING DRIVER PORTRAIT (Overlapping both halves perfectly!) */}
          <div style={{
            position: 'absolute',
            left: '52%',
            bottom: 0,
            transform: 'translateX(-50%)',
            height: '92%',
            zIndex: 10,
            pointerEvents: 'none',
            display: 'flex',
            justify: 'center',
            alignItems: 'flex-end'
          }}>
            {driver.avatar ? (
              <motion.img
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, ease: luxuryEase }}
                src={driver.avatar}
                alt={driver.name}
                style={{
                  height: '100%',
                  maxHeight: '520px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.95))'
                }}
              />
            ) : (
              <div style={{ fontSize: '6rem', marginBottom: '60px' }}>🏎️</div>
            )}
          </div>

        </motion.div>
      </div>
    </div>
  );
}
