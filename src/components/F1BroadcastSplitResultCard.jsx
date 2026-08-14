import React, { useRef, useState } from 'react';
import { Camera, Layers, Zap } from 'lucide-react';
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';
import FlagIcon from './FlagIcon';

export default function F1BroadcastSplitResultCard({ raceTitle, trackImage, fullResults }) {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [page, setPage] = useState(1); // 1 for pos 1-10, 2 for pos 11-20 (with pos 1 pinned!)

  if (!fullResults || fullResults.length === 0) return null;

  const winner = fullResults[0];

  // Page 1: Positions 1-10
  // Page 2: Position 1 pinned at top + Positions 11-20 below it!
  const displayedResults = page === 1
    ? fullResults.slice(0, 10)
    : [fullResults[0], ...fullResults.slice(10, 20)];

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.98, cacheBust: true });
      const link = document.createElement('a');
      link.download = `F1_${raceTitle.replace(/\s+/g, '_')}_Official_Results_Page${page}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export broadcast screen photo:', err);
      alert('Ошибка экспорта 1-в-1 скриншота результатов!');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ marginBottom: '36px' }}>
      {/* Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '900', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={22} style={{ color: 'var(--f1-red)' }} />
            Таблица Результатов Заезда (Broadcast TV Card)
          </h3>

          {/* Page Switcher 1-10 / 11-20 */}
          <div className="nav-tabs" style={{ background: 'rgba(255,255,255,0.05)', padding: '2px', borderRadius: '6px' }}>
            <button
              className={`nav-btn ${page === 1 ? 'active' : ''}`}
              onClick={() => setPage(1)}
              style={{ padding: '6px 14px', fontSize: '0.85rem', fontWeight: '700' }}
            >
              Места 1 - 10
            </button>
            <button
              className={`nav-btn ${page === 2 ? 'active' : ''}`}
              onClick={() => setPage(2)}
              style={{ padding: '6px 14px', fontSize: '0.85rem', fontWeight: '700' }}
            >
              Места 11 - 20 (относительно 1-го)
            </button>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleDownload}
          disabled={isExporting}
          style={{ boxShadow: '0 4px 16px rgba(225,6,0,0.6)', padding: '12px 24px', fontWeight: '800', fontSize: '0.95rem' }}
        >
          <Camera size={20} /> {isExporting ? 'Экспорт PNG...' : `📸 Скачать Скриншот (${page === 1 ? '1-10' : '11-20'}) (PNG)`}
        </button>
      </div>

      {/* Scroll Wrapper for Mobile Responsiveness */}
      <div className="broadcast-card-scroll-wrapper">
        {/* Target Canvas for 1:1 F1 Broadcast PNG Export */}
        <div
          ref={cardRef}
          style={{
            width: '100%',
            minWidth: '940px',
            aspectRatio: '16 / 9',
            minHeight: '580px',
            background: '#13161F',
            backgroundImage: `
              linear-gradient(135deg, rgba(20, 24, 35, 0.95) 0%, rgba(10, 12, 18, 0.98) 100%),
              repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0, rgba(255,255,255,0.015) 10px, transparent 10px, transparent 20px)
            `,
            borderRadius: '16px',
            border: '3px solid #262B3B',
            padding: '28px 36px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            color: '#FFF'
          }}
        >
          {/* Track Outline Silhouette Watermark (Subtle Background) */}
          {trackImage && (
            <img
              src={trackImage}
              alt="Track Layout"
              style={{
                position: 'absolute',
                top: '20%',
                right: '25%',
                height: '60%',
                opacity: 0.08,
                filter: 'invert(1) drop-shadow(0 0 20px rgba(255,255,255,0.5))',
                pointerEvents: 'none',
                zIndex: 1
              }}
            />
          )}

          {/* Top Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', zIndex: 10 }}>
            <div style={{
              background: '#FFFFFF',
              padding: '8px 24px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 4px 18px rgba(255,255,255,0.4)'
            }}>
              <img src="/F1-logo.png" alt="F1" style={{ height: '28px', objectFit: 'contain' }} />
            </div>

            <div style={{
              fontFamily: 'var(--font-f1)',
              fontSize: '1.4rem',
              fontWeight: '900',
              fontStyle: 'italic',
              letterSpacing: '1.5px',
              color: '#FFF',
              textTransform: 'uppercase',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              {trackImage && <img src={trackImage} alt="Track" style={{ height: '26px', filter: 'invert(1) opacity(0.85)' }} />}
              FORMULA 1 {raceTitle.toUpperCase()} 2026
            </div>

            <div style={{
              background: '#FFFFFF',
              padding: '8px 24px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 4px 18px rgba(255,255,255,0.4)'
            }}>
              <img src="/F1-logo.png" alt="F1" style={{ height: '28px', objectFit: 'contain' }} />
            </div>
          </div>

          {/* Sub-Header Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '65% 35%', gap: '20px', marginBottom: '8px', zIndex: 10 }}>
            <div style={{
              fontFamily: 'var(--font-f1)',
              fontSize: '1.8rem',
              fontWeight: '900',
              fontStyle: 'italic',
              color: '#FFF',
              letterSpacing: '1px'
            }}>
              RACE {page === 2 && '(POS 11-20)'}
            </div>

            <div style={{
              fontFamily: 'var(--font-f1)',
              fontSize: '1.8rem',
              fontWeight: '900',
              fontStyle: 'italic',
              color: '#FFF',
              letterSpacing: '1px',
              textAlign: 'right',
              paddingRight: '30px'
            }}>
              WINNER
            </div>
          </div>

          {/* Main Content Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '65% 35%', gap: '20px', flex: 1, zIndex: 10 }}>
            {/* Left Table Section */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Table Header Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '50px 1.8fr 1.5fr 1fr 60px',
                padding: '6px 12px',
                fontSize: '0.7rem',
                fontWeight: '800',
                color: '#9CA3AF',
                fontFamily: 'var(--font-f1)',
                letterSpacing: '1px',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div>POSITION</div>
                <div>DRIVER</div>
                <div>TEAM</div>
                <div style={{ textAlign: 'right' }}>TIME</div>
                <div style={{ textAlign: 'right' }}>PTS</div>
              </div>

              {/* Table Rows with Smooth Cinematic Stagger Entrance */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '6px', flex: 1 }}>
                {displayedResults.map((item, index) => {
                  const isWinnerRow = item.finishPos === 1;
                  const isPlayer = !item.driver.isAi;
                  const isDnfOrDsq = item.status === 'DNF' || item.status === 'DSQ' || item.totalTime === 'DNF' || item.totalTime === 'DSQ';
                  const statusText = (item.status === 'DSQ' || item.totalTime === 'DSQ') ? 'DSQ' : (item.status === 'DNF' || item.totalTime === 'DNF') ? 'DNF' : item.totalTime;

                  return (
                    <motion.div
                      key={`${item.driverId}_${index}_${page}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '50px 1.8fr 1.5fr 1fr 60px',
                        alignItems: 'center',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: isWinnerRow
                          ? '#FFFFFF'
                          : isPlayer
                          ? 'rgba(0, 160, 222, 0.12)'
                          : 'rgba(255, 255, 255, 0.04)',
                        color: isWinnerRow ? '#000' : '#FFF',
                        borderLeft: `4px solid ${item.team.color}`,
                        fontWeight: isWinnerRow ? '800' : '600',
                        fontSize: '0.9rem',
                        boxShadow: isWinnerRow ? '0 4px 15px rgba(255,255,255,0.3)' : 'none'
                      }}
                    >
                      {/* Position */}
                      <div style={{
                        fontWeight: '900',
                        fontFamily: 'var(--font-f1)',
                        fontSize: '1.05rem',
                        color: isWinnerRow ? '#000' : item.finishPos <= 3 ? 'var(--f1-gold)' : '#FFF'
                      }}>
                        {item.finishPos}
                      </div>

                      {/* Driver Name & Flag */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FlagIcon countryCode={item.driver.country} style={{ width: '20px', height: '14px' }} />
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <span style={{ fontWeight: isWinnerRow ? '900' : '700' }}>{item.driver.name}</span>
                          {isPlayer && <span style={{ marginLeft: '4px', fontSize: '0.75rem', color: isWinnerRow ? '#0284C7' : '#38BDF8' }}>🎮</span>}
                        </div>
                      </div>

                      {/* Team Name */}
                      <div style={{
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        color: isWinnerRow ? '#333' : '#D1D5DB',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textTransform: 'uppercase'
                      }}>
                        {item.team.name}
                      </div>

                      {/* Time / Gap */}
                      <div style={{
                        textAlign: 'right',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        color: isWinnerRow ? '#000' : isDnfOrDsq ? '#EF4444' : '#E5E7EB',
                        fontWeight: isDnfOrDsq ? '900' : isWinnerRow ? '800' : '600'
                      }}>
                        {statusText}
                      </div>

                      {/* PTS */}
                      <div style={{
                        textAlign: 'right',
                        fontWeight: '900',
                        fontFamily: 'var(--font-f1)',
                        color: isWinnerRow ? 'var(--f1-red)' : item.pts > 0 ? '#FFD700' : '#6B7280'
                      }}>
                        +{item.pts}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right Winner Cutout */}
            <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
              <div style={{
                position: 'absolute',
                top: '5%',
                right: 0,
                bottom: 0,
                width: '90%',
                background: `linear-gradient(180deg, ${winner.team.color}50 0%, rgba(0,0,0,0.85) 100%)`,
                borderRadius: '16px 16px 0 0',
                zIndex: 1
              }} />

              {winner.driver.avatar ? (
                <motion.img
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  src={winner.driver.avatar}
                  alt={winner.driver.name}
                  style={{
                    height: '400px',
                    maxHeight: '115%',
                    objectFit: 'contain',
                    zIndex: 3,
                    filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.95))'
                  }}
                />
              ) : null}

              <div style={{ position: 'absolute', bottom: '18px', right: '12px', textAlign: 'right', zIndex: 10 }}>
                <div style={{
                  fontFamily: 'var(--font-f1)',
                  fontSize: '3.2rem',
                  fontWeight: '900',
                  fontStyle: 'italic',
                  color: '#FFFFFF',
                  lineHeight: 0.85,
                  letterSpacing: '2px',
                  textShadow: '0 4px 20px rgba(0,0,0,0.95), 0 0 15px rgba(0,0,0,0.95)'
                }}>
                  WINNER
                </div>

                <div style={{
                  fontFamily: 'var(--font-f1)',
                  fontSize: '2.2rem',
                  fontWeight: '900',
                  color: '#FF8000',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  textShadow: '0 4px 20px rgba(0,0,0,0.95), 0 0 15px rgba(0,0,0,0.95)',
                  letterSpacing: '1px',
                  marginTop: '2px'
                }}>
                  {winner.driver.name.split(' ').pop()}
                </div>

                <div style={{
                  fontSize: '1.05rem',
                  fontWeight: '800',
                  color: '#38BDF8',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  marginTop: '4px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.95)'
                }}>
                  {winner.team.name}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: '#D1D5DB', fontWeight: '700' }}>
              <div style={{ background: '#FFF', padding: '4px 10px', borderRadius: '4px' }}>
                <img src="/F1-logo.png" alt="F1" style={{ height: '14px', objectFit: 'contain' }} />
              </div>
              <span>OFFICIAL TIMEKEEPER OF FORMULA 1</span>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '600' }}>
              SEASON 2026 • RACE RESULTS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
