import React, { useState } from 'react';
import { Zap, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { BREAKING_TRANSFERS } from '../services/initialData';

export default function F1TransfersShowcase() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, #131622 0%, #1A1E2E 100%)',
      border: '2px solid #E10600',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '32px',
      boxShadow: '0 12px 35px rgba(225, 6, 0, 0.2)'
    }}>
      {/* Title Header */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid rgba(225, 6, 0, 0.4)',
        paddingBottom: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'var(--f1-red)',
            color: '#FFF',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <Zap size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>
              OFFICIAL FIA ANNOUNCEMENTS
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', fontStyle: 'italic', color: '#FFF' }}>
              ⚡ BREAKING: ГРОМКИЕ ТРАНСФЕРЫ И ПРОДЛЕНИЯ КОНТРАКТОВ
            </h2>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.06)',
          padding: '6px 14px',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.85rem',
          fontWeight: '700',
          color: '#9CA3AF'
        }}>
          Очки пилотов полностью переходят в новые команды!
        </div>
      </div>

      {/* Grid of 4 Official Breaking Transfer Posters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {BREAKING_TRANSFERS.map((tr) => (
          <div
            key={tr.id}
            onClick={() => setSelectedImage(tr)}
            style={{
              background: '#0B0D14',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              position: 'relative',
              boxShadow: '0 6px 20px rgba(0,0,0,0.5)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'var(--f1-red)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(225,6,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.5)';
            }}
          >
            {/* Card Image */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden' }}>
              <img
                src={tr.image}
                alt={tr.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: tr.type === 'EXTENDED' ? '#00A19B' : '#E10600',
                color: '#FFF',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.68rem',
                fontWeight: '900',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                boxShadow: '0 4px 12px rgba(0,0,0,0.6)'
              }}>
                {tr.badgeText}
              </div>
            </div>

            {/* Card Info */}
            <div style={{ padding: '14px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#FFF', marginBottom: '4px' }}>
                {tr.driverName}
              </h4>
              <div style={{ fontSize: '0.8rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{tr.fromTeam}</span>
                <ArrowRight size={14} style={{ color: 'var(--f1-red)' }} />
                <strong style={{ color: '#FFF' }}>{tr.toTeam}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Box: New Team Lineups */}
      <div style={{
        background: 'rgba(0,0,0,0.35)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '18px 20px'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFD700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} />
          ОФИЦИАЛЬНЫЙ СОСТАВ КОМАНД ПОСЛЕ ТРАНСФЕРНОГО ОКНА 2026:
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {/* Mercedes */}
          <div style={{
            background: 'rgba(0, 161, 155, 0.08)',
            borderLeft: '4px solid #00A19B',
            padding: '12px 16px',
            borderRadius: '8px'
          }}>
            <div style={{ fontWeight: '900', color: '#6CD3BF', fontSize: '1rem', textTransform: 'uppercase', marginBottom: '6px' }}>
              🏎️ Mercedes-AMG Petronas F1 Team
            </div>
            <div style={{ fontSize: '0.88rem', color: '#FFF', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>• <strong>Юрий ЗАХАРЧУК</strong> (imnot4777) <span style={{ color: '#38BDF8', fontSize: '0.75rem' }}>[Трансфер из AlphaTauri]</span></div>
              <div>• <strong>Александр ГРОМОВ</strong> (PABV) <span style={{ color: '#10B981', fontSize: '0.75rem' }}>[Продление контракта]</span></div>
            </div>
          </div>

          {/* Red Bull */}
          <div style={{
            background: 'rgba(30, 65, 255, 0.08)',
            borderLeft: '4px solid #1E41FF',
            padding: '12px 16px',
            borderRadius: '8px'
          }}>
            <div style={{ fontWeight: '900', color: '#60A5FA', fontSize: '1rem', textTransform: 'uppercase', marginBottom: '6px' }}>
              🐂 Red Bull Racing / Red Kangaroo
            </div>
            <div style={{ fontSize: '0.88rem', color: '#FFF', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>• <strong>Микола ЯРЕМА</strong> (kolyacoolguy) <span style={{ color: '#38BDF8', fontSize: '0.75rem' }}>[Трансфер из AlphaTauri]</span></div>
              <div>• <strong>Денис КОВАЛЕНКО</strong> (ProstoDenya) <span style={{ color: '#38BDF8', fontSize: '0.75rem' }}>[Трансфер из Mercedes]</span></div>
            </div>
          </div>

          {/* AlphaTauri */}
          <div style={{
            background: 'rgba(0, 41, 59, 0.2)',
            borderLeft: '4px solid #4E7C9B',
            padding: '12px 16px',
            borderRadius: '8px'
          }}>
            <div style={{ fontWeight: '900', color: '#94A3B8', fontSize: '1rem', textTransform: 'uppercase', marginBottom: '6px' }}>
              🚀 AlphaTauri (Новый состав AI)
            </div>
            <div style={{ fontSize: '0.88rem', color: '#9CA3AF', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>• <strong>Max VERSTAPPEN</strong> <span style={{ fontSize: '0.75rem' }}>[Переход из Red Bull]</span></div>
              <div>• <strong>Sergio PÉREZ</strong> <span style={{ fontSize: '0.75rem' }}>[Переход из Red Bull]</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Preview for Clicked Card */}
      {selectedImage && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedImage(null)}
          style={{ cursor: 'pointer' }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '520px',
              padding: '16px',
              background: '#0B0D14',
              borderRadius: '16px',
              border: '2px solid var(--f1-red)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0,0,0,0.7)',
                color: '#FFF',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={20} />
            </button>

            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.9)' }}
            />
            <div style={{ marginTop: '14px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#FFF' }}>
                {selectedImage.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#9CA3AF', marginTop: '4px' }}>
                {selectedImage.subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
