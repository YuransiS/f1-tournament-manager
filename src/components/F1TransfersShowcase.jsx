import React, { useState } from 'react';
import { Zap, ShieldCheck, ArrowRight, X, Trophy, Crown, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { BREAKING_TRANSFERS } from '../services/initialData';

export default function F1TransfersShowcase() {
  const [selectedImage, setSelectedImage] = useState(null);

  const luxuryEase = [0.16, 1, 0.3, 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: luxuryEase }}
      className="card"
      style={{
        background: 'linear-gradient(135deg, #18150A 0%, #0F121C 100%)',
        border: '2px solid #FFD700',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
        boxShadow: '0 12px 35px rgba(255, 215, 0, 0.25)'
      }}
    >
      {/* Champion Banner Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid rgba(255, 215, 0, 0.4)',
        paddingBottom: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#000',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 18px rgba(255, 215, 0, 0.6)'
          }}>
            <Crown size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#FFD700', fontWeight: '900', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              ⚡ OFFICIAL FIA CHAMPIONSHIP BULLETIN
            </div>
            <h2 style={{ fontSize: '1.7rem', fontWeight: '900', fontStyle: 'italic', color: '#FFF', letterSpacing: '0.5px' }}>
              🏆 СМЕНА ЛИДЕРА: МИКОЛА ЯРЕМА — НОВЫЙ ЛИДЕР ЧЕМПИОНАТА 2026!
            </h2>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,215,0,0.15)',
          border: '1px solid rgba(255,215,0,0.4)',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: '800',
          color: '#FFD700',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Flame size={18} /> 4 ПОБЕДЫ ПОДРЯД (МАЙАМИ • ИМОЛА • МОНАКО • ИСПАНИЯ • КАНАДА)
        </div>
      </div>

      {/* Main Leader Spotlight Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '24px',
        alignItems: 'center'
      }}>
        {/* Left Champion Card */}
        <div style={{
          background: 'linear-gradient(135deg, #241E0F 0%, #121522 100%)',
          borderRadius: '14px',
          border: '2px solid #FFD700',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
        }}>
          <img
            src="/portraits/kolya.png"
            alt="Mykola Yarema"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #FFD700',
              boxShadow: '0 6px 20px rgba(255,215,0,0.4)'
            }}
          />
          <div>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: '800', textTransform: 'uppercase' }}>
              ЛИЧНЫЙ ЗАЧЁТ ПИЛОТОВ
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#FFF', fontStyle: 'italic', textTransform: 'uppercase' }}>
              Mykola YAREMA 🇺🇦
            </div>
            <div style={{ fontSize: '0.85rem', color: '#60A5FA', fontWeight: '800', textTransform: 'uppercase', marginTop: '2px' }}>
              Red Bull Racing / Red Kangaroo
            </div>
            <div style={{ marginTop: '8px', display: 'inline-block', background: '#FFD700', color: '#000', padding: '4px 12px', borderRadius: '12px', fontWeight: '900', fontSize: '0.95rem' }}>
              156 PTS (P1 LEADER)
            </div>
          </div>
        </div>

        {/* Right Constructors Spotlight */}
        <div style={{
          background: 'linear-gradient(135deg, #12192E 0%, #0F121C 100%)',
          borderRadius: '14px',
          border: '2px solid #1E41FF',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
        }}>
          <div style={{
            background: 'rgba(30,65,255,0.15)',
            padding: '12px 16px',
            borderRadius: '14px',
            border: '1px solid rgba(30,65,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90px',
            height: '90px',
            flexShrink: 0
          }}>
            <img
              src="/teams/red-bull.png"
              alt="Red Bull Racing"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))'
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: '800', textTransform: 'uppercase' }}>
              КУБОК КОНСТРУКТОРОВ
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#FFF', fontStyle: 'italic', textTransform: 'uppercase' }}>
              Red Bull Racing
            </div>
            <div style={{ fontSize: '0.85rem', color: '#93C5FD', fontWeight: '700', marginTop: '2px' }}>
              Ярема (156) + Коваленко (67)
            </div>
            <div style={{ marginTop: '8px', display: 'inline-block', background: '#1E41FF', color: '#FFF', padding: '4px 12px', borderRadius: '12px', fontWeight: '900', fontSize: '0.95rem' }}>
              223 PTS (P1 LEADER)
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Official Announcements & Transfers Posters */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Zap size={18} style={{ color: 'var(--f1-red)' }} />
        Официальные постеры сезонов и переходов:
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {BREAKING_TRANSFERS.map((tr, index) => (
          <motion.div
            key={tr.id}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.0, delay: index * 0.2, ease: luxuryEase }}
            onClick={() => setSelectedImage(tr)}
            style={{
              background: '#0B0D14',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
              position: 'relative',
              boxShadow: '0 6px 20px rgba(0,0,0,0.5)'
            }}
            whileHover={{ y: -6, borderColor: '#E10600', boxShadow: '0 15px 35px rgba(225,6,0,0.35)' }}
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
          </motion.div>
        ))}
      </div>

      {/* Summary Box: New Team Lineups */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.8, ease: luxuryEase }}
        style={{
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '18px 20px'
        }}
      >
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFD700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} />
          ОФИЦИАЛЬНЫЙ СОСТАВ КОМАНД ПОСЛЕ ТРАНСФЕРНОГО ОКНА 2026:
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {/* Red Bull */}
          <div style={{
            background: 'rgba(30, 65, 255, 0.12)',
            borderLeft: '4px solid #1E41FF',
            padding: '12px 16px',
            borderRadius: '8px'
          }}>
            <div style={{ fontWeight: '900', color: '#60A5FA', fontSize: '1rem', textTransform: 'uppercase', marginBottom: '6px' }}>
              🐂 Red Bull Racing / Red Kangaroo (Лидер КК)
            </div>
            <div style={{ fontSize: '0.88rem', color: '#FFF', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>• <strong>Микола ЯРЕМА</strong> (kolyacoolguy) <span style={{ color: '#FFD700', fontSize: '0.75rem', fontWeight: '900' }}>[👑 P1 Leader • 121 pts]</span></div>
              <div>• <strong>Денис КОВАЛЕНКО</strong> (ProstoDenya) <span style={{ color: '#60A5FA', fontSize: '0.75rem' }}>[🥈 P2 Spain • 30 pts]</span></div>
            </div>
          </div>

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
              <div>• <strong>Юрий ЗАХАРЧУК</strong> (imnot4777) <span style={{ color: '#38BDF8', fontSize: '0.75rem' }}>[P2 Leader • 116 pts]</span></div>
              <div>• <strong>Александр ГРОМОВ</strong> (PABV) <span style={{ color: '#10B981', fontSize: '0.75rem' }}>[Продление контракта • 1 pt]</span></div>
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
              <div>• <strong>Daniel RICCIARDO / Yuki TSUNODA</strong> <span style={{ fontSize: '0.75rem' }}>[Состав 2026]</span></div>
              <div>• <strong>Max VERSTAPPEN / Sergio PÉREZ</strong> <span style={{ fontSize: '0.75rem' }}>[Переход из Red Bull]</span></div>
            </div>
          </div>
        </div>
      </motion.div>

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
                justifyContent: 'center',
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
    </motion.div>
  );
}
