import React, { useState, useMemo, useRef } from 'react';
import { Calendar, Flag, Sparkles, Camera, Download, Search, Filter, Zap, Clock, MapPin, Gauge, Shield, ChevronRight, X, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import FlagIcon from './FlagIcon';
import { CALENDAR_2027_1 } from '../data/calendar2027';

export default function F1Calendar2027View() {
  const containerRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'sprint', 'europe', 'americas', 'asia', 'oceania'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [activeModalRace, setActiveModalRace] = useState(null);

  // Filtered races list
  const filteredRaces = useMemo(() => {
    return CALENDAR_2027_1.filter(race => {
      const matchesSearch =
        race.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        race.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        race.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        race.circuit.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'sprint') return race.hasSprint;
      if (selectedFilter === 'europe') return race.region === 'europe';
      if (selectedFilter === 'americas') return race.region === 'americas';
      if (selectedFilter === 'asia') return race.region === 'asia';
      if (selectedFilter === 'oceania') return race.region === 'oceania';

      return true;
    });
  }, [searchQuery, selectedFilter]);

  // Export full calendar snapshot
  const handleExportPNG = async () => {
    if (!containerRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(containerRef.current, {
        quality: 0.98,
        cacheBust: true,
        pixelRatio: 2
      });
      const link = document.createElement('a');
      link.download = `F1_Season_2027-1_Official_Calendar_FIA.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export calendar as PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Generate and download standard .ics calendar file
  const handleDownloadICS = () => {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Formula 1//Tournament Calendar 2027-1//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:F1 2027-1 Official Calendar',
      'X-WR-TIMEZONE:UTC'
    ];

    CALENDAR_2027_1.forEach(race => {
      const summary = `F1: Round ${race.round} - ${race.name}${race.hasSprint ? ' (⚡ Sprint Weekend)' : ''}`;
      const description = `${race.officialName}\\nCircuit: ${race.circuit}, ${race.city}, ${race.country}\\nLaps: ${race.laps} (${race.circuitLength})\\nSprint Format: ${race.hasSprint ? 'YES (7 Sprints in Season)' : 'Standard'}`;
      const location = `${race.circuit}, ${race.city}, ${race.country}`;

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:f1-2027-1-round-${race.round}@f1tournament.local`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        `STATUS:CONFIRMED`,
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'F1_Season_2027_1_Calendar.ics';
    link.click();
    URL.revokeObjectURL(url);
  };

  const sprintCount = CALENDAR_2027_1.filter(r => r.hasSprint).length;

  return (
    <div style={{ marginBottom: '40px' }} ref={containerRef}>
      {/* Official FIA Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #090B12 0%, #121828 50%, #1A0D10 100%)',
        border: '2px solid rgba(225, 6, 0, 0.4)',
        borderRadius: '24px',
        padding: '28px 32px',
        marginBottom: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.85), inset 0 0 30px rgba(225,6,0,0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Speed stripes watermark */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0, rgba(255,255,255,0.015) 12px, transparent 12px, transparent 24px)',
          pointerEvents: 'none'
        }} />

        {/* Top Official Banner Ribbon */}
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          paddingBottom: '16px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src="/F1-logo.png"
              alt="Formula 1"
              style={{ height: '32px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(225,6,0,0.8))' }}
            />
            <div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '2px', color: '#FFD700', fontWeight: '900', textTransform: 'uppercase' }}>
                FEDERATION INTERNATIONALE DE L'AUTOMOBILE
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#FFFFFF', letterSpacing: '1px' }}>
                FIA FORMULA ONE WORLD CHAMPIONSHIP™ • 2027-1 SEASON CALENDAR
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{
              background: 'linear-gradient(135deg, #E10600 0%, #B30000 100%)',
              color: '#FFF',
              fontSize: '0.75rem',
              fontWeight: '900',
              padding: '6px 14px',
              borderRadius: '8px',
              letterSpacing: '1px',
              boxShadow: '0 0 16px rgba(225,6,0,0.5)'
            }}>
              СЛЕДУЮЩИЙ СЕЗОН 2027-1
            </span>
          </div>
        </div>

        {/* Big Title & Summary */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontFamily: 'Caveat, cursive', fontSize: '1.8rem', color: '#FFD700', lineHeight: '1.1' }}>
              The Official Schedule
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', fontStyle: 'italic', margin: '4px 0 10px 0', color: '#FFF', letterSpacing: '1px' }}>
              КАЛЕНДАРЬ СЕЗОНА 2027-1
            </h2>
            <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.95rem', maxWidth: '680px', lineHeight: '1.5' }}>
              Официальное расписание чемпионата, утверждённое FIA: <strong>23 этапа Гран-при</strong>, включая <strong>7 спринт-уик-эндов</strong>. Сезон стартует на легендарном автодроме Red Bull Ring в Австрии и завершится традиционным финалом в Абу-Даби на трассе Яс-Марина.
            </p>
          </div>

          {/* Quick HUD Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            background: 'rgba(0,0,0,0.4)',
            padding: '14px 18px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{ textAlign: 'center', padding: '0 8px' }}>
              <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: '800' }}>ЭТАПОВ</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#FFF' }}>23</div>
              <div style={{ fontSize: '0.6rem', color: '#10B981', fontWeight: '700' }}>ГРАН-ПРИ</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0 8px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.65rem', color: '#00D2BE', fontWeight: '800' }}>СПРИНТОВ</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#00D2BE' }}>{sprintCount}</div>
              <div style={{ fontSize: '0.6rem', color: '#00D2BE', fontWeight: '700' }}>УИК-ЭНДОВ ⚡</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0 8px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: '800' }}>КЛАССИКА</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#FFF' }}>16</div>
              <div style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: '700' }}>СТАНДАРТ</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0 8px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.65rem', color: '#FFD700', fontWeight: '800' }}>КОНТИНЕНТЫ</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#FFD700' }}>5</div>
              <div style={{ fontSize: '0.6rem', color: '#FFD700', fontWeight: '700' }}>МИРОВОЙ ТУР</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Filters, View Modes, Export Buttons */}
      <div className="card" style={{
        padding: '16px 20px',
        marginBottom: '20px',
        background: '#101420',
        border: '1px solid #232A3E',
        borderRadius: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 260px' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '360px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Поиск по трассе, городу или стране..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                color: '#FFF',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => setSelectedFilter('all')}
            className={`btn btn-sm ${selectedFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontWeight: '700', fontSize: '0.82rem', padding: '6px 14px' }}
          >
            Все (23)
          </button>
          <button
            onClick={() => setSelectedFilter('sprint')}
            className={`btn btn-sm ${selectedFilter === 'sprint' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              fontWeight: '800',
              fontSize: '0.82rem',
              padding: '6px 14px',
              color: selectedFilter === 'sprint' ? '#FFF' : '#00D2BE',
              borderColor: selectedFilter === 'sprint' ? undefined : 'rgba(0, 210, 190, 0.4)'
            }}
          >
            <Zap size={14} /> Спринты (7)
          </button>
          <button
            onClick={() => setSelectedFilter('europe')}
            className={`btn btn-sm ${selectedFilter === 'europe' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontWeight: '700', fontSize: '0.82rem', padding: '6px 12px' }}
          >
            Европа (9)
          </button>
          <button
            onClick={() => setSelectedFilter('americas')}
            className={`btn btn-sm ${selectedFilter === 'americas' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontWeight: '700', fontSize: '0.82rem', padding: '6px 12px' }}
          >
            Америка (6)
          </button>
          <button
            onClick={() => setSelectedFilter('asia')}
            className={`btn btn-sm ${selectedFilter === 'asia' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontWeight: '700', fontSize: '0.82rem', padding: '6px 12px' }}
          >
            Азия / Восток (7)
          </button>
        </div>

        {/* View mode toggle & Action Export Buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            padding: '2px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex'
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? '#E10600' : 'transparent',
                color: '#FFF',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: '800',
                cursor: 'pointer'
              }}
              title="Плитка"
            >
              🎴 Сетка
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                background: viewMode === 'table' ? '#E10600' : 'transparent',
                color: '#FFF',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: '800',
                cursor: 'pointer'
              }}
              title="Таблица"
            >
              📋 Таблица FIA
            </button>
          </div>

          <button
            onClick={handleDownloadICS}
            className="btn btn-secondary btn-sm"
            style={{ fontWeight: '800', padding: '6px 12px', fontSize: '0.82rem' }}
            title="Скачать .ics файл для Apple Calendar, Google Calendar, Outlook"
          >
            <Calendar size={14} /> .iCal
          </button>
          <button
            onClick={handleExportPNG}
            disabled={isExporting}
            className="btn btn-primary btn-sm"
            style={{ fontWeight: '800', padding: '6px 14px', fontSize: '0.82rem' }}
          >
            <Camera size={14} /> {isExporting ? 'Экспорт...' : 'PNG'}
          </button>
        </div>
      </div>

      {/* Render Mode 1: Grid Cards View */}
      {viewMode === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {filteredRaces.map((race) => (
            <motion.div
              key={race.id}
              whileHover={{ y: -4, borderColor: race.hasSprint ? '#00D2BE' : 'rgba(225, 6, 0, 0.6)', boxShadow: '0 12px 30px rgba(0,0,0,0.6)' }}
              transition={{ duration: 0.2 }}
              onClick={() => setActiveModalRace(race)}
              style={{
                background: 'linear-gradient(145deg, #101422 0%, #161C2E 100%)',
                border: race.hasSprint ? '1.5px solid rgba(0, 210, 190, 0.45)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '18px',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              {/* Top Accent Band with Round Number and Sprint Pill */}
              <div style={{
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(0,0,0,0.35)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    background: '#E10600',
                    color: '#FFF',
                    fontWeight: '900',
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    letterSpacing: '1px'
                  }}>
                    ROUND {String(race.round).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '700' }}>
                    {race.dates}
                  </span>
                </div>

                {race.hasSprint && (
                  <span style={{
                    background: 'linear-gradient(135deg, rgba(0, 210, 190, 0.2) 0%, rgba(0, 161, 155, 0.3) 100%)',
                    border: '1px solid #00D2BE',
                    color: '#00D2BE',
                    fontSize: '0.68rem',
                    fontWeight: '900',
                    padding: '3px 9px',
                    borderRadius: '20px',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 0 10px rgba(0, 210, 190, 0.3)'
                  }}>
                    <Zap size={12} /> SPRINT ⚡
                  </span>
                )}
              </div>

              {/* Grand Prix Title & Location */}
              <div style={{ padding: '16px 18px 8px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <FlagIcon countryCode={race.countryCode} style={{ width: '22px', height: '15px', borderRadius: '3px' }} />
                  <span style={{ fontSize: '0.82rem', color: '#FFD700', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {race.country}
                  </span>
                </div>
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: '900',
                  color: '#FFFFFF',
                  margin: '0 0 4px 0',
                  fontStyle: 'italic',
                  letterSpacing: '0.5px'
                }}>
                  {race.name}
                </h4>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} style={{ color: '#E10600' }} />
                  {race.circuit}, {race.city}
                </div>
              </div>

              {/* Circuit Map Visual Showcase */}
              <div style={{
                padding: '12px 18px',
                height: '160px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)',
                position: 'relative'
              }}>
                <img
                  src={race.trackMap}
                  alt={race.circuit}
                  style={{
                    maxHeight: '140px',
                    maxWidth: '90%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8)) drop-shadow(0 0 8px rgba(255,255,255,0.15))',
                    transition: 'transform 0.2s ease'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png';
                  }}
                />
              </div>

              {/* Bottom Telemetry HUD Specs */}
              <div style={{
                marginTop: 'auto',
                background: 'rgba(0,0,0,0.4)',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                padding: '12px 18px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                fontSize: '0.75rem',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ color: '#64748B', fontWeight: '800' }}>КРУГИ</div>
                  <div style={{ fontWeight: '900', color: '#FFF' }}>{race.laps} LAPS</div>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: '#64748B', fontWeight: '800' }}>ДЛИНА</div>
                  <div style={{ fontWeight: '900', color: '#FFF' }}>{race.circuitLength}</div>
                </div>
                <div>
                  <div style={{ color: '#64748B', fontWeight: '800' }}>DRS ЗОНЫ</div>
                  <div style={{ fontWeight: '900', color: race.hasSprint ? '#00D2BE' : '#FFD700' }}>{race.drsZones} ЗОНЫ</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Render Mode 2: Official FIA Table View */}
      {viewMode === 'table' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', background: '#12151F', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', fontStyle: 'italic', margin: 0 }}>
              ОФИЦИАЛЬНАЯ ТАБЛИЦА РАСПИСАНИЯ FIA • СЕЗОН 2027-1
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Всего 23 Гран-при утверждены
            </span>
          </div>

          <div className="f1-table-wrapper">
            <table className="f1-table">
              <thead>
                <tr>
                  <th style={{ width: '60px', textAlign: 'center' }}>РАУНД</th>
                  <th>СТРАНА & ЭТАП</th>
                  <th>АВТОДРОМ</th>
                  <th>ФОРМАТ</th>
                  <th style={{ textAlign: 'center' }}>ДАТЫ</th>
                  <th style={{ textAlign: 'center' }}>КРУГИ</th>
                  <th style={{ textAlign: 'center' }}>ДЛИНА</th>
                  <th style={{ textAlign: 'center' }}>DRS</th>
                  <th style={{ textAlign: 'right', paddingRight: '20px' }}>РЕКОРД КРУГА</th>
                </tr>
              </thead>
              <tbody>
                {filteredRaces.map((race) => (
                  <tr
                    key={race.id}
                    onClick={() => setActiveModalRace(race)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ textAlign: 'center', fontWeight: '900', fontSize: '1.05rem', color: '#E10600' }}>
                      {String(race.round).padStart(2, '0')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FlagIcon countryCode={race.countryCode} style={{ width: '24px', height: '16px', borderRadius: '3px' }} />
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '1rem', color: '#FFF' }}>
                            {race.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                            {race.officialName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#CBD5E1' }}>{race.circuit}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{race.city}</div>
                    </td>
                    <td>
                      {race.hasSprint ? (
                        <span style={{
                          background: 'rgba(0, 210, 190, 0.15)',
                          border: '1px solid #00D2BE',
                          color: '#00D2BE',
                          fontSize: '0.7rem',
                          fontWeight: '900',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          ⚡ СПРИНТ
                        </span>
                      ) : (
                        <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>Классика</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '700', fontSize: '0.85rem', color: '#FFF' }}>
                      {race.dates}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '800' }}>{race.laps}</td>
                    <td style={{ textAlign: 'center', fontWeight: '700', color: '#94A3B8' }}>{race.circuitLength}</td>
                    <td style={{ textAlign: 'center', fontWeight: '800', color: '#FFD700' }}>{race.drsZones}</td>
                    <td style={{ textAlign: 'right', paddingRight: '20px', fontSize: '0.8rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                      {race.lapRecord}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Track Details Lightbox Modal */}
      <AnimatePresence>
        {activeModalRace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalRace(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: 'rgba(0, 0, 0, 0.88)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: '720px',
                width: '100%',
                background: 'linear-gradient(145deg, #0C101C 0%, #171E33 100%)',
                border: activeModalRace.hasSprint ? '2px solid #00D2BE' : '2px solid rgba(225,6,0,0.7)',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 30px 90px rgba(0,0,0,0.95), 0 0 50px rgba(225,6,0,0.25)',
                color: '#FFF'
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setActiveModalRace(null)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FFF',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{
                  background: '#E10600',
                  color: '#FFF',
                  fontWeight: '900',
                  fontSize: '0.8rem',
                  padding: '3px 10px',
                  borderRadius: '6px'
                }}>
                  ROUND {String(activeModalRace.round).padStart(2, '0')}
                </span>
                <FlagIcon countryCode={activeModalRace.countryCode} style={{ width: '28px', height: '18px', borderRadius: '4px' }} />
                <span style={{ fontSize: '0.9rem', color: '#FFD700', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {activeModalRace.country}
                </span>
                {activeModalRace.hasSprint && (
                  <span style={{
                    background: 'rgba(0, 210, 190, 0.2)',
                    border: '1px solid #00D2BE',
                    color: '#00D2BE',
                    fontSize: '0.72rem',
                    fontWeight: '900',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    ⚡ SPRINT WEEKEND
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.9rem', fontWeight: '900', fontStyle: 'italic', margin: '4px 0 2px 0' }}>
                {activeModalRace.name}
              </h3>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '16px' }}>
                {activeModalRace.officialName}
              </div>

              {/* Big Circuit Map */}
              <div style={{
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '220px',
                marginBottom: '20px'
              }}>
                <img
                  src={activeModalRace.trackMap}
                  alt={activeModalRace.circuit}
                  style={{ maxHeight: '190px', maxWidth: '90%', objectFit: 'contain' }}
                />
              </div>

              {/* 4 Stats Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '10px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: '800' }}>ДЛИНА КРУГА</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#FFF' }}>{activeModalRace.circuitLength}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: '800' }}>ДИСТАНЦИЯ</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#FFF' }}>{activeModalRace.raceDistance}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: '800' }}>КРУГОВ</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#FFF' }}>{activeModalRace.laps}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: '800' }}>DRS ЗОНЫ</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#FFD700' }}>{activeModalRace.drsZones}</div>
                </div>
              </div>

              {/* Weekend Format & Timetable */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: '0.85rem'
              }}>
                <div style={{ fontWeight: '900', color: '#FFD700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={15} /> РАСПИСАНИЕ УИК-ЭНДА:
                </div>
                {activeModalRace.hasSprint ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', color: '#CBD5E1' }}>
                    <div>
                      <strong style={{ color: '#00D2BE' }}>Пятница:</strong>
                      <div>• FP1 (Тренировка 1)</div>
                      <div>• Sprint Qualifying</div>
                    </div>
                    <div>
                      <strong style={{ color: '#00D2BE' }}>Суббота:</strong>
                      <div>• ⚡ F1 Sprint (100 км)</div>
                      <div>• Grand Prix Qualifying</div>
                    </div>
                    <div>
                      <strong style={{ color: '#00D2BE' }}>Воскресенье:</strong>
                      <div>• 🏁 Главная Гонка Гран-при</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', color: '#CBD5E1' }}>
                    <div>
                      <strong style={{ color: '#FFF' }}>Пятница:</strong>
                      <div>• FP1 (Тренировка 1)</div>
                      <div>• FP2 (Тренировка 2)</div>
                    </div>
                    <div>
                      <strong style={{ color: '#FFF' }}>Суббота:</strong>
                      <div>• FP3 (Тренировка 3)</div>
                      <div>• Grand Prix Qualifying</div>
                    </div>
                    <div>
                      <strong style={{ color: '#FFF' }}>Воскресенье:</strong>
                      <div>• 🏁 Главная Гонка Гран-при</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
