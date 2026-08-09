import React, { useState } from 'react';
import { Trophy, Shield, User, Bot, AlertTriangle, Zap } from 'lucide-react';
import FlagIcon from './FlagIcon';
import F1StandingsBroadcastCard from './F1StandingsBroadcastCard';

export default function StandingsView({ driverStandings, constructorStandings }) {
  const [subTab, setSubTab] = useState('drivers'); // 'drivers' | 'constructors'

  return (
    <div>
      {/* Sub-Tab Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div className="nav-tabs" style={{ background: 'transparent', padding: 0 }}>
          <button
            className={`nav-btn ${subTab === 'drivers' ? 'active' : ''}`}
            onClick={() => setSubTab('drivers')}
            style={{ padding: '8px 20px', fontSize: '1rem', fontWeight: '800' }}
          >
            <User size={18} /> Зачёт Пилотов (Drivers Championship)
          </button>
          <button
            className={`nav-btn ${subTab === 'constructors' ? 'active' : ''}`}
            onClick={() => setSubTab('constructors')}
            style={{ padding: '8px 20px', fontSize: '1rem', fontWeight: '800' }}
          >
            <Shield size={18} /> Зачёт Команд (Кубок Конструкторов)
          </button>
        </div>
      </div>

      {subTab === 'drivers' ? (
        /* Single Drivers Championship Leaderboard Card with Export */
        <F1StandingsBroadcastCard driverStandings={driverStandings} />
      ) : (
        /* Constructors Championship Table with Official Team Logos */
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', background: 'linear-gradient(90deg, #161922 0%, #1F2432 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px' }}>
                FORMULA 1 2026
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '900', fontStyle: 'italic', color: '#FFF' }}>
                КУБОК КОНСТРУКТОРОВ (Constructors Championship)
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--f1-gold)', fontWeight: '800' }}>
                ЛИДЕР: {constructorStandings[0]?.team.name} ({constructorStandings[0]?.totalPoints} PTS)
              </div>
            </div>
          </div>

          <div className="f1-table-wrapper">
            <table className="f1-table">
              <thead>
                <tr>
                  <th style={{ width: '60px', textAlign: 'center' }}>ПОЗ</th>
                  <th>КОМАНДА / КОНСТРУКТОР</th>
                  <th>ПИЛОТЫ КОМАНДЫ</th>
                  <th style={{ textAlign: 'center' }}>ПОБЕДЫ</th>
                  <th style={{ textAlign: 'center' }}>ПОДИУМЫ</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>СУММА ОЧКОВ</th>
                </tr>
              </thead>
              <tbody>
                {constructorStandings.map((item, index) => {
                  const pos = index + 1;
                  return (
                    <tr key={item.team.id}>
                      <td className={`pos-cell pos-${pos}`} style={{ textAlign: 'center', fontWeight: '900', fontSize: '1.1rem' }}>
                        {pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : pos}
                      </td>
                      <td>
                        <div className="team-cell" style={{ gap: '14px' }}>
                          <span className="team-stripe" style={{ backgroundColor: item.team.color, height: '36px', width: '5px' }} />
                          {item.team.logo && (
                            <img
                              src={item.team.logo}
                              alt={item.team.name}
                              style={{ height: '24px', maxWidth: '36px', objectFit: 'contain', filter: 'brightness(1.1)' }}
                            />
                          )}
                          <div>
                            <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#FFF' }}>{item.team.name}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                          {item.drivers.map(d => (
                            <span key={d.id} style={{ fontSize: '0.85rem', background: 'rgba(255,255,255,0.06)', padding: '5px 10px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
                              <FlagIcon countryCode={d.country} />
                              <span style={{ fontWeight: '700', color: '#FFF' }}>{d.name}</span>
                              {!d.isAi && <span style={{ color: '#38BDF8', fontSize: '0.75rem' }}>🎮</span>}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '800', fontSize: '1rem', color: item.wins > 0 ? '#FFD700' : 'var(--text-dark)' }}>
                        {item.wins}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '700', fontSize: '1rem' }}>{item.podiums}</td>
                      <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                        <span className={`pts-badge ${item.totalPoints === 0 ? 'zero' : ''}`} style={{ fontSize: '1.1rem', padding: '6px 14px' }}>
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
      )}
    </div>
  );
}
