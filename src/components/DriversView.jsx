import React from 'react';
import { User, Shield, AlertOctagon, Trophy, Zap, Flag } from 'lucide-react';
import FlagIcon from './FlagIcon';

export default function DriversView({ drivers, teams, standings, penalties }) {
  const standingsMap = {};
  standings.driverStandings.forEach((s, idx) => {
    standingsMap[s.driver.id] = { ...s, rank: idx + 1 };
  });

  // Sort drivers by points descending (then wins, then podiums)
  const sortedDrivers = [...drivers].sort((a, b) => {
    const statsA = standingsMap[a.id]?.totalPoints || 0;
    const statsB = standingsMap[b.id]?.totalPoints || 0;
    if (statsB !== statsA) return statsB - statsA;
    const winsA = standingsMap[a.id]?.wins || 0;
    const winsB = standingsMap[b.id]?.wins || 0;
    if (winsB !== winsA) return winsB - winsA;
    const podA = standingsMap[a.id]?.podiums || 0;
    const podB = standingsMap[b.id]?.podiums || 0;
    return podB - podA;
  });

  return (
    <div>
      <div className="card-header">
        <h2 className="card-title">
          <User className="card-title-icon" size={24} />
          F1 DRIVER SPOTLIGHT • РЕЕСТР ПИЛОТОВ
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Всего пилотов: {drivers.length} ({drivers.filter(d => !d.isAi).length} реальных игроков) • Сортировка по очкам (P1 - P{drivers.length})
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {sortedDrivers.map(driver => {
          const team = teams.find(t => t.id === driver.teamId) || { name: 'Без команды', color: '#666' };
          const stats = standingsMap[driver.id] || { totalPoints: 0, wins: 0, podiums: 0, fastestLaps: 0, rank: '-' };
          const driverPenalties = penalties.filter(p => p.driverId === driver.id);
          const isPlayer = !driver.isAi;

          return (
            <div
              key={driver.id}
              className="card"
              style={{
                padding: 0,
                marginBottom: 0,
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, #181C26 0%, #11141C 100%)',
                border: isPlayer ? '1px solid #0284C7' : '1px solid var(--border-color)',
                boxShadow: isPlayer ? '0 10px 30px rgba(2, 132, 199, 0.2)' : '0 4px 16px rgba(0,0,0,0.4)'
              }}
            >
              {/* Top Livery Accent Bar */}
              <div style={{ height: '6px', backgroundColor: team.color }} />

              {/* Large Portrait Showcase Header with clean blend logo background */}
              <div style={{
                position: 'relative',
                height: '240px',
                background: `radial-gradient(circle at 50% 30%, ${team.color}35 0%, transparent 85%)`,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {/* Perfectly Centered & Uniform Background Team Watermark */}
                {team.logo && (
                  <div style={{
                    position: 'absolute',
                    top: '36%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '82%',
                    height: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}>
                    <img
                      src={team.logo}
                      alt=""
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        opacity: 0.22,
                        mixBlendMode: 'screen',
                        filter: 'contrast(1.4) brightness(1.3) drop-shadow(0 0 20px rgba(255,255,255,0.06))'
                      }}
                    />
                  </div>
                )}

                {/* Standing Driver Portrait */}
                {driver.avatar ? (
                  <img
                    src={driver.avatar}
                    alt={driver.name}
                    style={{
                      height: '100%',
                      maxHeight: '230px',
                      objectFit: 'contain',
                      zIndex: 2,
                      filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.85))'
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '4rem', marginBottom: '20px', zIndex: 2 }}>🏎️</div>
                )}

                {/* Rank Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: stats.rank === 1 ? '#FFD700' : stats.rank === 2 ? '#C0C0C0' : stats.rank === 3 ? '#CD7F32' : 'rgba(0,0,0,0.6)',
                  color: stats.rank <= 3 ? '#000' : '#FFF',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontWeight: '900',
                  fontSize: '0.85rem',
                  zIndex: 3,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
                }}>
                  P{stats.rank}
                </div>

                {/* Player Badge */}
                {isPlayer && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#0284C7',
                    color: '#FFF',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: '800',
                    fontSize: '0.75rem',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    zIndex: 3,
                    boxShadow: '0 4px 10px rgba(2, 132, 199, 0.4)'
                  }}>
                    PLAYER
                  </div>
                )}
              </div>

              {/* Driver Details Body */}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <FlagIcon countryCode={driver.country} style={{ width: '20px', height: '14px', borderRadius: '2px' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    {driver.country}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '6px', color: '#FFF' }}>
                  {driver.name}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span className="team-stripe" style={{ backgroundColor: team.color, width: '12px', height: '12px' }} />
                  <span style={{ fontSize: '0.85rem', color: team.color, fontWeight: '700' }}>
                    {team.name}
                  </span>
                </div>

                {/* Driver Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Очки</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--f1-gold)' }}>{stats.totalPoints}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Победы</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#FFF' }}>{stats.wins}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Подиумы</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#FFF' }}>{stats.podiums}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Быстрые круги</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#FFF' }}>{stats.fastestLaps}</div>
                  </div>
                </div>

                {/* Penalties Notice */}
                {driverPenalties.length > 0 && (
                  <div style={{ marginTop: '12px', fontSize: '0.8rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertOctagon size={14} />
                    <span>Штрафов: {driverPenalties.length}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
