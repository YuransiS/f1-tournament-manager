import React, { useRef, useState } from 'react';
import { Camera, AlertTriangle, ShieldAlert, Scale, CheckCircle2 } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function F1PenaltyAnnouncement({ raceTitle, trackImage }) {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.98, cacheBust: true });
      const link = document.createElement('a');
      link.download = `FIA_Official_Penalty_Carlos_Sainz_10s_${raceTitle.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export penalty announcement:', err);
      alert('Ошибка экспорта документа о штрафе Сайнса!');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ marginBottom: '36px' }}>
      {/* Control Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge badge-red" style={{ padding: '6px 14px', fontSize: '0.85rem', fontWeight: '900', letterSpacing: '1px' }}>
            ⚠️ OFFICIAL STEWARDS DECISION
          </span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '900', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            Официальный Анонс Штрафа ФИА (Carlos SAINZ)
          </h3>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleDownload}
          disabled={isExporting}
          style={{ boxShadow: '0 4px 20px rgba(225,6,0,0.7)', padding: '12px 24px', fontWeight: '800', fontSize: '0.95rem' }}
        >
          <Camera size={20} /> {isExporting ? 'Экспорт PNG...' : '📸 Скачать Анонс Штрафа (PNG)'}
        </button>
      </div>

      {/* Official FIA Decision Notice Canvas */}
      <div
        ref={cardRef}
        style={{
          width: '100%',
          minHeight: '600px',
          background: '#0F121A',
          backgroundImage: `
            linear-gradient(135deg, rgba(24, 28, 42, 0.98) 0%, rgba(10, 12, 18, 0.99) 100%),
            repeating-linear-gradient(45deg, rgba(239, 68, 68, 0.02) 0, rgba(239, 68, 68, 0.02) 15px, transparent 15px, transparent 30px)
          `,
          borderRadius: '16px',
          border: '3px solid #EF4444',
          padding: '36px 44px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 70px rgba(239, 68, 68, 0.2), 0 10px 40px rgba(0,0,0,0.9)',
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
              opacity: 0.06,
              filter: 'invert(1) drop-shadow(0 0 30px rgba(239,68,68,0.6))',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
        )}

        {/* GIANT RED PENALTY STAMP WATERMARK */}
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-12deg)',
          fontSize: '5.5rem',
          fontWeight: '900',
          fontFamily: 'var(--font-f1)',
          color: 'rgba(239, 68, 68, 0.16)',
          border: '8px solid rgba(239, 68, 68, 0.22)',
          padding: '10px 36px',
          borderRadius: '18px',
          letterSpacing: '6px',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          zIndex: 2,
          whiteSpace: 'nowrap'
        }}>
          +10 SEC TIME PENALTY
        </div>

        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: '#FFF', padding: '8px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', boxShadow: '0 4px 15px rgba(255,255,255,0.3)' }}>
              <img src="/F1-logo.png" alt="F1" style={{ height: '30px', objectFit: 'contain' }} />
            </div>
            <div style={{ height: '36px', width: '2px', background: 'rgba(255,255,255,0.2)' }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#EF4444', letterSpacing: '2px', textTransform: 'uppercase' }}>
                FEDERATION INTERNATIONALE DE L'AUTOMOBILE
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '900', letterSpacing: '1px', fontStyle: 'italic' }}>
                DECISION OF THE STEWARDS • RACE INCIDENT BULLETIN
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: '700' }}>DOCUMENT NO: DEC-2026-MIA-55</div>
            <div style={{ fontSize: '0.85rem', color: '#FFF', fontWeight: '800' }}>MIAMI INTERNATIONAL AUTODROME</div>
          </div>
        </div>

        {/* Incident Summary Card Header */}
        <div style={{ zIndex: 10, margin: '22px 0', flex: 1 }}>
          <div style={{
            background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.25) 0%, rgba(239, 68, 68, 0.05) 100%)',
            borderLeft: '6px solid #EF4444',
            padding: '18px 24px',
            borderRadius: '8px',
            marginBottom: '22px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#EF4444', fontWeight: '900', fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
              <Scale size={20} /> РЕШЕНИЕ СТЮАРДОВ ПОСЛЕ ГОНКИ (POST-RACE PENALTY)
            </div>
            <h1 style={{
              fontFamily: 'var(--font-f1)',
              fontSize: '2.2rem',
              fontWeight: '900',
              fontStyle: 'italic',
              margin: 0,
              color: '#FFF',
              letterSpacing: '1px'
            }}>
              ШТРАФ +10 СЕКУНД ДЛЯ CARLOS SAINZ (#55 FERRARI)
            </h1>
          </div>

          {/* Details Table & Reasoning */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px 20px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase' }}>Нарушитель (Offender)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#E80020', marginTop: '2px' }}>
                Carlos SAINZ <span style={{ color: '#FFF', fontSize: '0.9rem' }}>(Car #55 • Ferrari)</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px 20px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase' }}>Пострадавшая сторона (Victim)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#00A19B', marginTop: '2px' }}>
                Alexsandr GROMOV (PABV) <span style={{ color: '#FFF', fontSize: '0.9rem' }}>(Car #63 • Mercedes)</span>
              </div>
            </div>
          </div>

          {/* Official Reasoning Box */}
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '20px 24px',
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#E5E7EB'
          }}>
            <div style={{ fontWeight: '900', color: '#FFD700', fontSize: '1.05rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} style={{ color: '#FFD700' }} /> Обоснование решения Международных Стюардов ФИА:
            </div>
            <p style={{ margin: 0 }}>
              Стюарды изучили видеозаписи с онборд-камер, данные GPS и телеметрии. Было установлено, что болид #55 (Carlos Sainz) совершил агрессивный и нескоординированный маневр обгона, вызвав фатальный контакт с болидом #63 (Alexsandr GROMOV / PABV).
            </p>
            <p style={{ margin: '10px 0 0 0', color: '#F87171', fontWeight: '600' }}>
              💥 <strong>Последствия инцидента:</strong> Болид Артёма/Сашка получил несовместимые с продолжением гонки повреждения (<em>Terminal Damage</em>) и сошел с дистанции. Вся вина за инцидент возложена на Карлоса Сайнса.
            </p>
            <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(239,68,68,0.15)', borderRadius: '6px', fontSize: '0.9rem', color: '#FFF', fontWeight: '800' }}>
              ⚖️ <strong>ИТОГОВЫЙ ШТРАФ:</strong> +10 секунд к финальному времени гонки. Карлос Сайнс перемещается с 6-го места на 17-е место (0 очков).
            </div>
          </div>
        </div>

        {/* Footer & Stamps */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
          <div style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: '600' }}>
            FIA STEWARDS: Garry Connelly, Felix Holter, Vitantonio Liuzzi, Dennis Dean
          </div>

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
            PENALTY APPLIED: +10 SECONDS
          </div>
        </div>
      </div>
    </div>
  );
}
