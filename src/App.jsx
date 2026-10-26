import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import Header from './components/Header';
import WinnerBanner from './components/WinnerBanner';
import StandingsView from './components/StandingsView';
import F1SeasonTransitionModal from './components/F1SeasonTransitionModal';

const ChartsView = lazy(() => import('./components/ChartsView'));
const RacesView = lazy(() => import('./components/RacesView'));
const DriversView = lazy(() => import('./components/DriversView'));
const StartingGridView = lazy(() => import('./components/StartingGridView'));
const F1Calendar2027View = lazy(() => import('./components/F1Calendar2027View'));

import {
  getActiveSeason,
  setActiveSeason,
  getTournamentData,
  exportDataAsJSON,
  calculateStandings
} from './services/storage';

// Helper to determine initial tab from URL path or hash
function getTabFromUrl() {
  const path = window.location.pathname.toLowerCase().replace(/^\//, '');
  const hash = window.location.hash.toLowerCase().replace(/^#/, '');

  const validTabs = ['standings', 'charts', 'races', 'drivers', 'starting-grid', 'calendar', 'calendar-2027'];

  if (validTabs.includes(path)) return path === 'calendar-2027' ? 'calendar' : path;
  if (validTabs.includes(hash)) return hash === 'calendar-2027' ? 'calendar' : hash;
  return 'standings';
}

export default function App() {
  const [activeSeason, setActiveSeasonState] = useState(() => getActiveSeason());
  const [data, setData] = useState(() => getTournamentData(activeSeason));
  const [activeTab, setActiveTabState] = useState(() => getTabFromUrl());
  const [isSeasonModalOpen, setIsSeasonModalOpen] = useState(false);

  // Switch between Season 2026 and Season 2027-1
  const handleSwitchSeason = (seasonId) => {
    setActiveSeason(seasonId);
    setActiveSeasonState(seasonId);
    const seasonData = getTournamentData(seasonId);
    setData(seasonData);
  };

  // Function to set active tab and update browser address bar URL cleanly
  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    const newPath = tab === 'standings' ? '/' : `/${tab}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({ tab }, '', newPath);
    }
  };

  // Sync with browser back/forward buttons and direct URL navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const currentTab = getTabFromUrl();
      setActiveTabState(currentTab);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleExportData = () => {
    exportDataAsJSON(data, activeSeason);
  };

  // Calculate live overall standings
  const standings = useMemo(() => calculateStandings(data), [data]);

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        data={data}
        onExportData={handleExportData}
        activeSeason={activeSeason}
        onSwitchSeason={handleSwitchSeason}
        onOpenSeasonModal={() => setIsSeasonModalOpen(true)}
      />

      {activeTab === 'standings' && (
        <WinnerBanner
          driverStandings={standings.driverStandings}
          races={data.races}
          activeSeason={activeSeason}
          onNavigateTab={setActiveTab}
          onOpenSeasonModal={() => setIsSeasonModalOpen(true)}
        />
      )}

      <main>
        <Suspense
          fallback={
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
              Загрузка телеметрии F1...
            </div>
          }
        >
          {activeTab === 'standings' && (
            <StandingsView
              data={data}
              standings={standings}
              onNavigateTab={setActiveTab}
              activeSeason={activeSeason}
            />
          )}

          {activeTab === 'charts' && (
            <ChartsView
              data={data}
            />
          )}

          {activeTab === 'races' && (
            <RacesView
              races={data.races}
              drivers={data.drivers}
              teams={data.teams}
              pointsMap={data.pointsMap}
              fastestLapPoints={data.fastestLapPoints}
              onNavigateTab={setActiveTab}
              activeSeason={activeSeason}
            />
          )}

          {activeTab === 'drivers' && (
            <DriversView
              drivers={data.drivers}
              teams={data.teams}
              standings={standings}
              penalties={data.penalties}
            />
          )}

          {activeTab === 'starting-grid' && (
            <StartingGridView data={data} />
          )}

          {activeTab === 'calendar' && (
            <F1Calendar2027View />
          )}
        </Suspense>
      </main>

      <F1SeasonTransitionModal
        isOpen={isSeasonModalOpen}
        onClose={() => setIsSeasonModalOpen(false)}
        activeSeason={activeSeason}
        onSwitchSeason={handleSwitchSeason}
        onNavigateTab={setActiveTab}
        season2026Data={getTournamentData('2026')}
        season2027Data={getTournamentData('2027-1')}
      />
    </div>
  );
}
