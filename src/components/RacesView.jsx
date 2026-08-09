import React, { useState } from 'react';
import { Calendar, Flag, Award, AlertCircle, FileText, Zap, ShieldAlert, Trophy } from 'lucide-react';
import { calculateRacePoints } from '../services/storage';
import F1PodiumOnlyCard from './F1PodiumOnlyCard';
import F1BroadcastSplitResultCard from './F1BroadcastSplitResultCard';
import F1CancelledPressRelease from './F1CancelledPressRelease';
import F1PenaltyAnnouncement from './F1PenaltyAnnouncement';

const TRACK_LAYOUTS = {
  'race-1': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png',
  'race-2': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Saudi_Arabia_Circuit.png',
  'race-3': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Australia_Circuit.png',
  'race-4': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Baku_Circuit.png',
  'race-5': 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Miami_Circuit.png'
};

export default function RacesView({ races, drivers, teams, pointsMap, fastestLapPoints }) {
  const [selectedRaceId, setSelectedRaceId] = useState(races[races.length - 1]?.id || races[0]?.id || '');
  const [viewMode, setViewMode] = useState('main-results'); // 'press-release', 'sprint-results', 'main-results', 'penalty-notice'

  const activeRace = races.find(r => r.id === selectedRaceId) || races[races.length - 1] || races[0];

  if (!activeRace) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <AlertCircle size={32} style={{ color: 'var(--f1-red)', marginBottom: '12px' }} />
        <h3>Заезды пока не добавлены</h3>
        <p style={{ color: 'var(--text-muted)' }}>Перейдите в /ADMIN панель, чтобы добавить первый Гран-при!</p>
      </div>
    );
  }

  const isCancelled = activeRace.status === 'cancelled' || activeRace.isCancelled;
  const hasPenaltyNotice = activeRace.hasPenaltyAnnouncement;

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
      {/* Grand Prix Selector Header */}
      <div className="card" style={{ padding: '18px 24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: isCancelled ? '#EF4444' : 'var(--f1-red)', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isCancelled ? (
                <>🚨 ОСНОВНАЯ ГОНКА ОТМЕНЕНА (OFFICIALLY CANCELLED)</>
              ) : activeRace.isSprint ? (
                <>⚡ СПРИНТ-ЗАЕЗД (SPRINT RACE)</>
              ) : (
                <>ОФИЦИАЛЬНЫЕ РЕЗУЛЬТАТЫ ЭТАПА</>
              )}
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', fontStyle: 'italic', margin: '4px 0', color: isCancelled ? '#F87171' : 'inherit' }}>
              {activeRace.title} {isCancelled && '(ОТМЕНА)'}
            </h2>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {activeRace.subtitle} • {activeRace.date}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* View Mode Switcher for Cancelled or Penalty Announced Races */}
            {isCancelled ? (
              <div className="nav-tabs" style={{ background: 'rgba(255,255,255,0.06)', padding: '3px', borderRadius: '8px' }}>
                <button
                  className={`nav-btn ${viewMode === 'press-release' ? 'active' : ''}`}
                  onClick={() => setViewMode('press-release')}
                  style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FileText size={16} /> Пресс-релиз ФИА
                </button>
                <button
                  className={`nav-btn ${viewMode === 'sprint-results' ? 'active' : ''}`}
                  onClick={() => setViewMode('sprint-results')}
                  style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Zap size={16} style={{ color: '#F59E0B' }} /> Результаты Спринта
                </button>
              </div>
            ) : hasPenaltyNotice ? (
              <div className="nav-tabs" style={{ background: 'rgba(255,255,255,0.06)', padding: '3px', borderRadius: '8px' }}>
                <button
                  className={`nav-btn ${viewMode === 'main-results' || viewMode === 'press-release' ? 'active' : ''}`}
                  onClick={() => setViewMode('main-results')}
                  style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Trophy size={16} style={{ color: '#FFD700' }} /> Таблица Гонки
                </button>
                <button
                  className={`nav-btn ${viewMode === 'penalty-notice' ? 'active' : ''}`}
                  onClick={() => setViewMode('penalty-notice')}
                  style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ShieldAlert size={16} style={{ color: '#EF4444' }} /> ⚠️ Анонс Штрафа (Sainz +10s)
                </button>
              </div>
            ) : null}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>Выбор этапа:</label>
              <select
                className="form-control"
                style={{ width: 'auto', minWidth: '260px', fontWeight: '700' }}
                value={selectedRaceId}
                onChange={e => {
                  setSelectedRaceId(e.target.value);
                  const selected = races.find(r => r.id === e.target.value);
                  if (selected?.isCancelled || selected?.status === 'cancelled') {
                    setViewMode('press-release');
                  } else {
                    setViewMode('main-results');
                  }
                }}
              >
                {races.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.title} {r.isCancelled || r.status === 'cancelled' ? '🚨 (Отменён)' : ''} ({r.date})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isCancelled && viewMode === 'press-release' ? (
        <F1CancelledPressRelease raceTitle={activeRace.title} trackImage={trackImage} />
      ) : hasPenaltyNotice && viewMode === 'penalty-notice' ? (
        <F1PenaltyAnnouncement raceTitle={activeRace.title} trackImage={trackImage} />
      ) : (
        <>
          {/* If there's an official penalty decision, show a notification banner above results */}
          {hasPenaltyNotice && (
            <div style={{
              background: 'linear-gradient(90deg, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.05) 100%)',
              borderLeft: '5px solid #EF4444',
              borderRadius: '8px',
              padding: '14px 20px',
              marginBottom: '24px',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldAlert size={24} style={{ color: '#EF4444' }} />
                <div>
                  <div style={{ fontWeight: '900', color: '#FFF', fontSize: '0.95rem' }}>
                    🚨 ОФИЦИАЛЬНОЕ РЕШЕНИЕ СТЮАРДОВ ФИА
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#D1D5DB' }}>
                    Carlos SAINZ получил штраф <strong>+10 секунд</strong> за столкновение и уничтожение болида Alexsandr GROMOV (PABV) • <em>Terminal Damage</em>.
                  </div>
                </div>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => setViewMode('penalty-notice')}
                style={{ padding: '6px 16px', fontSize: '0.8rem', fontWeight: '800', border: '1px solid #EF4444', color: '#EF4444' }}
              >
                📄 Посмотреть Документ ФИА
              </button>
            </div>
          )}

          {/* BLOCK 1: Top 3 Podium Showcase Card FIRST! */}
          <F1PodiumOnlyCard raceTitle={activeRace.title} trackImage={trackImage} fullResults={fullResults} />

          {/* BLOCK 2: Complete Race Results Table Card SECOND! */}
          <F1BroadcastSplitResultCard raceTitle={activeRace.title} trackImage={trackImage} fullResults={fullResults} />
        </>
      )}
    </div>
  );
}
