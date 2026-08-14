import React, { useState } from 'react';
import { Trophy, Shield, User, Filter } from 'lucide-react';
import FlagIcon from './FlagIcon';
import F1StandingsBroadcastCard from './F1StandingsBroadcastCard';
import F1TransfersShowcase from './F1TransfersShowcase';
import { calculateStandings } from '../services/storage';

export default function StandingsView({ data }) {
  const [subTab, setSubTab] = useState('drivers'); // 'drivers' | 'constructors'
  const [selectedRaceCutoff, setSelectedRaceCutoff] = useState('all'); // 'all' or raceId e.g. 'race-2'
  const [showTransfersBanner, setShowTransfersBanner] = useState(true);

  const races = data?.races || [];

  // Filter races up to selected cutoff race
  let activeRaces = races;
  let activePenalties = data?.penalties || [];
  let filterLabel = 'Итоговый текущий зачет (Все 5 этапов)';

  if (selectedRaceCutoff !== 'all') {
    const cutoffIndex = races.findIndex(r => r.id === selectedRaceCutoff);
    if (cutoffIndex >= 0) {
      activeRaces = races.slice(0, cutoffIndex + 1);
      const targetRace = races[cutoffIndex];
      filterLabel = `После ГП ${cutoffIndex + 1}: ${targetRace.title}`;

      // Filter penalties up to that race date
      if (targetRace.date) {
        activePenalties = (data?.penalties || []).filter(p => !p.date || p.date <= targetRace.date);
      }
    }
  }

  // Calculate dynamic standings for filtered races
  const filteredData = {
    ...data,
    races: activeRaces,
    penalties: activePenalties
  };

  const { driverStandings, constructorStandings } = calculateStandings(filteredData);

  return (
    <div>
      {/* Official Breaking Transfers Announcements Banner */}
      {showTransfersBanner && <F1TransfersShowcase />}

      {/* Top Filter Bar for Race Standings Snapshot */}
      <div className="card" style={{ padding: '16px 24px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="nav-tabs" style={{ background: 'transparent', padding: 0 }}>
            <button
              className={`nav-btn ${subTab === 'drivers' ? 'active' : ''}`}
              onClick={() => setSubTab('drivers')}
              style={{ padding: '8px 20px', fontSize: '0.95rem', fontWeight: '800' }}
            >
              <User size={18} /> Зачёт Пилотов
            </button>
            <button
              className={`nav-btn ${subTab === 'constructors' ? 'active' : ''}`}
              onClick={() => setSubTab('constructors')}
              style={{ padding: '8px 20px', fontSize: '0.95rem', fontWeight: '800' }}
            >
              <Shield size={18} /> Зачёт Команд
            </button>
          </div>
        </div>

        {/* Race Filter Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--f1-gold)', fontWeight: '800', fontSize: '0.9rem' }}>
            <Filter size={16} /> Фильтр зачета по гонкам:
          </div>
          <select
            className="form-control"
            style={{ width: 'auto', minWidth: '280px', fontWeight: '800', border: '1px solid var(--f1-red)' }}
            value={selectedRaceCutoff}
            onChange={e => setSelectedRaceCutoff(e.target.value)}
          >
            <option value="all">🏆 Все проведенные этапы (Текущий итоговый зачет)</option>
            {races.map((r, idx) => (
              <option key={r.id} value={r.id}>
                🏁 После ГП {idx + 1}: {r.title} ({r.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      {subTab === 'drivers' ? (
        /* Single Drivers Championship Leaderboard Card with Export */
        <F1StandingsBroadcastCard driverStandings={driverStandings} subtitleLabel={filterLabel} />
      ) : (
        /* Constructors Championship Table with Official Team Logos */
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', background: 'linear-gradient(90deg, #161922 0%, #1F2432 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--f1-red)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '1px' }}>
                FORMULA 1 2026 • {filterLabel.toUpperCase()}
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
