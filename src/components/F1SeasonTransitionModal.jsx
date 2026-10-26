import React from 'react';
import {
  Trophy,
  Flame,
  CheckCircle2,
  Calendar,
  Zap,
  Download,
  X
} from 'lucide-react';
import { exportDataAsJSON, exportFullArchiveJSON } from '../services/storage';

export default function F1SeasonTransitionModal({
  isOpen,
  onClose,
  activeSeason,
  onSwitchSeason,
  onNavigateTab,
  season2026Data,
  season2027Data
}) {
  if (!isOpen) return null;

  const handleSelectSeason = (seasonId) => {
    onSwitchSeason(seasonId);
    onClose();
  };

  const handleNavigate = (tab) => {
    if (onNavigateTab) onNavigateTab(tab);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 7, 12, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '880px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(135deg, #0D1019 0%, #131724 100%)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(225, 6, 0, 0.15)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#E5E7EB',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          title="Закрыть"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: '900',
                background: '#E10600',
                color: '#FFF',
                padding: '2px 8px',
                borderRadius: '4px',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
            >
              FIA ARCHITECTURE CONTROL
            </span>
            <span style={{ fontSize: '0.75rem', color: '#FFD700', fontWeight: '800' }}>
              • ЦЕНТР ПЕРЕХОДА И УПРАВЛЕНИЯ СЕЗОНАМИ
            </span>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: '900', fontStyle: 'italic', margin: 0, color: '#FFF' }}>
            ПЕРЕХОД К СЕЗОНУ 2027-1
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem', margin: '6px 0 0' }}>
            Сезон 2026 триумфально завершён. Календарь, составы команд и стартовая решётка чемпионата 2027-1 подготовлены и готовы к старту.
          </p>
        </div>

        {/* Active Season Highlight Pill */}
        <div
          style={{
            background: activeSeason === '2027-1' ? 'rgba(0, 210, 190, 0.1)' : 'rgba(255, 215, 0, 0.1)',
            border: `1px solid ${activeSeason === '2027-1' ? '#00D2BE' : '#FFD700'}`,
            borderRadius: '12px',
            padding: '12px 18px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>
              {activeSeason === '2027-1' ? '🔥' : '🏆'}
            </span>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase' }}>
                Текущий активный режим:
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '900', color: '#FFF' }}>
                {activeSeason === '2027-1' ? 'Сезон 2027-1 (Новый чемпионат)' : 'Сезон 2026 (Архив / Зал Славы)'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleSelectSeason('2026')}
              className="btn btn-sm"
              style={{
                background: activeSeason === '2026' ? '#FFD700' : 'rgba(255, 255, 255, 0.08)',
                color: activeSeason === '2026' ? '#000' : '#E5E7EB',
                fontWeight: '800',
                border: '1px solid rgba(255, 215, 0, 0.4)'
              }}
            >
              🏆 Сезон 2026
            </button>
            <button
              onClick={() => handleSelectSeason('2027-1')}
              className="btn btn-sm"
              style={{
                background: activeSeason === '2027-1' ? '#E10600' : 'rgba(255, 255, 255, 0.08)',
                color: '#FFF',
                fontWeight: '800',
                border: '1px solid rgba(225, 6, 0, 0.5)'
              }}
            >
              🔥 Сезон 2027-1
            </button>
          </div>
        </div>

        {/* Two Season Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '20px',
            marginBottom: '28px'
          }}
        >
          {/* Card 1: Season 2026 Archive */}
          <div
            style={{
              background: '#0F131D',
              border: '1px solid rgba(255, 215, 0, 0.25)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: '900',
                    background: 'rgba(255, 215, 0, 0.15)',
                    color: '#FFD700',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 215, 0, 0.3)'
                  }}
                >
                  ЗАВЕРШЁН (24 ЭТАПА)
                </span>
                <Trophy size={18} color="#FFD700" />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#FFF', margin: '0 0 10px 0' }}>
                Сезон 2026: Итоги и Архив
              </h3>

              <div style={{ fontSize: '0.85rem', color: '#D1D5DB', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                <div>🥇 <strong>Чемпион:</strong> Микола Ярема (#67 Red Bull) — 281 PTS</div>
                <div>🥈 <strong>Вице-чемпион:</strong> Юрий Захарчук (#69 Mercedes) — 247 PTS</div>
                <div>🥉 <strong>Бронза:</strong> Денис Коваленко (#88 Red Bull) — 217 PTS</div>
                <div>🏎️ <strong>P4:</strong> Олександр Писаренко (#95 Mercedes) — 193 PTS</div>
                <div>🐎 <strong>Ferrari:</strong> Дебют Вадима Манштейна (#5) с подиумом в Монце</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
              <button
                onClick={() => handleSelectSeason('2026')}
                className="btn btn-sm"
                style={{
                  background: activeSeason === '2026' ? 'rgba(255, 215, 0, 0.2)' : '#191E2C',
                  border: '1px solid #374151',
                  color: '#FFD700',
                  fontWeight: '800',
                  flex: 1
                }}
              >
                {activeSeason === '2026' ? '✓ Сейчас активен' : 'Перейти в архив 2026 →'}
              </button>

              <button
                onClick={() => exportDataAsJSON(season2026Data || {}, '2026')}
                className="btn btn-sm"
                style={{
                  background: '#131722',
                  border: '1px solid #374151',
                  color: '#9CA3AF'
                }}
                title="Скачать JSON архива 2026"
              >
                <Download size={14} /> JSON 2026
              </button>
            </div>
          </div>

          {/* Card 2: Season 2027-1 New Season */}
          <div
            style={{
              background: '#0F131D',
              border: '1px solid rgba(225, 6, 0, 0.35)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: activeSeason === '2027-1' ? '0 0 24px rgba(225, 6, 0, 0.12)' : 'none'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: '900',
                    background: 'rgba(225, 6, 0, 0.2)',
                    color: '#EF4444',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(225, 6, 0, 0.4)'
                  }}
                >
                  ГОТОВ К СТАРТУ (23 ЭТАПА)
                </span>
                <Flame size={18} color="#EF4444" />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#FFF', margin: '0 0 10px 0' }}>
                Сезон 2027-1: Новый Чемпионат
              </h3>

              <div style={{ fontSize: '0.85rem', color: '#D1D5DB', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                <div>🏁 <strong>1-й этап:</strong> Гран-при Австрии (Red Bull Ring, 26-28 марта)</div>
                <div>⚡ <strong>Формат:</strong> 23 Гран-при и 7 спринт-уикендов</div>
                <div>🔴 <strong>Red Bull:</strong> Ярема (#67 👑) & Коваленко (#88 🥉)</div>
                <div>🟢 <strong>Mercedes-AMG:</strong> Захарчук (#69 🥈) & Писаренко (#95)</div>
                <div>🐎 <strong>Ferrari:</strong> Манштейн (#5) & Сайнс (#55)</div>
                <div>🔵 <strong>Williams:</strong> Марк (#47) & Албон (#23)</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
              <button
                onClick={() => handleSelectSeason('2027-1')}
                className="btn btn-sm"
                style={{
                  background: activeSeason === '2027-1' ? '#E10600' : '#191E2C',
                  border: '1px solid rgba(225, 6, 0, 0.5)',
                  color: '#FFF',
                  fontWeight: '800',
                  flex: 1
                }}
              >
                {activeSeason === '2027-1' ? '✓ Сейчас активен' : 'Активировать Сезон 2027-1 →'}
              </button>

              <button
                onClick={() => handleNavigate('starting-grid')}
                className="btn btn-sm"
                style={{
                  background: '#131722',
                  border: '1px solid #374151',
                  color: '#38BDF8',
                  fontWeight: '700'
                }}
                title="Открыть стартовую решётку Австрии"
              >
                <Zap size={14} /> Решётка
              </button>

              <button
                onClick={() => exportDataAsJSON(season2027Data || {}, '2027-1')}
                className="btn btn-sm"
                style={{
                  background: '#131722',
                  border: '1px solid #374151',
                  color: '#9CA3AF'
                }}
                title="Скачать JSON сезона 2027-1"
              >
                <Download size={14} /> JSON 2027
              </button>
            </div>
          </div>
        </div>

        {/* Quick Transition Checklist */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '14px',
            padding: '16px 20px',
            marginBottom: '20px',
            border: '1px solid rgba(255, 255, 255, 0.07)'
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '10px' }}>
            Чеклист готовности к сезону 2027-1:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#E5E7EB' }}>
              <CheckCircle2 size={16} color="#10B981" /> Календарь 23 этапов утверждён
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#E5E7EB' }}>
              <CheckCircle2 size={16} color="#10B981" /> Трансферы пилотов применены
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#E5E7EB' }}>
              <CheckCircle2 size={16} color="#10B981" /> Стартовая решётка Австрии готова
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#E5E7EB' }}>
              <CheckCircle2 size={16} color="#10B981" /> Архив сезона 2026 защищён
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <button
            onClick={() => exportFullArchiveJSON()}
            className="btn btn-sm"
            style={{
              background: '#0B0D13',
              border: '1px solid #374151',
              color: '#D1D5DB',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Download size={14} /> Скачать единый мастер-архив всех сезонов
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handleNavigate('calendar')}
              className="btn btn-sm"
              style={{
                background: '#1E2433',
                border: '1px solid #3B82F6',
                color: '#60A5FA',
                fontWeight: '800'
              }}
            >
              <Calendar size={14} /> Календарь 2027-1
            </button>
            <button
              onClick={onClose}
              className="btn btn-sm"
              style={{
                background: '#E10600',
                border: 'none',
                color: '#FFF',
                fontWeight: '800',
                padding: '8px 18px'
              }}
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
