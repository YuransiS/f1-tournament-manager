import React, { useRef, useState } from 'react';
import { Camera, ChevronDown, ChevronUp, FileText, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import FlagIcon from './FlagIcon';

export default function F1AstonMartinBreakingCard({ yuriiDriver, sashkoDriver }) {
  const posterRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const yuriiImg = yuriiDriver?.avatarFullWithBg || '/portraits/yura_aston_standing.jpg';
  const sashkoImg = sashkoDriver?.avatarFullWithBg || '/portraits/sashko_standing_9-16_with_backjground.png';

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(posterRef.current, {
        quality: 0.98,
        cacheBust: true,
        pixelRatio: 2
      });
      const link = document.createElement('a');
      link.download = 'F1_BREAKING_ASTON_MARTIN_ZAKHARCHUK_PISARENKO_2027.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export breaking poster:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Top Control Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(90deg, #031F1B 0%, #062E28 100%)',
          border: '1px solid rgba(0, 210, 190, 0.35)',
          borderRadius: '14px',
          padding: '12px 18px',
          marginBottom: '12px',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #006F62 0%, #00D2BE 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#031A17',
              fontWeight: 900,
              boxShadow: '0 0 14px rgba(0, 210, 190, 0.35)'
            }}
          >
            <FileText size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  color: '#CEDC00',
                  textTransform: 'uppercase'
                }}
              >
                OFFICIAL F1 PRESS RELEASE • 2027-1
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(0, 210, 190, 0.16)',
                  color: '#00D2BE',
                  border: '1px solid rgba(0, 210, 190, 0.35)'
                }}
              >
                ASTON MARTIN ARAMCO F1
              </span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
              BREAKING: Захарчук (#69) та Писаренко (#95) переходять до Aston Martin
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleDownload}
            disabled={isExporting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(0, 210, 190, 0.4)',
              background: 'rgba(0, 111, 98, 0.45)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: isExporting ? 'wait' : 'pointer'
            }}
          >
            <Camera size={15} />
            {isExporting ? 'Экспорт...' : 'Скачать BREAKING PNG'}
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Развернуть пресс-релиз' : 'Свернуть пресс-релиз'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '20px',
                alignItems: 'stretch'
              }}
            >
              {/* LEFT: Official F1 BREAKING Graphic Poster (Matching Reference Layout) */}
              <div
                ref={posterRef}
                style={{
                  position: 'relative',
                  width: '100%',
                  minHeight: '540px',
                  aspectRatio: '4 / 5',
                  background: '#1E2428',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(0, 210, 190, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  userSelect: 'none'
                }}
              >
                {/* Studio Background Split (Left & Right Driver Photos instead of Cars) */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    background: 'radial-gradient(circle at 50% 35%, #374147 0%, #171B1E 100%)'
                  }}
                >
                  {/* Yurii Zakharchuk */}
                  <div style={{ position: 'relative', overflow: 'hidden', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                    <img
                      src={yuriiImg}
                      alt="Yurii Zakharchuk Aston Martin"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                        transform: 'scale(1.04)'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 25%, transparent 65%, rgba(0,0,0,0.6) 100%)'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '132px',
                        left: '14px',
                        zIndex: 4,
                        background: 'rgba(3, 31, 27, 0.85)',
                        borderLeft: '3px solid #CEDC00',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        backdropFilter: 'blur(6px)'
                      }}
                    >
                      <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#CEDC00', letterSpacing: '0.08em' }}>
                        #69 • UA
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase' }}>
                        ZAKHARCHUK
                      </div>
                    </div>
                  </div>

                  {/* Alexsandr Pisarenko */}
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={sashkoImg}
                      alt="Alexsandr Pisarenko Aston Martin"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                        transform: 'scale(1.04)'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 25%, transparent 65%, rgba(0,0,0,0.6) 100%)'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '132px',
                        right: '14px',
                        zIndex: 4,
                        background: 'rgba(3, 31, 27, 0.85)',
                        borderRight: '3px solid #00D2BE',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        textAlign: 'right',
                        backdropFilter: 'blur(6px)'
                      }}
                    >
                      <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#00D2BE', letterSpacing: '0.08em' }}>
                        #95 • UA
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase' }}>
                        PISARENKO
                      </div>
                    </div>
                  </div>
                </div>

                {/* TOP BREAKING RIBBON (Diagonal F1 Broadcast Style) */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 5,
                    background: 'linear-gradient(135deg, #006F62 0%, #008C7A 60%, #006F62 100%)',
                    padding: '14px 20px 18px',
                    clipPath: 'polygon(0 0, 100% 0, 100% 78%, 18% 78%, 0 100%)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  {/* Official F1 Mark */}
                  <svg width="58" height="22" viewBox="0 0 120 30" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M12.5 28L25.5 15H68.5L76.5 7H22.5C15.5 7 9.8 10 5.5 14.5L0 20L12.5 28Z" fill="#061412" />
                    <path d="M30 28L39.5 18.5H65L57 28H30Z" fill="#061412" />
                    <path d="M84 7H102L81 28H63L84 7Z" fill="#061412" />
                  </svg>
                  <div
                    style={{
                      fontSize: 'clamp(2.1rem, 4.5vw, 3.1rem)',
                      fontWeight: 900,
                      letterSpacing: '0.04em',
                      color: '#061412',
                      lineHeight: 0.9,
                      textTransform: 'uppercase',
                      fontFamily: "'Titillium Web', sans-serif"
                    }}
                  >
                    BREAKING
                  </div>
                </div>

                {/* BOTTOM ANNOUNCEMENT BANNER (Diagonal Aston Martin Style) */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 5,
                    background: 'linear-gradient(135deg, #006F62 0%, #008C7A 75%, #00594F 100%)',
                    padding: '28px 22px 18px',
                    clipPath: 'polygon(0 28%, 82% 28%, 100% 0, 100% 100%, 0 100%)',
                    boxShadow: '0 -10px 30px rgba(0,0,0,0.5)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <img
                      src="/teams/aston-martin.png"
                      alt="Aston Martin"
                      style={{ height: '24px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                    />
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#CEDC00', letterSpacing: '0.12em' }}>
                      ARAMCO F1 TEAM
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: 'clamp(1.05rem, 2.2vw, 1.35rem)',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        color: '#E2F5F2',
                        textTransform: 'uppercase'
                      }}
                    >
                      ASTON MARTIN SIGN
                    </div>
                    <div
                      style={{
                        fontSize: 'clamp(1.45rem, 3vw, 2.05rem)',
                        fontWeight: 900,
                        letterSpacing: '0.02em',
                        color: '#061412',
                        textTransform: 'uppercase',
                        lineHeight: 1.05,
                        marginTop: '2px'
                      }}
                    >
                      ZAKHARCHUK &amp; PISARENKO
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Realistic Official Aston Martin F1 Press Release */}
              <div
                className="card"
                style={{
                  background: 'linear-gradient(160deg, #0A1715 0%, #10161E 100%)',
                  border: '1px solid rgba(0, 210, 190, 0.25)',
                  borderRadius: '14px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      paddingBottom: '12px',
                      marginBottom: '16px',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldCheck size={18} style={{ color: '#00D2BE' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: '#00D2BE' }}>
                        SILVERSTONE, UK • OFFICIAL STATEMENT
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      SEASON 2027-1 • MULTI-YEAR DEAL
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      lineHeight: 1.25,
                      marginBottom: '14px'
                    }}
                  >
                    Aston Martin Aramco официально подписывает Юрия Захарчука и Сашка Писаренко
                  </h3>

                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#CBD5E1', marginBottom: '14px' }}>
                    Команда <strong style={{ color: '#FFFFFF' }}>Aston Martin Aramco Cognizant F1 Team</strong> официально подтверждает подписание контракта с вице-чемпионом мира 2026 года{' '}
                    <strong style={{ color: '#CEDC00' }}>Юрием Захарчуком (#69)</strong> и победителем гонок{' '}
                    <strong style={{ color: '#00D2BE' }}>Александром Писаренко (#95)</strong>. Украинский дуэт, ранее выступавший за Mercedes-AMG Petronas, возглавит проект в Сильверстоуне в сезоне 2027-1.
                  </p>

                  {/* Quotes */}
                  <div
                    style={{
                      background: 'rgba(0, 111, 98, 0.16)',
                      borderLeft: '3px solid #CEDC00',
                      borderRadius: '0 10px 10px 0',
                      padding: '12px 14px',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#CEDC00', marginBottom: '4px' }}>
                      Юрий Захарчук (#69, Aston Martin):
                    </div>
                    <div style={{ fontSize: '0.86rem', fontStyle: 'italic', color: '#E2E8F0', lineHeight: 1.5 }}>
                      «После борьбы за титул до финальных этапов в 2026 году нам был нужен новый вызов и максимальная свобода в разработке машины. В Сильверстоуне собрана невероятная команда, и наша цель с первых этапов — Кубок конструкторов и титул чемпиона мира».
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(0, 210, 190, 0.08)',
                      borderLeft: '3px solid #00D2BE',
                      borderRadius: '0 10px 10px 0',
                      padding: '12px 14px',
                      marginBottom: '14px'
                    }}
                  >
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#00D2BE', marginBottom: '4px' }}>
                      Александр Писаренко / PABV (#95, Aston Martin):
                    </div>
                    <div style={{ fontSize: '0.86rem', fontStyle: 'italic', color: '#E2E8F0', lineHeight: 1.5 }}>
                      «Переход в Aston Martin вместе с Юрой — идеальный шаг. Мы уже сработали как единый механизм, и старт в Австрии и Венгрии доказал, что у зелёного болида есть скорость побеждать с первых метров дистанции».
                    </div>
                  </div>
                </div>

                {/* Live Season Impact Telemetry */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                    paddingTop: '14px',
                    borderTop: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#CEDC00' }}>P1</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                      Кубок конструкторов
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#00D2BE' }}>80</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                      Очков команды
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>2 / 3</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                      Побед в ГП
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
