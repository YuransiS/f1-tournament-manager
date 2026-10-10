import React, { useRef, useState, useEffect } from 'react';
import { Trophy, Crown, Sparkles, Camera, Award, ChevronDown, ChevronUp, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import FlagIcon from './FlagIcon';

export default function F1WorldChampionCard({ champion, runnerUp, constructorChampion, lastRaceTitle = 'Chinese Grand Prix' }) {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [heroMode, setHeroMode] = useState('art'); // 'art' (champion victory art) or 'photo' (standing cutout)

  // Trigger celebration confetti on mount
  useEffect(() => {
    fireConfetti();
  }, []);

  const fireConfetti = () => {
    try {
      // First burst from left
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.4 },
        colors: ['#FFD700', '#FF0000', '#1E41FF', '#FFFFFF']
      });
      // Second burst from right
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.4 },
        colors: ['#FFD700', '#FF0000', '#1E41FF', '#FFFFFF']
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
      link.download = `F1_2026_WORLD_CHAMPION_MYKOLA_YAREMA.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export champion poster:', err);
      alert('Ошибка при экспорте плаката чемпиона!');
    } finally {
      setIsExporting(false);
    }
  };

  // Fallback defaults if props are loading
  const champName = champion?.driver?.name || 'Mykola YAREMA';
  const champPoints = champion?.totalPoints || 425;
  const champWins = champion?.wins || 11;
  const champPodiums = champion?.podiums || 21;
  const runnerUpPoints = runnerUp?.totalPoints || 390;
  const pointsGap = champPoints - runnerUpPoints; // 35
  const teamName = champion?.team?.name || 'Red Bull / Red Kangaroo';
  const teamColor = champion?.team?.color || '#1E41FF';

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Top Controls Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            boxShadow: '0 0 16px rgba(255, 215, 0, 0.5)'
          }}>
            <Crown size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#FFD700', fontWeight: '900', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              OFFICIAL FIA WORLD CHAMPIONSHIP DECLARATION
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '900', fontStyle: 'italic', margin: 0, color: '#FFF' }}>
              Титул Чемпиона Мира 2026 Завоёван Досрочно!
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
              background: heroMode === 'art' ? 'rgba(255, 100, 0, 0.15)' : 'rgba(255,255,255,0.06)',
              border: heroMode === 'art' ? '1px solid rgba(255, 120, 0, 0.4)' : '1px solid rgba(255,255,255,0.2)',
              color: heroMode === 'art' ? '#FF8C00' : '#FFF'
            }}
            title="Переключить: Арт победы / Ростовое фото"
          >
            {heroMode === 'art' ? '🔥 Арт Победы' : '👤 Фото Пилота'}
          </button>
          <button
            onClick={fireConfetti}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: '800', background: 'rgba(255,215,0,0.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' }}
          >
            <Sparkles size={16} /> Салют Чемпиона 🎉
          </button>
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="btn btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '0.88rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #E10600 0%, #B30000 100%)',
              boxShadow: '0 4px 18px rgba(225,6,0,0.5)'
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
              {/* Target 16:9 Official Champion Poster Canvas */}
              <div
                ref={cardRef}
                style={{
                  width: '100%',
                  minWidth: '940px',
                  aspectRatio: '16 / 9',
                  minHeight: '530px',
                  borderRadius: '24px',
                  background: '#07090F',
                  border: '2px solid rgba(255, 215, 0, 0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.95), inset 0 0 35px rgba(255,215,0,0.1)',
                  color: '#FFF'
                }}
              >
                {/* Layer 1: Dark Track Background Image with Rich Moody Wash */}
                <img
                  src="/tracks/spain.jpg"
                  alt="Circuit"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.35) contrast(1.2) grayscale(40%)'
                  }}
                />

                {/* Layer 2: Red Bull Midnight Navy & Golden Ray Gradient */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle at 75% 25%, rgba(255, 215, 0, 0.18) 0%, transparent 60%), linear-gradient(135deg, rgba(6, 10, 25, 0.96) 0%, rgba(13, 22, 45, 0.90) 50%, rgba(30, 20, 10, 0.94) 100%)',
                  mixBlendMode: 'normal'
                }} />

                {/* Layer 2.5: F1 Speed Pattern Watermark */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0, rgba(255,255,255,0.015) 12px, transparent 12px, transparent 24px)',
                  pointerEvents: 'none'
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
                  borderBottom: '1px solid rgba(255, 215, 0, 0.25)',
                  paddingBottom: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      background: '#FFFFFF',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontWeight: '900',
                      fontSize: '1.05rem',
                      color: '#E10600',
                      letterSpacing: '-0.5px'
                    }}>
                      F1
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', letterSpacing: '2px', color: '#FFD700', fontWeight: '900', textTransform: 'uppercase' }}>
                        FIA FORMULA 1 WORLD CHAMPIONSHIP • 2026
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#9CA3AF', fontWeight: '700' }}>
                        OFFICIAL WORLD DRIVERS' CHAMPIONSHIP VERDICT
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      background: 'rgba(255, 215, 0, 0.15)',
                      border: '1px solid rgba(255, 215, 0, 0.4)',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#FFD700',
                      fontWeight: '900',
                      fontSize: '0.78rem',
                      letterSpacing: '1px'
                    }}>
                      <ShieldCheck size={16} /> МАТЕМАТИЧЕСКИЙ ТИТУЛ ЗАКРЫТ
                    </div>
                  </div>
                </div>

                {/* Layer 4: Left Heroic Visual (Victory Art or Driver Cutout) */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: heroMode === 'art' ? '46%' : '44%',
                  zIndex: 8,
                  pointerEvents: 'none',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'flex-end'
                }}>
                  {heroMode === 'art' ? (
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                      <img
                        src="/portraits/kolya_champion_victory.jpg"
                        alt={champName}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center 15%',
                          filter: 'contrast(1.08) saturate(1.15) brightness(0.96)'
                        }}
                      />
                      {/* Smooth Right and Top Edge Fade to blend with dark poster */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: '45%',
                        background: 'linear-gradient(to right, transparent 0%, #07090F 100%)'
                      }} />
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '90px',
                        background: 'linear-gradient(to bottom, rgba(7,9,15,0.85) 0%, transparent 100%)'
                      }} />
                    </div>
                  ) : (
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'flex-end',
                      paddingLeft: '10%'
                    }}>
                      <img
                        src="/portraits/kolya_standing_9-16_without_backjground.png"
                        alt={champName}
                        onError={(e) => {
                          e.currentTarget.src = '/portraits/kolya.png';
                        }}
                        style={{
                          height: '88%',
                          maxHeight: '480px',
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 20px 45px rgba(0,0,0,0.95)) drop-shadow(0 0 30px rgba(255,215,0,0.25))'
                        }}
                      />
                      {/* Golden Trophy Silhouette behind pilot */}
                      <div style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: '20px',
                        transform: 'translateX(-50%)',
                        zIndex: -1,
                        opacity: 0.15,
                        filter: 'drop-shadow(0 0 35px #FFD700)'
                      }}>
                        <Trophy size={360} color="#FFD700" />
                      </div>
                    </div>
                  )}
                </div>

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
                      src="/teams/red-bull.png"
                      alt="Red Bull Racing"
                      style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: '900',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: '#FFD700',
                      background: 'rgba(255, 215, 0, 0.12)',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 215, 0, 0.25)'
                    }}>
                      WORLD CHAMPION • СЕЗОН 2026
                    </span>
                  </div>

                  {/* Gigantic Pilot Name */}
                  <div style={{ marginBottom: '6px' }}>
                    <div style={{
                      fontFamily: 'Caveat, cursive',
                      fontSize: '2.5rem',
                      color: '#FFD700',
                      lineHeight: '1.0',
                      textShadow: '0 0 15px rgba(255,215,0,0.5)',
                      transform: 'rotate(-2deg)',
                      display: 'inline-block'
                    }}>
                      Mykola
                    </div>
                    <div style={{
                      fontSize: '3.6rem',
                      fontWeight: '900',
                      letterSpacing: '3px',
                      lineHeight: '0.9',
                      textTransform: 'uppercase',
                      color: '#FFFFFF',
                      textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 0 30px rgba(255,215,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px'
                    }}>
                      YAREMA
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
                    <span style={{ width: '8px', height: '18px', background: teamColor, borderRadius: '2px' }} />
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
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      borderRadius: '12px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.65rem', color: '#9CA3AF', fontWeight: '800', letterSpacing: '1px' }}>ОЧКИ</div>
                      <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#FFD700', lineHeight: '1.1' }}>{champPoints}</div>
                      <div style={{ fontSize: '0.62rem', color: '#10B981', fontWeight: '700' }}>№1 В МИРЕ</div>
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
                      <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#FFF', lineHeight: '1.1' }}>{champWins}</div>
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
                      <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#FFF', lineHeight: '1.1' }}>{champPodiums}</div>
                      <div style={{ fontSize: '0.62rem', color: '#F59E0B', fontWeight: '700' }}>ТОП-3</div>
                    </div>

                    <div style={{
                      background: 'rgba(255, 215, 0, 0.08)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 215, 0, 0.4)',
                      borderRadius: '12px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.65rem', color: '#FFD700', fontWeight: '800', letterSpacing: '1px' }}>ОТРЫВ</div>
                      <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#FFD700', lineHeight: '1.1' }}>+{pointsGap}</div>
                      <div style={{ fontSize: '0.62rem', color: '#10B981', fontWeight: '700' }}>НЕОТЫГРЫВАЕМО</div>
                    </div>
                  </div>

                  {/* Verdict Footer Bar inside Poster */}
                  <div style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <Award size={20} style={{ color: '#FFD700', flexShrink: 0 }} />
                    <div style={{ fontSize: '0.8rem', color: '#E5E7EB', lineHeight: '1.3' }}>
                      <strong style={{ color: '#FFD700' }}>Математическая гарантия титула:</strong> при остающемся максимуме в 26 очков в Абу-Даби, отрыв в {pointsGap} очков гарантирует чемпионскую корону вне зависимости от исхода финального этапа!
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Announcement Briefing Below Poster */}
            <div style={{
              background: 'linear-gradient(135deg, #0F121C 0%, #151A27 100%)',
              border: '1px solid #282E40',
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
                border: '2px solid rgba(255,215,0,0.5)',
                boxShadow: '0 8px 25px rgba(255,100,0,0.3)',
                background: '#07090F'
              }}>
                <img
                  src="/portraits/kolya_champion_victory.jpg"
                  alt="Mykola Yarema Victory Art"
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
                  color: '#FFD700',
                  letterSpacing: '0.5px'
                }}>
                  👑 ПОБЕДНЫЙ АРТ
                </div>
              </div>

              <div style={{ flex: '1 1 500px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFD700', fontWeight: '900', fontSize: '0.82rem', letterSpacing: '1px', marginBottom: '8px' }}>
                  <CheckCircle2 size={16} /> ОФИЦИАЛЬНОЕ ПОДТВЕРЖДЕНИЕ СТЮАРДОВ FIA & ДИРЕКЦИИ ЧЕМПИОНАТА
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#E2E8F0', lineHeight: '1.5' }}>
                  После победы на {lastRaceTitle || 'Гран-при Китая'} и уверенного финиша в Лас-Вегасе украинский пилот <strong style={{ color: '#FFD700' }}>Микола Ярема (kolyacoolguy)</strong> официально оформил чемпионский титул сезона 2026! Имея в активе <strong>{champPoints} очков</strong>, {champWins} побед и {champPodiums} {champPodiums % 10 === 1 && champPodiums !== 11 ? 'подиум' : 'подиумов'}, он опережает ближайшего преследователя Юрия Захарчука ({runnerUpPoints} очков) на <strong>{pointsGap} очков</strong>.
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
                    🏆 <strong style={{ color: '#FFF' }}>Кубок Конструкторов:</strong> {constructorChampion?.team?.name || 'Red Bull Racing'} ({constructorChampion?.totalPoints || 680} pts) празднует победу с отрывом +{Math.max(0, (constructorChampion?.totalPoints || 680) - 583)} очков!
                  </div>
                  <div>
                    🏁 <strong style={{ color: '#FFF' }}>Финал в Абу-Даби:</strong> станет парадным этапом чествования новоиспеченного чемпиона мира.
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
