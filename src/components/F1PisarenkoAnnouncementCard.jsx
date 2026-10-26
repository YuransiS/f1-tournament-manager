import React, { useRef, useState } from 'react';
import { Camera, CheckCircle2, Megaphone, Sparkles } from 'lucide-react';
import { toPng } from 'html-to-image';
import TeamLogo from './TeamLogo';

export default function F1PisarenkoAnnouncementCard() {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const teamColor = '#00D2BE'; // Mercedes Petronas teal

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
      link.download = 'F1_2026_Announcement_Oleksandr_Pisarenko_Mercedes.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export announcement card:', err);
      alert('Ошибка экспорта карточки анонса!');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Control Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(90deg, #091316 0%, #0F1A1E 100%)',
          border: '1px solid rgba(0, 210, 190, 0.4)',
          borderRadius: '16px',
          padding: '12px 20px',
          marginBottom: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #00D2BE 0%, #00877A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              boxShadow: '0 0 16px rgba(0, 210, 190, 0.5)'
            }}
          >
            <Megaphone size={22} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#00D2BE',
                fontWeight: '900',
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}
            >
              ⚡ OFFICIAL MERCEDES-AMG PETRONAS & FIA BULLETIN
            </div>
            <h3
              style={{
                fontSize: '1.35rem',
                fontWeight: '900',
                fontStyle: 'italic',
                margin: 0,
                color: '#FFF'
              }}
            >
              Офіційний Анонс: Олександр ПИСАРЕНКО (№95) у Mercedes-AMG!
            </h3>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleDownload}
          disabled={isExporting}
          style={{
            background: 'linear-gradient(135deg, #00D2BE 0%, #00877A 100%)',
            color: '#000',
            border: 'none',
            boxShadow: '0 4px 20px rgba(0, 210, 190, 0.5)',
            padding: '12px 24px',
            fontWeight: '900',
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Camera size={18} /> {isExporting ? 'Экспорт...' : 'Скачать Анонс (PNG)'}
        </button>
      </div>

      {/* Main Announcement Poster Canvas */}
      <div
        ref={cardRef}
        style={{
          position: 'relative',
          background: 'linear-gradient(145deg, #080C10 0%, #0B1417 50%, #05080A 100%)',
          border: '2px solid rgba(0, 210, 190, 0.55)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 210, 190, 0.15)',
          padding: '32px',
          color: '#FFF'
        }}
      >
        {/* Ambient Glows */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 210, 190, 0.22) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 210, 190, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Content Layout */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
            alignItems: 'center'
          }}
        >
          {/* Left: Driver Standing Portrait Card */}
          <div
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '2px solid rgba(0, 210, 190, 0.45)',
              background: 'radial-gradient(circle at 50% 30%, rgba(0, 210, 190, 0.25) 0%, #05070A 90%)',
              height: '440px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.7)'
            }}
          >
            {/* Team Logo Watermark */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '70px',
                height: '70px',
                opacity: 0.85
              }}
            >
              <TeamLogo teamId="mercedes" size="md" />
            </div>

            {/* Racing Number Watermark */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '20px',
                fontSize: '6.5rem',
                fontWeight: '900',
                fontFamily: "'Chakra Petch', sans-serif",
                color: 'rgba(0, 210, 190, 0.12)',
                lineHeight: '1',
                pointerEvents: 'none'
              }}
            >
              95
            </div>

            {/* Driver Image */}
            <img
              src="/portraits/sashko_standing_9-16_with_backjground.png"
              alt="Oleksandr Pisarenko"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                position: 'relative',
                zIndex: 2
              }}
            />

            {/* Bottom Gradient Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 45%)',
                zIndex: 3
              }}
            />

            {/* Bottom Badge inside portrait */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                right: '16px',
                zIndex: 4,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span
                style={{
                  background: 'rgba(0, 210, 190, 0.95)',
                  color: '#000',
                  fontWeight: '900',
                  fontSize: '0.82rem',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  letterSpacing: '1px'
                }}
              >
                PABV • CAR #95
              </span>
              <span
                style={{
                  background: 'rgba(0,0,0,0.8)',
                  color: '#FFF',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}
              >
                🇺🇦 UKRAINE
              </span>
            </div>
          </div>

          {/* Right: Statement & Data Briefing */}
          <div>
            {/* Header Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span
                style={{
                  background: 'rgba(0, 210, 190, 0.15)',
                  border: '1px solid #00D2BE',
                  color: '#00D2BE',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '900',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={14} /> OFFICIAL DRIVER IDENTITY CONFIRMATION
              </span>
            </div>

            {/* Large Name */}
            <div
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '2.5rem',
                color: '#FFF',
                lineHeight: '1',
                marginBottom: '-6px'
              }}
            >
              Олександр
            </div>
            <h1
              style={{
                fontSize: 'clamp(2.6rem, 2rem + 2vw, 3.8rem)',
                fontWeight: '900',
                fontFamily: "'Titillium Web', sans-serif",
                textTransform: 'uppercase',
                margin: '0 0 6px 0',
                color: teamColor,
                lineHeight: '1',
                letterSpacing: '1px',
                textShadow: `0 0 35px ${teamColor}80`
              }}
            >
              ПИСАРЕНКО
            </h1>

            {/* Team & Subtitle */}
            <div
              style={{
                fontSize: '1.1rem',
                fontWeight: '800',
                color: '#E2E8F0',
                letterSpacing: '0.5px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span>MERCEDES-AMG PETRONAS F1 TEAM</span>
              <span style={{ color: '#00D2BE' }}>•</span>
              <span style={{ color: '#00D2BE' }}>БОЛІД #95</span>
            </div>

            {/* Official Announcement Text */}
            <div
              style={{
                background: 'rgba(0, 210, 190, 0.08)',
                borderLeft: '4px solid #00D2BE',
                padding: '16px 20px',
                borderRadius: '8px',
                fontSize: '0.98rem',
                lineHeight: '1.6',
                color: '#E2E8F0',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00D2BE', fontWeight: '900', marginBottom: '6px' }}>
                <CheckCircle2 size={18} /> ОФІЦІЙНА ЗАЯВА ПРЕС-СЛУЖБИ ТА FIA:
              </div>
              Прес-служба команди <strong>Mercedes-AMG Petronas</strong> та Дирекція Чемпіонату офіційно заявляють: напарником Юрія Захарчука під стартовим номером <strong>95</strong> є український гонщик <strong>Олександр ПИСАРЕНКО (PABV)</strong>, а не Громов!
              <div style={{ marginTop: '8px', color: '#94A3B8', fontSize: '0.9rem' }}>
                Просимо вболівальників, трансляторів та коментаторів використовувати правильне прізвище пілота.
              </div>
            </div>

            {/* 4 Stats Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '12px'
              }}
            >
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: '1px solid rgba(0, 210, 190, 0.3)',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '800' }}>СЕЗОН 2026</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: teamColor }}>193</div>
                <div style={{ fontSize: '0.75rem', color: '#E2E8F0', fontWeight: '700' }}>ОЧКІВ У ЗАЛІК</div>
              </div>

              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: '1px solid rgba(0, 210, 190, 0.3)',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '800' }}>ГРАН-ПРІ</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#FFF' }}>3</div>
                <div style={{ fontSize: '0.75rem', color: '#E2E8F0', fontWeight: '700' }}>ПЕРЕМОГИ</div>
              </div>

              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: '1px solid rgba(0, 210, 190, 0.3)',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '800' }}>ПОДІУМИ</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#FFF' }}>8</div>
                <div style={{ fontSize: '0.75rem', color: '#E2E8F0', fontWeight: '700' }}>ПРИЗОВИХ МІСЦЬ</div>
              </div>

              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: '1px solid rgba(0, 210, 190, 0.3)',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '800' }}>РЕЙТИНГ СВІТУ</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: teamColor }}>P4</div>
                <div style={{ fontSize: '0.75rem', color: '#E2E8F0', fontWeight: '700' }}>ТОП-4 СВІТУ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
