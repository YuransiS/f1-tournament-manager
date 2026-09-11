import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Trophy,
  Shield
} from 'lucide-react';
import F1PointsProgressionChart from './F1PointsProgressionChart';
import FlagIcon from './FlagIcon';
import TeamLogo from './TeamLogo';
import { calculatePointsProgression } from '../services/storage';

export default function ChartsView({ data }) {
  const [activeMatrixTab, setActiveMatrixTab] = useState('drivers'); // 'drivers' | 'constructors'

  const progressionData = useMemo(() => {
    return calculatePointsProgression(data);
  }, [data]);

  const {
    stages = [],
    driverSeries = [],
    constructorSeries = []
  } = progressionData;

  // Top driver and constructor leaders
  const leaderDriver = driverSeries[0];
  const secondDriver = driverSeries[1];
  const driverGap = leaderDriver && secondDriver ? leaderDriver.cumulative - secondDriver.cumulative : 0;

  const leaderTeam = constructorSeries[0];
  const secondTeam = constructorSeries[1];
  const teamGap = leaderTeam && secondTeam ? leaderTeam.cumulative - secondTeam.cumulative : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPI Highlight Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {/* Card 1: Drivers Championship Leader */}
        <div className="card" style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #151924 0%, #1A2133 100%)',
          borderLeft: '4px solid #00A19B',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                ЛИДЕР ЛИЧНОГО ЗАЧЕТА
              </span>
              <Trophy size={18} color="var(--f1-gold)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {leaderDriver?.driver?.avatar ? (
                <img
                  src={leaderDriver.driver.avatar}
                  alt={leaderDriver.driver.name}
                  style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--f1-gold)' }}
                />
              ) : (
                <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                  🏎️
                </div>
              )}
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#FFF' }}>
                  {leaderDriver?.driver?.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
                  {leaderDriver?.team?.name}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid #262B3A', paddingTop: '10px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Отрыв от 2-го места:</span>
              <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#10B981' }}>
                +{driverGap} PTS ({secondDriver?.driver?.name?.split(' ')?.pop()})
              </div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--f1-gold)' }}>
              {leaderDriver?.cumulative} <span style={{ fontSize: '0.9rem', color: '#9CA3AF' }}>PTS</span>
            </div>
          </div>
        </div>

        {/* Card 2: Constructors Championship Leader */}
        <div className="card" style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #151924 0%, #1A2133 100%)',
          borderLeft: '4px solid #1E41FF',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                ЛИДЕР КУБКА КОНСТРУКТОРОВ
              </span>
              <Shield size={18} color="#1E41FF" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {leaderTeam && <TeamLogo teamId={leaderTeam.team.id} size="md" />}
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#FFF' }}>
                  {leaderTeam?.team?.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
                  Конструктор года
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid #262B3A', paddingTop: '10px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Отрыв от 2-го места:</span>
              <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#10B981' }}>
                +{teamGap} PTS ({secondTeam?.team?.name})
              </div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--f1-gold)' }}>
              {leaderTeam?.cumulative} <span style={{ fontSize: '0.9rem', color: '#9CA3AF' }}>PTS</span>
            </div>
          </div>
        </div>

        {/* Card 3: Season Status & Progression */}
        <div className="card" style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #151924 0%, #1A2133 100%)',
          borderLeft: '4px solid var(--f1-red)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                ДИНАМИКА СЕЗОНА
              </span>
              <TrendingUp size={18} color="var(--f1-red)" />
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#FFF' }}>
              {stages.length - 1} Завершенных Гран-при
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: '4px' }}>
              Начальная точка: 0 очков у всех участников
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid #262B3A', paddingTop: '10px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Статус чемпионата:</span>
              <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#FFF' }}>
                В самом разгаре
              </div>
            </div>
            <span style={{
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(225,6,0,0.2)',
              color: 'var(--f1-red)',
              fontWeight: '800',
              fontSize: '0.8rem'
            }}>
              СЕЗОН 2026
            </span>
          </div>
        </div>
      </div>

      {/* Primary Interactive Chart */}
      <F1PointsProgressionChart progressionData={progressionData} defaultMode="drivers" />

      {/* Race-by-Race Progression Matrix Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', background: '#12141C', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-color)',
          background: '#161922',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--f1-red)', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
              МАТРИЦА НАКОПИТЕЛЬНЫХ ОЧКОВ ПО ЭТАПАМ
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', fontStyle: 'italic', margin: '2px 0 0 0' }}>
              {activeMatrixTab === 'drivers' ? 'Таблица прогрессии пилотов (Топ-10)' : 'Таблица прогрессии команд (Кубок конструкторов)'}
            </h3>
          </div>

          {/* Table Tab Selector */}
          <div style={{ display: 'flex', gap: '6px', background: '#0B0D12', padding: '4px', borderRadius: '8px' }}>
            <button
              className={`btn btn-sm ${activeMatrixTab === 'drivers' ? 'btn-primary' : ''}`}
              onClick={() => setActiveMatrixTab('drivers')}
              style={{ fontSize: '0.75rem', padding: '5px 12px' }}
            >
              Пилоты (Топ-10)
            </button>
            <button
              className={`btn btn-sm ${activeMatrixTab === 'constructors' ? 'btn-primary' : ''}`}
              onClick={() => setActiveMatrixTab('constructors')}
              style={{ fontSize: '0.75rem', padding: '5px 12px' }}
            >
              Команды
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table className="f1-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#0F121A' }}>
                <th style={{ width: '50px', textAlign: 'center', position: 'sticky', left: 0, background: '#0F121A', zIndex: 2 }}>ПОЗ</th>
                <th style={{ minWidth: '180px', position: 'sticky', left: '50px', background: '#0F121A', zIndex: 2 }}>
                  {activeMatrixTab === 'drivers' ? 'ПИЛОТ' : 'КОМАНДА'}
                </th>
                {stages.map(stg => (
                  <th key={`th-${stg.id}`} style={{ textAlign: 'center', minWidth: '85px', padding: '10px 6px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '800' }}>{stg.shortTitle}</div>
                    <div style={{ fontSize: '0.65rem', color: '#6B7280' }}>{stg.stageIndex === 0 ? '0 PTS' : `R${stg.stageIndex}`}</div>
                  </th>
                ))}
                <th style={{ textAlign: 'right', paddingRight: '20px', minWidth: '90px' }}>ИТОГО</th>
              </tr>
            </thead>
            <tbody>
              {(activeMatrixTab === 'drivers' ? driverSeries.slice(0, 10) : constructorSeries).map((item, idx) => {
                const pos = idx + 1;
                const isPlayer = activeMatrixTab === 'drivers' && !item.driver.isAi;
                const name = activeMatrixTab === 'drivers' ? item.driver.name : item.team.name;
                const color = item.team.color;

                return (
                  <tr key={`row-${idx}`} style={{ borderBottom: '1px solid #1E2330' }}>
                    <td style={{
                      textAlign: 'center',
                      fontWeight: '800',
                      position: 'sticky',
                      left: 0,
                      background: '#12141C',
                      zIndex: 1,
                      color: pos === 1 ? 'var(--f1-gold)' : pos === 2 ? '#C0C0C0' : pos === 3 ? '#CD7F32' : 'inherit'
                    }}>
                      {pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : pos}
                    </td>

                    <td style={{
                      position: 'sticky',
                      left: '50px',
                      background: '#12141C',
                      zIndex: 1,
                      borderRight: '1px solid #262B3A'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '4px', height: '20px', backgroundColor: color, borderRadius: '2px' }} />
                        {activeMatrixTab === 'drivers' ? (
                          <>
                            <FlagIcon countryCode={item.driver.country} style={{ fontSize: '0.85rem' }} />
                            <span style={{ fontWeight: isPlayer ? '800' : '600', color: isPlayer ? '#38BDF8' : '#FFF' }}>
                              {name}
                            </span>
                          </>
                        ) : (
                          <>
                            <TeamLogo teamId={item.team.id} size="xs" />
                            <span style={{ fontWeight: '700', color: '#FFF' }}>{name}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {stages.map((stg, sIdx) => {
                      const cumulativeAtStage = item.cumulativeHistory[sIdx] || 0;
                      const gainedAtStage = item.pointsHistory[sIdx] || 0;
                      const isZero = cumulativeAtStage === 0;

                      return (
                        <td key={`cell-${sIdx}`} style={{ textAlign: 'center', padding: '8px 4px' }}>
                          <div style={{ fontWeight: '800', color: isZero ? '#4B5563' : '#FFF' }}>
                            {cumulativeAtStage}
                          </div>
                          {sIdx > 0 && gainedAtStage > 0 && (
                            <div style={{ fontSize: '0.65rem', color: '#10B981', fontWeight: '700' }}>
                              +{gainedAtStage}
                            </div>
                          )}
                        </td>
                      );
                    })}

                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                      <span className="pts-badge" style={{ fontSize: '0.95rem', padding: '4px 10px' }}>
                        {item.cumulative}
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
  );
}
