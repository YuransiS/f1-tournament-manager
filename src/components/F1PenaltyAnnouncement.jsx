import React, { useRef, useState } from 'react';
import { Camera, AlertTriangle, ShieldAlert, Scale } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function F1PenaltyAnnouncement({
  raceTitle = 'Spanish Grand Prix',
  trackImage,
  penaltyData = {
    offenderName: 'Yuki TSUNODA',
    offenderCar: 'Car #22 • AlphaTauri',
    victimName: 'Yurii ZAKHARCHUK (imnot4777)',
    victimCar: 'Car #44 • Mercedes-AMG Petronas',
    penaltyText: '+20 SEC TIME PENALTY',
    penaltyValue: '+20 SECONDS',
    docNo: 'DEC-2026-ESP-22',
    circuitName: 'CIRCUIT DE BARCELONA-CATALUNYA',
    headline: 'ШТРАФ +20 СЕКУНД ДЛЯ YUKI TSUNODA (#22 ALPHATAURI)',
    description: 'Стюарды изучили записи онборд-камер и телеметрии. Было установлено, что болид #22 (Yuki Tsunoda) совершил опасный и агрессивный маневр обгона, в результате которого развернул болид #44 (Yurii ZAKHARCHUK / imnot4777) в защитный барьер.',
    consequences: '💥 Последствия инцидента: Болид Юрия Захарчука был отброшен в стену и потерял позиции, а сам Юки Цунода сломал подвеску/колесо своей машины и сошёл с дистанции (DNF).',
    outcome: '⚖️ ИТОГОВЫЙ ШТРАФ: +20 секунд к финальному результату за выбивание соперника и опасный маневр на трассе.'
  }
}) {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.98, cacheBust: true });
      const link = document.createElement('a');
      link.download = `FIA_Official_Penalty_${penaltyData.offenderName.replace(/\s+/g, '_')}_${raceTitle.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export penalty announcement:', err);
      alert('Ошибка экспорта документа о штрафе!');
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
            Официальное Решение Стюардов ФИА ({penaltyData.offenderName})
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
          fontSize: '4.8rem',
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
          {penaltyData.penaltyText}
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
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: '700' }}>DOCUMENT NO: {penaltyData.docNo}</div>
            <div style={{ fontSize: '0.85rem', color: '#FFF', fontWeight: '800' }}>{penaltyData.circuitName}</div>
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
              fontSize: '2rem',
              fontWeight: '900',
              fontStyle: 'italic',
              margin: 0,
              color: '#FFF',
              letterSpacing: '1px'
            }}>
              {penaltyData.headline}
            </h1>
          </div>

          {/* Details Table & Reasoning */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px 20px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase' }}>Нарушитель (Offender)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#EF4444', marginTop: '2px' }}>
                {penaltyData.offenderName} <span style={{ color: '#FFF', fontSize: '0.88rem' }}>({penaltyData.offenderCar})</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px 20px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase' }}>Пострадавшая сторона (Victim)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#00A19B', marginTop: '2px' }}>
                {penaltyData.victimName} <span style={{ color: '#FFF', fontSize: '0.88rem' }}>({penaltyData.victimCar})</span>
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
              {penaltyData.description}
            </p>
            <p style={{ margin: '10px 0 0 0', color: '#F87171', fontWeight: '600' }}>
              {penaltyData.consequences}
            </p>
            <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(239,68,68,0.15)', borderRadius: '6px', fontSize: '0.9rem', color: '#FFF', fontWeight: '800' }}>
              {penaltyData.outcome}
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
            PENALTY APPLIED: {penaltyData.penaltyValue}
          </div>
        </div>
      </div>
    </div>
  );
}
