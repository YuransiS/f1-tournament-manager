import React, { useRef, useState } from 'react';
import { Camera, Star } from 'lucide-react';
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';
import FlagIcon from './FlagIcon';

// Host country mapping for each Grand Prix stage
const RACE_COUNTRY_MAP = {
  'race-1': { code: 'BH', name: 'BAHRAIN' },
  'race-2': { code: 'SA', name: 'SAUDI ARABIA' },
  'race-3': { code: 'AU', name: 'AUSTRALIA' },
  'race-4': { code: 'AZ', name: 'AZERBAIJAN' },
  'race-5': { code: 'US', name: 'MIAMI • USA' },
  'race-6': { code: 'IT', name: 'IMOLA • ITALY' },
  'race-7': { code: 'MC', name: 'MONACO' },
  'race-8': { code: 'ES', name: 'SPAIN' }
};

export default function F1DriverOfTheDayCard({ raceTitle, trackImage, fullResults, defaultDriverId, activeRaceId }) {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  // Auto-select driver with highest position gains (or winner if equal)
  const bestGainDriver = [...fullResults].sort((a, b) => b.posDiff - a.posDiff)[0] || fullResults[0];
  const [selectedDriverId, setSelectedDriverId] = useState(defaultDriverId || bestGainDriver.driverId);

  const selectedResult = fullResults.find(r => r.driverId === selectedDriverId) || bestGainDriver;
  const { driver, team, posDiff } = selectedResult;

  // Race host country info
  const hostCountry = RACE_COUNTRY_MAP[activeRaceId] || {
    code: 'ES',
    name: raceTitle.replace(/Grand Prix/i, '').trim().toUpperCase()
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.98, cacheBust: true });
      const link = document.createElement('a');
      link.download = `F1_Driver_Of_The_Day_${driver.name.replace(/\s+/g, '_')}_${hostCountry.name}.png`;
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

  // Team vibrant colors
  const teamPrimaryColor = team.color || '#1E41FF';
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

      {/* Target 16:9 Canvas matching Official F1 TV Poster (Lando Norris China template) */}
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
            background: '#07090E',
            borderRadius: '24px',
            border: '3px solid #282E40',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.95)',
            color: '#FFF'
          }}
        >
          {/* Layer 1: Team Tinted Background Canvas with Circuit Silhouette & Speed Grids */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(circle at 80% 20%, ${teamPrimaryColor}DD 0%, rgba(10,12,18,0.98) 70%),
              linear-gradient(135deg, ${teamPrimaryColor}AA 0%, ${teamAccentColor}BB 100%),
              repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0, rgba(255,255,255,0.02) 14px, transparent 14px, transparent 28px)
            `,
            mixBlendMode: 'normal',
            zIndex: 1
          }} />

          {/* Layer 1.5: Track Outline Silhouette Background Watermark */}
          {trackImage && (
            <img
              src={trackImage}
              alt="Track Layout"
              style={{
                position: 'absolute',
                top: '5%',
                right: '2%',
                height: '85%',
                opacity: 0.14,
                filter: 'invert(1) drop-shadow(0 0 25px rgba(255,255,255,0.3))',
                pointerEvents: 'none',
                zIndex: 2
              }}
            />
          )}

          {/* Layer 2: Left Side Standing Driver Portrait Cutout */}
          <div style={{
            position: 'absolute',
            left: '4%',
            bottom: 0,
            height: '96%',
            zIndex: 5,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'flex-end'
          }}>
            {driver.avatar ? (
              <motion.img
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: luxuryEase }}
                src={driver.avatar}
                alt={driver.name}
                style={{
                  height: '100%',
                  maxHeight: '550px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 25px 45px rgba(0,0,0,0.95))'
                }}
              />
            ) : (
              <div style={{ fontSize: '6rem', marginBottom: '60px' }}>🏎️</div>
            )}
          </div>

          {/* Layer 3: Right Side Content (F1 Logo + DRIVER OF THE DAY + Track Host Flag + Driver Name) */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '54%',
            padding: '40px 48px',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            alignItems: 'flex-end',
            textAlign: 'right',
            zIndex: 10
          }}>
            {/* Top Right: Official F1 Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src="/F1-logo.png" alt="F1" style={{ height: '42px', objectFit: 'contain', filter: 'brightness(0) invert(1) drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} />
            </div>

            {/* Middle Right: GIANT "DRIVER OF THE DAY" TYPOGRAPHY */}
            <div style={{ margin: 'auto 0' }}>
              <div style={{
                fontFamily: 'var(--font-f1)',
                fontSize: '4.2rem',
                fontWeight: '900',
                fontStyle: 'italic',
                color: '#FFFFFF',
                lineHeight: 0.84,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                textShadow: '0 6px 25px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.6)'
              }}>
                DRIVER<br />
                OF THE<br />
                DAY
              </div>

              {/* Sub-row: HOST RACE COUNTRY FLAG + GP LOCATION NAME */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '20px',
                background: 'rgba(0,0,0,0.55)',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '8px 18px',
                borderRadius: '8px',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.6)'
              }}>
                <FlagIcon countryCode={hostCountry.code} style={{ width: '28px', height: '19px', borderRadius: '3px', boxShadow: '0 2px 8px rgba(0,0,0,0.6)' }} />
                <span style={{ fontSize: '1.15rem', fontWeight: '900', color: '#FFF', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-f1)' }}>
                  {hostCountry.name}
                </span>
                {posDiff > 0 && (
                  <span style={{ background: '#10B981', color: '#FFF', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '900' }}>
                    ▲ +{posDiff} POS
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Right: Team Logo + Driver Full Name */}
            <div>
              {/* Team Logo / Badge */}
              {team.logo && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
                  <img src={team.logo} alt={team.name} style={{ height: '32px', objectFit: 'contain', filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.6))' }} />
                </div>
              )}

              {/* Driver Full Name */}
              <div style={{
                fontFamily: 'var(--font-f1)',
                fontSize: '3rem',
                fontWeight: '900',
                fontStyle: 'italic',
                color: '#FFFFFF',
                lineHeight: 0.9,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                textShadow: '0 4px 20px rgba(0,0,0,0.8)'
              }}>
                {driver.name}
              </div>

              <div style={{
                fontSize: '0.95rem',
                fontWeight: '800',
                color: 'rgba(255,255,255,0.95)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginTop: '4px'
              }}>
                {team.name}
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
