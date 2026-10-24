import React, { useRef, useState } from 'react';
import { Trophy, Award, Sparkles, Camera, ChevronDown, ChevronUp, CheckCircle2, ShieldCheck, Medal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import FlagIcon from './FlagIcon';

export default function F1ViceChampionCard({ runnerUp, thirdPlace }) {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [heroMode, setHeroMode] = useState('art'); // 'art' (wide outpainted poster) or 'photo' (standing cutout)

  const viceName = runnerUp?.driver?.name || 'Yurii ZAKHARCHUK';
  const vicePoints = runnerUp?.totalPoints || 390;
  const viceWins = runnerUp?.wins || 10;
  const vicePodiums = runnerUp?.podiums || 19;
  const thirdPoints = thirdPlace?.totalPoints || 255;
  const pointsGapP3 = Math.max(0, vicePoints - thirdPoints); // 135 pts
  const teamName = runnerUp?.team?.name || 'Mercedes-AMG Petronas';
  const teamAccent = runnerUp?.team?.accentColor || '#00D2BE';

  const fireSilverConfetti = () => {
    try {
      confetti({
        particleCount: 55,
        angle: 60,
        spread: 65,
        origin: { x: 0.1, y: 0.5 },
        colors: ['#00D2BE', '#E2E8F0', '#FFFFFF', '#00A19B', '#94A3B8']
      });
      confetti({
        particleCount: 55,
        angle: 120,
        spread: 65,
        origin: { x: 0.9, y: 0.5 },
        colors: ['#00D2BE', '#E2E8F0', '#FFFFFF', '#00A19B', '#94A3B8']
      });
    } catch {
      // ignore
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.98,
        cacheBust: true,
        pixelRatio: 2
      });
      const link = document.createElement('a');
      link.download = `F1_2026_Vice_Champion_Yurii_Zakharchuk.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export vice champion card:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Top Header Controls Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(90deg, #09131C 0%, #0F1D28 100%)',
        border: '1px solid rgba(0, 210, 190, 0.35)',
        borderRadius: '16px',
        padding: '12px 20px',
        marginBottom: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00D2BE 0%, #00877C 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            boxShadow: '0 0 16px rgba(0, 210, 190, 0.45)'
          }}>
            <Medal size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#00D2BE', fontWeight: '900', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              OFFICIAL FIA WORLD CHAMPIONSHIP • 2ND PLACE
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '900', fontStyle: 'italic', margin: 0, color: '#FFF' }}>
              Серебряный Призёр Сезона: Вице-Чемпион Мира 2026!
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setHeroMode(heroMode === 'art' ? 'photo' : 'art')}
            className="btn btn-secondary"
            style={{
              padding: '8px 14px',
              fontSize: '0.85rem',
              fontWeight: '800',
              background: heroMode === 'art' ? 'rgba(0, 210, 190, 0.15)' : 'rgba(255,255,255,0.06)',
              border: heroMode === 'art' ? '1px solid rgba(0, 210, 190, 0.45)' : '1px solid rgba(255,255,255,0.2)',
              color: heroMode === 'art' ? '#00D2BE' : '#FFF'
            }}
            title="Переключить: Арт вице-чемпиона / Ростовое фото"
          >
            {heroMode === 'art' ? '⚡ Арт Вице-Чемпиона' : '👤 Фото Пилота'}
          </button>
          <button
            onClick={fireSilverConfetti}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: '800', background: 'rgba(0, 210, 190, 0.12)', color: '#00D2BE', border: '1px solid rgba(0, 210, 190, 0.35)' }}
          >
            <Sparkles size={16} /> Салют Серебра ✨
          </button>
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="btn btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '0.88rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #00A19B 0%, #00736E 100%)',
              border: '1px solid #00D2BE',
              boxShadow: '0 4px 18px rgba(0, 161, 155, 0.5)'
            }}
          >
            <Camera size={16} /> {isExporting ? 'Экспорт...' : '📸 Скачать Постер (PNG)'}
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="btn btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            title={isCollapsed ? 'Развернуть' : 'Свернуть'}
          >
            {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Scrollable Container for Touch Screens & Mobile */}
            <div className="broadcast-card-scroll-wrapper">
              {/* Target 16:9 Official Vice Champion Poster Canvas */}
              <div
                ref={cardRef}
                style={{
                  width: '100%',
                  minWidth: '940px',
                  aspectRatio: '16 / 9',
                  minHeight: '530px',
                  borderRadius: '24px',
                  background: '#070C12',
                  border: '2px solid rgba(0, 210, 190, 0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.95), inset 0 0 35px rgba(0, 210, 190, 0.1)',
                  color: '#FFF'
                }}
              >
                {/* Background Layer */}
                {heroMode === 'art' ? (
                  <>
                    {/* Seamless 16:9 Outpainted Wide Vice-Championship Background */}
                    <img
                      src="/portraits/yura_vice_champion_wide.jpg"
                      alt={viceName}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center center',
                        zIndex: 1
                      }}
                    />
                    {/* Cinematic Telemetry Contrast Gradient on the Right */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to right, transparent 0%, transparent 34%, rgba(7, 12, 18, 0.45) 52%, rgba(7, 12, 18, 0.92) 82%), linear-gradient(to bottom, rgba(7, 12, 18, 0.75) 0%, transparent 20%, transparent 75%, rgba(7, 12, 18, 0.7) 100%)',
                      pointerEvents: 'none',
                      zIndex: 2
                    }} />
                  </>
                ) : (
                  <>
                    {/* Fallback Track Background */}
                    <img
                      src="/tracks/spain.jpg"
                      alt="Circuit"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'brightness(0.3) contrast(1.2) grayscale(30%)',
                        zIndex: 1
                      }}
                    />
                    {/* Petronas Midnight Teal Gradient */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(circle at 75% 25%, rgba(0, 210, 190, 0.16) 0%, transparent 60%), linear-gradient(135deg, rgba(6, 16, 25, 0.96) 0%, rgba(9, 24, 34, 0.92) 50%, rgba(10, 18, 26, 0.95) 100%)',
                      zIndex: 2
                    }} />
                  </>
                )}

                {/* Layer 2.5: Speed Pattern Watermark */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0, rgba(255,255,255,0.015) 12px, transparent 12px, transparent 24px)',
                  pointerEvents: 'none',
                  zIndex: 3
                }} />

                {/* Layer 3: Top Official FIA Ribbon Banner */}
                <div style={{
                  position: 'absolute',
                  top: '24px',
                  left: '32px',
                  right: '32px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  zIndex: 10,
                  borderBottom: '1px solid rgba(0, 210, 190, 0.3)',
                  paddingBottom: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                      src="/F1-logo.png"
                      alt="Formula 1"
                      style={{
                        height: '28px',
                        width: 'auto',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 0 14px rgba(225,6,0,0.8))'
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '0.72rem', letterSpacing: '2px', color: '#00D2BE', fontWeight: '900', textTransform: 'uppercase' }}>
                        FEDERATION INTERNATIONALE DE L'AUTOMOBILE
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#FFFFFF', letterSpacing: '1px' }}>
                        FIA FORMULA 1 WORLD CHAMPIONSHIP • 2026 OFFICIAL VICE-CHAMPION
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(0, 210, 190, 0.15)',
                      border: '1px solid #00D2BE',
                      color: '#00D2BE',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontWeight: '900',
                      fontSize: '0.78rem',
                      letterSpacing: '1px'
                    }}>
                      <ShieldCheck size={16} /> МАТЕМАТИЧЕСКИЙ ВИЦЕ-ТИТУЛ ЗАКРЫТ
                    </div>
                  </div>
                </div>

                {/* Layer 4: Standing Driver Cutout (Active only in photo mode) */}
                {heroMode === 'photo' && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '44%',
                    zIndex: 8,
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'flex-end',
                    paddingLeft: '10%'
                  }}>
                    <img
                      src="/portraits/yura_standing_9-16_without_backjground.png"
                      alt={viceName}
                      onError={(e) => {
                        e.currentTarget.src = '/portraits/yura.png';
                      }}
                      style={{
                        height: '88%',
                        maxHeight: '480px',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 20px 45px rgba(0,0,0,0.95)) drop-shadow(0 0 30px rgba(0,210,190,0.3))'
                      }}
                    />
                    {/* Silver Trophy Silhouette behind pilot */}
                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      bottom: '20px',
                      transform: 'translateX(-50%)',
                      zIndex: -1,
                      opacity: 0.15,
                      filter: 'drop-shadow(0 0 35px #00D2BE)'
                    }}>
                      <Trophy size={360} color="#00D2BE" />
                    </div>
                  </div>
                )}

                {/* Layer 5: Right Authority Information & Typography Showcase */}
                <div style={{
                  position: 'absolute',
                  right: '48px',
                  top: '90px',
                  bottom: '30px',
                  width: '56%',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  {/* Category Pill with Team Logo */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <img
                      src="/teams/mercedes.svg"
                      alt="Mercedes-AMG Petronas"
                      style={{ height: '30px', width: 'auto', objectFit: 'contain' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: '900',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: '#00D2BE',
                      background: 'rgba(0, 210, 190, 0.12)',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(0, 210, 190, 0.35)'
                    }}>
                      🥈 VICE WORLD CHAMPION • СЕЗОН 2026
                    </span>
                  </div>

                  {/* Gigantic Pilot Name */}
                  <div style={{ marginBottom: '6px' }}>
                    <div style={{
                      fontFamily: 'Caveat, cursive',
                      fontSize: '2.5rem',
                      color: '#00D2BE',
                      lineHeight: '1.0',
                      textShadow: '0 0 15px rgba(0,210,190,0.6)',
                      transform: 'rotate(-2deg)',
                      display: 'inline-block'
                    }}>
                      Yurii
                    </div>
                    <div style={{
                      fontSize: '3.6rem',
                      fontWeight: '900',
                      letterSpacing: '3px',
                      lineHeight: '0.9',
                      textTransform: 'uppercase',
                      color: '#FFFFFF',
                      textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 0 30px rgba(0,210,190,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px'
                    }}>
                      ZAKHARCHUK
                      <FlagIcon countryCode="UA" style={{ width: '42px', height: '28px', borderRadius: '4px' }} />
                    </div>
                  </div>

                  {/* Team Subtitle */}
                  <div style={{
                    fontSize: '1.15rem',
                    fontWeight: '800',
                    color: '#93C5FD',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ width: '8px', height: '18px', background: teamAccent, borderRadius: '2px' }} />
                    {teamName}
                  </div>

                  {/* 4 Hero Stats Telemetry Tiles */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0, 210, 190, 0.4)',
                      borderRadius: '12px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.65rem', color: '#9CA3AF', fontWeight: '800', letterSpacing: '1px' }}>ОЧКИ</div>
                      <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#00D2BE', lineHeight: '1.1' }}>{vicePoints}</div>
                      <div style={{ fontSize: '0.62rem', color: '#E2E8F0', fontWeight: '700' }}>№2 В МИРЕ</div>
                    </div>

                    <div style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.65rem', color: '#9CA3AF', fontWeight: '800', letterSpacing: '1px' }}>ПОБЕДЫ</div>
                      <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#FFF', lineHeight: '1.1' }}>{viceWins}</div>
                      <div style={{ fontSize: '0.62rem', color: '#93C5FD', fontWeight: '700' }}>ГРАН-ПРИ</div>
                    </div>

                    <div style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.65rem', color: '#9CA3AF', fontWeight: '800', letterSpacing: '1px' }}>ПОДИУМЫ</div>
                      <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#FFF', lineHeight: '1.1' }}>{vicePodiums}</div>
                      <div style={{ fontSize: '0.62rem', color: '#00D2BE', fontWeight: '700' }}>ТОП-3</div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05, borderColor: '#00D2BE', boxShadow: '0 0 25px rgba(0, 210, 190, 0.45)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={fireSilverConfetti}
                      role="button"
                      tabIndex={0}
                      title="Отрыв от третьего места"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 210, 190, 0.15) 0%, rgba(0, 161, 155, 0.1) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1.5px solid rgba(0, 210, 190, 0.6)',
                        borderRadius: '12px',
                        padding: '12px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      <div style={{ fontSize: '0.65rem', color: '#00D2BE', fontWeight: '800', letterSpacing: '1px' }}>ОТРЫВ ОТ P3</div>
                      <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#00D2BE', lineHeight: '1.1' }}>+{pointsGapP3}</div>
                      <div style={{ fontSize: '0.62rem', color: '#10B981', fontWeight: '700' }}>НЕДОСЯГАЕМО 🥈</div>
                    </motion.div>
                  </div>

                  {/* Verdict Footer Bar inside Poster */}
                  <div style={{
                    background: 'rgba(0,0,0,0.55)',
                    border: '1px solid rgba(0, 210, 190, 0.25)',
                    borderRadius: '10px',
                    padding: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <Award size={20} style={{ color: '#00D2BE', flexShrink: 0 }} />
                    <div style={{ fontSize: '0.8rem', color: '#E5E7EB', lineHeight: '1.3' }}>
                      <strong style={{ color: '#00D2BE' }}>Математическая гарантия 2-го места:</strong> при максимуме в 26 очков в Абу-Даби, гигантский отрыв в {pointsGapP3} очков от 3-го места гарантирует титул Вице-чемпиона мира 2026 вне зависимости от исхода финального этапа!
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Announcement Briefing Below Poster */}
            <div style={{
              background: 'linear-gradient(135deg, #09131C 0%, #0F1D28 100%)',
              border: '1px solid rgba(0, 210, 190, 0.25)',
              borderRadius: '16px',
              padding: '20px 24px',
              marginTop: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              display: 'flex',
              gap: '24px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{
                position: 'relative',
                flexShrink: 0,
                width: '130px',
                height: '175px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid rgba(0, 210, 190, 0.5)',
                boxShadow: '0 8px 25px rgba(0, 210, 190, 0.3)',
                background: '#070C12'
              }}>
                <img
                  src="/portraits/yura_vice_champion_wide.jpg"
                  alt="Yurii Zakharchuk Vice Champion Art"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)',
                  padding: '6px 4px',
                  textAlign: 'center',
                  fontSize: '0.65rem',
                  fontWeight: '900',
                  color: '#00D2BE',
                  letterSpacing: '0.5px'
                }}>
                  🥈 ВИЦЕ-ЧЕМПИОН
                </div>
              </div>

              <div style={{ flex: '1 1 500px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00D2BE', fontWeight: '900', fontSize: '0.82rem', letterSpacing: '1px', marginBottom: '8px' }}>
                  <CheckCircle2 size={16} /> ОФИЦИАЛЬНОЕ ПОДТВЕРЖДЕНИЕ СТЮАРДОВ FIA & ДИРЕКЦИИ ЧЕМПИОНАТА
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#E2E8F0', lineHeight: '1.5' }}>
                  Гонщик команды Mercedes-AMG Petronas <strong style={{ color: '#00D2BE' }}>Юрий Захарчук (Yurii ZAKHARCHUK)</strong> провёл выдающийся сезон, завоевав <strong>{viceWins} побед</strong>, {vicePodiums} подиумов и набрав <strong>{vicePoints} очков</strong>. С колоссальным преимуществом в <strong>+{pointsGapP3} очков</strong> над Денисом Коваленко ({thirdPoints} очков), Юрий математически закрепил за собой титул <strong style={{ color: '#FFF' }}>Вице-чемпиона мира Формулы-1 2026 года</strong>!
                </p>
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  color: '#94A3B8'
                }}>
                  <div>
                    🥈 <strong style={{ color: '#FFF' }}>Серебряный Призёр:</strong> 10 побед на этапах Гран-при в бескомпромиссной дуэли за титул.
                  </div>
                  <div>
                    🏁 <strong style={{ color: '#FFF' }}>Гран-при Абу-Даби:</strong> Финальный раунд сезона станет триумфом сильнейших пилотов года.
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
