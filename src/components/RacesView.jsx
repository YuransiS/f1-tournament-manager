import React, { useState } from 'react';
import { Calendar, Flag, Award, AlertCircle, FileText, ShieldAlert, Trophy, Star, Tv } from 'lucide-react';
import { calculateRacePoints } from '../services/storage';
import FlagIcon from './FlagIcon';
import TeamLogo from './TeamLogo';
import F1PodiumOnlyCard from './F1PodiumOnlyCard';
import F1BroadcastSplitResultCard from './F1BroadcastSplitResultCard';
import F1CancelledPressRelease from './F1CancelledPressRelease';
import F1PenaltyAnnouncement from './F1PenaltyAnnouncement';
import F1DriverOfTheDayCard from './F1DriverOfTheDayCard';
import { DRIVER_NUMBER_MAP } from '../utils/f1CircuitHelper';

const TRACK_LAYOUTS = {
  'race-1': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png',
  'race-2': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Saudi_Arabia_Circuit.png',
  'race-3': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Australia_Circuit.png',
  'race-4': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Baku_Circuit.png',
  'race-5': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Miami_Circuit.png',
  'race-6': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png',
  'race-7': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Monoco_Circuit.png',
  'race-8': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Spain_Circuit.png',
  'race-9': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Canada_Circuit.png',
  'race-10-sprint': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Austria_Circuit.png',
  'race-10': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Austria_Circuit.png',
  'race-11': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Great_Britain_Circuit.png',
  'race-12': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Hungary_Circuit.png',
  'race-13': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Belgium_Circuit.png',
  'race-14': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Belgium_Circuit.png',
  'race-15': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Netherlands_Circuit.png',
  'race-16': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Italy_Circuit.png',
  'race-17': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png',
  'race-18': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Japan_Circuit.png',
  'race-19-sprint': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Qatar_Circuit.png',
  'race-19': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Qatar_Circuit.png',
  'race-20-sprint': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/USA_Circuit.png',
  'race-20': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/USA_Circuit.png',
  'race-21': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Mexico_Circuit.png',
  'race-22-sprint': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Brazil_Circuit.png',
  'race-22': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Brazil_Circuit.png',
  'race-23': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Las_Vegas_Circuit.png',
  'race-24': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/China_Circuit.png',
  'race-25': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Abu_Dhabi_Circuit.png'
};

export default function RacesView({ races, drivers, teams, pointsMap, fastestLapPoints, onNavigateTab }) {
  const [selectedRaceId, setSelectedRaceId] = useState(races[races.length - 1]?.id || races[0]?.id || '');
  const [viewMode, setViewMode] = useState('main-results'); // 'press-release', 'main-results', 'penalty-notice', 'dotd'

  const activeRace = races.find(r => r.id === selectedRaceId) || races[races.length - 1] || races[0];

  if (!activeRace) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <AlertCircle size={32} style={{ color: 'var(--f1-red)', marginBottom: '12px' }} />
        <h3>Заезды пока не добавлены</h3>
      </div>
    );
  }

  const isCancelled = activeRace.status === 'cancelled' || activeRace.isCancelled;
  const hasPenaltyNotice = activeRace.hasPenaltyAnnouncement;
  const hasPressRelease = activeRace.hasPressRelease || isCancelled;

  // Map drivers to results
  const fullResults = activeRace.results.map((res, idx) => {
    const driver = drivers.find(d => d.id === res.driverId) || { name: 'Unknown Driver', country: 'UA', teamId: '', isAi: true };
    const team = teams.find(t => t.id === driver.teamId) || { name: 'Unknown Team', color: '#666' };
    const finishPos = idx + 1;
    const isFastestLap = !activeRace.isSprint && activeRace.fastestLapDriverId === res.driverId;
    const pts = res.status === 'DNF' ? 0 : calculateRacePoints(finishPos, isFastestLap, pointsMap, fastestLapPoints, activeRace.isSprint);

    const gridPos = res.grid || finishPos;
    const posDiff = gridPos - finishPos;

    return {
      ...res,
      finishPos,
      driver,
      team,
      isFastestLap,
      pts,
      posDiff
    };
  });

  const trackImage = TRACK_LAYOUTS[activeRace.id] || TRACK_LAYOUTS['race-1'];

  return (
    <div>
      {/* Season Switcher & 2027 Calendar Link */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '12px 18px',
        marginBottom: '16px',
        background: 'linear-gradient(90deg, rgba(225, 6, 0, 0.12) 0%, rgba(20, 24, 36, 0.9) 100%)',
        border: '1px solid rgba(225, 6, 0, 0.3)',
        borderRadius: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: '#E10600',
            color: '#FFF',
            padding: '3px 8px',
            borderRadius: '4px',
            fontWeight: '900',
            fontSize: '0.72rem',
            letterSpacing: '0.5px'
          }}>
            СЕЗОН 2026
          </span>
          <span style={{ fontSize: '0.85rem', color: '#E2E8F0', fontWeight: '600' }}>
            Текущий архив гонок сезона 2026 (Сезон завершен)
          </span>
        </div>

        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab('calendar')}
            className="btn btn-sm"
            style={{
              background: '#E10600',
              color: '#FFF',
              border: 'none',
              fontWeight: '800',
              borderRadius: '8px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Calendar size={14} />
            Официальный Календарь 2027-1 (23 Этапа) →
          </button>
        )}
      </div>

      {/* Race Selection Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flag size={16} style={{ color: 'var(--f1-red)' }} /> ЭТАПЫ ГРАН-ПРИ 2026:
          </span>
          {races.map((r, index) => {
            const isSelected = r.id === activeRace.id;
            const isRaceCancelled = r.status === 'cancelled' || r.isCancelled;
            const isSprint = r.isSprint;

            return (
              <button
                key={r.id}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : ''}`}
                onClick={() => {
                  setSelectedRaceId(r.id);
                  setViewMode('main-results');
                }}
                style={{
                  whiteSpace: 'nowrap',
                  fontWeight: '700',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  background: isSelected ? 'var(--f1-red)' : isSprint ? 'rgba(0, 160, 222, 0.15)' : isRaceCancelled ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-card-hover)',
                  border: isSelected ? 'none' : isSprint ? '1px solid #00A0DE' : isRaceCancelled ? '1px solid #EF4444' : '1px solid var(--border-color)',
                  color: isSelected ? '#FFF' : isSprint ? '#38BDF8' : isRaceCancelled ? '#EF4444' : 'var(--text-muted)'
                }}
              >
                ГП {index + 1}: {r.title.split(' ')[0]} {isSprint ? '⚡ (Спринт)' : isRaceCancelled ? '🚫' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Race Header Summary Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #161A26 0%, #0F121C 100%)',
        borderLeft: isCancelled ? '6px solid #EF4444' : activeRace.isSprint ? '6px solid #00A0DE' : '6px solid var(--f1-red)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {trackImage && (
          <img
            src={trackImage}
            alt="Track map"
            style={{
              position: 'absolute',
              right: '-40px',
              top: '-30px',
              height: '240px',
              opacity: 0.1,
              pointerEvents: 'none',
              filter: 'invert(1)'
            }}
          />
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="player-badge" style={{ background: activeRace.isSprint ? '#00A0DE' : isCancelled ? '#EF4444' : 'var(--f1-red)', padding: '4px 10px', fontSize: '0.75rem' }}>
                {activeRace.isSprint ? '⚡ СПРИНТ ЗАЕЗД (SPRINT RACE)' : isCancelled ? 'ОТМЕНЁННЫЙ ЭТАП' : 'ОФИЦИАЛЬНЫЙ ЭТАП'}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} /> {activeRace.date}
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', fontStyle: 'italic', letterSpacing: '1px' }}>
              {activeRace.title}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '2px' }}>
              {activeRace.subtitle}
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${viewMode === 'main-results' ? 'btn-primary' : ''}`}
              onClick={() => setViewMode('main-results')}
              style={{ padding: '8px 16px', fontWeight: '700' }}
            >
              <Trophy size={16} /> {activeRace.isSprint ? 'Протокол и Подиум ⚡' : 'Протокол и Подиум'}
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'tv-broadcast' ? 'btn-primary' : ''}`}
              onClick={() => setViewMode('tv-broadcast')}
              style={{ padding: '8px 16px', fontWeight: '700' }}
            >
              <Tv size={16} /> ТВ-Графика 1:1
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'dotd' ? 'btn-primary' : ''}`}
              onClick={() => setViewMode('dotd')}
              style={{ background: viewMode === 'dotd' ? 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)' : 'var(--bg-card-hover)', color: viewMode === 'dotd' ? '#000' : '#FFF', padding: '8px 16px', fontWeight: '800' }}
            >
              <Star size={16} /> Driver of the Day 🌟
            </button>
            {hasPenaltyNotice && (
              <button
                className={`btn btn-sm ${viewMode === 'penalty-notice' ? 'btn-primary' : ''}`}
                onClick={() => setViewMode('penalty-notice')}
                style={{ background: viewMode === 'penalty-notice' ? '#B91C1C' : 'rgba(239, 68, 68, 0.15)', color: '#FFF', border: '1px solid #EF4444', padding: '8px 16px', fontWeight: '700' }}
              >
                <ShieldAlert size={16} /> Решение Стюардов (Штраф)
              </button>
            )}
            {hasPressRelease && (
              <button
                className={`btn btn-sm ${viewMode === 'press-release' ? 'btn-primary' : ''}`}
                onClick={() => setViewMode('press-release')}
                style={{ background: viewMode === 'press-release' ? '#B91C1C' : 'rgba(239, 68, 68, 0.15)', color: '#FFF', border: '1px solid #EF4444', padding: '8px 16px', fontWeight: '700' }}
              >
                <FileText size={16} /> Пресс-Релиз ФИА (Отмена GP)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main View Mode Switcher Rendering */}
      {viewMode === 'press-release' ? (
        <F1CancelledPressRelease raceTitle={activeRace.title} circuitSubtitle={activeRace.subtitle} />
      ) : hasPenaltyNotice && viewMode === 'penalty-notice' ? (
        <F1PenaltyAnnouncement raceTitle={activeRace.title} trackImage={trackImage} penaltyData={activeRace.penaltyData} />
      ) : viewMode === 'dotd' ? (
        <F1DriverOfTheDayCard
          raceTitle={activeRace.title}
          trackImage={trackImage}
          fullResults={fullResults}
          defaultDriverId={activeRace.driverOfTheDayId || activeRace.fastestLapDriverId || fullResults[0].driverId}
          activeRaceId={activeRace.id}
        />
      ) : viewMode === 'tv-broadcast' ? (
        <F1BroadcastSplitResultCard
          raceTitle={activeRace.title}
          trackImage={trackImage}
          fullResults={fullResults}
        />
      ) : (
        <>
          {/* Full Interactive Table FIRST for immediate access */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', background: '#12151F', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} style={{ color: 'var(--f1-gold)' }} />
                ПОЛНЫЙ ИТОГОВЫЙ ПРОТОКОЛ {activeRace.title.toUpperCase()} {activeRace.isSprint ? '(СПРИНТ)' : ''}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                Участников: {fullResults.length} • Быстрый круг: {fullResults.find(r => r.isFastestLap)?.driver?.name || '—'}
              </span>
            </div>

            <div className="f1-table-wrapper">
              <table className="f1-table">
                <thead>
                  <tr>
                    <th style={{ width: '50px', textAlign: 'center' }}>ПОЗ</th>
                    <th>ПИЛОТ</th>
                    <th>КОМАНДА</th>
                    <th style={{ textAlign: 'center' }}>СТАРТ</th>
                    <th style={{ textAlign: 'center' }}>ПИТ-СТОПЫ</th>
                    <th style={{ textAlign: 'center' }}>ЛУЧШИЙ КРУГ</th>
                    <th style={{ textAlign: 'right' }}>ВРЕМЯ / ОТСТАВАНИЕ</th>
                    <th style={{ textAlign: 'right', paddingRight: '20px' }}>ОЧКИ</th>
                  </tr>
                </thead>
                <tbody>
                  {fullResults.map((item) => {
                    const isPlayer = !item.driver.isAi;
                    const raceNum = DRIVER_NUMBER_MAP[item.driverId] || item.driver.driverNumber || '';

                    return (
                      <tr key={item.driverId} className={isPlayer ? 'real-player-row' : ''}>
                        <td className={`pos-cell pos-${item.finishPos}`} style={{ textAlign: 'center', fontWeight: '900' }}>
                          {item.finishPos === 1 ? '🥇' : item.finishPos === 2 ? '🥈' : item.finishPos === 3 ? '🥉' : item.finishPos}
                        </td>
                        <td>
                          <div className="driver-cell">
                            {item.driver.avatar ? (
                              <img
                                src={item.driver.avatar}
                                alt={item.driver.name}
                                style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: isPlayer ? '1.5px solid #0284C7' : '1px solid var(--border-color)' }}
                              />
                            ) : (
                              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                                🏎️
                              </div>
                            )}
                            <div className="driver-name">
                              <FlagIcon countryCode={item.driver.country} />
                              <span style={{ fontWeight: '700' }}>{item.driver.name}</span>
                              {raceNum && (
                                <span style={{
                                  fontSize: '0.72rem',
                                  fontWeight: '900',
                                  color: item.team.color || '#FFF',
                                  background: 'rgba(255,255,255,0.06)',
                                  border: '1px solid rgba(255,255,255,0.12)',
                                  padding: '1px 5px',
                                  borderRadius: '4px',
                                  fontFamily: 'Titillium Web, sans-serif'
                                }}>
                                  #{raceNum}
                                </span>
                              )}
                              {isPlayer && <span className="player-badge">Player</span>}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="team-cell">
                            <span className="team-stripe" style={{ backgroundColor: item.team.color }} />
                            {item.team.id && <TeamLogo teamId={item.team.id} size="xs" />}
                            <span>{item.team.name}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: '600' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span>P{item.gridPos}</span>
                            {item.posDiff > 0 ? (
                              <span className="grid-change grid-up">▲+{item.posDiff}</span>
                            ) : item.posDiff < 0 ? (
                              <span className="grid-change grid-down">▼{item.posDiff}</span>
                            ) : (
                              <span className="grid-change grid-same">=</span>
                            )}
                          </div>
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: '600' }}>{item.stops}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={item.isFastestLap ? 'fastest-lap-tag' : ''} style={{ fontFamily: 'monospace', fontWeight: '700' }}>
                            {item.bestLap} {item.isFastestLap ? '⚡ FL' : ''}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: '700', color: item.status === 'DNF' ? '#EF4444' : '#FFF' }}>
                          {item.status === 'DNF' ? 'DNF' : item.totalTime}
                          {item.penaltyLabel && (
                            <div style={{ marginTop: '2px' }}>
                              <span className="penalty-tag">{item.penaltyLabel}</span>
                            </div>
                          )}
                        </td>
                        <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                          <span className={`pts-badge ${item.pts === 0 ? 'zero' : ''}`}>
                            +{item.pts}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 16:9 F1 Podium Card (Top 3) */}
          <F1PodiumOnlyCard
            raceTitle={activeRace.title}
            trackImage={trackImage}
            fullResults={fullResults}
          />
        </>
      )}
    </div>
  );
}
