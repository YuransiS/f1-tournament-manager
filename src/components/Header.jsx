import React from 'react';
import { Trophy, Flag, Users, Download, RefreshCw } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, data, onResetData, onExportData }) {
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
      </nav>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          className="btn btn-sm"
          title="Экспорт данных в JSON"
          onClick={onExportData}
        >
          <Download size={14} /> JSON
        </button>
        <button
          className="btn btn-sm btn-danger"
          title="Сбросить к исходным данным скриншота"
          onClick={onResetData}
        >
          <RefreshCw size={14} /> Сброс
        </button>
      </div>
    </header>
  );
}
