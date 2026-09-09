import React from 'react';
import { Zap, AlertOctagon, Trophy } from 'lucide-react';
import TeamLogo from './TeamLogo';

export default function F1WilliamsMercedesAnnouncement() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #071018 0%, #05080E 50%, #0B1420 100%)',
      borderRadius: '16px',
      border: '2px solid #00A3E0',
      boxShadow: '0 20px 50px rgba(0, 163, 224, 0.28), 0 10px 30px rgba(0,0,0,0.9)',
      padding: '24px 28px',
      marginBottom: '32px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background ambient cyan/blue glow */}
      <div style={{
        position: 'absolute',
        top: '-35%',
        right: '-10%',
        width: '520px',
        height: '520px',
        background: 'radial-gradient(circle, rgba(0, 163, 224, 0.2) 0%, rgba(0, 90, 255, 0.08) 45%, transparent 70%)',
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
            <Zap size={15} fill="#000" /> OFFICIAL F1 BREAKING
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
          <span style={{ color: '#94A3B8', fontWeight: '900' }}>🤝</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TeamLogo teamId="williams" size="sm" />
            <span style={{ color: '#00A3E0', fontWeight: '900', fontSize: '0.9rem' }}>WILLIAMS RACING</span>
          </div>
          <span style={{
            background: 'rgba(0, 210, 190, 0.15)',
            border: '1px solid #00D2BE',
            color: '#00D2BE',
            fontSize: '0.72rem',
            fontWeight: '900',
            padding: '3px 10px',
            borderRadius: '12px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            OFFICIAL JUNIOR TEAM
          </span>
        </div>
      </div>

      {/* Main Content Layout: Poster on Left, Story on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: '24px',
        alignItems: 'center'
      }}>
        {/* Left Column: Official Breaking Poster */}
        <div style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 12px 35px rgba(0,0,0,0.85), 0 0 25px rgba(0, 163, 224, 0.35)',
          border: '2px solid rgba(0, 163, 224, 0.5)',
          maxWidth: '380px',
          margin: '0 auto',
          width: '100%'
        }}>
          <img
            src="/announcements/mark_williams.jpg"
            alt="МАРК (не уеббер) будет представлять WILLIAMS"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* Right Column: Hilarious Paddock Story & Strategic Deal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#38BDF8', fontWeight: '900', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
              🚨 СЕНСАЦИЯ В ПАДДОКЕ: MERCEDES + WILLIAMS + НОВЫЙ ПИЛОТ!
            </div>
            <h2 style={{
              fontSize: '1.65rem',
              fontWeight: '900',
              fontStyle: 'italic',
              color: '#FFF',
              letterSpacing: '0.5px',
              marginTop: '4px',
              lineHeight: 1.2
            }}>
              MERCEDES ВЫКУПАЕТ WILLIAMS КАК МЛАДШУЮ КОМАНДУ И ВЫГОНЯЕТ САРДЖЕНТА РАДИ МАРКА!
            </h2>
          </div>

          {/* Strategic Mercedes Deal Banner */}
          <div style={{
            background: 'linear-gradient(90deg, rgba(0, 210, 190, 0.12) 0%, rgba(0, 163, 224, 0.12) 100%)',
            border: '1.5px solid rgba(0, 210, 190, 0.35)',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '0.92rem',
            color: '#E2E8F0',
            lineHeight: 1.5
          }}>
            <div style={{ color: '#00D2BE', fontWeight: '900', fontSize: '0.95rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏁 Сделка года: Williams — официальная младшая команда Mercedes!
            </div>
            Концерн <strong>Mercedes-AMG Petronas</strong> выкупил команду Williams Racing, <strong>не меняя её легендарное название</strong> и базу в Гроуве. Теперь Williams становится официальной младшей (юниорской) командой Mercedes для обкатки самых дерзких и талантливых пилотов паддока.
          </div>

          <p style={{ fontSize: '0.92rem', color: '#CBD5E1', lineHeight: 1.5, margin: 0 }}>
            Первым решением нового альянса стало немедленное изгнание <strong style={{ color: '#EF4444' }}>Логана Сарджента</strong> (0 очков за 11 этапов) прямо на пит-лейне Сильверстоуна после бунта лидеров чемпионата!
          </p>

          {/* Player-related funny reasons */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '0.86rem',
            color: '#E2E8F0',
            lineHeight: 1.45
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F87171', fontWeight: '900', marginBottom: '6px' }}>
              <AlertOctagon size={16} /> Претензии игроков, переполнившие чашу терпения:
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>
                <strong style={{ color: '#00D2BE' }}>Юра Захарчук (Mercedes):</strong> орал по тим-радио на весь паддок, требуя отобрать у Сарджента суперлицензию — Логан постоянно парковался на апексах и блокировал атаки за подиум.
              </li>
              <li>
                <strong style={{ color: '#60A5FA' }}>Микола Ярема (Red Bull):</strong> чуть не поседел в связке поворотов, когда Сарджент на синих флагах решил «посоревноваться» и чуть не впечатал Red Bull лидера сезона в бетонную стену.
              </li>
              <li>
                <strong style={{ color: '#00D2BE' }}>Сашко Громов (Mercedes):</strong> после хет-трика побед прямо заявил стюардам: <em>«Либо вы убираете этого американского туриста, либо я лично вытолкаю его в гравий!»</em>
              </li>
              <li>
                <strong style={{ color: '#60A5FA' }}>Денис Коваленко (Red Bull):</strong> предложил обменять Логана на самокат: <em>«Даже машина безопасности едет быстрее и агрессивнее Сарджента!»</em>
              </li>
            </ul>
          </div>

          {/* New Hero: Mark (not Webber) */}
          <div style={{
            background: 'rgba(0, 163, 224, 0.12)',
            border: '1.5px solid rgba(0, 163, 224, 0.45)',
            borderRadius: '10px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <img
              src="/portraits/mark.png"
              alt="Mark"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #00A3E0',
                boxShadow: '0 4px 16px rgba(0, 163, 224, 0.4)',
                flexShrink: 0
              }}
            />
            <div>
              <div style={{ color: '#38BDF8', fontWeight: '900', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                НОВЫЙ БОЕВОЙ ПИЛОТ WILLIAMS & MERCEDES JUNIOR TEAM
              </div>
              <div style={{ color: '#FFF', fontWeight: '900', fontSize: '1.15rem', fontStyle: 'italic' }}>
                МАРК (НЕ УЕББЕР) 🇺🇦
              </div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '2px' }}>
                Подписан в обновленную юниорскую команду Williams, чтобы навести порядок, кошмарить Red Bull и Mercedes и привозить долгожданные очки!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
