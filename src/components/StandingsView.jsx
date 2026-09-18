import React, { useState, useMemo } from 'react';
import { Shield, User, TrendingUp } from 'lucide-react';
import FlagIcon from './FlagIcon';
import TeamLogo from './TeamLogo';
import F1StandingsBroadcastCard from './F1StandingsBroadcastCard';
import F1MonzaEmergencyAnnouncement from './F1MonzaEmergencyAnnouncement';
import F1WilliamsMercedesAnnouncement from './F1WilliamsMercedesAnnouncement';
import F1PointsProgressionChart from './F1PointsProgressionChart';
import { calculateStandings, calculatePointsProgression } from '../services/storage';

export default function StandingsView({ data, standings: propStandings, activeTab: propActiveTab, onTabChange, onNavigateTab }) {
  const [internalTab, setInternalTab] = useState('drivers');
  const [showInlineChart, setShowInlineChart] = useState(false);
  const activeTab = propActiveTab || internalTab;
  const handleTabChange = onTabChange || setInternalTab;

  const standings = propStandings || (data ? calculateStandings(data) : { driverStandings: [], constructorStandings: [] });
  const { driverStandings = [], constructorStandings = [] } = standings;

  const progressionData = useMemo(() => {
    return data ? calculatePointsProgression(data) : null;
  }, [data]);

  return (
    <div>
      {/* 0. Monza GP Breaking: Denys Illness & Vadim Manstein Debut Podium */}
      <F1MonzaEmergencyAnnouncement />

      {/* 1. Official Williams-Mercedes Sale Breaking Announcement */}
      <F1WilliamsMercedesAnnouncement />

      {/* 2. Broadcast TV 16:9 Standings Graphic Card */}
      <F1StandingsBroadcastCard standings={standings} activeTab={activeTab} />

      {/* 2.5 Quick Chart Progression Teaser / Embed */}
      <div className="card" style={{
        padding: '16px 20px',
        marginBottom: '24px',
        background: 'linear-gradient(90deg, #131722 0%, #1A2030 100%)',
        border: '1px solid #262B3A',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(225,6,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--f1-red)',
            border: '1px solid rgba(225,6,0,0.3)'
          }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--f1-gold)', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
              ТЕЛЕМЕТРИЯ И АНАЛИТИКА • СЕЗОН 2026
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#FFF' }}>
              Гонка чартов: Динамика роста очков от 0 до текущего Гран-при
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
              10 пилотов и Кубок конструкторов стартуют с 0. Накопительные траектории с каждого этапа.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${showInlineChart ? 'btn-primary' : ''}`}
            onClick={() => setShowInlineChart(!showInlineChart)}
            style={{ fontWeight: '700', padding: '8px 16px' }}
          >
            {showInlineChart ? 'Свернуть график ✕' : '📊 Показать график здесь'}
          </button>
          {onNavigateTab && (
            <button
              className="btn btn-sm"
              onClick={() => onNavigateTab('charts')}
              style={{ fontWeight: '700', padding: '8px 16px', background: '#0B0D12', border: '1px solid var(--border-color)' }}
            >
              Вся аналитика во вкладке →
            </button>
          )}
        </div>
      </div>

      {showInlineChart && progressionData && (
        <div style={{ marginBottom: '24px' }}>
          <F1PointsProgressionChart progressionData={progressionData} defaultMode={activeTab === 'constructors' ? 'constructors' : 'drivers'} />
        </div>
      )}

      {/* Sub navigation for Drivers vs Constructors */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          className={`btn ${activeTab === 'drivers' ? 'btn-primary' : ''}`}
          onClick={() => handleTabChange('drivers')}
          style={{ padding: '10px 24px', fontWeight: '800', fontSize: '0.95rem' }}
        >
          <User size={18} /> ЛИЧНЫЙ ЗАЧЁТ (DRIVERS)
        </button>
        <button
          className={`btn ${activeTab === 'constructors' ? 'btn-primary' : ''}`}
          onClick={() => handleTabChange('constructors')}
          style={{ padding: '10px 24px', fontWeight: '800', fontSize: '0.95rem' }}
        >
          <Shield size={18} /> КУБОК КОНСТРУКТОРОВ (TEAMS)
        </button>
      </div>

      {activeTab === 'drivers' ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', background: '#12151F', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--f1-red)', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                FORMULA 1 2026 • ИТОГОВЫЙ ТЕКУЩИЙ ЗАЧЕТ
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '900', fontStyle: 'italic', letterSpacing: '0.5px' }}>
                ЛИЧНЫЙ ЗАЧЕТ ПИЛОТОВ (DRIVERS CHAMPIONSHIP)
              </h3>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--f1-gold)', fontWeight: '700' }}>
              ЛИДЕР: {driverStandings[0]?.driver.name} ({driverStandings[0]?.totalPoints} PTS)
            </div>
          </div>

          <div className="f1-table-wrapper">
            <table className="f1-table">
              <thead>
                <tr>
                  <th style={{ width: '60px', textAlign: 'center' }}>ПОЗ</th>
                  <th>ПИЛОТ</th>
                  <th>КОМАНДА</th>
                  <th style={{ textAlign: 'center' }}>ПОБЕДЫ</th>
                  <th style={{ textAlign: 'center' }}>ПОДИУМЫ</th>
                  <th style={{ textAlign: 'center' }}>ЛУЧШИЕ КРУГИ</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>СУММА ОЧКОВ</th>
                </tr>
              </thead>
              <tbody>
                {driverStandings.map((item, index) => {
                  const pos = index + 1;
                  const isPlayer = !item.driver.isAi;

                  return (
                    <tr key={item.driver.id} className={isPlayer ? 'real-player-row' : ''}>
                      <td className={`pos-cell pos-${pos}`} style={{ textAlign: 'center', fontWeight: '900', fontSize: '1.1rem' }}>
                        {pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : pos}
                      </td>
                      <td>
                        <div className="driver-cell">
                          {item.driver.avatar ? (
                            <img
                              src={item.driver.avatar}
                              alt={item.driver.name}
                              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: isPlayer ? '2px solid #0284C7' : '1px solid var(--border-color)' }}
                            />
                          ) : (
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                              🏎️
                            </div>
                          )}
                          <div>
                            <div className="driver-name" style={{ fontSize: '1.05rem', fontWeight: '800' }}>
                              <FlagIcon countryCode={item.driver.country} style={{ marginRight: '6px' }} />
                              {item.driver.name}
                              {isPlayer && <span className="player-badge">Player</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="team-cell" style={{ gap: '10px', alignItems: 'center' }}>
                          <span className="team-stripe" style={{ backgroundColor: item.team.color, height: '24px', width: '4px' }} />
                          <TeamLogo teamId={item.team.id} size="sm" />
                          <span style={{ fontWeight: '600' }}>{item.team.name}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '800', fontSize: '1rem', color: item.wins > 0 ? '#FFD700' : 'var(--text-dark)' }}>
                        {item.wins}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '700', fontSize: '1rem' }}>{item.podiums}</td>
                      <td style={{ textAlign: 'center', fontWeight: '700', fontSize: '1rem', color: item.fastestLaps > 0 ? '#A855F7' : 'inherit' }}>
                        {item.fastestLaps}
                      </td>
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
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', background: '#12151F', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--f1-red)', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                FORMULA 1 2026 • ИТОГОВЫЙ ТЕКУЩИЙ ЗАЧЕТ
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '900', fontStyle: 'italic', letterSpacing: '0.5px' }}>
                КУБОК КОНСТРУКТОРОВ (CONSTRUCTORS CHAMPIONSHIP)
              </h3>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--f1-gold)', fontWeight: '700' }}>
              ЛИДЕР: {constructorStandings[0]?.team.name} ({constructorStandings[0]?.totalPoints} PTS)
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
                        <div className="team-cell" style={{ gap: '16px', alignItems: 'center' }}>
                          <span className="team-stripe" style={{ backgroundColor: item.team.color, height: '38px', width: '5px' }} />
                          <TeamLogo teamId={item.team.id} size="md" />
                          <div>
                            <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#FFF' }}>{item.team.name}</div>
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
