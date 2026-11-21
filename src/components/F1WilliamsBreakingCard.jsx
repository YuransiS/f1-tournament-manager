import React, { useRef, useState } from 'react';
import { Camera, ChevronDown, ChevronUp, FileText, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';

/** Official Williams Racing 2027-1 line-up BREAKING card and press release. */
export default function F1WilliamsBreakingCard({
  mykolaDriver,
  denysDriver,
  constructorStandings = [],
  driverStandings = [],
  races = [],
  defaultCollapsed = false
}) {
  const posterRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const mykolaImg = mykolaDriver?.avatar || '/portraits/kolya_williams_nobg.png';
  const denysImg = denysDriver?.avatar || '/portraits/denya_williams_nobg.png';

  // Derive live Williams telemetry from standings with safe fallbacks
  const williamsIdx = constructorStandings.findIndex((c) => c.team?.id === 'williams');
  const williamsEntry = williamsIdx >= 0 ? constructorStandings[williamsIdx] : null;
  const williamsRank = williamsIdx >= 0 ? `P${williamsIdx + 1}` : 'P2';
  const williamsPoints = williamsEntry ? williamsEntry.totalPoints : 60;

  const mykolaStats = driverStandings.find((d) => d.driver?.id === 'drv-6');
  const denysStats = driverStandings.find((d) => d.driver?.id === 'drv-17');
  const sprintWins = (mykolaStats?.sprintWins || 0) + (denysStats?.sprintWins || 0);
  const gpPodiums = (mykolaStats?.podiums || 0) + (denysStats?.podiums || 0);
  const completedGpsCount = races.filter(
    (r) => !r.isSprint && (r.status === 'completed' || r.status === 'FINISHED')
  ).length;
  const highlightStat =
    sprintWins > 0 || gpPodiums > 0
      ? `${sprintWins} Спринт • ${gpPodiums} Подиум`
      : `0 / ${completedGpsCount || 3}`;

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
      link.download = 'F1_BREAKING_WILLIAMS_YAREMA_KOVALENKO_2027.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export Williams breaking poster:', err);
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
          background: 'linear-gradient(90deg, #04142E 0%, #07224D 100%)',
          border: '1px solid rgba(0, 163, 224, 0.4)',
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
              background: 'linear-gradient(135deg, #0039A6 0%, #00A3E0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 900,
              boxShadow: '0 0 14px rgba(0, 163, 224, 0.4)'
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
                  color: '#38BDF8',
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
                  background: 'rgba(0, 163, 224, 0.16)',
                  color: '#00A3E0',
                  border: '1px solid rgba(0, 163, 224, 0.4)'
                }}
              >
                WILLIAMS RACING • GROVE
              </span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
              BREAKING: Чемпион мира Ярема (#67) и Коваленко (#88) переходят в Williams Racing
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
              border: '1px solid rgba(0, 163, 224, 0.45)',
              background: 'rgba(0, 57, 166, 0.5)',
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
              {/* LEFT: Official F1 BREAKING Graphic Poster (Williams Grove Broadcast Edition) */}
              <div
                ref={posterRef}
                style={{
                  position: 'relative',
                  width: '100%',
                  minHeight: '480px',
                  aspectRatio: '1 / 1',
                  background: 'radial-gradient(circle at 50% 40%, #0A2454 0%, #020B1A 100%)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
                  border: '1px solid rgba(0, 163, 224, 0.45)',
                  display: 'flex',
                  flexDirection: 'column',
                  userSelect: 'none'
                }}
              >
                {/* TOP BREAKING RIBBON (Diagonal F1 Broadcast Style) */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 5,
                    background: 'linear-gradient(135deg, #0039A6 0%, #0066FF 55%, #00A3E0 100%)',
                    padding: '14px 22px 22px',
                    clipPath: 'polygon(0 0, 100% 0, 100% 76%, 16% 76%, 0 100%)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    flexShrink: 0
                  }}
                >
                  {/* Official F1 Mark */}
                  <svg width="58" height="22" viewBox="0 0 120 30" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M12.5 28L25.5 15H68.5L76.5 7H22.5C15.5 7 9.8 10 5.5 14.5L0 20L12.5 28Z" fill="#FFFFFF" />
                    <path d="M30 28L39.5 18.5H65L57 28H30Z" fill="#FFFFFF" />
                    <path d="M84 7H102L81 28H63L84 7Z" fill="#FFFFFF" />
                  </svg>
                  <div
                    style={{
                      fontSize: 'clamp(2.1rem, 4.4vw, 3.05rem)',
                      fontWeight: 900,
                      letterSpacing: '0.04em',
                      color: '#FFFFFF',
                      lineHeight: 0.9,
                      textTransform: 'uppercase',
                      fontFamily: "'Titillium Web', sans-serif",
                      textShadow: '0 2px 10px rgba(0,0,0,0.25)'
                    }}
                  >
                    BREAKING
                  </div>
                </div>

                {/* CENTER STAGE: Square Bust Cutouts Framed Without Cropping + Grove Backdrop */}
                <div
                  style={{
                    position: 'relative',
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    alignItems: 'stretch',
                    marginTop: '-16px',
                    marginBottom: '-24px',
                    overflow: 'hidden'
                  }}
                >
                  {/* Subtle Silverstone (British GP / Grove) track backdrop */}
                  <img
                    src="/tracks/silverstone.jpg"
                    alt=""
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.2,
                      filter: 'grayscale(55%) contrast(1.2) hue-rotate(190deg) saturate(1.4)',
                      pointerEvents: 'none'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(circle at 50% 45%, rgba(0,102,255,0.2) 0%, rgba(2,11,26,0.82) 100%)',
                      pointerEvents: 'none'
                    }}
                  />
                  {/* Subtle Williams diagonal racing chevron stripe */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'repeating-linear-gradient(-35deg, rgba(0,163,224,0.045) 0px, rgba(0,163,224,0.045) 14px, transparent 14px, transparent 36px)',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Centered white-inverted Williams W watermark */}
                  <img
                    src="/teams/williams.png"
                    alt=""
                    style={{
                      position: 'absolute',
                      top: '44%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '54%',
                      objectFit: 'contain',
                      opacity: 0.08,
                      filter: 'brightness(0) invert(1)',
                      pointerEvents: 'none',
                      zIndex: 1
                    }}
                  />

                  {/* Oversized faded italic racing numbers behind drivers */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '6%',
                      left: '4%',
                      fontSize: 'clamp(4.2rem, 8vw, 6.2rem)',
                      fontWeight: 900,
                      fontStyle: 'italic',
                      fontFamily: "'Titillium Web', sans-serif",
                      lineHeight: 0.85,
                      color: 'rgba(255, 215, 0, 0.13)',
                      letterSpacing: '-0.04em',
                      pointerEvents: 'none',
                      zIndex: 1
                    }}
                  >
                    67
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '6%',
                      right: '4%',
                      fontSize: 'clamp(4.2rem, 8vw, 6.2rem)',
                      fontWeight: 900,
                      fontStyle: 'italic',
                      fontFamily: "'Titillium Web', sans-serif",
                      lineHeight: 0.85,
                      color: 'rgba(56, 189, 248, 0.14)',
                      letterSpacing: '-0.04em',
                      pointerEvents: 'none',
                      zIndex: 1
                    }}
                  >
                    88
                  </div>

                  {/* Subtle center vertical glow */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10%',
                      bottom: '10%',
                      left: '50%',
                      width: '1px',
                      background: 'linear-gradient(180deg, transparent 0%, rgba(0,163,224,0.45) 50%, transparent 100%)',
                      zIndex: 2
                    }}
                  />

                  {/* Mykola Yarema (Bottom-aligned full-width contain cutout) */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 3,
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      paddingBottom: '12px'
                    }}
                  >
                    <img
                      src={mykolaImg}
                      alt="Mykola Yarema Williams Racing"
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '94%',
                        objectFit: 'contain',
                        objectPosition: 'center bottom',
                        transform: 'scale(1.12)',
                        transformOrigin: 'center bottom',
                        filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.75))'
                      }}
                    />

                    {/* Lower-third frosted nameplate (left) */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '34px',
                        left: '10px',
                        right: '10px',
                        background: 'rgba(2, 11, 26, 0.82)',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255, 215, 0, 0.45)',
                        borderLeft: '3px solid #FFD700',
                        borderRadius: '7px',
                        padding: '5px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px',
                        zIndex: 4
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 900,
                          color: '#FFFFFF',
                          letterSpacing: '0.04em',
                          fontFamily: "'Titillium Web', sans-serif"
                        }}
                      >
                        #67 • YAREMA
                      </span>
                      <span
                        style={{
                          fontSize: '0.58rem',
                          fontWeight: 900,
                          color: '#020B1A',
                          background: '#FFD700',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          letterSpacing: '0.05em',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        2026 CHAMP
                      </span>
                    </div>
                  </div>

                  {/* Denys Kovalenko (Bottom-aligned full-width contain cutout) */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 3,
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      paddingBottom: '12px'
                    }}
                  >
                    <img
                      src={denysImg}
                      alt="Denys Kovalenko Williams Racing"
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '94%',
                        objectFit: 'contain',
                        objectPosition: 'center bottom',
                        transform: 'scale(1.12)',
                        transformOrigin: 'center bottom',
                        filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.75))'
                      }}
                    />

                    {/* Lower-third frosted nameplate (right) */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '34px',
                        left: '10px',
                        right: '10px',
                        background: 'rgba(2, 11, 26, 0.82)',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(0, 163, 224, 0.5)',
                        borderLeft: '3px solid #F59E0B',
                        borderRadius: '7px',
                        padding: '5px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px',
                        zIndex: 4
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 900,
                          color: '#FFFFFF',
                          letterSpacing: '0.04em',
                          fontFamily: "'Titillium Web', sans-serif"
                        }}
                      >
                        #88 • KOVALENKO
                      </span>
                      <span
                        style={{
                          fontSize: '0.58rem',
                          fontWeight: 900,
                          color: '#020B1A',
                          background: '#F59E0B',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          letterSpacing: '0.05em',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        2026 P3
                      </span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM ANNOUNCEMENT BANNER (Diagonal Williams Grove Style) */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 5,
                    background: 'linear-gradient(135deg, #002F87 0%, #005AFF 55%, #00A3E0 100%)',
                    padding: '42px 22px 16px',
                    clipPath: 'polygon(0 24%, 82% 24%, 100% 0, 100% 100%, 0 100%)',
                    boxShadow: '0 -10px 30px rgba(0,0,0,0.55)',
                    flexShrink: 0
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <img
                      src="/teams/williams.png"
                      alt="Williams Racing"
                      style={{ height: '22px', objectFit: 'contain', filter: 'brightness(0) invert(1) drop-shadow(0 1px 3px rgba(0,0,0,0.4))' }}
                    />
                    <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#BAE6FD', letterSpacing: '0.12em' }}>
                      WILLIAMS RACING • GROVE
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: 'clamp(1.05rem, 2.1vw, 1.3rem)',
                        fontWeight: 800,
                        letterSpacing: '0.06em',
                        color: '#BAE6FD',
                        textTransform: 'uppercase',
                        textShadow: '0 1px 4px rgba(0,0,0,0.25)'
                      }}
                    >
                      WILLIAMS RACING SIGN
                    </div>
                    <div
                      style={{
                        fontSize: 'clamp(1.45rem, 2.9vw, 1.95rem)',
                        fontWeight: 900,
                        letterSpacing: '0.02em',
                        color: '#FFFFFF',
                        textTransform: 'uppercase',
                        lineHeight: 1.05,
                        marginTop: '2px',
                        textShadow: '0 2px 10px rgba(0,0,0,0.35)'
                      }}
                    >
                      YAREMA &amp; KOVALENKO
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Realistic Official Williams Racing F1 Press Release */}
              <div
                className="card"
                style={{
                  background: 'linear-gradient(160deg, #051126 0%, #0C1524 100%)',
                  border: '1px solid rgba(0, 163, 224, 0.28)',
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
                      <ShieldCheck size={18} style={{ color: '#38BDF8' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: '#38BDF8' }}>
                        GROVE, OXFORDSHIRE • OFFICIAL STATEMENT
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      SEASON 2027-1 • CHAMPION LINE-UP
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
                    Williams Racing официально подписывает чемпиона мира Миколу Ярему и Дениса Коваленко
                  </h3>

                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#CBD5E1', marginBottom: '14px' }}>
                    Британская конюшня <strong style={{ color: '#FFFFFF' }}>Williams Racing</strong> официально подтверждает главный трансфер межсезонья: действующий чемпион мира 2026 года{' '}
                    <strong style={{ color: '#FFD700' }}>Микола Ярема (#67)</strong> и бронзовый призёр чемпионата{' '}
                    <strong style={{ color: '#38BDF8' }}>Денис Коваленко (#88)</strong> покидают Red Bull Racing и переходят единым составом в Гроув на сезон 2027-1.
                  </p>

                  {/* Quotes */}
                  <div
                    style={{
                      background: 'rgba(255, 215, 0, 0.08)',
                      borderLeft: '3px solid #FFD700',
                      borderRadius: '0 10px 10px 0',
                      padding: '12px 14px',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#FFD700', marginBottom: '4px' }}>
                      Микола Ярема / kolyacoolguy (#67, Williams Racing):
                    </div>
                    <div style={{ fontSize: '0.86rem', fontStyle: 'italic', color: '#E2E8F0', lineHeight: 1.5 }}>
                      «После завоевания титула в 2026 году нам был нужен настоящий исторический вызов. Вернуть имя Williams на вершину Формулы-1 — цель, ради которой мы с Денисом объединились в Гроуве. Победа в спринте Австрии и поул-позиция в первый же уик-энд показали наш реальный темп».
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(0, 163, 224, 0.1)',
                      borderLeft: '3px solid #00A3E0',
                      borderRadius: '0 10px 10px 0',
                      padding: '12px 14px',
                      marginBottom: '14px'
                    }}
                  >
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#38BDF8', marginBottom: '4px' }}>
                      Денис Коваленко / ProstoDenya (#88, Williams Racing):
                    </div>
                    <div style={{ fontSize: '0.86rem', fontStyle: 'italic', color: '#E2E8F0', lineHeight: 1.5 }}>
                      «Мы идеально понимаем друг друга на трассе и за её пределами — наш Кубок конструкторов это доказал. В Williams собралась мотивированная команда: после прорыва P20→P6 в Австрии и подиума P2 в Венгрии мы нацелены бороться за победы на каждом этапе».
                    </div>
                  </div>

                  {/* Key Facts / Grove Project Context */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      fontSize: '0.82rem',
                      lineHeight: 1.55,
                      color: '#94A3B8'
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Гроув перезагружает проект 2027-1:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <li>
                        <strong style={{ color: '#38BDF8' }}>Чемпионский тандем:</strong> пара, набравшая 714 очков и Кубок конструкторов в 2026 году, переходит единым составом на шасси Williams с силовыми установками Mercedes-AMG.
                      </li>
                      <li>
                        <strong style={{ color: '#60A5FA' }}>Эффект на рынок пилотов:</strong> уход Яремы и Коваленко вынудил <strong style={{ color: '#E2E8F0' }}>Red Bull Racing</strong> экстренно пересобрать состав с <strong style={{ color: '#E2E8F0' }}>Максом Ферстаппеном (#1)</strong> и <strong style={{ color: '#E2E8F0' }}>Серхио Пересом (#11)</strong>, в то время как <strong style={{ color: '#E2E8F0' }}>Aston Martin</strong> подписала Захарчука и Писаренко.
                      </li>
                      <li>
                        <strong style={{ color: '#FFD700' }}>Мгновенный результат:</strong> победа в спринте Австрии (#67), поул в основной гонке на Ред Булл Ринге (#67) и подиум P2 на Гран-при Венгрии (#88).
                      </li>
                    </ul>
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
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFD700' }}>{williamsRank}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                      Кубок конструкторов
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#38BDF8' }}>{williamsPoints}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                      Очков команды
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.4 }}>{highlightStat}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                      Победы / Подиумы
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
