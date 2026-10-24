import React from 'react';
import { Trophy, TrendingUp, Flag, Users, Download, Zap, Calendar } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onExportData }) {
  return (
    <header className="navbar">
      <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
          <h1 className="brand-title" style={{ fontSize: '1.2rem', fontWeight: '900', fontStyle: 'italic', letterSpacing: '1px' }}>
            TOURNAMENT CHAMPIONSHIP 2026
          </h1>
          <span className="brand-subtitle" style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
            Система учета очков, заездов и ТВ-трансляций F1
          </span>
        </div>
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
          Заезды
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


      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          className="btn btn-sm"
          title="Экспорт данных в JSON"
          onClick={onExportData}
        >
          <Download size={14} /> JSON
        </button>
      </div>
    </header>
  );
}
