import React from 'react';
import { Zap, Sparkles, Building2, UserCheck } from 'lucide-react';
import TeamLogo from './TeamLogo';

export default function F1WilliamsMercedesAnnouncement() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0A1118 0%, #06090E 50%, #0D1622 100%)',
      borderRadius: '16px',
      border: '2px solid #00A3E0',
      boxShadow: '0 20px 50px rgba(0, 163, 224, 0.25), 0 10px 30px rgba(0,0,0,0.8)',
      padding: '24px 28px',
      marginBottom: '32px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        top: '-40%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(0, 163, 224, 0.15) 0%, rgba(0, 210, 190, 0.08) 40%, transparent 70%)',
        pointerEvents: 'none'
      }} />


      {/* Top Header Badge */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid rgba(0, 163, 224, 0.25)',
        paddingBottom: '14px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: '#00A3E0',
            color: '#000',
            padding: '5px 14px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: '900',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Zap size={15} fill="#000" /> OFFICIAL F1 BREAKING NEWS
          </span>
          <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: '700' }}>
            FIA BULLETIN • СЕЗОН 2026
          </span>
        </div>


        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TeamLogo teamId="mercedes" size="sm" />
            <span style={{ color: '#00D2BE', fontWeight: '900', fontSize: '0.9rem' }}>MERCEDES-AMG</span>
          </div>
          <span style={{ color: '#94A3B8', fontWeight: '900' }}>❤</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TeamLogo teamId="williams" size="sm" />
            <span style={{ color: '#00A3E0', fontWeight: '900', fontSize: '0.9rem' }}>WILLIAMS RACING</span>
          </div>
        </div>
      </div>


      {/* Main Content Layout: Poster on Left, Rich Details on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: '24px',
        alignItems: 'center'
      }}>
        {/* Left Column: Official Poster Image */}
        <div style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 12px 35px rgba(0,0,0,0.8), 0 0 20px rgba(0, 163, 224, 0.3)',
          border: '1.5px solid rgba(0, 163, 224, 0.4)',
          maxWidth: '380px',
          margin: '0 auto',
          width: '100%'
        }}>
          <img
            src="/announcements/williams_mercedes.jpg"
            alt="Williams Announce Sale of F1 Team"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'cover'
            }}
          />
        </div>


        {/* Right Column: Detailed Official Statement */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#38BDF8', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>
              WILLIAMS ANNOUNCE SALE OF F1 TEAM
            </div>
            <h2 style={{
              fontSize: '1.7rem',
              fontWeight: '900',
              fontStyle: 'italic',
              color: '#FFF',
              letterSpacing: '0.5px',
              marginTop: '4px',
              lineHeight: 1.2
            }}>
              MERCEDES QOКУПАЕТ WILLIAMS: СТАТУС МЛАДШЕЙ КОМАНДЫ ДЛЯ МОЛОДЫХ ТАЛАНТОЗ!
            </h2>
          </div>


          <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: 1.6, margin: 0 }}>
            Концерн <strong style={{ color: '#00D2BE' }}>Mercedes-AMG Petronas</strong> официально завершил сделку по приобретению 100% акций команды <strong style={{ color: '#00A3E0' }}>Williams Racing</strong>. Команда сохраняет своѐ историческое имя и базу в Гроуве, становясь ключевой официальной юниорской командой Mercedes для молодых и талантливых гонщиков.
          </p>


          {/* 3 Key Takeaways Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div style={{
              background: 'rgba(0, 163, 224, 0.08)',
              border: '1px solid rgba(0, 163, 224, 0.25)',
              borderRadius: '10px',
              padding: '12px 14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38BDF8', fontWeight: '900', fontSize: '0.88rem' }}>
                <Building2 size={16} /> Историческое Имя
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px', lineHeight: 1.4 }}>
                Название <strong>Williams</strong> и аутентичная айдентика сохраняются в полном объеме.
              </div>
            </div>


            <div style={{ 
              background: 'rgba(0, 210, 190, 0.08)',
              border: '1px solid rgba(0, 210, 190, 0.25)',
              borderRadius: '10px',
              padding: '12px 14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2DD41B', fontWeight: '900', fontSize: '0.88rem' }}>
                <UserCheck size={16} /> Юниорская Команда
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px', lineHeight: 1.4 }}>
                Williams становится официальной юниорской командой Mercedes для обкатки молодых талантов.
              </div>
            </div>


            <div style={{
              background: 'rgba(255, 215, 0, 0.08)',
              border: '1px solid rgba(255, 215, 0, 0.25)',
              borderRadius: '10px',
              padding: '12px 14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FCD34D', fontWeight: '900', fontSize: '0.88rem' }}>
                <Sparkles size={16} /> Технический Альянс
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px', lineHeight: 1.4 }}>
                Прямая поддержка Mercedes High Performance Powertrains и инженерных лабораторий.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
