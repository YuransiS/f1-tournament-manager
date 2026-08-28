import React, { useState } from 'react';
import { Calendar, Flag, Award, AlertCircle, FileText, ShieldAlert, Trophy, Star, Zap } from 'lucide-react';
import { calculateRacePoints } from '../services/storage';
import F1PodiumOnlyCard from './F1PodiumOnlyCard';
import F1BroadcastSplitResultCard from './F1BroadcastSplitResultCard';
import F1CancelledPressRelease from './F1CancelledPressRelease';
import F1PenaltyAnnouncement from './F1PenaltyAnnouncement';
import F1DriverOfTheDayCard from './F1DriverOfTheDayCard';

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
  'race-10': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Austria_Circuit.png'
};

export default function RacesView({ races, drivers, teams, pointsMap, fastestLapPoints }) {
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
              <Trophy size={16} /> {activeRace.isSprint ? 'Результаты Спринта ⚡' : 'Результаты Гонки'}
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
          defaultDriverId={activeRace.fastestLapDriverId || fullResults[0].driverId}
          activeRaceId={activeRace.id}
        />
      ) : (
        <>
          {/* Driver of the Day Spotlight Card at top of results */}
          <F1DriverOfTheDayCard
            raceTitle={activeRace.title}
            trackImage={trackImage}
            fullResults={fullResults}
            defaultDriverId={activeRace.fastestLapDriverId || fullResults[0].driverId}
            activeRaceId={activeRace.id}
          />

          {/* 1:1 F1 Broadcast Split Result TV Cards (Top 10 / 11-20) */}
          <F1BroadcastSplitResultCard
            raceTitle={activeRace.title}
            trackImage={trackImage}
            fullResults={fullResults}
          />

          {/* 16:9 F1 Podium Card (Top 3) */}
          <F1PodiumOnlyCard
            raceTitle={activeRace.title}
            trackImage={trackImage}
            fullResults={fullResults}
          />

          {/* Full Interactive Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', background: '#12151F', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} style={{ color: 'var(--f1-gold)' }} />
                ПОЛНЫЙ ИТОГОВЫЙ ПРОТОКОЛ {activeRace.title.toUpperCase()} {activeRace.isSprint ? '(СПРИНТ)' : ''}
              </h3>
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

                    return (
                      <tr key={item.driverId} className={isPlayer ? 'real-player-row' : ''}>
                        <td className={`pos-cell pos-${item.finishPos}`} style={{ textAlign: 'center', fontWeight: '900' }}>
                          {item.finishPos === 1 ? '🥇' : item.finishPos === 2 ? '🥈' : item.finishPos === 3 ? '🥉' : item.finishPos}
                        </td>
                        <td>
                          <div className="driver-cell">
                            {item.driver.avatar && (
                              <img
                                src={item.driver.avatar}
                                alt={item.driver.name}
                                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                              />
                            )}
                            <div className="driver-name">
                              <span style={{ fontWeight: '700' }}>{item.driver.name}</span>
                              {isPlayer && <span className="player-badge">Player</span>}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="team-cell">
                            <span className="team-stripe" style={{ backgroundColor: item.team.color }} />
                            {item.team.name}
                          </div>
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: '600' }}>
                          {item.gridPos}
                          {item.posDiff > 0 ? (
                            <span className="grid-change grid-up">▲+{item.posDiff}</span>
                          ) : item.posDiff < 0 ? (
                            <span className="grid-change grid-down">▼{item.posDiff}</span>
                          ) : (
                            <span className="grid-change grid-same">=</span>
                          )}
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
        </>
      )}
    </div>
  );
}
