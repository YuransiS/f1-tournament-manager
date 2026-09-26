import React, { useState } from 'react';
import { Zap, AlertTriangle, ShieldCheck, Trophy, HeartPulse, Scale, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import TeamLogo from './TeamLogo';

export default function F1MonzaEmergencyAnnouncement() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #090B14 0%, #0F1322 45%, #180D12 100%)',
      borderRadius: '16px',
      border: '2px solid #E10600',
      boxShadow: '0 20px 50px rgba(225, 6, 0, 0.25), 0 10px 30px rgba(0,0,0,0.9)',
      padding: '24px 28px',
      marginBottom: '32px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background ambient red/gold glow */}
      <div style={{
        position: 'absolute',
        top: '-25%',
        right: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(225, 6, 0, 0.22) 0%, rgba(255, 215, 0, 0.08) 50%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid rgba(225, 6, 0, 0.3)',
        paddingBottom: '14px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: '#E10600',
            color: '#FFF',
            padding: '5px 14px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: '900',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 0 15px rgba(225,6,0,0.7)'
          }}>
            <Zap size={15} fill="#FFF" /> OFFICIAL F1 BREAKING BULLETIN
          </span>
          <span style={{ fontSize: '0.82rem', color: '#F87171', fontWeight: '800' }}>
            DOC 48 • ITALIAN GP MONZA 2026
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid #F59E0B',
            color: '#FBBF24',
            padding: '4px 12px',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <HeartPulse size={14} /> MEDICAL & FIA VERDICT
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-sm"
            style={{ padding: '4px 10px', fontSize: '0.75rem', background: '#161B28' }}
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {isExpanded ? 'Свернуть' : 'Подробнее'}
          </button>
        </div>
      </div>

      {/* Main Headline */}
      <div style={{ marginBottom: isExpanded ? '24px' : '0' }}>
        <h2 style={{
          fontSize: '1.55rem',
          fontWeight: '900',
          fontStyle: 'italic',
          letterSpacing: '0.5px',
          color: '#FFF',
          margin: '0 0 8px 0',
          lineHeight: '1.25'
        }}>
          ХРАМ СКОРОСТИ (МОНЦА): ЕКСТРЕНА ЗАМІНА В RED BULL ТА ВЕРДИКТ FIA ЩОДО РЕСТАРТУ
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#CBD5E1', margin: 0, lineHeight: '1.5' }}>
          Денис Коваленко пропустив етап через раптову хворобу. Резервіст Вадим Манштейн (<strong>_erich_manstein_</strong>) сходу піднявся на подіум (P3), а суддівська колегія скасувала помилковий баг гри з дискваліфікацією Юрія Захарчука.
        </p>
      </div>

      {isExpanded && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          marginTop: '16px'
        }}>
          {/* Box 1: Red Bull Medical Update & Vadim Manstein Debut */}
          <div style={{
            background: 'rgba(30, 65, 255, 0.08)',
            border: '1px solid rgba(30, 65, 255, 0.4)',
            borderLeft: '4px solid #1E41FF',
            borderRadius: '12px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#60A5FA', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  🏥 МЕДИЧНИЙ БЮЛЕТЕНЬ RED BULL
                </span>
                <TeamLogo teamId="red-bull" size="sm" />
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                  {/* Denys (Medical Bulletin) */}
                  <div style={{
                    width: '74px',
                    height: '116px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '2px solid #EF4444',
                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                    position: 'relative'
                  }}>
                    <img
                      src="/portraits/denya_standing_9-16_with_backjground.png"
                      alt="Denys Kovalenko"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(239,68,68,0.9)', fontSize: '8px', fontWeight: '900', textAlign: 'center', color: '#FFF', padding: '1px 0' }}>
                      OUT (ХВОРИЙ)
                    </div>
                  </div>

                  {/* Vadim (Debut Podium) */}
                  <div style={{
                    width: '74px',
                    height: '116px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '2px solid #1E41FF',
                    boxShadow: '0 4px 14px rgba(30, 65, 255, 0.4)',
                    position: 'relative'
                  }}>
                    <img
                      src="/portraits/manstein.png"
                      alt="Vadim Manstein"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(30,65,255,0.9)', fontSize: '8px', fontWeight: '900', textAlign: 'center', color: '#FFF', padding: '1px 0' }}>
                      IN (P3 PODIUM)
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: '180px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#FFF', margin: '0 0 6px 0' }}>
                    Заміна пілота: Вадим Манштейн у боліді #17
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.55', margin: 0 }}>
                    Перед стартом вікенду в Монці лідер заліку <strong>Денис Коваленко</strong> відчув гостре нездужання та за рекомендацією медичної делегації FIA був відсторонений від участі в гонці для відновлення.
                  </p>
                </div>
              </div>
              <div style={{
                marginTop: '14px',
                padding: '10px 14px',
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '8px',
                border: '1px dashed #3B82F6',
                fontSize: '0.82rem',
                color: '#E2E8F0'
              }}>
                🥉 <strong>Сенсаційний подіум:</strong> Вадим «Еріх» Манштейн сів за кермо боліда Red Bull та фінішував на 3-му місці, принісши собі та Red Bull 15 очок в особистий залік та Кубок конструкторів!
              </div>
            </div>
          </div>

          {/* Box 2: Mark Safety Car Crash Incident */}
          <div style={{
            background: 'rgba(0, 160, 222, 0.08)',
            border: '1px solid rgba(0, 160, 222, 0.4)',
            borderLeft: '4px solid #00A0DE',
            borderRadius: '12px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  🚨 INCIDENT REPORT • WILLIAMS
                </span>
                <TeamLogo teamId="williams" size="sm" />
              </div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'radial-gradient(circle, rgba(0,160,222,0.3) 0%, rgba(10,14,24,0.9) 100%)',
                  border: '1px solid #00A0DE',
                  flexShrink: 0
                }}>
                  <img
                    src="/portraits/mark.png"
                    alt="Mark"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#FFF', margin: '0 0 6px 0' }}>
                    Марк розбив Williams: виїзд Safety Car
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: '1.5', margin: 0 }}>
                    Пілот Williams <strong>Марк</strong> не впорався з керуванням на швидкісній ділянці Монци, врізався у відбійник і оформив сход з дистанції (DNF).
                  </p>
                </div>
              </div>
              <div style={{
                marginTop: '14px',
                padding: '10px 14px',
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '8px',
                border: '1px dashed #00A0DE',
                fontSize: '0.82rem',
                color: '#BAE6FD'
              }}>
                🏎️💨 <strong>Нейтралізація гонки:</strong> Аварія викликала появу <strong>Safety Car (Бернд Майлендер)</strong>, що збило весь пелотон і призвело до скандального рестарту з багом гри.
              </div>
            </div>
          </div>

          {/* Box 3: Official FIA Stewards Verdict */}
          <div style={{
            background: 'rgba(225, 6, 0, 0.08)',
            border: '1px solid rgba(225, 6, 0, 0.4)',
            borderLeft: '4px solid var(--f1-gold)',
            borderRadius: '12px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--f1-gold)', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  ⚖️ РІШЕННЯ СТЮАРДІВ FIA
                </span>
                <Scale size={18} color="var(--f1-gold)" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#FFF', marginBottom: '8px' }}>
                Анулювання системної DSQ Юрія Захарчука
              </h3>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginTop: '10px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                  {/* Yurii Zakharchuk */}
                  <div style={{
                    width: '74px',
                    height: '116px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '2px solid var(--f1-silver)',
                    boxShadow: '0 4px 14px rgba(192, 192, 192, 0.3)',
                    position: 'relative'
                  }}>
                    <img
                      src="/portraits/yura_standing_9-16_with_backjground.png"
                      alt="Yurii Zakharchuk"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,161,155,0.9)', fontSize: '8px', fontWeight: '900', textAlign: 'center', color: '#FFF', padding: '1px 0' }}>
                      P2 RESTORED
                    </div>
                  </div>

                  {/* Mykola Yarema */}
                  <div style={{
                    width: '74px',
                    height: '116px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '2px solid var(--f1-gold)',
                    boxShadow: '0 4px 14px rgba(255, 215, 0, 0.4)',
                    position: 'relative'
                  }}>
                    <img
                      src="/portraits/kolya_standing_9-16_with_backjground.png"
                      alt="Mykola Yarema"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(255,215,0,0.9)', fontSize: '8px', fontWeight: '900', textAlign: 'center', color: '#000', padding: '1px 0' }}>
                      P1 WINNER
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: '160px' }}>
                  <p style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: '1.5', margin: 0 }}>
                    Під час рестарту після аварії Марка внаслідок збою мережевого коду F1 23 боліду <strong>Юрія Захарчука (KillerplautzeGer)</strong> було безпідставно виписано технічну дискваліфікацію (DSQ).
                  </p>
                </div>
              </div>

              <div style={{
                marginTop: '12px',
                padding: '10px 14px',
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                fontSize: '0.82rem',
                color: '#FEF08A'
              }}>
                ✅ <strong>Офіційна класифікація:</strong> Стюарди відновили Юрія на заслуженому <strong>2-му місці (18 очок)</strong>. Перемогу здобув <strong>Микола Ярема (25 + 1 FL = 26 очок)</strong>, <strong>Сашко Громов</strong> — 7-й (6 очок).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
