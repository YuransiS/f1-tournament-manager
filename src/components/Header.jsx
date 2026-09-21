import React from 'react';
import { Trophy, TrendingUp, Flag, Users, Download, Zap } from 'lucide-react';

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
          style={{
            borderColor: activeTab === 'starting-grid' ? '#E10600' : undefined,
            background: activeTab === 'starting-grid' ? 'rgba(225, 6, 0, 0.15)' : undefined
          }}
        >
          <Zap size={18} color="#E10600" />
          Starting Grid
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
