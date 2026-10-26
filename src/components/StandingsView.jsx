import React, { useState, useMemo } from 'react';
import { Shield, User, TrendingUp, Calendar } from 'lucide-react';
import FlagIcon from './FlagIcon';
import TeamLogo from './TeamLogo';
import F1StandingsBroadcastCard from './F1StandingsBroadcastCard';
import F1PointsProgressionChart from './F1PointsProgressionChart';
import F1WorldChampionCard from './F1WorldChampionCard';
import F1ViceChampionCard from './F1ViceChampionCard';
import F1BronzeChampionCard from './F1BronzeChampionCard';
import F1ConstructorsChampionCard from './F1ConstructorsChampionCard';
import F1PisarenkoAnnouncementCard from './F1PisarenkoAnnouncementCard';
import { calculateStandings, calculatePointsProgression } from '../services/storage';
import { DRIVER_NUMBER_MAP } from '../utils/f1CircuitHelper';

export default function StandingsView({ data, standings: propStandings, activeTab: propActiveTab, onTabChange, onNavigateTab }) {
  const [internalTab, setInternalTab] = useState('drivers');
  const [showInlineChart, setShowInlineChart] = useState(false);
  const [activePoster, setActivePoster] = useState('p1'); // 'p1' | 'p2' | 'p3' | 'constructors' | 'broadcast-tv' | 'all' | 'none'
  const activeTab = propActiveTab || internalTab;
  const handleTabChange = onTabChange || setInternalTab;

  const standings = propStandings || (data ? calculateStandings(data) : { driverStandings: [], constructorStandings: [] });
  const { driverStandings = [], constructorStandings = [] } = standings;

  const progressionData = useMemo(() => {
    return data ? calculatePointsProgression(data) : null;
  }, [data]);

  const handleMainTabSwitch = (nextTab) => {
    handleTabChange(nextTab);
    if (nextTab === 'constructors' && ['p1', 'p2', 'p3'].includes(activePoster)) {
      setActivePoster('constructors');
    } else if (nextTab === 'drivers' && activePoster === 'constructors') {
      setActivePoster('p1');
    }
  };

  return (
    <div>
      {/* Interactive Hall of Fame / Champions Poster Switcher */}
      <div
        className="card"
        style={{
          padding: '14px 18px',
          marginBottom: '20px',
          background: 'linear-gradient(90deg, #121521 0%, #191E2E 100%)',
          border: '1px solid rgba(255, 215, 0, 0.25)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: '900',
            background: 'rgba(255, 215, 0, 0.15)',
            color: '#FFD700',
            border: '1px solid rgba(255, 215, 0, 0.4)',
            padding: '4px 10px',
            borderRadius: '6px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            🏆 Зал Славы 2026
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#E5E7EB' }}>
            Официальные постеры призёров чемпионата:
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {[
            { id: 'p1', label: '🥇 Чемпион (#67 Коля)', color: '#FFD700' },
            { id: 'p2', label: '🥈 Вице-чемпион (#69 Юра)', color: '#00D2BE' },
            { id: 'p3', label: '🥉 Бронза (#88 Денис)', color: '#F59E0B' },
            { id: 'constructors', label: '🏆 Кубок Конструкторов', color: '#3B82F6' },
            { id: 'broadcast-tv', label: '📺 ТВ-Таблица 16:9', color: '#E10600' },
            { id: 'announcement', label: '📢 Анонс: Писаренко #95', color: '#00D2BE' },
            { id: 'all', label: 'Все постеры', color: '#9CA3AF' },
            { id: 'none', label: 'Скрыть ✕', color: '#6B7280' }
          ].map((item) => {
            const isSelected = activePoster === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePoster(item.id)}
                className="btn btn-sm"
                style={{
                  background: isSelected ? 'rgba(255, 255, 255, 0.14)' : 'rgba(11, 13, 18, 0.7)',
                  borderColor: isSelected ? item.color : '#262B3A',
                  color: isSelected ? '#FFFFFF' : '#9CA3AF',
                  fontWeight: isSelected ? '900' : '700',
                  boxShadow: isSelected ? `0 0 14px ${item.color}33` : 'none',
                  padding: '6px 12px',
                  fontSize: '0.8rem'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Official FIA World Champion 2026 Declaration Card & Poster */}
      {(activePoster === 'p1' || activePoster === 'all') && (
        <F1WorldChampionCard
          champion={driverStandings[0]}
          runnerUp={driverStandings[1]}
          constructorChampion={constructorStandings[0]}
          lastRaceTitle={data?.races?.[data.races.length - 1]?.title}
        />
      )}

      {/* Official FIA Vice-Champion 2026 Declaration Card & Poster */}
      {(activePoster === 'p2' || activePoster === 'all') && (
        <F1ViceChampionCard
          runnerUp={driverStandings[1]}
          thirdPlace={driverStandings[2]}
          lastRaceTitle={data?.races?.[data.races.length - 1]?.title}
        />
      )}

      {/* Official FIA Bronze Medalist 2026 Declaration Card & Poster */}
      {(activePoster === 'p3' || activePoster === 'all') && (
        <F1BronzeChampionCard
          thirdPlace={driverStandings[2]}
          fourthPlace={driverStandings[3]}
          lastRaceTitle={data?.races?.[data.races.length - 1]?.title}
        />
      )}

      {/* Official FIA Constructors World Champion 2026 Celebration Poster */}
      {(activePoster === 'constructors' || activePoster === 'all') && (
        <F1ConstructorsChampionCard
          constructorChampion={constructorStandings[0]}
          runnerUpTeam={constructorStandings[1]}
        />
      )}

      {/* Broadcast TV 16:9 Standings Graphic Card */}
      {(activePoster === 'broadcast-tv' || activePoster === 'all') && (
        <F1StandingsBroadcastCard driverStandings={driverStandings} subtitleLabel="ФИНАЛЬНЫЙ ЗАЧЁТ 2026" />
      )}

      {/* Official Mercedes Announcement: Oleksandr Pisarenko Card */}
      {(activePoster === 'announcement' || activePoster === 'all') && (
        <F1PisarenkoAnnouncementCard />
      )}

      {/* 2027-1 Official Season Calendar Announcement Banner */}
      <div className="card" style={{
        padding: '16px 20px',
        marginBottom: '24px',
        background: 'linear-gradient(90deg, #181119 0%, #151825 100%)',
        border: '1px solid rgba(225, 6, 0, 0.4)',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 4px 20px rgba(225, 6, 0, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(225, 6, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#E10600',
            border: '1px solid rgba(225, 6, 0, 0.5)'
          }}>
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.72rem', background: '#E10600', color: '#FFF', fontWeight: '900', padding: '1px 6px', borderRadius: '4px' }}>
                FIA CALENDAR 2027-1
              </span>
              <span style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: '800', letterSpacing: '0.5px' }}>
                ⚡ 7 СПРИНТ-ЭТАПОВ
              </span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#FFF', marginTop: '2px' }}>
              Официальный календарь следующего сезона 2027-1 утвержден
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
              23 Гран-при: Австрия, Франция, Португалия, Лас-Вегас, Монако и финальный заезд в Абу-Даби.
            </div>
          </div>
        </div>

        {onNavigateTab && (
          <button
            className="btn btn-sm"
            onClick={() => onNavigateTab('calendar')}
            style={{
              fontWeight: '800',
              padding: '10px 20px',
              background: '#E10600',
              color: '#FFF',
              border: 'none',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Calendar size={16} />
            Перейти к календарю 2027-1 →
          </button>
        )}
      </div>

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
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeTab === 'drivers' ? 'btn-primary' : ''}`}
          onClick={() => handleMainTabSwitch('drivers')}
          style={{ padding: '10px 24px', fontWeight: '800', fontSize: '0.95rem' }}
        >
          <User size={18} /> ЛИЧНЫЙ ЗАЧЁТ (DRIVERS)
        </button>
        <button
          className={`btn ${activeTab === 'constructors' ? 'btn-primary' : ''}`}
          onClick={() => handleMainTabSwitch('constructors')}
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
                            <div className="driver-name" style={{ fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <FlagIcon countryCode={item.driver.country} style={{ marginRight: '2px' }} />
                              <span>{item.driver.name}</span>
                              <span style={{
                                fontSize: '0.78rem',
                                fontWeight: '900',
                                color: item.team.color || '#FFF',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                fontFamily: 'Titillium Web, sans-serif'
                              }}>
                                #{DRIVER_NUMBER_MAP[item.driver.id] || item.driver.driverNumber || ''}
                              </span>
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
                            <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {item.team.name}
                              {pos === 1 && (
                                <span style={{ fontSize: '0.65rem', background: 'rgba(255,215,0,0.15)', border: '1px solid #FFD700', color: '#FFD700', padding: '2px 8px', borderRadius: '4px', fontWeight: '900' }}>
                                  ЧЕМПИОНЫ МИРА 🏆
                                </span>
                              )}
                            </div>
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
