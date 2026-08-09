import React from 'react';
import { Award, Zap, Flame } from 'lucide-react';
import FlagIcon from './FlagIcon';

export default function WinnerBanner({ driverStandings, races }) {
  if (!driverStandings || driverStandings.length === 0) return null;

  const leader = driverStandings[0];
  const lastRace = races && races.length > 0 ? races[races.length - 1] : null;

  return (
    <div className="winner-banner">
      <div className="winner-info">
        <div className="winner-crown">🏆</div>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Лидер чемпионата
          </div>
          <div className="winner-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FlagIcon countryCode={leader.driver.country} style={{ width: '26px', height: '17px' }} />
            <span>{leader.driver.name}</span>
            {leader.driver.isAi ? (
              <span className="ai-badge" style={{ marginLeft: '4px' }}>AI</span>
            ) : (
              <span className="player-badge" style={{ marginLeft: '4px' }}>Игрок</span>
            )}
          </div>
          <div className="winner-team">
            <span
              className="team-stripe"
              style={{ backgroundColor: leader.team.color, marginRight: '6px' }}
            />
            {leader.team.name} • {leader.totalPoints} Очков ({leader.wins} побед, {leader.podiums} подиумов)
          </div>
        </div>
      </div>

      {lastRace && (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase' }}>
              Последний заезд
            </div>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: '#FFF' }}>
              {lastRace.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6CD3BF' }}>
              Статус: Завершён
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
