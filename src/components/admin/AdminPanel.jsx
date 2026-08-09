import React, { useState } from 'react';
import { ShieldAlert, Plus, Trash2, Edit3, Save, ArrowUp, ArrowDown, Award, Settings, Database, AlertCircle } from 'lucide-react';

export default function AdminPanel({
  data,
  onSaveData,
  onResetData,
  onExportData,
  onImportData
}) {
  const [tab, setTab] = useState('races'); // 'races' | 'penalties' | 'drivers' | 'points' | 'backup'
  const [selectedRaceId, setSelectedRaceId] = useState(data.races[0]?.id || '');
  const [editingRace, setEditingRace] = useState(null);

  // New Race Form State
  const [showNewRaceModal, setShowNewRaceModal] = useState(false);
  const [newRaceTitle, setNewRaceTitle] = useState('');
  const [newRaceSubtitle, setNewRaceSubtitle] = useState('');
  const [newRaceDate, setNewRaceDate] = useState(new Date().toISOString().slice(0, 10));

  // New Penalty Form State
  const [penDriverId, setPenDriverId] = useState(data.drivers[0]?.id || '');
  const [penType, setPenType] = useState('TIME');
  const [penValue, setPenValue] = useState(3);
  const [penReason, setPenReason] = useState('Срез трассы / Track limits (x1)');

  // New Driver Form State
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverFlag, setNewDriverFlag] = useState('🇺🇦');
  const [newDriverTeam, setNewDriverTeam] = useState(data.teams[0]?.id || '');
  const [newDriverIsAi, setNewDriverIsAi] = useState(false);

  // Active Race for Results Editing
  const activeRace = data.races.find(r => r.id === selectedRaceId) || data.races[0];

  // Handler: Move driver position up/down in active race
  const moveDriverPosition = (index, direction) => {
    if (!activeRace) return;
    const newResults = [...activeRace.results];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newResults.length) return;

    const temp = newResults[index];
    newResults[index] = newResults[targetIdx];
    newResults[targetIdx] = temp;

    const updatedRaces = data.races.map(r => r.id === activeRace.id ? { ...r, results: newResults } : r);
    onSaveData({ ...data, races: updatedRaces });
  };

  // Handler: Update result field for driver in active race
  const updateResultField = (driverId, field, value) => {
    const updatedResults = activeRace.results.map(res => {
      if (res.driverId === driverId) {
        return { ...res, [field]: value };
      }
      return res;
    });
    const updatedRaces = data.races.map(r => r.id === activeRace.id ? { ...r, results: updatedResults } : r);
    onSaveData({ ...data, races: updatedRaces });
  };

  // Handler: Set Fastest Lap Driver
  const setFastestLapDriver = (driverId) => {
    const updatedRaces = data.races.map(r => r.id === activeRace.id ? { ...r, fastestLapDriverId: driverId } : r);
    onSaveData({ ...data, races: updatedRaces });
  };

  // Handler: Add New Race
  const handleAddRace = (e) => {
    e.preventDefault();
    if (!newRaceTitle.trim()) return;

    // Default results ordering based on current drivers
    const initialResults = data.drivers.map((d, i) => ({
      driverId: d.id,
      grid: i + 1,
      stops: 1,
      bestLap: '1:35.000',
      totalTime: i === 0 ? '50:00.000' : `+${i * 1.5}s`,
      penaltySeconds: 0,
      penaltyLabel: '',
      status: 'FINISHED'
    }));

    const newRace = {
      id: `race-${Date.now()}`,
      title: newRaceTitle,
      subtitle: newRaceSubtitle || 'GRAND PRIX RACE',
      date: newRaceDate,
      status: 'completed',
      fastestLapDriverId: data.drivers[0]?.id || '',
      results: initialResults
    };

    onSaveData({ ...data, races: [...data.races, newRace] });
    setSelectedRaceId(newRace.id);
    setShowNewRaceModal(false);
    setNewRaceTitle('');
    setNewRaceSubtitle('');
  };

  // Handler: Add Penalty
  const handleAddPenalty = (e) => {
    e.preventDefault();
    const newPen = {
      id: `pen-${Date.now()}`,
      driverId: penDriverId,
      raceId: selectedRaceId,
      type: penType,
      value: Number(penValue),
      reason: penReason,
      date: new Date().toISOString().slice(0, 10)
    };

    // Also update penalty label in active race if time penalty
    if (penType === 'TIME' && activeRace) {
      const updatedResults = activeRace.results.map(res => {
        if (res.driverId === penDriverId) {
          return {
            ...res,
            penaltySeconds: Number(penValue),
            penaltyLabel: `x1 (+${penValue} secs.)`
          };
        }
        return res;
      });
      const updatedRaces = data.races.map(r => r.id === activeRace.id ? { ...r, results: updatedResults } : r);
      onSaveData({
        ...data,
        races: updatedRaces,
        penalties: [...(data.penalties || []), newPen]
      });
    } else {
      onSaveData({
        ...data,
        penalties: [...(data.penalties || []), newPen]
      });
    }
  };

  // Handler: Delete Penalty
  const handleDeletePenalty = (penId) => {
    const updated = data.penalties.filter(p => p.id !== penId);
    onSaveData({ ...data, penalties: updated });
  };

  // Handler: Add Driver
  const handleAddDriver = (e) => {
    e.preventDefault();
    if (!newDriverName.trim()) return;

    const newDriver = {
      id: `drv-${Date.now()}`,
      name: newDriverName,
      flag: newDriverFlag,
      country: 'UA',
      teamId: newDriverTeam,
      isAi: newDriverIsAi
    };

    onSaveData({ ...data, drivers: [...data.drivers, newDriver] });
    setNewDriverName('');
  };

  // Handler: Delete Driver
  const handleDeleteDriver = (driverId) => {
    if (!confirm('Вы уверены, что хотите удалить этого пилота?')) return;
    const updatedDrivers = data.drivers.filter(d => d.id !== driverId);
    onSaveData({ ...data, drivers: updatedDrivers });
  };

  return (
    <div className="card" style={{ borderTop: '3px solid var(--f1-red)' }}>
      <div className="card-header">
        <h2 className="card-title" style={{ color: 'var(--f1-red)' }}>
          <ShieldAlert size={28} />
          /ADMIN CONTROL CENTER
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Панель судьи: управление заездами, очками и штрафами
        </span>
      </div>

      {/* Admin Sub-navigation */}
      <div className="nav-tabs" style={{ marginBottom: '24px' }}>
        <button className={`nav-btn ${tab === 'races' ? 'active' : ''}`} onClick={() => setTab('races')}>
          🏆 Заезды & Результаты
        </button>
        <button className={`nav-btn ${tab === 'penalties' ? 'active' : ''}`} onClick={() => setTab('penalties')}>
          ⚠️ Штрафы & Секунды
        </button>
        <button className={`nav-btn ${tab === 'drivers' ? 'active' : ''}`} onClick={() => setTab('drivers')}>
          🏎️ Управление Пилотами
        </button>
        <button className={`nav-btn ${tab === 'points' ? 'active' : ''}`} onClick={() => setTab('points')}>
          📊 Система Очков
        </button>
        <button className={`nav-btn ${tab === 'backup' ? 'active' : ''}`} onClick={() => setTab('backup')}>
          💾 Данные / Бэкап
        </button>
      </div>

      {/* TAB 1: RACE RESULTS EDITOR */}
      {tab === 'races' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Редактируемый Заезд:</label>
              <select
                className="form-control"
                value={selectedRaceId}
                onChange={e => setSelectedRaceId(e.target.value)}
                style={{ width: 'auto', minWidth: '240px' }}
              >
                {data.races.map(r => (
                  <option key={r.id} value={r.id}>{r.title} ({r.date})</option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary" onClick={() => setShowNewRaceModal(true)}>
              <Plus size={16} /> Создать новый заезд
            </button>
          </div>

          {activeRace && (
            <div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                💡 <strong>Подсказка судьи:</strong> Используйте кнопки ⬆️/⬇️ для изменения финишной позиции пилотов. Введите штрафные секунды или маркеры. Позиция 1 получает 25 очков, лучший круг дает +1 очко.
              </div>

              <div className="f1-table-wrapper">
                <table className="f1-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px', textAlign: 'center' }}>ПОРЯДОК</th>
                      <th>ПИЛОТ</th>
                      <th style={{ width: '90px' }}>GRID</th>
                      <th style={{ width: '80px' }}>STOPS</th>
                      <th style={{ width: '130px' }}>БЫСТРЫЙ КРУГ</th>
                      <th style={{ width: '150px' }}>ВРЕМЯ / ОГРАНИЧЕНИЕ</th>
                      <th style={{ width: '150px' }}>ШТРАФ (МЕТКА)</th>
                      <th style={{ width: '100px', textAlign: 'center' }}>СТАТУС</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeRace.results.map((res, idx) => {
                      const drv = data.drivers.find(d => d.id === res.driverId) || { name: 'Unknown', flag: '🏳️' };
                      const isFastest = activeRace.fastestLapDriverId === res.driverId;

                      return (
                        <tr key={res.driverId}>
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                              <button
                                className="btn btn-sm"
                                disabled={idx === 0}
                                onClick={() => moveDriverPosition(idx, -1)}
                                style={{ padding: '2px 6px' }}
                              >
                                ⬆️
                              </button>
                              <button
                                className="btn btn-sm"
                                disabled={idx === activeRace.results.length - 1}
                                onClick={() => moveDriverPosition(idx, 1)}
                                style={{ padding: '2px 6px' }}
                              >
                                ⬇️
                              </button>
                            </div>
                          </td>

                          <td>
                            <div style={{ fontWeight: '700', color: '#FFF' }}>
                              {idx + 1}. {drv.flag} {drv.name} {!drv.isAi && '🎮'}
                            </div>
                          </td>

                          <td>
                            <input
                              type="number"
                              className="form-control"
                              style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                              value={res.grid || (idx + 1)}
                              onChange={e => updateResultField(res.driverId, 'grid', Number(e.target.value))}
                            />
                          </td>

                          <td>
                            <input
                              type="number"
                              className="form-control"
                              style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                              value={res.stops || 1}
                              onChange={e => updateResultField(res.driverId, 'stops', Number(e.target.value))}
                            />
                          </td>

                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <input
                                type="text"
                                className="form-control"
                                style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                                value={res.bestLap || ''}
                                onChange={e => updateResultField(res.driverId, 'bestLap', e.target.value)}
                              />
                              <button
                                className={`btn btn-sm ${isFastest ? 'btn-primary' : ''}`}
                                title="Назначить лучшим кругом заезда"
                                onClick={() => setFastestLapDriver(res.driverId)}
                                style={{ padding: '4px 6px', fontSize: '0.75rem' }}
                              >
                                🟣
                              </button>
                            </div>
                          </td>

                          <td>
                            <input
                              type="text"
                              className="form-control"
                              style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                              value={res.totalTime || ''}
                              onChange={e => updateResultField(res.driverId, 'totalTime', e.target.value)}
                            />
                          </td>

                          <td>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. x1 (+3 secs.)"
                              style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                              value={res.penaltyLabel || ''}
                              onChange={e => updateResultField(res.driverId, 'penaltyLabel', e.target.value)}
                            />
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            <select
                              className="form-control"
                              style={{ padding: '4px 6px', fontSize: '0.8rem' }}
                              value={res.status || 'FINISHED'}
                              onChange={e => updateResultField(res.driverId, 'status', e.target.value)}
                            >
                              <option value="FINISHED">ОК</option>
                              <option value="DNF">DNF</option>
                              <option value="DSQ">DSQ</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PENALTIES MANAGER */}
      {tab === 'penalties' && (
        <div>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Выдать штраф пилоту</h3>
          <form onSubmit={handleAddPenalty} className="form-row" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            <div className="form-group">
              <label>Пилот:</label>
              <select className="form-control" value={penDriverId} onChange={e => setPenDriverId(e.target.value)}>
                {data.drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.flag} {d.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Тип штрафа:</label>
              <select className="form-control" value={penType} onChange={e => setPenType(e.target.value)}>
                <option value="TIME">Секунды к времени заезда (+3s, +5s)</option>
                <option value="POINTS">Вычет очков из общего зачёта</option>
              </select>
            </div>

            <div className="form-group">
              <label>Значение (секунды или очки):</label>
              <input type="number" className="form-control" value={penValue} onChange={e => setPenValue(e.target.value)} min="1" required />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Причина штрафа:</label>
              <input type="text" className="form-control" value={penReason} onChange={e => setPenReason(e.target.value)} required />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Plus size={16} /> Назначить Штраф
              </button>
            </div>
          </form>

          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>История выданных штрафов</h3>
          <div className="f1-table-wrapper">
            <table className="f1-table">
              <thead>
                <tr>
                  <th>ПИЛОТ</th>
                  <th>ТИП ШТРАФА</th>
                  <th>ЗНАЧЕНИЕ</th>
                  <th>ПРИЧИНА</th>
                  <th>ДАТА</th>
                  <th style={{ textAlign: 'center' }}>ДЕЙСТВИЕ</th>
                </tr>
              </thead>
              <tbody>
                {(data.penalties || []).map(p => {
                  const drv = data.drivers.find(d => d.id === p.driverId) || { name: 'Unknown' };
                  return (
                    <tr key={p.id}>
                      <td><span style={{ fontWeight: '700' }}>{drv.flag} {drv.name}</span></td>
                      <td>
                        <span className="penalty-tag">
                          {p.type === 'TIME' ? '⏱️ ВРЕМЕННОЙ' : '📉 ВЫЧЕТ ОЧКОВ'}
                        </span>
                      </td>
                      <td style={{ fontWeight: '700', color: '#EF4444' }}>
                        {p.type === 'TIME' ? `+${p.value} сек.` : `-${p.value} очков`}
                      </td>
                      <td>{p.reason}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{p.date}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeletePenalty(p.id)}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DRIVER & TEAM MANAGER */}
      {tab === 'drivers' && (
        <div>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Добавить нового пилота в турнир</h3>
          <form onSubmit={handleAddDriver} className="form-row" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            <div className="form-group">
              <label>Имя / Никнейм:</label>
              <input type="text" className="form-control" placeholder="e.g. SpeedDemon" value={newDriverName} onChange={e => setNewDriverName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Флаг страны (эмодзи):</label>
              <input type="text" className="form-control" value={newDriverFlag} onChange={e => setNewDriverFlag(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Команда:</label>
              <select className="form-control" value={newDriverTeam} onChange={e => setNewDriverTeam(e.target.value)}>
                {data.teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Тип игрока:</label>
              <select className="form-control" value={newDriverIsAi ? 'ai' : 'player'} onChange={e => setNewDriverIsAi(e.target.value === 'ai')}>
                <option value="player">🎮 Реальный Игрок</option>
                <option value="ai">🤖 ИИ Бот</option>
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Plus size={16} /> Добавить Пилота
              </button>
            </div>
          </form>

          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Список участников ({data.drivers.length})</h3>
          <div className="f1-table-wrapper">
            <table className="f1-table">
              <thead>
                <tr>
                  <th>ПИЛОТ</th>
                  <th>ТИП</th>
                  <th>КОМАНДА</th>
                  <th style={{ textAlign: 'center' }}>ДЕЙСТВИЕ</th>
                </tr>
              </thead>
              <tbody>
                {data.drivers.map(drv => {
                  const tm = data.teams.find(t => t.id === drv.teamId) || { name: 'None', color: '#666' };
                  return (
                    <tr key={drv.id}>
                      <td style={{ fontWeight: '700' }}>{drv.flag} {drv.name}</td>
                      <td>
                        {!drv.isAi ? (
                          <span className="player-badge">🎮 Игрок</span>
                        ) : (
                          <span className="ai-badge">🤖 AI</span>
                        )}
                      </td>
                      <td>
                        <span className="team-stripe" style={{ backgroundColor: tm.color, marginRight: '8px' }} />
                        {tm.name}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteDriver(drv.id)}>
                          <Trash2 size={14} /> Удалить
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: POINTS SYSTEM CONFIG */}
      {tab === 'points' && (
        <div>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Настройка распределения очков (F1 Standard)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {(data.pointsMap || [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]).map((pts, idx) => (
              <div key={idx} className="form-group" style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                <label>{idx + 1} Место:</label>
                <input
                  type="number"
                  className="form-control"
                  value={pts}
                  onChange={e => {
                    const updated = [...(data.pointsMap || [25, 18, 15, 12, 10, 8, 6, 4, 2, 1])];
                    updated[idx] = Number(e.target.value);
                    onSaveData({ ...data, pointsMap: updated });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: BACKUP & LOCAL STORAGE */}
      {tab === 'backup' && (
        <div>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Управление данными и Бэкап</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="card" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <Database size={24} style={{ color: 'var(--f1-red)', marginBottom: '12px' }} />
              <h4>Сохранить локальную копию</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '8px 0 16px 0' }}>
                Скачайте файл `.json` со всеми результатами турнира, штрафами и списками пилотов.
              </p>
              <button className="btn btn-primary" onClick={onExportData}>
                Скачать JSON Бэкап
              </button>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <Settings size={24} style={{ color: '#00A0DE', marginBottom: '12px' }} />
              <h4>Загрузить Бэкап</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '8px 0 16px 0' }}>
                Восстановите состояние турнира из ранее сохранённого `.json` файла.
              </p>
              <input
                type="file"
                accept=".json"
                onChange={e => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = event => {
                    try {
                      onImportData(event.target.result);
                      alert('Данные успешно импортированы!');
                    } catch (err) {
                      alert('Ошибка при импорте: ' + err.message);
                    }
                  };
                  reader.readAsText(file);
                }}
              />
            </div>

            <div className="card" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <AlertCircle size={24} style={{ color: '#EF4444', marginBottom: '12px' }} />
              <h4>Сброс к скриншотам</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '8px 0 16px 0' }}>
                Восстановить первоначальные данные этапа Бахрейна из скриншота F1.
              </p>
              <button className="btn btn-danger" onClick={onResetData}>
                Сбросить к Демо-Данным
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Creating New Race */}
      {showNewRaceModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Создание нового заезда Гран-при</h3>
              <button className="close-btn" onClick={() => setShowNewRaceModal(false)}>×</button>
            </div>

            <form onSubmit={handleAddRace}>
              <div className="form-group">
                <label>Название этапа (Гран-при):</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Saudi Arabian Grand Prix"
                  value={newRaceTitle}
                  onChange={e => setNewRaceTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Подзаголовок / Трасса:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. JEDDAH CORNICHE CIRCUIT - RACE 2"
                  value={newRaceSubtitle}
                  onChange={e => setNewRaceSubtitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Дата проведения:</label>
                <input
                  type="date"
                  className="form-control"
                  value={newRaceDate}
                  onChange={e => setNewRaceDate(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn" onClick={() => setShowNewRaceModal(false)}>
                  Отмена
                </button>
                <button type="submit" className="btn btn-primary">
                  Создать этап
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
