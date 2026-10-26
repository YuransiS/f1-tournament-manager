import React from 'react';
import { Trophy, TrendingUp, Flag, Users, Download, Zap, Calendar, Sparkles } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  onExportData,
  activeSeason = '2027-1',
  onSwitchSeason,
  onOpenSeasonModal
}) {
  const is2027 = activeSeason === '2027-1';

  return (
    <header className="navbar">
      <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <img
          src="/F1-logo.png"
          alt="F1"
          style={{
            height: '38px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 14px rgba(225, 6, 0, 0.9))'
          }}
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="brand-title" style={{ fontSize: '1.2rem', fontWeight: '900', fontStyle: 'italic', letterSpacing: '1px', margin: 0 }}>
              TOURNAMENT CHAMPIONSHIP {is2027 ? '2027-1' : '2026'}
            </h1>
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: '900',
                background: is2027 ? '#E10600' : 'rgba(255, 215, 0, 0.2)',
                color: is2027 ? '#FFF' : '#FFD700',
                border: is2027 ? 'none' : '1px solid rgba(255, 215, 0, 0.4)',
                padding: '1px 6px',
                borderRadius: '4px',
                letterSpacing: '0.5px'
              }}
            >
              {is2027 ? 'LIVE СЕЗОН' : 'АРХИВ 2026'}
            </span>
          </div>
          <span className="brand-subtitle" style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
            {is2027
              ? 'Новый сезон: 23 Гран-при • 7 Спринтов • Старт: Австрия (Red Bull Ring)'
              : 'Система учета очков, заездов и ТВ-трансляций F1 (Сезон завершён)'}
          </span>
        </div>

        {/* Season Switcher Pills */}
        {onSwitchSeason && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(11, 14, 23, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '9px',
              padding: '3px',
              gap: '4px',
              marginLeft: '4px'
            }}
          >
            <button
              type="button"
              onClick={() => onSwitchSeason('2026')}
              style={{
                background: !is2027 ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                color: !is2027 ? '#FFD700' : '#9CA3AF',
                border: !is2027 ? '1px solid rgba(255, 215, 0, 0.4)' : '1px solid transparent',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: !is2027 ? '900' : '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Переключиться на завершённый сезон 2026 года"
            >
              <span>🏆</span>
              <span>2026</span>
            </button>

            <button
              type="button"
              onClick={() => onSwitchSeason('2027-1')}
              style={{
                background: is2027 ? 'rgba(225, 6, 0, 0.25)' : 'transparent',
                color: is2027 ? '#FF6B6B' : '#9CA3AF',
                border: is2027 ? '1px solid rgba(225, 6, 0, 0.6)' : '1px solid transparent',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: is2027 ? '900' : '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Переключиться на новый сезон 2027-1"
            >
              <span>🔥</span>
              <span>2027-1</span>
            </button>
          </div>
        )}
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-btn ${activeTab === 'standings' ? 'active' : ''}`}
          onClick={() => setActiveTab('standings')}
        >
          <Trophy size={18} />
          Турнирная Таблица
        </button>

        <button
          className={`nav-btn ${activeTab === 'charts' ? 'active' : ''}`}
          onClick={() => setActiveTab('charts')}
        >
          <TrendingUp size={18} />
          Графика / Чарты
        </button>

        <button
          className={`nav-btn ${activeTab === 'races' ? 'active' : ''}`}
          onClick={() => setActiveTab('races')}
        >
          <Flag size={18} />
          Заезды ({is2027 ? '23 этапа' : '2026'})
        </button>

        <button
          className={`nav-btn ${activeTab === 'drivers' ? 'active' : ''}`}
          onClick={() => setActiveTab('drivers')}
        >
          <Users size={18} />
          Пилоты
        </button>

        <button
          className={`nav-btn ${activeTab === 'starting-grid' ? 'active' : ''}`}
          onClick={() => setActiveTab('starting-grid')}
        >
          <Zap size={18} color={activeTab === 'starting-grid' ? '#FFF' : '#E10600'} />
          Starting Grid
        </button>

        <button
          className={`nav-btn ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
          style={{ position: 'relative' }}
        >
          <Calendar size={18} color={activeTab === 'calendar' ? '#FFF' : '#38BDF8'} />
          Календарь 2027-1
          <span style={{
            fontSize: '0.6rem',
            background: activeTab === 'calendar' ? '#FFF' : '#E10600',
            color: activeTab === 'calendar' ? '#E10600' : '#FFF',
            padding: '1px 6px',
            borderRadius: '4px',
            fontWeight: '900',
            letterSpacing: '0.5px',
            marginLeft: '4px'
          }}>
            2027
          </span>
        </button>
      </nav>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {onOpenSeasonModal && (
          <button
            className="btn btn-sm"
            onClick={onOpenSeasonModal}
            style={{
              background: 'linear-gradient(90deg, #E10600 0%, #B30000 100%)',
              color: '#FFF',
              border: 'none',
              fontWeight: '800',
              fontSize: '0.75rem',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            title="Открыть Центр Перехода к Сезону 2027-1"
          >
            <Sparkles size={14} />
            Сезоны / Хаб
          </button>
        )}

        <button
          className="btn btn-sm"
          title="Экспорт данных текущего сезона в JSON"
          onClick={onExportData}
        >
          <Download size={14} /> JSON
        </button>
      </div>
    </header>
  );
}
