import React, { useRef, useState } from 'react';
import { Trophy, Award, Sparkles, Camera, ChevronDown, ChevronUp, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

export default function F1ConstructorsChampionCard({ constructorChampion, runnerUpTeam }) {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const teamPoints = constructorChampion?.totalPoints || 680;
  const teamWins = constructorChampion?.wins || 14;
  const teamPodiums = constructorChampion?.podiums || 33;
  const runnerUpPoints = runnerUpTeam?.totalPoints || 583;
  const pointsGap = Math.max(0, teamPoints - runnerUpPoints); // 97 pts

  const fireRedBullConfetti = () => {
    try {
      confetti({
        particleCount: 65,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.5 },
        colors: ['#1E41FF', '#FF0000', '#FFD700', '#FFFFFF']
      });
      confetti({
        particleCount: 65,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.5 },
        colors: ['#1E41FF', '#FF0000', '#FFD700', '#FFFFFF']
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
      link.download = `F1_2026_Constructors_World_Champions_Red_Bull.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export constructors champion card:', err);
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
        background: 'linear-gradient(90deg, #091024 0%, #151833 100%)',
        border: '1px solid rgba(30, 65, 255, 0.4)',
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
            background: 'linear-gradient(135deg, #1E41FF 0%, #0B1E8A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFD700',
            boxShadow: '0 0 16px rgba(30, 65, 255, 0.5)'
          }}>
            <Trophy size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#60A5FA', fontWeight: '900', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              OFFICIAL FIA WORLD CHAMPIONSHIP • CONSTRUCTORS' TITLE
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '900', fontStyle: 'italic', margin: 0, color: '#FFF' }}>
              Кубок Конструкторов 2026: Празднование Триумфа Red Bull!
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={fireRedBullConfetti}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: '800', background: 'rgba(30, 65, 255, 0.15)', color: '#60A5FA', border: '1px solid rgba(30, 65, 255, 0.4)' }}
          >
            <Sparkles size={16} /> Салют Чемпионов 🎉
          </button>
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="btn btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '0.88rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #E10600 0%, #1E41FF 100%)',
              border: '1px solid rgba(255, 215, 0, 0.4)',
              boxShadow: '0 4px 18px rgba(30, 65, 255, 0.4)'
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
              {/* Target 16:9 Official Constructors Champion Poster Canvas */}
              <div
                ref={cardRef}
                style={{
                  width: '100%',
                  minWidth: '940px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #070B16 0%, #0F1426 50%, #161A30 100%)',
                  border: '2px solid rgba(255, 215, 0, 0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.95), inset 0 0 35px rgba(30, 65, 255, 0.15)',
                  color: '#FFF',
                  padding: '32px'
                }}
              >
                {/* Background speed lines */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0, rgba(255,255,255,0.015) 12px, transparent 12px, transparent 24px)',
                  pointerEvents: 'none',
                  zIndex: 1
                }} />

                {/* Top Official FIA Ribbon Banner */}
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  zIndex: 10,
                  borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
                  paddingBottom: '16px',
                  marginBottom: '24px'
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
                      <div style={{ fontSize: '0.72rem', letterSpacing: '2px', color: '#FFD700', fontWeight: '900', textTransform: 'uppercase' }}>
                        FEDERATION INTERNATIONALE DE L'AUTOMOBILE
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#FFFFFF', letterSpacing: '1px' }}>
                        FIA FORMULA 1 WORLD CHAMPIONSHIP • 2026 CONSTRUCTORS WORLD CHAMPIONS
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(255, 215, 0, 0.15)',
                      border: '1px solid #FFD700',
                      color: '#FFD700',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontWeight: '900',
                      fontSize: '0.78rem',
                      letterSpacing: '1px'
                    }}>
                      <ShieldCheck size={16} /> КУБОК КОНСТРУКТОРОВ ЗАКРЫТ
                    </div>
                  </div>
                </div>

                {/* Main Content Layout: Left Celebration Photo + Right Telemetry Showcase */}
                <div style={{
                  position: 'relative',
                  zIndex: 10,
                  display: 'flex',
                  gap: '32px',
                  alignItems: 'center'
                }}>
                  {/* Left: Red Bull Celebration Photo Showcase */}
                  <div style={{
                    position: 'relative',
                    flex: '0 0 360px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '2px solid rgba(255, 215, 0, 0.5)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(30,65,255,0.3)',
                    background: '#000'
                  }}>
                    <img
                      src="/portraits/redbull_constructors_celebration.jpg"
                      alt="Red Bull Racing Celebrating Constructors Title"
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#FFD700', fontWeight: '900', letterSpacing: '1px' }}>
                          ORACLE RED BULL RACING
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#FFF', fontWeight: '800' }}>
                          Празднование в боксах команды
                        </div>
                      </div>
                      <span style={{ fontSize: '1.4rem' }}>🏆</span>
                    </div>
                  </div>

                  {/* Right: Authority Information & Telemetry Stats */}
                  <div style={{ flex: '1 1 auto' }}>
                    {/* Category Pill with Team Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                      <img
                        src="/teams/red-bull.png"
                        alt="Red Bull Racing"
                        style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <span style={{
                        fontSize: '0.88rem',
                        fontWeight: '900',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: '#FFD700',
                        background: 'rgba(255, 215, 0, 0.12)',
                        padding: '4px 14px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 215, 0, 0.3)'
                      }}>
                        🏆 2026 CONSTRUCTORS CHAMPIONS
                      </span>
                    </div>

                    {/* Gigantic Team Name */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{
                        fontFamily: 'Caveat, cursive',
                        fontSize: '2.4rem',
                        color: '#FFD700',
                        lineHeight: '1.0',
                        textShadow: '0 0 15px rgba(255,215,0,0.5)',
                        transform: 'rotate(-2deg)',
                        display: 'inline-block'
                      }}>
                        Oracle
                      </div>
                      <div style={{
                        fontSize: '3.4rem',
                        fontWeight: '900',
                        letterSpacing: '3px',
                        lineHeight: '0.95',
                        textTransform: 'uppercase',
                        color: '#FFFFFF',
                        textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 0 30px rgba(30,65,255,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px'
                      }}>
                        RED BULL RACING
                      </div>
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
                        border: '1px solid rgba(255, 215, 0, 0.4)',
                        borderRadius: '12px',
                        padding: '12px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '0.65rem', color: '#9CA3AF', fontWeight: '800', letterSpacing: '1px' }}>ОЧКИ</div>
                        <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#FFD700', lineHeight: '1.1' }}>{teamPoints}</div>
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
                        <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#FFF', lineHeight: '1.1' }}>{teamWins}</div>
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
                        <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#FFF', lineHeight: '1.1' }}>{teamPodiums}</div>
                        <div style={{ fontSize: '0.62rem', color: '#F59E0B', fontWeight: '700' }}>ТОП-3</div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.05, borderColor: '#FFD700', boxShadow: '0 0 25px rgba(255, 215, 0, 0.45)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={fireRedBullConfetti}
                        role="button"
                        tabIndex={0}
                        title="Отрыв от Mercedes"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(30, 65, 255, 0.1) 100%)',
                          backdropFilter: 'blur(10px)',
                          border: '1.5px solid rgba(255, 215, 0, 0.6)',
                          borderRadius: '12px',
                          padding: '12px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                      >
                        <div style={{ fontSize: '0.65rem', color: '#FFD700', fontWeight: '800', letterSpacing: '1px' }}>ОТРЫВ ОТ P2</div>
                        <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#FFD700', lineHeight: '1.1' }}>+{pointsGap}</div>
                        <div style={{ fontSize: '0.62rem', color: '#10B981', fontWeight: '700' }}>НЕДОСЯГАЕМО 🏆</div>
                      </motion.div>
                    </div>

                    {/* Verdict Footer Bar inside Poster */}
                    <div style={{
                      background: 'rgba(0,0,0,0.55)',
                      border: '1px solid rgba(255, 215, 0, 0.25)',
                      borderRadius: '10px',
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <Award size={20} style={{ color: '#FFD700', flexShrink: 0 }} />
                      <div style={{ fontSize: '0.82rem', color: '#E5E7EB', lineHeight: '1.3' }}>
                        <strong style={{ color: '#FFD700' }}>Математическая гарантия Кубка конструкторов:</strong> при максимуме в 44 очка на финальном этапе в Абу-Даби, отрыв в {pointsGap} очков от Mercedes-AMG Petronas гарантирует победу Red Bull Racing!
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editorial Announcement Briefing Below Poster */}
                <div style={{
                  background: 'linear-gradient(135deg, #0B1021 0%, #11172E 100%)',
                  border: '1px solid rgba(30, 65, 255, 0.3)',
                  borderRadius: '16px',
                  padding: '18px 22px',
                  marginTop: '24px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center'
                }}>
                  <div style={{ flex: '1 1 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFD700', fontWeight: '900', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '8px' }}>
                      <CheckCircle2 size={16} /> ОФИЦИАЛЬНОЕ ПРАЗДНОВАНИЕ ТИТУЛА В БОКСАХ RED BULL RACING
                    </div>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#E2E8F0', lineHeight: '1.5' }}>
                      Команда <strong style={{ color: '#FFD700' }}>Red Bull Racing</strong> празднует досрочный триумф в Кубке конструкторов 2026 года! Благодаря совместным усилиям чемпионского дуэта пилотов команда набрала <strong>{teamPoints} очков</strong>, завоевала <strong>{teamWins} побед</strong> и <strong>{teamPodiums} подиума</strong>. Отрыв в <strong>+{pointsGap} очков</strong> от Mercedes ({runnerUpPoints} очков) делает команду математически недосягаемой перед финалом в Абу-Даби.
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      flexWrap: 'wrap',
                      background: 'rgba(0,0,0,0.3)',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      color: '#94A3B8'
                    }}>
                      <div>
                        🏆 <strong style={{ color: '#FFF' }}>Кубок Конструкторов:</strong> Чемпионский кубок отправляется в Милтон-Кинс.
                      </div>
                      <div>
                        🏁 <strong style={{ color: '#FFF' }}>Финал сезона в Абу-Даби:</strong> Парадный финиш чемпионской кампании 2026 года.
                      </div>
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
