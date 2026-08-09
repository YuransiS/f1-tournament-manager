import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WinnerBanner from './components/WinnerBanner';
import StandingsView from './components/StandingsView';
import RacesView from './components/RacesView';
import DriversView from './components/DriversView';

import {
  getTournamentData,
  exportDataAsJSON,
  calculateStandings
} from './services/storage';

// Helper to determine initial tab from URL path or hash
function getTabFromUrl() {
  const path = window.location.pathname.toLowerCase().replace(/^\//, '');
  const hash = window.location.hash.toLowerCase().replace(/^#/, '');

  const validTabs = ['standings', 'races', 'drivers'];

  if (validTabs.includes(path)) return path;
  if (validTabs.includes(hash)) return hash;
  return 'standings';
}

export default function App() {
  const [data, setData] = useState(() => getTournamentData());
  const [activeTab, setActiveTabState] = useState(() => getTabFromUrl());

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
    exportDataAsJSON(data);
  };

  // Calculate live overall standings
  const standings = calculateStandings(data);

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        data={data}
        onExportData={handleExportData}
      />

      <WinnerBanner
        driverStandings={standings.driverStandings}
        races={data.races}
      />

      <main>
        {activeTab === 'standings' && (
          <StandingsView
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
      </main>
    </div>
  );
}
