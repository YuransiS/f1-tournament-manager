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
- `src/components/F1StartingGridIntro.tsx`: Official F1 TV broadcast intro graphic with seamless 50%/50% split shutter doors aligned to exact 100vw coordinates (zero subpixel overlap, zero collision/doubling of red pillars or text). Features upper & lower twin red chevron pillars, center glowing F1 logo, bold `ROUND X · COUNTRY`, colossal `STARTING GRID` headline, and cursive circuit city accent (`Caveat`).
- `src/components/F1StartingGrid.tsx`: Core F1 TV broadcast Starting Grid controller with bottom-to-top progression ("снизу вверх") from rear grid (Row 10) to Pole Position (Row 1). Full-screen 50/50 division (`w-1/2 left-0` and `w-1/2 right-0`) with 100% height utilization for 1:1 format pilot portraits, zero header vertical displacement (floating top-left GP badge and top-right hover HUD), vertically centered starting grid overlay in `z-30` (`w-[520px]` to `w-[740px]`), progressive sequential row reveal (`revealedIndices`), split-curtain intro integration, uniform lighting wash eliminating any pilot dimming, fixed 20% background audio volume, and `startWithSound` automatic playback support.
- `src/components/F1GridDriverCard.tsx`: 1-to-1 recreation of official F1 TV broadcast driver cards matching reference `media_1790535748106.png`. Outer constructor side-strips removed to free up 100% of each screen half for heroic 1:1 bust pilot portraits (`h-[95%-98%] w-auto max-w-full object-contain object-bottom`), cursive handwriting first name (`Caveat`), massive bold uppercase surname with team color neon glow, and centered race numbers.
- `src/components/F1StartingGridSlotDisplay.tsx`: 1-to-1 recreation of official F1 TV broadcast center starting grid reel matching reference `media_1790535748106.png`. Grid slots scaled ~2x larger (`h-[48px]` to `h-[52px]`, `min-w-[190px]` to `min-w-[235px]`, `text-base` to `text-xl` bold typography, larger team logos) and vertically centered (`justify-center gap-4 sm:gap-6`), pulling all rows well away from top and bottom screen edges. Rendered with authentic SVG `П` starting grid brackets with downward tick marks extending to 65% height (`M 1 65 L 1 1 L 99 1 L 99 65`), balanced padding (`px-6` to `px-7`) and dedicated centered digit width (`min-w-[28px]` to `min-w-[32px]`) ensuring double-digit numbers (10, 16, etc.) never touch or overflow past the left bracket boundary, clean inline sequence (`[ <digit> <logo> <CODE> ]`), 0.5h tarmac stagger (right slot shifted down 25px, row interval 25px), thick authoritative twin red bars (`w-7` to `w-9`, `gap-2`), and diagonal middle break ("разлом").
- `src/utils/f1CircuitHelper.ts`: Helper resolving round numbers, country codes, country names, circuit names, and circuit cities across all championship rounds.
- `src/components/F1FlagVideoBackground.tsx`: Seamless waving flag video background using YouTube Iframe Player API with `loop: 1` and `playlist` parameters, scaled at 170% to completely crop out YouTube player titles, watermarks, and progress bars. Full-bleed `pointer-events-auto` pointer shield overlay and container preventing any mouse gestures from triggering YouTube internal player OSD controls, with underlying GIF fallback.
- `src/components/DriverAvatarFallback.tsx`: Stylized SVG racing suit & helmet fallback when driver portrait is missing or fails to load.
- `src/components/StartingGridView.tsx`: Interactive tournament starting grid view integrating live broadcast rendering directly within the dashboard tab (zero empty voids or disconnected placeholder cards), full-bleed fixed modal broadcast overlay (`fixed inset-0 z-[99999] w-screen h-screen`), native browser fullscreen integration (`requestFullscreen()`), Grand Prix selection station, prominent launch button (`▶ В ЭФИР (20%)`), 1:1 bust photos (`driver.avatar`), interval speed controls, and synchronized race telemetry.
- `public/portraits/standing/*.webp`: Complete set of 20 official Formula 1 waist-up transparent cutouts (800x1420 px, ~9:16 aspect ratio: Verstappen, Norris, Leclerc, Alonso, Sainz, Albon, Gasly, Perez, Stroll, Bottas, Ocon, Hulkenberg, Magnussen, Piastri, Zhou Guanyu [used for drv-20 Zhou & drv-23 Vadim Manstein], Ricciardo, Tsunoda, Hamilton, Russell, Sargeant) ensuring 100% format, head-size, and scale parity with Ukrainian pilots' 9:16 waist-up cutouts across Starting Grid, Driver of the Day, and Race Results cards.
- `public/audio/f1_starting_grid.mp3`: High-fidelity F1 Starting Grid official theme extracted starting precisely from 105 seconds (1:45) of Brian Tyler's "Build Up & Starting Grid" suite. Plays synchronously when starting grid animation triggers, with mute/unmute control, keyboard shortcut (M), and automatic gesture unblocking.
- `public/flags/animated/*.gif`: 17 optimized, local looping waving national flag GIFs for instant fallback and offline support.
- `src/data/mockStartingGrid.ts`: Pre-populated starting grid datasets for official F1 2026 grid and tournament championship grid using standardized waist-up cutouts.
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
  avatar: string; // 1:1 square photo (mini icons in Drivers tab & official podium)
  avatarFullWithBg?: string; // 9:16 full standing with background (Standings table announcements & bulletins)
  avatarFullNoBg?: string; // 9:16 full standing transparent cutout (Starting Grid, Driver of the Day, Race Results Broadcast Card winner)
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
