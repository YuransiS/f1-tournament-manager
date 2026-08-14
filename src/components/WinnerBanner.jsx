import React, { useEffect } from 'react';
import { Trophy, Flame, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import FlagIcon from './FlagIcon';

export default function WinnerBanner({ driverStandings, races }) {
  if (!driverStandings || driverStandings.length === 0) return null;

  const leader = driverStandings[0];
  const lastRace = races && races.length > 0 ? races[races.length - 1] : null;

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.15 },
        colors: ['#E10600', '#FFD700', '#00A19B', '#FFFFFF']
      });
    } catch (e) {
      // ignore
    }
  }, [leader.driver.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="winner-banner"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(225,6,0,0.2) 0%, rgba(20,24,35,0.95) 50%, rgba(255,215,0,0.15) 100%)',
        border: '2px solid rgba(255, 215, 0, 0.4)',
        boxShadow: '0 12px 35px rgba(225,6,0,0.25), inset 0 0 20px rgba(255,215,0,0.1)'
      }}
    >
      {/* Moving F1 Speed Lines Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 10px, transparent 10px, transparent 20px)',
        pointerEvents: 'none'
      }} />

      <div className="winner-info" style={{ zIndex: 5, position: 'relative' }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="winner-crown"
          style={{ filter: 'drop-shadow(0 0 16px rgba(255,215,0,0.8))' }}
        >
          🏆
        </motion.div>

        <div>
          <div style={{ fontSize: '0.75rem', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> ЛИДЕР ЧЕМПИОНАТА ФОРМУЛЫ-1 2026
          </div>
          <div className="winner-name" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.6rem', fontWeight: '900' }}>
            <FlagIcon countryCode={leader.driver.country} style={{ width: '28px', height: '18px' }} />
            <span style={{ color: '#FFF', fontStyle: 'italic' }}>{leader.driver.name}</span>
            {!leader.driver.isAi ? (
              <span className="player-badge" style={{ fontSize: '0.7rem', padding: '3px 8px', background: '#0284C7' }}>PLAYER</span>
            ) : (
              <span className="ai-badge" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>AI</span>
            )}
          </div>
          <div className="winner-team" style={{ fontSize: '0.92rem', marginTop: '2px' }}>
            <span
              className="team-stripe"
              style={{ backgroundColor: leader.team.color, marginRight: '8px', width: '6px', height: '18px', verticalAlign: 'middle' }}
            />
            <strong style={{ color: leader.team.color }}>{leader.team.name}</strong> • <span style={{ color: '#FFD700', fontWeight: '800' }}>{leader.totalPoints} ОЧКОВ</span> ({leader.wins} побед, {leader.podiums} подиумов)
          </div>
        </div>
      </div>

      {lastRace && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: '20px', alignItems: 'center', zIndex: 5, position: 'relative' }}
        >
          <div style={{ textAlign: 'right', background: 'rgba(0,0,0,0.4)', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800' }}>
              ПОСЛЕДНИЙ ПРОВЕДЁННЫЙ ЭТАП
            </div>
            <div style={{ fontWeight: '900', fontSize: '1.05rem', color: '#FFF', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
              <Flame size={16} style={{ color: 'var(--f1-red)' }} />
              {lastRace.title}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: '700', marginTop: '2px' }}>
              ✓ Результаты утверждены ФИА
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
