import React from 'react';
import { Flame, Sparkles, Calendar, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import FlagIcon from './FlagIcon';
import { DRIVER_NUMBER_MAP } from '../utils/f1CircuitHelper';

export default function WinnerBanner({ driverStandings, races, activeSeason = '2027-1', onNavigateTab, onOpenSeasonModal }) {
  if (activeSeason === '2027-1') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="winner-banner"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(225,6,0,0.25) 0%, rgba(18,21,32,0.96) 50%, rgba(0,210,190,0.18) 100%)',
          border: '2px solid rgba(225, 6, 0, 0.45)',
          boxShadow: '0 12px 35px rgba(225,6,0,0.22)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '16px 22px'
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0, rgba(255,255,255,0.02) 10px, transparent 10px, transparent 20px)',
          pointerEvents: 'none'
        }} />

        <div style={{ zIndex: 5, position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src="/portraits/kolya_champion_victory.jpg"
              alt="Reigning Champion"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '14px',
                objectFit: 'cover',
                objectPosition: 'center 15%',
                border: '2px solid #FFD700',
                boxShadow: '0 0 18px rgba(255, 215, 0, 0.6)'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              fontSize: '1.1rem',
              filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.9))'
            }}>
              👑
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: '900',
                background: '#E10600',
                color: '#FFF',
                padding: '2px 8px',
                borderRadius: '4px',
                letterSpacing: '1px'
              }}>
                НОВЫЙ СЕЗОН 2027-1
              </span>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: '800',
                background: 'rgba(0, 210, 190, 0.15)',
                color: '#00D2BE',
                border: '1px solid rgba(0, 210, 190, 0.35)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                ⚡ ЭТАП 1: ГРАН-ПРИ АВСТРИИ (СПРИНТ)
              </span>
            </div>

            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#FFF', fontStyle: 'italic', marginTop: '4px' }}>
              СТАРТ ЧЕМПИОНАТА МИРА 2027-1
            </div>

            <div style={{ fontSize: '0.82rem', color: '#D1D5DB', marginTop: '2px' }}>
              Действующий чемпион <strong style={{ color: '#FFD700' }}>Микола Ярема (#67 Red Bull)</strong> защищает титул против Юрия Захарчука (#69 Mercedes) и Дениса Коваленко (#88 Red Bull).
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', zIndex: 5, position: 'relative' }}>
          {onNavigateTab && (
            <>
              <button
                type="button"
                onClick={() => onNavigateTab('starting-grid')}
                className="btn btn-sm"
                style={{
                  background: '#E10600',
                  color: '#FFF',
                  border: 'none',
                  fontWeight: '800',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Zap size={15} /> Starting Grid Австрии
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('calendar')}
                className="btn btn-sm"
                style={{
                  background: '#1A2133',
                  color: '#38BDF8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  fontWeight: '800',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Calendar size={15} /> Календарь 23 этапов
              </button>
            </>
          )}

          {onOpenSeasonModal && (
            <button
              type="button"
              onClick={onOpenSeasonModal}
              className="btn btn-sm"
              style={{
                background: 'rgba(255, 215, 0, 0.12)',
                color: '#FFD700',
                border: '1px solid rgba(255, 215, 0, 0.4)',
                fontWeight: '800',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              title="Открыть архив 2026 и центр перехода"
            >
              🏆 Архив 2026
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  const leader = driverStandings && driverStandings.length > 0 ? driverStandings[0] : null;
  const runnerUp = driverStandings && driverStandings.length > 1 ? driverStandings[1] : null;
  const thirdPlace = driverStandings && driverStandings.length > 2 ? driverStandings[2] : null;
  const lastRace = races && races.length > 0 ? races[races.length - 1] : null;
  const isChampionSealed = leader && runnerUp ? ((leader.totalPoints - runnerUp.totalPoints) > 26) : false;

  if (!leader) return null;

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

      <div className="winner-info" style={{ zIndex: 5, position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isChampionSealed ? (
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src="/portraits/kolya_champion_victory.jpg"
              alt="Champion Victory"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '14px',
                objectFit: 'cover',
                objectPosition: 'center 15%',
                border: '2px solid #FFD700',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.7)'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              fontSize: '1.1rem',
              filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.9))'
            }}>
              👑
            </div>
          </div>
        ) : (
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="winner-crown"
            style={{ filter: 'drop-shadow(0 0 16px rgba(255,215,0,0.8))' }}
          >
            🏆
          </motion.div>
        )}

        <div>
          <div style={{ fontSize: '0.75rem', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> {isChampionSealed ? 'ЧЕМПИОН МИРА ФОРМУЛЫ-1 2026 👑 (ДОСРОЧНО)' : 'ЛИДЕР ЧЕМПИОНАТА ФОРМУЛЫ-1 2026'}
          </div>
          <div className="winner-name" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.6rem', fontWeight: '900' }}>
            <FlagIcon countryCode={leader.driver.country} style={{ width: '28px', height: '18px' }} />
            <span style={{ color: '#FFF', fontStyle: 'italic' }}>{leader.driver.name}</span>
            <span style={{
              fontSize: '1rem',
              fontWeight: '900',
              fontStyle: 'italic',
              color: leader.team.color || '#FFD700',
              fontFamily: 'Titillium Web, sans-serif',
              background: 'rgba(255,255,255,0.08)',
              padding: '2px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.15)'
            }}>
              #{DRIVER_NUMBER_MAP[leader.driver.id] || leader.driver.driverNumber || ''}
            </span>
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

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', zIndex: 5 }}>
        {runnerUp && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(0, 210, 190, 0.1)',
            border: '1px solid rgba(0, 210, 190, 0.35)',
            padding: '8px 14px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0, 210, 190, 0.15)'
          }}>
            <div style={{ position: 'relative' }}>
              <img
                src="/portraits/yura_vice_champion_wide.jpg"
                alt="Vice Champion"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  objectPosition: 'center 15%',
                  border: '1.5px solid #00D2BE'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                fontSize: '0.85rem'
              }}>
                🥈
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.62rem', color: '#00D2BE', fontWeight: '900', letterSpacing: '1px' }}>
                ВИЦЕ-ЧЕМПИОН (ДОСРОЧНО)
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: '900', color: '#FFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{runnerUp.driver.name}</span>
                <span style={{ fontSize: '0.8rem', color: '#00D2BE', fontFamily: 'Titillium Web, sans-serif' }}>
                  #{DRIVER_NUMBER_MAP[runnerUp.driver.id] || runnerUp.driver.driverNumber || ''}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                <span style={{ color: '#00D2BE', fontWeight: '800' }}>{runnerUp.totalPoints} PTS</span> • {runnerUp.wins} побед
              </div>
            </div>
          </div>
        )}

        {thirdPlace && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(217, 119, 6, 0.1)',
            border: '1px solid rgba(217, 119, 6, 0.35)',
            padding: '8px 14px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(217, 119, 6, 0.15)'
          }}>
            <div style={{ position: 'relative' }}>
              <img
                src="/portraits/denis_bronze_champion_wide.jpg"
                alt="Bronze Medalist"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  objectPosition: 'center 15%',
                  border: '1.5px solid #D97706'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                fontSize: '0.85rem'
              }}>
                🥉
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.62rem', color: '#F59E0B', fontWeight: '900', letterSpacing: '1px' }}>
                БРОНЗОВЫЙ ПРИЗЁР (ДОСРОЧНО)
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: '900', color: '#FFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{thirdPlace.driver.name}</span>
                <span style={{ fontSize: '0.8rem', color: '#F59E0B', fontFamily: 'Titillium Web, sans-serif' }}>
                  #{DRIVER_NUMBER_MAP[thirdPlace.driver.id] || thirdPlace.driver.driverNumber || ''}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                <span style={{ color: '#F59E0B', fontWeight: '800' }}>{thirdPlace.totalPoints} PTS</span> • {thirdPlace.wins} побед
              </div>
            </div>
          </div>
        )}
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
