import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Users,
  Shield,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import FlagIcon from './FlagIcon';
import TeamLogo from './TeamLogo';

export default function F1PointsProgressionChart({ progressionData, defaultMode = 'drivers' }) {
  const [mode, setMode] = useState(defaultMode); // 'drivers' | 'constructors'
  const [filterType, setFilterType] = useState('top10'); // 'top10' | 'all' | 'players'
  const [selectedId, setSelectedId] = useState(null); // highlight specific driver/team
  const [hoveredStageIdx, setHoveredStageIdx] = useState(null);
  const [activeStageLimit, setActiveStageLimit] = useState(null); // for playback simulation
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimerRef = useRef(null);

  const {
    stages = [],
    driverSeries = [],
    constructorSeries = [],
    leaderHistoryDrivers = [],
    leaderHistoryConstructors = []
  } = progressionData || {};

  const totalStages = stages.length;
  // If activeStageLimit is null, show all stages
  const currentMaxStage = activeStageLimit === null ? totalStages - 1 : activeStageLimit;

  // Autoplay simulation logic
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setActiveStageLimit(prev => {
          const next = (prev === null ? 0 : prev) + 1;
          if (next >= totalStages) {
            setIsPlaying(false);
            return totalStages - 1;
          }
          return next;
        });
      }, 1000);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, totalStages]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (activeStageLimit === null || activeStageLimit >= totalStages - 1) {
        setActiveStageLimit(0);
      }
      setIsPlaying(true);
    }
  };

  const handleResetPlay = () => {
    setIsPlaying(false);
    setActiveStageLimit(null);
  };

  // Filter series based on current mode and filter
  const currentSeriesList = useMemo(() => {
    if (mode === 'drivers') {
      if (filterType === 'top10') {
        return driverSeries.slice(0, 10);
      }
      if (filterType === 'players') {
        return driverSeries.filter(d => !d.driver.isAi);
      }
      return driverSeries;
    } else {
      return constructorSeries;
    }
  }, [mode, filterType, driverSeries, constructorSeries]);

  // Current leaders based on currentMaxStage
  const currentLeaderInfo = useMemo(() => {
    if (mode === 'drivers') {
      return leaderHistoryDrivers[currentMaxStage] || null;
    } else {
      return leaderHistoryConstructors[currentMaxStage] || null;
    }
  }, [mode, currentMaxStage, leaderHistoryDrivers, leaderHistoryConstructors]);

  // Dimensions of SVG chart
  const width = 1040;
  const height = 520;
  const margin = { top: 40, right: 180, bottom: 70, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Scaling functions
  const maxPts = useMemo(() => {
    let max = 0;
    currentSeriesList.forEach(s => {
      const pts = s.cumulativeHistory[currentMaxStage] ?? 0;
      if (pts > max) max = pts;
    });
    // Add 15% headroom
    const buffer = Math.ceil(max * 1.15);
    return Math.max(buffer, 30);
  }, [currentSeriesList, currentMaxStage]);

  // X coordinate for stage index
  const getX = (stageIdx) => {
    if (totalStages <= 1) return margin.left;
    return margin.left + (stageIdx / (totalStages - 1)) * innerWidth;
  };

  // Y coordinate for points
  const getY = (points) => {
    return margin.top + innerHeight - (points / maxPts) * innerHeight;
  };

  // Y Grid lines (0, 25, 50, 75, 100...)
  const yTicks = useMemo(() => {
    const step = maxPts > 200 ? 50 : maxPts > 100 ? 25 : maxPts > 50 ? 15 : 10;
    const ticks = [];
    for (let p = 0; p <= maxPts; p += step) {
      ticks.push(p);
    }
    return ticks;
  }, [maxPts]);

  // Generate smooth SVG path (Catmull-Rom or Bézier)
  const generatePath = (history) => {
    const points = [];
    const limit = Math.min(history.length - 1, currentMaxStage);
    for (let i = 0; i <= limit; i++) {
      points.push({ x: getX(i), y: getY(history[i] || 0) });
    }

    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const mx = (curr.x + next.x) / 2;
      path += ` C ${mx} ${curr.y}, ${mx} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
  };

  // Hovered stage data
  const hoverStage = hoveredStageIdx !== null ? stages[hoveredStageIdx] : null;

  return (
    <div className="card" style={{ padding: '24px', background: '#12141C', border: '1px solid var(--border-color)', borderRadius: '16px', boxShadow: '0 12px 36px rgba(0,0,0,0.6)' }}>
      {/* Top Controls Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--f1-red)', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            <Sparkles size={14} /> ТЕЛЕМЕТРИЯ НАКОПЛЕННЫХ ОЧКОВ • СЕЗОН 2026
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '900', fontStyle: 'italic', margin: '4px 0 6px 0', letterSpacing: '0.5px' }}>
            {mode === 'drivers' ? 'ГОНКА ЧАРТОВ: ЛИЧНЫЙ ЗАЧЁТ ПИЛОТОВ' : 'ГОНКА ЧАРТОВ: КУБОК КОНСТРУКТОРОВ'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#9CA3AF', margin: 0 }}>
            Старт с 0-й точки. Динамика роста очков от первой гонки до текущего этапа.
          </p>
        </div>

        {/* Mode Selector Tabs (Drivers vs Constructors) */}
        <div style={{ display: 'flex', gap: '8px', background: '#0B0D12', padding: '5px', borderRadius: '10px', border: '1px solid #262B3A' }}>
          <button
            className={`btn btn-sm ${mode === 'drivers' ? 'btn-primary' : ''}`}
            onClick={() => { setMode('drivers'); setSelectedId(null); }}
            style={{ fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '7px' }}
          >
            <Users size={16} /> Пилоты (Топ-10)
          </button>
          <button
            className={`btn btn-sm ${mode === 'constructors' ? 'btn-primary' : ''}`}
            onClick={() => { setMode('constructors'); setSelectedId(null); }}
            style={{ fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '7px' }}
          >
            <Shield size={16} /> Кубок конструкторов
          </button>
        </div>
      </div>

      {/* Sub Toolbar: Driver Filter (Топ 10 / Все / Игроки) & Race Playback Simulator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', padding: '12px 16px', background: '#161922', borderRadius: '10px', border: '1px solid #262B3A', marginBottom: '18px' }}>
        {/* Left: Filter Buttons (for drivers) */}
        {mode === 'drivers' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase' }}>Фильтр:</span>
            <button
              className={`btn btn-sm ${filterType === 'top10' ? 'btn-primary' : ''}`}
              onClick={() => setFilterType('top10')}
              style={{ fontSize: '0.75rem', padding: '5px 12px' }}
            >
              Топ-10 пилотов
            </button>
            <button
              className={`btn btn-sm ${filterType === 'players' ? 'btn-primary' : ''}`}
              onClick={() => setFilterType('players')}
              style={{ fontSize: '0.75rem', padding: '5px 12px' }}
            >
              Только игроки (Human)
            </button>
            <button
              className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : ''}`}
              onClick={() => setFilterType('all')}
              style={{ fontSize: '0.75rem', padding: '5px 12px' }}
            >
              Все пилоты ({driverSeries.length})
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase' }}>Команд в борьбе:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#FFF' }}>10 Конструкторов F1</span>
          </div>
        )}

        {/* Right: Race Step Playback Controller ("Симуляция гонки по этапам") */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase' }}>
            Этап: <strong style={{ color: '#FFF' }}>{stages[currentMaxStage]?.shortTitle || 'Все'} ({currentMaxStage}/{totalStages - 1})</strong>
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              className="btn btn-sm"
              disabled={currentMaxStage <= 0}
              onClick={() => { setIsPlaying(false); setActiveStageLimit(Math.max(0, currentMaxStage - 1)); }}
              title="Предыдущий Гран-при"
              style={{ padding: '6px 8px' }}
            >
              <ChevronLeft size={14} />
            </button>

            <button
              className={`btn btn-sm ${isPlaying ? 'btn-primary' : ''}`}
              onClick={handleTogglePlay}
              title={isPlaying ? 'Пауза' : 'Запустить воспроизведение сезона'}
              style={{ padding: '6px 14px', fontWeight: '700', gap: '6px' }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? 'Пауза' : 'Плей'}
            </button>

            <button
              className="btn btn-sm"
              disabled={currentMaxStage >= totalStages - 1}
              onClick={() => { setIsPlaying(false); setActiveStageLimit(Math.min(totalStages - 1, currentMaxStage + 1)); }}
              title="Следующий Гран-при"
              style={{ padding: '6px 8px' }}
            >
              <ChevronRight size={14} />
            </button>

            {activeStageLimit !== null && (
              <button
                className="btn btn-sm"
                onClick={handleResetPlay}
                title="Показать весь сезон целиком"
                style={{ padding: '6px 10px' }}
              >
                <RotateCcw size={13} /> Все
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Current Leader Badge at Current Stage */}
      {currentLeaderInfo && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 18px',
          background: 'linear-gradient(90deg, rgba(225,6,0,0.15) 0%, rgba(255,215,0,0.08) 100%)',
          borderLeft: '4px solid var(--f1-gold)',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.2rem' }}>🥇</span>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--f1-gold)', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                ЛИДЕР ЧЕМПИОНАТА ({stages[currentMaxStage]?.shortTitle})
              </span>
              <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#FFF' }}>
                {mode === 'drivers'
                  ? currentLeaderInfo.driver?.name || 'Нет данных'
                  : currentLeaderInfo.team?.name || 'Нет данных'}
                {mode === 'drivers' && currentLeaderInfo.team && (
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: '600', marginLeft: '8px' }}>
                    • {currentLeaderInfo.team.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Накоплено:</span>
            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--f1-gold)' }}>
              {currentLeaderInfo.points} PTS
            </div>
          </div>
        </div>
      )}

      {/* Interactive SVG Chart Canvas */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto', background: '#0D0F16', borderRadius: '12px', border: '1px solid #1E2330', padding: '10px 0' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', minWidth: '760px', display: 'block' }}
          onMouseLeave={() => setHoveredStageIdx(null)}
        >
          <defs>
            {/* Glow filters */}
            <filter id="f1-gold-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="f1-line-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Grid Pattern */}
            <linearGradient id="chartBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#121520" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0B0D14" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Chart Background Canvas */}
          <rect
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill="url(#chartBgGrad)"
            rx="6"
          />

          {/* Horizontal Y-Gridlines & Labels */}
          {yTicks.map(pts => {
            const y = getY(pts);
            return (
              <g key={`y-${pts}`}>
                <line
                  x1={margin.left}
                  y1={y}
                  x2={margin.left + innerWidth}
                  y2={y}
                  stroke="#1F2433"
                  strokeDasharray={pts === 0 ? 'none' : '3 3'}
                  strokeWidth={pts === 0 ? '1.5' : '1'}
                />
                <text
                  x={margin.left - 10}
                  y={y + 4}
                  fill="#6B7280"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="end"
                  fontFamily="Inter, sans-serif"
                >
                  {pts} pts
                </text>
              </g>
            );
          })}

          {/* Vertical X-Stage Gridlines & Stage Labels */}
          {stages.slice(0, currentMaxStage + 1).map((stg, sIdx) => {
            const x = getX(sIdx);
            const isHovered = hoveredStageIdx === sIdx;
            const isStart = sIdx === 0;

            return (
              <g key={`stg-${stg.id}`}>
                <line
                  x1={x}
                  y1={margin.top}
                  x2={x}
                  y2={margin.top + innerHeight}
                  stroke={isHovered ? 'var(--f1-red)' : isStart ? '#374151' : '#1B202D'}
                  strokeDasharray={isStart ? 'none' : '2 3'}
                  strokeWidth={isHovered ? '2' : isStart ? '1.5' : '1'}
                />

                {/* X Axis Bottom Stage Label */}
                <text
                  x={x}
                  y={margin.top + innerHeight + 20}
                  fill={isHovered ? '#FFF' : isStart ? 'var(--f1-gold)' : '#9CA3AF'}
                  fontSize={isStart ? '10' : '9'}
                  fontWeight={isHovered || isStart ? '800' : '600'}
                  textAnchor="middle"
                  fontFamily="Titillium Web, sans-serif"
                >
                  {stg.shortTitle}
                </text>

                {/* Subtitle / Code below */}
                <text
                  x={x}
                  y={margin.top + innerHeight + 34}
                  fill="#6B7280"
                  fontSize="8"
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                >
                  {isStart ? '0 PTS' : stg.code}
                </text>
              </g>
            );
          })}

          {/* Interactive Hover Area Columns */}
          {stages.slice(0, currentMaxStage + 1).map((_, sIdx) => {
            const x = getX(sIdx);
            const colWidth = innerWidth / Math.max(1, totalStages - 1);
            return (
              <rect
                key={`hover-col-${sIdx}`}
                x={x - colWidth / 2}
                y={margin.top}
                width={colWidth}
                height={innerHeight}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredStageIdx(sIdx)}
              />
            );
          })}

          {/* Chart Series Lines */}
          {currentSeriesList.map(seriesItem => {
            const id = mode === 'drivers' ? seriesItem.driver.id : seriesItem.team.id;
            const color = mode === 'drivers' ? seriesItem.team.color : seriesItem.team.color;
            const isSelected = selectedId === id;
            const isDimmed = selectedId !== null && !isSelected;
            const isLeader = seriesItem.currentRank === 1;

            const pathData = generatePath(seriesItem.cumulativeHistory);

            return (
              <g
                key={`line-${id}`}
                style={{
                  opacity: isDimmed ? 0.15 : 1,
                  transition: 'opacity 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedId(isSelected ? null : id)}
              >
                {/* Thick invisible hit area for easy hover/clicks */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="14"
                />

                {/* Glow layer for selected or leader line */}
                {(isSelected || isLeader) && (
                  <path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth="5"
                    strokeOpacity="0.4"
                    filter="url(#f1-line-glow)"
                  />
                )}

                {/* Primary Telemetry Line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={color}
                  strokeWidth={isSelected ? '3.5' : isLeader ? '3' : '2'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Milestone Node Dots on Each Grand Prix */}
                {seriesItem.cumulativeHistory.slice(0, currentMaxStage + 1).map((pts, stgIdx) => {
                  const cx = getX(stgIdx);
                  const cy = getY(pts);
                  const isWonGP = mode === 'drivers' && seriesItem.raceResults?.[stgIdx]?.pos === 1;
                  const isFastest = mode === 'drivers' && seriesItem.raceResults?.[stgIdx]?.isFastestLap;

                  return (
                    <g key={`dot-${id}-${stgIdx}`}>
                      {/* Outer ring for won GP */}
                      {isWonGP && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="6"
                          fill="none"
                          stroke="var(--f1-gold)"
                          strokeWidth="2"
                        />
                      )}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={stgIdx === 0 ? '3' : isWonGP ? '4' : (isSelected || hoveredStageIdx === stgIdx) ? '4.5' : '2.5'}
                        fill={isWonGP ? 'var(--f1-gold)' : isFastest ? '#A855F7' : color}
                        stroke="#0B0D14"
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })}

                {/* Right Margin: End-point Label & Points Badge */}
                {(() => {
                  const lastStageIdx = Math.min(seriesItem.cumulativeHistory.length - 1, currentMaxStage);
                  const lastPts = seriesItem.cumulativeHistory[lastStageIdx] || 0;
                  const endX = getX(lastStageIdx);
                  const endY = getY(lastPts);

                  const shortDisplayName = mode === 'drivers'
                    ? seriesItem.driver.name.split(' ').pop()
                    : seriesItem.team.name.replace('-AMG Petronas', '').replace(' Racing', '');

                  return (
                    <g transform={`translate(${endX + 8}, ${endY})`}>
                      {/* Color marker tag */}
                      <rect
                        x="0"
                        y="-8"
                        width="3"
                        height="16"
                        fill={color}
                        rx="1.5"
                      />
                      {/* Name */}
                      <text
                        x="7"
                        y="4"
                        fill={isSelected ? '#FFF' : '#D1D5DB'}
                        fontSize="9.5"
                        fontWeight={isSelected || isLeader ? '800' : '600'}
                        fontFamily="Titillium Web, sans-serif"
                      >
                        {shortDisplayName}
                      </text>
                      {/* Points pill */}
                      <text
                        x="90"
                        y="4"
                        fill={isLeader ? 'var(--f1-gold)' : color}
                        fontSize="9.5"
                        fontWeight="800"
                        fontFamily="Inter, sans-serif"
                        textAnchor="end"
                      >
                        {lastPts}
                      </text>
                    </g>
                  );
                })()}
              </g>
            );
          })}

          {/* Active Hover Crosshair Line */}
          {hoveredStageIdx !== null && (
            <g>
              <line
                x1={getX(hoveredStageIdx)}
                y1={margin.top}
                x2={getX(hoveredStageIdx)}
                y2={margin.top + innerHeight}
                stroke="var(--f1-red)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <circle
                cx={getX(hoveredStageIdx)}
                cy={margin.top}
                r="4"
                fill="var(--f1-red)"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Hover Telemetry HUD Card */}
      {hoverStage && (
        <div style={{
          marginTop: '16px',
          padding: '14px 18px',
          background: '#0B0D12',
          border: '1px solid var(--f1-red)',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--f1-red)', fontWeight: '800', letterSpacing: '1px' }}>
              ТЕЛЕМЕТРИЯ ЭТАПА • {hoverStage.shortTitle.toUpperCase()} {hoverStage.date ? `(${hoverStage.date})` : ''}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#FFF' }}>
              {hoverStage.title}
            </div>
          </div>

          {/* Standings breakdown at this specific hovered GP */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Лидеры на этом этапе:</span>
            {currentSeriesList.slice(0, 4).map((item, idx) => {
              const ptsAtStage = item.cumulativeHistory[hoveredStageIdx] || 0;
              const ptsGained = item.pointsHistory[hoveredStageIdx] || 0;
              const name = mode === 'drivers' ? item.driver.name.split(' ').pop() : item.team.name;

              return (
                <div key={`hud-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: '800', color: idx === 0 ? 'var(--f1-gold)' : '#9CA3AF' }}>
                    #{idx + 1}
                  </span>
                  <span style={{ fontWeight: '700', color: '#FFF' }}>{name}:</span>
                  <span style={{ fontWeight: '800', color: item.team.color }}>
                    {ptsAtStage} pts
                  </span>
                  {ptsGained > 0 && (
                    <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '700' }}>
                      (+{ptsGained})
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Legend Pills / Filter Selector */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase' }}>
            {mode === 'drivers' ? 'Выберите пилота для подсветки траектории:' : 'Выберите команду:'}
          </span>
          {selectedId && (
            <button
              className="btn btn-sm"
              onClick={() => setSelectedId(null)}
              style={{ fontSize: '0.75rem', padding: '2px 8px' }}
            >
              Сбросить выделение ✕
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {currentSeriesList.map(item => {
            const id = mode === 'drivers' ? item.driver.id : item.team.id;
            const name = mode === 'drivers' ? item.driver.name : item.team.name;
            const isSelected = selectedId === id;
            const color = item.team.color;
            const currentPoints = item.cumulativeHistory[currentMaxStage] || 0;

            return (
              <button
                key={`pill-${id}`}
                onClick={() => setSelectedId(isSelected ? null : id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: isSelected ? `2px solid ${color}` : '1px solid #262B3A',
                  background: isSelected ? 'rgba(255,255,255,0.08)' : '#161922',
                  color: isSelected ? '#FFF' : '#D1D5DB',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? '800' : '600',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }} />
                {mode === 'drivers' && (
                  <FlagIcon countryCode={item.driver.country} style={{ fontSize: '0.85rem' }} />
                )}
                {mode === 'constructors' && (
                  <TeamLogo teamId={item.team.id} size="xs" />
                )}
                <span>{name}</span>
                <span style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: '#0B0D12',
                  color: item.currentRank === 1 ? 'var(--f1-gold)' : color,
                  fontWeight: '800',
                  fontSize: '0.75rem'
                }}>
                  {currentPoints} pts
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
