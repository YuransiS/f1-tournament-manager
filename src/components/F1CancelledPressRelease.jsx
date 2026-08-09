import React, { useRef, useState } from 'react';
import { Camera, AlertTriangle, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function F1CancelledPressRelease({ raceTitle, trackImage }) {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.98, cacheBust: true });
      const link = document.createElement('a');
      link.download = `FIA_Official_Statement_${raceTitle.replace(/\s+/g, '_')}_CANCELLED.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export press release image:', err);
      alert('Ошибка экспорта пресс-релиза!');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ marginBottom: '36px' }}>
      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge badge-red" style={{ padding: '6px 14px', fontSize: '0.85rem', fontWeight: '900', letterSpacing: '1px' }}>
            🚨 OFFICIAL FIA STATEMENT
          </span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '900', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            Официальный Пресс-Релиз ФИА
          </h3>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleDownload}
          disabled={isExporting}
          style={{ boxShadow: '0 4px 20px rgba(225,6,0,0.7)', padding: '12px 24px', fontWeight: '800', fontSize: '0.95rem' }}
        >
          <Camera size={20} /> {isExporting ? 'Экспорт PNG...' : '📸 Скачать Пресс-релиз (PNG)'}
        </button>
      </div>

      {/* Official F1 / FIA Press Release Canvas */}
      <div
        ref={cardRef}
        style={{
          width: '100%',
          minHeight: '620px',
          background: '#0F1117',
          backgroundImage: `
            linear-gradient(135deg, rgba(20, 24, 35, 0.98) 0%, rgba(10, 12, 18, 0.99) 100%),
            repeating-linear-gradient(45deg, rgba(225,6,0,0.02) 0, rgba(225,6,0,0.02) 15px, transparent 15px, transparent 30px)
          `,
          borderRadius: '16px',
          border: '3px solid #DC2626',
          padding: '40px 48px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 70px rgba(220, 38, 38, 0.25), 0 10px 40px rgba(0,0,0,0.9)',
          color: '#FFF',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between'
        }}
      >
        {/* Track Outline Silhouette Background Watermark */}
        {trackImage && (
          <img
            src={trackImage}
            alt="Track Layout"
            style={{
              position: 'absolute',
              top: '15%',
              right: '5%',
              height: '70%',
              opacity: 0.05,
              filter: 'invert(1) drop-shadow(0 0 30px rgba(225,6,0,0.8))',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
        )}

        {/* GIANT CANCELLED WATERMARK STAMP */}
        <div style={{
          position: 'absolute',
          top: '38%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-14deg)',
          fontSize: '6.5rem',
          fontWeight: '900',
          fontFamily: 'var(--font-f1)',
          color: 'rgba(220, 38, 38, 0.18)',
          border: '10px solid rgba(220, 38, 38, 0.22)',
          padding: '10px 40px',
          borderRadius: '20px',
          letterSpacing: '8px',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          zIndex: 2,
          whiteSpace: 'nowrap',
          textShadow: '0 0 30px rgba(220,38,38,0.3)'
        }}>
          OFFICIALLY CANCELLED
        </div>

        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
          {/* FIA & F1 Logo Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: '#FFF', padding: '8px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', boxShadow: '0 4px 15px rgba(255,255,255,0.3)' }}>
              <img src="/F1-logo.png" alt="F1" style={{ height: '32px', objectFit: 'contain' }} />
            </div>
            <div style={{ height: '36px', width: '2px', background: 'rgba(255,255,255,0.2)' }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#EF4444', letterSpacing: '2px', textTransform: 'uppercase' }}>
                FEDERATION INTERNATIONALE DE L'AUTOMOBILE
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '900', letterSpacing: '1px', fontStyle: 'italic' }}>
                OFFICIAL RACE BULLETIN & MEDIA STATEMENT
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: '700' }}>DOC NO: FIA-2026-AZ-04</div>
            <div style={{ fontSize: '0.85rem', color: '#FFF', fontWeight: '800' }}>BAKU CITY CIRCUIT • 23.03.2026</div>
          </div>
        </div>

        {/* Main Document Body */}
        <div style={{ zIndex: 10, margin: '28px 0', flex: 1 }}>
          {/* Main Title Banner */}
          <div style={{
            background: 'linear-gradient(90deg, rgba(220, 38, 38, 0.25) 0%, rgba(220, 38, 38, 0.05) 100%)',
            borderLeft: '6px solid #DC2626',
            padding: '20px 24px',
            borderRadius: '8px',
            marginBottom: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#EF4444', fontWeight: '900', fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
              <ShieldAlert size={20} /> ЭКСТРЕННОЕ СООБЩЕНИЕ ГОНОЧНОЙ ДИРЕКЦИИ
            </div>
            <h1 style={{
              fontFamily: 'var(--font-f1)',
              fontSize: '2.4rem',
              fontWeight: '900',
              fontStyle: 'italic',
              margin: 0,
              color: '#FFF',
              letterSpacing: '1px',
              lineHeight: 1.1
            }}>
              ОФИЦИАЛЬНАЯ ОТМЕНА ОСНОВНОЙ ГОНКИ ГРАН-ПРИ АЗЕРБАЙДЖАНА 2026
            </h1>
          </div>

          {/* Statement Paragraphs */}
          <div style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#E5E7EB', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <p style={{ margin: 0, fontWeight: '500' }}>
              Международная автомобильная федерация (<strong>FIA</strong>) и руководящий комитет <strong>Formula 1</strong> официально заявляют, что <span style={{ color: '#EF4444', fontWeight: '800' }}>основная гонка Гран-при Азербайджана 2026 года</span> на уличной трассе <em>Baku City Circuit</em> <strong style={{ textDecoration: 'underline' }}>отменена</strong>.
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '20px 24px'
            }}>
              <div style={{ fontWeight: '800', color: '#FFD700', fontSize: '1.1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} style={{ color: '#FFD700' }} /> Причина решения стюардов и Гоночной Дирекции:
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#D1D5DB' }}>
                <li>
                  <strong>Массовый завал и повреждение барьеров:</strong> В узком узловом секторе у Замка (Castle Section, поворот 8) произошёл массовый завал с участием более 5 болидов, сделавший безопасное возобновление гонки невозможным.
                </li>
                <li>
                  <strong>Сложные инфраструктурные и сбойные условия:</strong> Серия сходов (DNF) пилотов в Спринте и форс-мажорные технические задержки на трассе.
                </li>
                <li>
                  <strong>Безопасность гонщиков:</strong> Проведение 51 круга гонки признано несущим высокую угрозу безопасности спортсменов и маршалов трассы.
                </li>
              </ul>
            </div>

            {/* Championship Points Policy */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '4px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: '800', fontSize: '0.95rem', marginBottom: '4px' }}>
                  <CheckCircle2 size={18} /> СПРИНТ-ЗАЕЗД (SPRINT)
                </div>
                <div style={{ fontSize: '0.9rem', color: '#D1D5DB' }}>
                  Результаты Спринта за 23 марта <strong>сохранены в полном объёме</strong>. Очки ТОП-8 пилотам начислены в зачет Чемпионата!
                </div>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', fontWeight: '800', fontSize: '0.95rem', marginBottom: '4px' }}>
                  <AlertTriangle size={18} /> ОСНОВНАЯ ГОНКА (FEATURE RACE)
                </div>
                <div style={{ fontSize: '0.9rem', color: '#D1D5DB' }}>
                  Гонка признана <strong>несостоявшейся (0 PTS)</strong>. Очки за заезд не начисляются ни пилотам, ни конструкторам.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Signatures & Stamp */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
              OFFICIAL SIGNATURES & RATIFICATION
            </div>
            <div style={{ display: 'flex', gap: '32px', marginTop: '10px' }}>
              <div>
                <div style={{ fontFamily: 'cursive', fontSize: '1.3rem', color: '#60A5FA', fontWeight: '700' }}>M. Ben Sulayem</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '600' }}>President, FIA</div>
              </div>
              <div>
                <div style={{ fontFamily: 'cursive', fontSize: '1.3rem', color: '#F472B6', fontWeight: '700' }}>S. Domenicali</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '600' }}>CEO, Formula 1</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: '#EF4444',
              color: '#FFF',
              fontFamily: 'var(--font-f1)',
              fontWeight: '900',
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '0.9rem',
              letterSpacing: '1px',
              boxShadow: '0 4px 15px rgba(239,68,68,0.5)'
            }}>
              STATUS: CANCELLED (0 PTS)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
