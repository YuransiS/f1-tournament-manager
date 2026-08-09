import React, { useRef, useState } from 'react';
import { Camera, Trophy } from 'lucide-react';
import { toPng } from 'html-to-image';
import FlagIcon from './FlagIcon';

export default function F1StandingsBroadcastCard({ driverStandings, subtitleLabel = 'ТЕКУЩИЙ ЗАЧЕТ' }) {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!driverStandings || driverStandings.length === 0) return null;

  const leader = driverStandings[0];

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.98, cacheBust: true });
      const link = document.createElement('a');
      link.download = `F1_Drivers_Championship_Standings_${subtitleLabel.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export standings photo:', err);
      alert('Ошибка экспорта скриншота таблицы зачёта!');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: '900', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={22} style={{ color: 'var(--f1-gold)' }} />
          Личный Зачёт Пилотов (Drivers Championship)
        </h3>
        <button
          className="btn btn-primary"
          onClick={handleDownload}
          disabled={isExporting}
          style={{ boxShadow: '0 4px 16px rgba(225,6,0,0.6)', padding: '10px 20px', fontWeight: '800', fontSize: '0.95rem' }}
        >
          <Camera size={18} /> {isExporting ? 'Экспорт PNG...' : '📸 Скачать Скриншот Таблицы (PNG)'}
        </button>
      </div>

      {/* Target Container for PNG Export */}
      <div
        ref={cardRef}
        style={{
          background: '#0B0D13',
          borderRadius: '16px',
          border: '3px solid #282E40',
          padding: '24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
        }}
      >
        {/* F1 Header Banner */}
        <div style={{
          background: 'linear-gradient(90deg, #161922 0%, #1F2432 100%)',
          padding: '16px 24px',
          borderRadius: '12px',
          borderBottom: '4px solid var(--f1-red)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              background: '#FFFFFF',
              padding: '8px 20px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 4px 16px rgba(255,255,255,0.3)'
            }}>
              <img src="/F1-logo.png" alt="F1" style={{ height: '26px', objectFit: 'contain' }} />
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--f1-red)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '1px' }}>
                SEASON 2026 • {subtitleLabel.toUpperCase()}
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '900', fontStyle: 'italic', letterSpacing: '1px', color: '#FFF' }}>
                FORMULA 1 DRIVERS CHAMPIONSHIP
              </h1>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px' }}>
              ЛИДЕР ЧЕМПИОНАТА
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--f1-gold)', fontStyle: 'italic' }}>
              {leader.driver.name} ({leader.totalPoints} PTS)
            </div>
          </div>
        </div>

        {/* Layout: Wider Left Leader Portrait Box + Right Full Standings Table */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'stretch' }}>
          {/* Left Championship Leader Spotlight (Wider & Larger Photo!) */}
          <div style={{
            background: 'linear-gradient(180deg, #181C28 0%, #0F121B 100%)',
            borderRadius: '14px',
            border: '2px solid rgba(255,215,0,0.4)',
            padding: '24px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 15px 35px rgba(0,0,0,0.6)'
          }}>
            <div>
              <div style={{
                background: 'rgba(255, 215, 0, 0.15)',
                color: 'var(--f1-gold)',
                border: '1px solid rgba(255, 215, 0, 0.4)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '800',
                display: 'inline-block',
                marginBottom: '14px',
                letterSpacing: '1px'
              }}>
                🏆 CHAMPIONSHIP LEADER
              </div>

              {/* Leader Photo (Scaled Larger) */}
              <div style={{ position: 'relative', height: '260px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', margin: '14px 0' }}>
                {leader.driver.avatar ? (
                  <img
                    src={leader.driver.avatar}
                    alt={leader.driver.name}
                    style={{
                      height: '250px',
                      maxHeight: '115%',
                      objectFit: 'contain',
                      transform: 'scale(1.15)',
                      transformOrigin: 'bottom center',
                      filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.95))'
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '5rem' }}>🏆</div>
                )}
              </div>

              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#FFF', textTransform: 'uppercase', fontStyle: 'italic', lineHeight: 1.1 }}>
                {leader.driver.name}
              </div>
              <div style={{ fontSize: '0.9rem', color: leader.team.color, fontWeight: '800', textTransform: 'uppercase', marginTop: '4px' }}>
                {leader.team.name}
              </div>
            </div>

            <div style={{
              background: 'var(--f1-red)',
              color: '#FFF',
              padding: '10px 16px',
              borderRadius: '8px',
              fontWeight: '900',
              fontSize: '1.1rem',
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '10px',
              boxShadow: '0 4px 15px rgba(225,6,0,0.5)'
            }}>
              <FlagIcon countryCode={leader.driver.country} style={{ width: '26px', height: '17px' }} />
              <span>{leader.totalPoints} POINTS</span>
            </div>
          </div>

          {/* Right Standings Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', background: '#0F1117', border: '1px solid var(--border-color)', marginBottom: 0 }}>
            <div className="f1-table-wrapper">
              <table className="f1-table">
                <thead>
                  <tr>
                    <th style={{ width: '45px', textAlign: 'center' }}>POS</th>
                    <th>DRIVER</th>
                    <th>TEAM</th>
                    <th style={{ textAlign: 'center' }}>RACES</th>
                    <th style={{ textAlign: 'center' }}>WINS</th>
                    <th style={{ textAlign: 'center' }}>PODIUMS</th>
                    <th style={{ textAlign: 'right', paddingRight: '16px' }}>PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {driverStandings.map((item, index) => {
                    const pos = index + 1;
                    const isPlayer = !item.driver.isAi;
                    return (
                      <tr key={item.driver.id} className={isPlayer ? 'real-player-row' : ''}>
                        <td className={`pos-cell pos-${pos}`}>
                          {pos}
                        </td>
                        <td>
                          <div className="driver-cell">
                            {item.driver.avatar ? (
                              <img
                                src={item.driver.avatar}
                                alt={item.driver.name}
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  border: isPlayer ? '2px solid #0284C7' : '1px solid var(--border-color)'
                                }}
                              />
                            ) : null}
                            <FlagIcon countryCode={item.driver.country} />
                            <div className="driver-name">
                              {item.driver.name}
                              {isPlayer ? <span className="player-badge">Player</span> : <span className="ai-badge">AI</span>}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="team-cell">
                            <span className="team-stripe" style={{ backgroundColor: item.team.color }} />
                            {item.team.name}
                          </div>
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: '600' }}>{item.racesCount}</td>
                        <td style={{ textAlign: 'center', fontWeight: '700', color: item.wins > 0 ? '#FFD700' : 'var(--text-dark)' }}>{item.wins}</td>
                        <td style={{ textAlign: 'center', fontWeight: '600' }}>{item.podiums}</td>
                        <td style={{ textAlign: 'right', paddingRight: '16px' }}>
                          <span className={`pts-badge ${item.totalPoints === 0 ? 'zero' : ''}`}>
                            {item.totalPoints}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
