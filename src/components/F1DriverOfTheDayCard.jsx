import React, { useRef, useState, useEffect } from 'react';
import { Camera, Star, Vote, CheckCircle2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';
import FlagIcon from './FlagIcon';

// Host country mapping for each Grand Prix stage
const RACE_COUNTRY_MAP = {
  'race-1': { code: 'BH', name: 'BAHRAIN' },
  'race-2': { code: 'SA', name: 'SAUDI ARABIA' },
  'race-3': { code: 'AU', name: 'AUSTRALIA' },
  'race-4': { code: 'AZ', name: 'AZERBAIJAN' },
  'race-5': { code: 'US', name: 'MIAMI • USA' },
  'race-6': { code: 'IT', name: 'IMOLA • ITALY' },
  'race-7': { code: 'MC', name: 'MONACO' },
  'race-8': { code: 'ES', name: 'SPAIN' }
};

// High-res real track background photos uploaded by user
const REAL_TRACK_PHOTOS = {
  'race-1': '/tracks/bahrain.jpg',
  'race-2': '/tracks/jeddah.png',
  'race-3': '/tracks/australia.jpg',
  'race-4': '/tracks/miami.jpg',
  'race-5': '/tracks/miami.jpg',
  'race-6': '/tracks/imola.jpg',
  'race-7': '/tracks/monaco.jpg',
  'race-8': '/tracks/spain.jpg'
};

export default function F1DriverOfTheDayCard({ raceTitle, trackImage, fullResults, defaultDriverId, activeRaceId }) {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  // 1. Device vote weight (between 942 and 1459 votes per device)
  const [deviceVoteWeight, setDeviceVoteWeight] = useState(1150);
  const [userVotedId, setUserVotedId] = useState(null);
  const [votes, setVotes] = useState({});

  useEffect(() => {
    if (!activeRaceId) return;

    // Retrieve or generate device vote weight for this race (942 to 1459)
    const weightKey = `f1_dotd_vote_weight_${activeRaceId}`;
    let savedWeight = localStorage.getItem(weightKey);
    if (!savedWeight) {
      savedWeight = Math.floor(Math.random() * (1459 - 942 + 1)) + 942;
      localStorage.setItem(weightKey, savedWeight.toString());
    }
    const parsedWeight = parseInt(savedWeight, 10);
    setDeviceVoteWeight(parsedWeight);

    // Retrieve user's voted driver for this race on this device
    const votedDriverKey = `f1_dotd_voted_driver_${activeRaceId}`;
    const savedVotedDriver = localStorage.getItem(votedDriverKey);
    setUserVotedId(savedVotedDriver || null);

    // Retrieve community votes pool (starts empty/real without fake pre-populated values)
    const votesKey = `f1_dotd_votes_pool_${activeRaceId}`;
    let savedVotes = {};
    try {
      savedVotes = JSON.parse(localStorage.getItem(votesKey)) || {};
    } catch (e) {
      savedVotes = {};
    }
    setVotes(savedVotes);
  }, [activeRaceId]);

  // Handle Voting: 1 vote per device, adds deviceVoteWeight (942-1459), vote can be changed without changing weight
  const handleVote = (driverId) => {
    if (userVotedId === driverId) return;

    const votesKey = `f1_dotd_votes_pool_${activeRaceId}`;
    const votedDriverKey = `f1_dotd_voted_driver_${activeRaceId}`;

    setVotes(prev => {
      const updated = { ...prev };
      // Remove weight from previous choice if user is changing vote
      if (userVotedId && updated[userVotedId]) {
        updated[userVotedId] = Math.max(0, updated[userVotedId] - deviceVoteWeight);
      }
      // Add weight to new choice
      updated[driverId] = (updated[driverId] || 0) + deviceVoteWeight;
      localStorage.setItem(votesKey, JSON.stringify(updated));
      return updated;
    });

    setUserVotedId(driverId);
    localStorage.setItem(votedDriverKey, driverId);
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  // Auto-select driver with highest votes, or winner/user-voted
  const highestVotedDriverId = Object.keys(votes).reduce((maxId, currId) => {
    if (!maxId) return currId;
    return (votes[currId] || 0) > (votes[maxId] || 0) ? currId : maxId;
  }, null);

  const activeDriverId = userVotedId || highestVotedDriverId || defaultDriverId || fullResults[0]?.driverId;
  const selectedResult = fullResults.find(r => r.driverId === activeDriverId) || fullResults[0];
  const { driver, team, posDiff } = selectedResult;

  // Race host country info
  const hostCountry = RACE_COUNTRY_MAP[activeRaceId] || {
    code: 'ES',
    name: raceTitle.replace(/Grand Prix/i, '').trim().toUpperCase()
  };

  const trackPhoto = REAL_TRACK_PHOTOS[activeRaceId] || '/tracks/spain.jpg';

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.98, cacheBust: true });
      const link = document.createElement('a');
      link.download = `F1_Driver_Of_The_Day_${driver.name.replace(/\s+/g, '_')}_${hostCountry.name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export Driver of the Day card:', err);
      alert('Ошибка экспорта карточки Гоночного Дня!');
    } finally {
      setIsExporting(false);
    }
  };

  const luxuryEase = [0.16, 1, 0.3, 1];

  // Team vibrant colors
  const teamPrimaryColor = team.color || '#1E41FF';
  const teamAccentColor = team.accentColor || teamPrimaryColor;

  return (
    <div style={{ marginBottom: '36px' }}>
      {/* Control Header without preview dropdown */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge badge-gold" style={{ padding: '6px 14px', fontSize: '0.85rem', fontWeight: '900', letterSpacing: '1px' }}>
            🌟 OFFICIAL F1 FAN VOTE
          </span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '900', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            🏆 Гоночный Гонщик Дня (Driver of the Day)
          </h3>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleDownload}
          disabled={isExporting}
          style={{ boxShadow: '0 4px 20px rgba(225,6,0,0.7)', padding: '10px 20px', fontWeight: '800', fontSize: '0.95rem' }}
        >
          <Camera size={18} /> {isExporting ? 'Экспорт PNG...' : '📸 Скачать Скриншот (PNG)'}
        </button>
      </div>

      {/* Target 16:9 Canvas matching Official F1 TV Poster */}
      <div className="broadcast-card-scroll-wrapper" style={{ marginBottom: '24px' }}>
        <motion.div
          key={driver.id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, ease: luxuryEase }}
          ref={cardRef}
          style={{
            width: '100%',
            minWidth: '980px',
            aspectRatio: '16 / 9',
            minHeight: '600px',
            background: '#07090E',
            borderRadius: '24px',
            border: '3px solid #282E40',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.95)',
            color: '#FFF'
          }}
        >
          {/* Layer 1: Full-Screen Real Track Photo Background */}
          <img
            src={trackPhoto}
            alt="Real Race Track"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.75) contrast(1.15)'
            }}
          />

          {/* Layer 2: Team Color Gradient Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${teamPrimaryColor}DD 0%, ${teamAccentColor}F0 100%)`,
            mixBlendMode: 'multiply',
            zIndex: 2
          }} />

          {/* Layer 2.5: Additional Glow for Warm Broadcast Feel */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 80% 25%, ${teamPrimaryColor}AA 0%, transparent 70%)`,
            zIndex: 3
          }} />

          {/* Layer 3: Left Side Standing Driver Portrait Cutout */}
          <div style={{
            position: 'absolute',
            left: '4%',
            bottom: 0,
            height: '96%',
            zIndex: 5,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'flex-end'
          }}>
            {driver.avatar ? (
              <motion.img
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: luxuryEase }}
                src={driver.avatar}
                alt={driver.name}
                style={{
                  height: '100%',
                  maxHeight: '560px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 25px 45px rgba(0,0,0,0.95))'
                }}
              />
            ) : (
              <div style={{ fontSize: '6rem', marginBottom: '60px' }}>🏎️</div>
            )}
          </div>

          {/* Layer 4: Right Side Content */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '56%',
            padding: '36px 44px',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            alignItems: 'flex-end',
            textAlign: 'right',
            zIndex: 10
          }}>
            {/* Top Right: OFFICIAL F1 LOGO (3X BIGGER!) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src="/F1-logo.png"
                alt="F1"
                style={{
                  height: '110px',
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1) drop-shadow(0 6px 20px rgba(0,0,0,0.6))'
                }}
              />
            </div>

            {/* Middle Right: HUGE "DRIVER OF THE DAY" TYPOGRAPHY */}
            <div style={{ margin: 'auto 0' }}>
              <div style={{
                fontFamily: 'var(--font-f1)',
                fontSize: '5.2rem',
                fontWeight: '900',
                fontStyle: 'italic',
                color: '#FFFFFF',
                lineHeight: 0.82,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                textShadow: '0 8px 30px rgba(0,0,0,0.85), 0 0 15px rgba(0,0,0,0.7)'
              }}>
                DRIVER<br />
                OF THE<br />
                DAY
              </div>

              {/* Sub-row: HOST RACE COUNTRY FLAG + GP LOCATION NAME */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '22px',
                background: 'rgba(0,0,0,0.6)',
                border: '1.5px solid rgba(255,255,255,0.2)',
                padding: '10px 22px',
                borderRadius: '10px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.7)'
              }}>
                <FlagIcon countryCode={hostCountry.code} style={{ width: '32px', height: '22px', borderRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.6)' }} />
                <span style={{ fontSize: '1.3rem', fontWeight: '900', color: '#FFF', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-f1)' }}>
                  {hostCountry.name}
                </span>
                {posDiff > 0 && (
                  <span style={{ background: '#10B981', color: '#FFF', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '900' }}>
                    ▲ +{posDiff} POS
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Right: Team Logo + Driver Full Name */}
            <div>
              {team.logo && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
                  <img src={team.logo} alt={team.name} style={{ height: '36px', objectFit: 'contain', filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.6))' }} />
                </div>
              )}

              <div style={{
                fontFamily: 'var(--font-f1)',
                fontSize: '3.2rem',
                fontWeight: '900',
                fontStyle: 'italic',
                color: '#FFFFFF',
                lineHeight: 0.9,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                textShadow: '0 4px 20px rgba(0,0,0,0.8)'
              }}>
                {driver.name}
              </div>

              <div style={{
                fontSize: '1rem',
                fontWeight: '800',
                color: 'rgba(255,255,255,0.95)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginTop: '4px'
              }}>
                {team.name}
              </div>
            </div>
          </div>

        </motion.div>
      </div>

      {/* --- INTERACTIVE FAN VOTING WIDGET (ALL 20 DRIVERS AVAILABLE) --- */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #131622 0%, #1A1E2E 100%)',
        border: '2px solid #FFD700',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 12px 35px rgba(255, 215, 0, 0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#FFD700', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>
              OFFICIAL F1 FAN POLL
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#FFF', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Vote size={22} style={{ color: '#FFD700' }} />
              🗳️ Голосование Фанатов за Driver of the Day ({raceTitle})
            </h3>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', color: '#9CA3AF', fontWeight: '700' }}>
              Всего голосов: <strong style={{ color: '#FFD700' }}>{totalVotes.toLocaleString('ru-RU')}</strong>
            </div>
          </div>
        </div>

        {/* User Vote Status Notification */}
        {userVotedId ? (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10B981',
            borderRadius: '8px',
            padding: '10px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            fontSize: '0.88rem',
            color: '#FFF'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} style={{ color: '#10B981' }} />
              <span>
                Ваш голос отдан за{' '}
                <strong style={{ color: '#FFD700' }}>
                  {fullResults.find(r => r.driverId === userVotedId)?.driver.name || 'Пилота'}
                </strong>!
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
              Вы можете изменить свой выбор, кликнув на другого пилота
            </span>
          </div>
        ) : (
          <div style={{
            background: 'rgba(255, 215, 0, 0.1)',
            border: '1px dashed #FFD700',
            borderRadius: '8px',
            padding: '10px 16px',
            marginBottom: '16px',
            fontSize: '0.88rem',
            color: '#E5E7EB'
          }}>
            👉 Выберите своего кандидата ниже, чтобы отдать голос за Гонщика Дня!
          </div>
        )}

        {/* Voting Drivers Grid (ALL 20 DRIVERS AVAILABLE) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {fullResults.map(r => {
            const voteCount = votes[r.driverId] || 0;
            const percentage = totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(1) : 0;
            const isVoted = userVotedId === r.driverId;

            return (
              <div
                key={r.driverId}
                onClick={() => handleVote(r.driverId)}
                style={{
                  background: isVoted ? 'rgba(255, 215, 0, 0.12)' : 'rgba(255,255,255,0.03)',
                  border: isVoted ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Vote Progress Fill Bar */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: `${percentage}%`,
                  background: isVoted ? 'rgba(255, 215, 0, 0.25)' : `${r.team.color}33`,
                  transition: 'width 0.4s ease',
                  zIndex: 1
                }} />

                <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {r.driver.avatar && (
                      <img
                        src={r.driver.avatar}
                        alt={r.driver.name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: isVoted ? '2px solid #FFD700' : '1px solid var(--border-color)' }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: '800', color: '#FFF', fontSize: '0.95rem' }}>
                        {r.driver.name} {isVoted && <CheckCircle2 size={16} style={{ color: '#FFD700', display: 'inline', marginLeft: '4px' }} />}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: r.team.color, fontWeight: '700' }}>
                        {r.team.name} • P{r.finishPos} {r.posDiff > 0 ? `[▲+${r.posDiff}]` : ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '900', color: isVoted ? '#FFD700' : '#FFF' }}>
                      {percentage}%
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
                      {voteCount.toLocaleString('ru-RU')} голосов
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
