import React from 'react';
import FlagIcon from './FlagIcon';

export default function F1PodiumShowcase({ raceTitle, fullResults }) {
  if (!fullResults || fullResults.length < 3) return null;

  const first = fullResults[0];
  const second = fullResults[1];
  const third = fullResults[2];

  return (
    <div style={{
      width: '100%',
      aspectRatio: '16 / 9',
      minHeight: '480px',
      background: '#131620',
      backgroundImage: `
        linear-gradient(135deg, rgba(22, 26, 38, 0.98) 0%, rgba(10, 12, 18, 0.99) 100%),
        repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0, rgba(255,255,255,0.015) 12px, transparent 12px, transparent 24px)
      `,
      borderRadius: '16px',
      border: '3px solid #282E40',
      padding: '24px 30px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 30px 70px rgba(0,0,0,0.9)',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
      color: '#FFF',
      marginBottom: '24px'
    }}>
      {/* Background Red Ambient Glow behind Winner */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(225,6,0,0.22) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Top Header Bar with WHITE Background for Red F1 Logo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 }}>
        <div style={{
          background: '#FFFFFF',
          padding: '6px 14px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 4px 14px rgba(255,255,255,0.3)'
        }}>
          <img src="/F1-logo.png" alt="F1" style={{ height: '18px', objectFit: 'contain' }} />
        </div>

        <div style={{
          fontFamily: 'var(--font-f1)',
          fontSize: '1.2rem',
          fontWeight: '900',
          fontStyle: 'italic',
          color: '#FFF',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          FORMULA 1 • {raceTitle.toUpperCase()}
        </div>

        <div style={{
          background: '#FFFFFF',
          padding: '6px 14px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 4px 14px rgba(255,255,255,0.3)'
        }}>
          <img src="/F1-logo.png" alt="F1" style={{ height: '18px', objectFit: 'contain' }} />
        </div>
      </div>

      {/* 2ND PLACE TEXT (Top Left) */}
      <div style={{ position: 'absolute', top: '16%', left: '5%', zIndex: 10 }}>
        <div style={{ fontFamily: 'var(--font-f1)', fontSize: '3.6rem', fontWeight: '900', color: '#FFF', lineHeight: 0.9, textShadow: '0 4px 12px rgba(0,0,0,0.9)' }}>
          2<span style={{ fontSize: '1.6rem', verticalAlign: 'top', fontStyle: 'italic' }}>ND</span>
        </div>
        <div style={{ marginTop: '4px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#D1D5DB' }}>
            {second.driver.name.split(' ')[0]}
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: second.team.color, textTransform: 'uppercase', fontStyle: 'italic', lineHeight: 1 }}>
            {second.driver.name.split(' ').slice(1).join(' ') || second.driver.name}
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', marginTop: '2px' }}>
            {second.team.name}
          </div>
        </div>
      </div>

      {/* 3RD PLACE TEXT (Top Right) */}
      <div style={{ position: 'absolute', top: '16%', right: '5%', textAlign: 'right', zIndex: 10 }}>
        <div style={{ fontFamily: 'var(--font-f1)', fontSize: '3.6rem', fontWeight: '900', color: '#FFF', lineHeight: 0.9, textShadow: '0 4px 12px rgba(0,0,0,0.9)' }}>
          3<span style={{ fontSize: '1.6rem', verticalAlign: 'top', fontStyle: 'italic' }}>RD</span>
        </div>
        <div style={{ marginTop: '4px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#D1D5DB' }}>
            {third.driver.name.split(' ')[0]}
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: third.team.color, textTransform: 'uppercase', fontStyle: 'italic', lineHeight: 1 }}>
            {third.driver.name.split(' ').slice(1).join(' ') || third.driver.name}
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', marginTop: '2px' }}>
            {third.team.name}
          </div>
        </div>
      </div>

      {/* 3D LAYERED STANDING DRIVER CUTOUTS */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: '10%', zIndex: 2, pointerEvents: 'none' }}>
        {/* Layer 2: 2nd Place Driver (Left - Shifted 1/4 outwards) */}
        {second.driver.avatar && (
          <img
            src={second.driver.avatar}
            alt={second.driver.name}
            style={{
              position: 'absolute',
              left: '2%',
              bottom: 0,
              height: '75%',
              objectFit: 'contain',
              zIndex: 2,
              filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.95))'
            }}
          />
        )}

        {/* Layer 2: 3rd Place Driver (Right - Shifted 1/4 outwards) */}
        {third.driver.avatar && (
          <img
            src={third.driver.avatar}
            alt={third.driver.name}
            style={{
              position: 'absolute',
              right: '2%',
              bottom: 0,
              height: '75%',
              objectFit: 'contain',
              zIndex: 2,
              filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.95))'
            }}
          />
        )}

        {/* Layer 4: 1st Place WINNER (Center - 1.4x LARGER foreground!) */}
        {first.driver.avatar && (
          <img
            src={first.driver.avatar}
            alt={first.driver.name}
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%) scale(1.4)',
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

      {/* FOREGROUND OVERLAY TYPOGRAPHY */}
      <div style={{
        position: 'absolute',
        bottom: '6%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 15,
        width: '100%',
        pointerEvents: 'none'
      }}>
        {/* Giant WINNER Title */}
        <div style={{
          fontFamily: 'var(--font-f1)',
          fontSize: '5.2rem',
          fontWeight: '900',
          fontStyle: 'italic',
          color: '#FFFFFF',
          lineHeight: 0.85,
          letterSpacing: '4px',
          textShadow: '0 8px 30px rgba(0,0,0,0.95), 0 0 25px rgba(0,0,0,0.95)'
        }}>
          WINNER
        </div>

        {/* Cursive / Handwritten Script Accent */}
        <div style={{
          fontFamily: 'cursive, sans-serif',
          fontSize: '1.9rem',
          color: '#FFD700',
          marginTop: '-18px',
          marginBottom: '-6px',
          textShadow: '0 4px 12px rgba(0,0,0,0.95)',
          fontWeight: '700'
        }}>
          {first.driver.name}
        </div>

        {/* Driver Surname in Bold Team Color */}
        <div style={{
          fontFamily: 'var(--font-f1)',
          fontSize: '2.8rem',
          fontWeight: '900',
          color: first.team.accentColor || '#FF8000',
          textTransform: 'uppercase',
          lineHeight: 1,
          textShadow: '0 6px 20px rgba(0,0,0,0.95)',
          letterSpacing: '1px'
        }}>
          {first.driver.name.split(' ').pop()}
        </div>

        {/* Team Name */}
        <div style={{
          fontSize: '1rem',
          fontWeight: '800',
          color: '#FFF',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginTop: '2px',
          textShadow: '0 2px 8px rgba(0,0,0,0.9)'
        }}>
          {first.team.name}
        </div>
      </div>
    </div>
  );
}
