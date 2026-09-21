# ARCHITECTURE.md • F1 Tournament Championship 2026

## 1. Project Overview & Tech Stack
- **Framework:** React 19.2 + Vite 8.2
- **Styling:** Custom F1 Dark Telemetry CSS (`index.css`, `App.css`), Titillium Web & Inter typography
- **Animations & Icons:** Framer Motion 13.1, Lucide React 1.28
- **Media & Export:** `html-to-image`, `gifenc`, `canvas-confetti`
- **Data Layer:** LocalStorage with fallback to curated initial data (`src/services/initialData.js`, `src/services/storage.js`)

---

## 2. Route & Component File Map
- `src/App.jsx`: Main application controller managing tab navigation (`standings`, `charts`, `races`, `drivers`), state hydration, and live standings calculation.
- `src/components/Header.jsx`: Top F1 broadcast brand navigation bar, tab selectors, JSON export trigger.
- `src/components/WinnerBanner.jsx`: Dynamic championship leader display banner.
- `src/components/StandingsView.jsx`: Broadcast cards, breaking bulletins (Monza emergency driver substitution, Williams sale), Drivers Championship table, and Constructors Championship table.
- `src/components/F1MonzaEmergencyAnnouncement.jsx`: Monza 2026 bulletin covering Denys Kovalenko illness, Vadim Manstein reserve podium debut, and FIA review of restart game glitch.
- `src/components/ChartsView.jsx`: Dedicated analytics view with cumulative points progression race chart (Личный зачёт Top 10 + Кубок конструкторов) with SVG telemetry curves, animated milestone dots, leader callouts, and race step simulation.
- `src/components/F1PointsProgressionChart.jsx`: Core responsive SVG chart component rendering cumulative points lines, dots, hover HUD telemetry, and filters.
- `src/components/RacesView.jsx`: Complete list of Grand Prix events (including Race 16 Monza, Race 17 Singapore & Race 18 Suzuka), sprint races, penalty notes, track layouts, and race result breakdowns.
- `src/components/DriversView.jsx`: Driver profiles, stats (wins, podiums, fastest laps), penalties, and team assignments.
- `src/components/F1StandingsBroadcastCard.jsx`: TV broadcast 16:9 graphic card with exportable snapshot view.
- `src/components/F1StartingGrid.tsx`: Authentic F1 TV broadcast Starting Grid recreation adhering to official TV storyboards (Bahrain 2021 graphics): Seamless intro sequence (Stage 1: Central `STARTING GRID` metallic pill with red accent ➔ Stage 2: Horizontal visor laser beam expansion with energetic arc pips ➔ Stage 3: Direct fluid unroll into full broadcast frame without awkward intermediate black cut bars). Features a dynamic vertical sliding Starting Grid Track (`StartingGridTrack`) that shifts vertically along the asphalt track (`y = centerY - activePairIndex * ROW_HEIGHT`) to keep the active driver row centered with white border halos and team accents, while previous rows recede upward and upcoming rows wait below. Full television broadcast HUD includes metallic chassis bezel, top-left official F1 event badge, driver first & LAST names, country flags, red Chakra Petch positions, standardized bottom-grounded portrait frames, team badges & digital monospace telemetry. Includes keyboard controls (Space, Arrows, F for fullscreen, R for intro replay).
- `src/components/StartingGridView.tsx`: Interactive view integrating the starting grid widget with real race data filtering from tournament history (`data.races`), Grand Prix selector dropdown, interval speed controls, and authentic qualifying starting grid deltas (Pole reference time for P1, strictly monotonic `+X.XXX` deltas for P2+). Driver avatar mapping relies purely on uniform container fill without per-driver scaling hacks. Margin and padding layouts are cleanly decoupled from background watermarks.
- `src/data/mockStartingGrid.ts`: Pre-populated starting grid datasets for official F1 2026 grid and tournament championship grid.
- `src/components/TeamLogo.jsx` & `FlagIcon.jsx`: Reusable SVG and asset helpers for F1 team branding and nationality flags.

---

## 3. Data Schema & Contracts

### Teams (`DEFAULT_TEAMS`)
```typescript
interface Team {
  id: string; // e.g. 'mercedes', 'red-bull'
  name: string;
  color: string; // Primary hex color
  accentColor: string;
  logo: string;
}
```

### Drivers (`DEFAULT_DRIVERS`)
```typescript
interface Driver {
  id: string; // e.g. 'drv-1'
  name: string;
  country: string; // ISO 2-letter country code
  flag: string;
  teamId: string;
  isAi: boolean;
  avatar: string;
}
```

### Starting Grid Pilot (`GridPilot`)
```typescript
export interface GridPilot {
  id: string;
  position: number; // 1, 2, 3 ... 20
  realName?: string;
  nickname: string;
  driverNumber: number;
  avatarUrl: string;
  avatarScale?: number;
  avatarOffsetY?: number;
  avatarOffsetX?: number;
  countryFlagUrl?: string;
  lapTimeOrDelta: string;
  team: {
    id: string;
    name: string;
    shortCode: string;
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    backgroundPatternUrl?: string;
  };
}
```


### Races & Results (`DEFAULT_RACES`)
```typescript
interface RaceResult {
  driverId: string;
  grid: number;
  stops: number;
  bestLap: string;
  totalTime: string;
  penaltySeconds: number;
  penaltyLabel: string;
  status: 'FINISHED' | 'DNF';
}

interface Race {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  status: 'completed' | 'scheduled' | 'cancelled';
  isSprint?: boolean;
  fastestLapDriverId?: string;
  results: RaceResult[];
}
```

---

## 4. Standings & Progression Calculation
- `calculateRacePoints(position, isFastestLap, pointsMap, fastestLapPoints, isSprint)`
- `calculateStandings(data)`: Aggregates driver and constructor points across all completed races.
- `calculatePointsProgression(data)`: Computes cumulative points from race 0 (start = 0 pts) to race N for each driver and team.
