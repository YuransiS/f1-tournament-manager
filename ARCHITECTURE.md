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
- `src/components/F1StartingGrid.tsx`: Authentic F1 TV broadcast Starting Grid recreation adhering to official TV storyboards (Bahrain 2021 broadcast layout):
  - **Dynamic Video Background:** Seamless 4K/HD waving flag animation loop via `COUNTRY_FLAG_YOUTUBE_MAP` (Bahrain, Saudi Arabia, Australia, Azerbaijan, USA, Italy, Monaco, Spain, Canada, Austria, Great Britain, Hungary, Belgium, Netherlands, Singapore, Japan) without player UI (`controls=0`, `showinfo=0`, `pointer-events-none`, centered `scale-135` crop to eliminate all external player branding/titles) with looping enabled (`loop=1&playlist=${videoId}`). Includes underlying animated GIF fallback for offline/instant hydration.
  - **Central Track Slot Graphic (`F1StartingGridSlotDisplay`):** Replaced heavy solid track box with completely transparent TV broadcast wireframe graphics. Displays `2026 Grid / STARTING GRID` header, active pair slots (`[ VER ]` / `[ HAM ]` or `[ GRO ]` / `[ YAR ]` with driver 3-letter codes and team color halos), authentic connecting staggered asphalt guide line, faint previous row silhouette above, faint next row preview below, and row progress pips.
  - **Broadcast HUD:** Driver portrait frame with bottom grounding, red Chakra Petch position markers, official driver number plates, team logos, and lap time / monotonic delta telemetry.
  - **Keyboard Controls:** Space (pause/play), Left/Right (step row), F (fullscreen toggle), R (replay intro animation).
- `src/components/StartingGridView.tsx`: Interactive view integrating the starting grid widget with real race data filtering from tournament history (`data.races`). Automatically resolves Grand Prix host circuit to its ISO country code (`getRaceCountryCode`, covering 16 countries including Azerbaijan, Japan, Italy, Bahrain, etc.) to feed the animated waving flag background. Provides Grand Prix selector dropdown, interval speed controls, and authentic qualifying starting grid deltas.
- `public/flags/animated/*.gif`: 17 optimized, local looping waving national flag GIFs for instant fallback and offline support.
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
