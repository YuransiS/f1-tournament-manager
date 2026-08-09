import React from 'react';
import { User, Shield, AlertOctagon, Trophy, Zap, Flag } from 'lucide-react';
import FlagIcon from './FlagIcon';

export default function DriversView({ drivers, teams, standings, penalties }) {
  const standingsMap = {};
  standings.driverStandings.forEach(s => {
    standingsMap[s.driver.id] = s;
  });

  return (
    <div>
      <div className="card-header">
        <h2 className="card-title">
          <User className="card-title-icon" size={24} />
          F1 DRIVER SPOTLIGHT • РЕЕСТР ПИЛОТОВ
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Всего пилотов: {drivers.length} ({drivers.filter(d => !d.isAi).length} реальных игроков)
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {drivers.map(driver => {
          const team = teams.find(t => t.id === driver.teamId) || { name: 'Без команды', color: '#666' };
          const stats = standingsMap[driver.id] || { totalPoints: 0, wins: 0, podiums: 0, fastestLaps: 0 };
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

              {/* Large Portrait Showcase Header */}
              <div style={{
                position: 'relative',
                height: '240px',
                background: `radial-gradient(circle at 50% 30%, ${team.color}40 0%, transparent 80%)`,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {driver.avatar ? (
                  <img
                    src={driver.avatar}
                    alt={driver.name}
                    style={{
                      height: '230px',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.8))',
                      maskImage: 'linear-gradient(to top, transparent 0%, black 15%)',
                      WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 15%)'
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '6rem' }}>🏎️</div>
                )}

                {/* Player Tag */}
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  {isPlayer ? (
                    <span className="player-badge" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>🎮 Игрок</span>
                  ) : (
                    <span className="ai-badge" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>🤖 AI</span>
                  )}
                </div>

                {/* Country Flag */}
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <FlagIcon countryCode={driver.country} style={{ width: '28px', height: '18px' }} />
                </div>
              </div>

              {/* Driver Details Body */}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#FFF', letterSpacing: '0.5px' }}>
                      {driver.name}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: team.color, fontWeight: '700', textTransform: 'uppercase' }}>
                      {team.name}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', uppercase: 'true' }}>ОЧКИ</div>
                    <div className="pts-badge" style={{ fontSize: '1.1rem', padding: '2px 10px' }}>
                      {stats.totalPoints}
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '8px',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '12px 8px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  marginTop: '16px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ПОБЕДЫ</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: stats.wins > 0 ? '#FFD700' : 'var(--text-main)' }}>
                      {stats.wins}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ПОДИУМЫ</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFF' }}>
                      {stats.podiums}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>БЫСТР. КРУГИ</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--purple-lap)' }}>
                      {stats.fastestLaps}
                    </div>
                  </div>
                </div>

                {driverPenalties.length > 0 && (
                  <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)', padding: '8px 10px', borderRadius: '6px' }}>
                    <AlertOctagon size={12} style={{ display: 'inline', marginRight: '6px' }} />
                    Штрафы: {driverPenalties.map(p => `${p.reason} (${p.type === 'TIME' ? `+${p.value}s` : `-${p.value} очков`})`).join(', ')}
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
