import React, { useState } from 'react';
import F1StartingGrid from './F1StartingGrid';
import { MOCK_F1_STARTING_GRID, MOCK_TOURNAMENT_STARTING_GRID } from '../data/mockStartingGrid';
import { Play, Sparkles, Monitor, Settings } from 'lucide-react';

export default function StartingGridView() {
  const [selectedPreset, setSelectedPreset] = useState<'f1_2026' | 'tournament'>('f1_2026');
  const [cycleSpeed, setCycleSpeed] = useState(3000);

  const activePilots = selectedPreset === 'f1_2026' ? MOCK_F1_STARTING_GRID : MOCK_TOURNAMENT_STARTING_GRID;
  const activeEventTitle =
    selectedPreset === 'f1_2026'
      ? "FORMULA 1 PIRELLI GRAN PREMIO D'ITALIA 2026"
      : 'F1 TOURNAMENT CHAMPIONSHIP 2026 • STARTING GRID';

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Control / Config Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#12141C] border border-[#262B3A] rounded-xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#E10600]/20 border border-[#E10600]/40 rounded-lg text-[#E10600]">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black italic tracking-wide text-white uppercase font-['Titillium_Web']">
              Starting Grid (F1 TV Official Style)
            </h2>
            <p className="text-xs text-neutral-400">
              Интерактивный сплит-экран со сменой пар пилотов, командной графикой и центральной башней позиций
            </p>
          </div>
        </div>

        {/* Preset Selector & Options */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Preset Buttons */}
          <div className="flex items-center bg-[#0B0D12] p-1 rounded-lg border border-[#262B3A]">
            <button
              onClick={() => setSelectedPreset('f1_2026')}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md transition-all cursor-pointer ${
                selectedPreset === 'f1_2026'
                  ? 'bg-[#E10600] text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              F1 2026 Grid (20 пилотов)
            </button>
            <button
              onClick={() => setSelectedPreset('tournament')}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md transition-all cursor-pointer ${
                selectedPreset === 'tournament'
                  ? 'bg-[#E10600] text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Турнирная Решетка
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0B0D12] rounded-lg border border-[#262B3A] text-xs font-bold text-neutral-300">
            <span>Интервал:</span>
            {[2200, 3000, 4000].map((ms) => (
              <button
                key={ms}
                onClick={() => setCycleSpeed(ms)}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  cycleSpeed === ms ? 'bg-white/20 text-white font-black' : 'text-neutral-500 hover:text-white'
                }`}
              >
                {(ms / 1000).toFixed(1)}s
              </button>
            ))}
          </div>

          {/* Hotkey hint */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg text-xs text-neutral-400 border border-white/5">
            <span>
              Управление: <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-neutral-200">Space</kbd> пауза,{' '}
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-neutral-200">←</kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-neutral-200">→</kbd> ряды,{' '}
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-neutral-200">F</kbd> на весь экран
            </span>
          </div>
        </div>
      </div>

      {/* Starting Grid Viewport Frame */}
      <div className="w-full aspect-[16/9] min-h-[640px] max-h-[88vh] rounded-2xl overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative bg-black">
        <F1StartingGrid
          key={`${selectedPreset}-${cycleSpeed}`}
          pilots={activePilots}
          eventTitle={activeEventTitle}
          sessionSubtitle="STARTING GRID • PROVISIONAL CLASSIFICATION"
          cycleIntervalMs={cycleSpeed}
          autoPlay={true}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
