# ARCHITECTURE.md • F1 Tournament Championship 2026

## 1. Project Overview & Tech Stack
- **Framework:** React 19.2 + Vite 8.2 (with `React.lazy` route-level code splitting & vendor manual chunks)
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss"`) with `@layer base` custom F1 Dark Telemetry CSS (`src/index.css`), Titillium Web & Inter typography
- **Animations & Icons:** Framer Motion 13.1, Lucide React 1.28
- **Media & Export:** `html-to-image`, `gifenc`, `canvas-confetti`
- **Data Layer:** LocalStorage with fallback to curated initial data (`src/services/initialData.js`, `src/services/storage.js`)

---

## 2. Route & Component File Map
- `src/App.jsx`: Main application controller managing tab navigation (`standings`, `charts`, `races`, `drivers`, `starting-grid`, `calendar`), lazy-loaded view chunks, state hydration, and live standings calculation.
- `src/components/Header.jsx`: Top F1 broadcast brand navigation bar, tab selectors (including `Календарь 2027-1`), JSON export trigger.
- `src/components/WinnerBanner.jsx`: Dynamic championship leader display banner with early World Champion coronation (rendered exclusively on the `standings` tab).
- `src/components/StandingsView.jsx`: Interactive **Зал Славы 2026** poster switcher (`🥇 Чемпион`, `🥈 Вице-чемпион`, `🥉 Бронза`, `🏆 Кубок Конструкторов`, `📺 ТВ-Таблица 16:9`, `Все постеры`, `Скрыть`), Drivers Championship table, Constructors Championship table, and 2027-1 Calendar announcement banner.
- `src/components/F1Calendar2027View.jsx`: Official FIA broadcast calendar for Season 2027-1 (23 rounds, 7 Sprints). Features search, region filters, Grid Cards & FIA Official Table views, interactive circuit detail modal with weekend schedules (Sprint vs Standard GP formats), PNG poster export (`html-to-image`), and standard `.ics` iCal calendar generator.
- `src/data/calendar2027.js`: Complete 23-round FIA season 2027-1 dataset (rounds 1-23) with exact sprint flags, FOM official circuit layouts, track telemetry specs (laps, circuit length, DRS zones, lap records), and weekend dates.
- `src/components/F1WorldChampionCard.jsx`: Official FIA World Champion declaration card & downloadable 16:9 poster celebration (Mykola Yarema `#67` clinches title in China Race 24, finishes season with 444 pts, 11 wins, 22 podiums, 9 FL, +54 pts gap), celebratory confetti button, collapse controls, interactive meme popup modal ("ОТРЫВ +35 НЕЗЛАМНО"), and editorial briefing.
- `src/components/F1ViceChampionCard.jsx`: Official FIA Vice-Champion declaration card & downloadable 16:9 poster celebration (Yurii Zakharchuk `#69` secured 2nd place with 390 pts, 10 wins, 19 podiums, 10 FL, +120 pts gap over 3rd place), celebratory silver confetti button, collapse controls, and editorial briefing.
- `src/components/F1BronzeChampionCard.jsx`: Official FIA Bronze Medalist declaration card & downloadable 16:9 poster celebration (Denys Kovalenko `#88` secured 3rd place with 270 pts, 3 wins, 13 podiums, 2 FL, +77 pts gap over 4th place), celebratory bronze confetti button, collapse controls, and editorial briefing.
- `src/components/F1ConstructorsChampionCard.jsx`: Official FIA Constructors World Champion declaration card & downloadable poster celebration (Red Bull Racing title victory with 714 pts, 14 wins, 35 podiums, and +131 pts gap over Mercedes), featuring the official pit celebration photo, celebratory confetti button, collapse controls, and telemetry breakdown.
- `src/components/ChartsView.jsx`: Dedicated analytics view with cumulative points progression race chart (Личный зачёт Top 10 + Кубок конструкторов) with SVG telemetry curves, animated milestone dots, leader callouts, and race step simulation.
- `src/components/F1PointsProgressionChart.jsx`: Core responsive SVG chart component rendering cumulative points lines, dots, hover HUD telemetry, and filters.
- `src/components/RacesView.jsx`: Complete list of Grand Prix events, season switcher linking to 2027-1 calendar, sprint races, sub-tabs (`Протокол и Подиум`, `ТВ-Графика 1:1`, `Driver of the Day 🌟`, `Решение Стюардов`, `Пресс-Релиз ФИА`), track layouts, and race result breakdowns with driver flags, racing numbers, and grid delta badges.
- `src/components/DriversView.jsx`: Driver profiles, stats (wins, podiums, fastest laps), penalties, and team assignments.
- `src/components/F1StandingsBroadcastCard.jsx`: TV broadcast 16:9 graphic card with exportable snapshot view.
- `src/components/F1StartingGridIntro.tsx`: Official F1 TV broadcast intro graphic with seamless 50%/50% split shutter doors aligned to `w-[200%]` parent-relative coordinates so it aligns seamlessly in both embedded 16:9 tab mode and fullscreen mode.
- `src/components/F1StartingGrid.tsx`: Core F1 TV broadcast Starting Grid controller with bottom-to-top progression ("снизу вверх") from rear grid (Row 10) to Pole Position (Row 1). Full-screen 50/50 division (`w-1/2 left-0` and `w-1/2 right-0`), floating top-left GP badge and top-right HUD controls, vertically centered starting grid overlay in `z-30` (`w-[350px]` to `w-[540px]`), progressive sequential row reveal (`revealedIndices`), split-curtain intro integration, and fixed 20% background audio volume.
- `src/components/F1GridDriverCard.tsx`: 1-to-1 recreation of official F1 TV broadcast driver cards with outward-offset portraits and typography (`pr-[18%-24%]` on left, `pl-[18%-24%]` on right) preventing any collision with the central starting grid tower, cursive handwriting first name (`Caveat`), bold uppercase surname with team color neon glow, and centered race numbers.
- `src/components/F1StartingGridSlotDisplay.tsx`: Responsive F1 TV broadcast center starting grid reel (`h-[34px]` to `h-[42px]`, `min-w-[145px]` to `min-w-[195px]`, `gap-[10px]` to `gap-[14px]`) fitting all 10 staggered rows + central ordinal indicator cleanly inside a 16:9 viewport with zero vertical clipping.
- `src/utils/f1CircuitHelper.ts`: Canonical `DRIVER_NUMBER_MAP` and helper resolving round numbers, country codes, country names, circuit names, and circuit cities across all championship rounds (including France and Portugal).
- `src/components/F1FlagVideoBackground.tsx`: Multi-tier waving flag video background (HTML5 local video -> YouTube Iframe with preemptive loop watcher -> animated GIF fallback).
- `src/components/DriverAvatarFallback.tsx`: Stylized SVG racing suit & helmet fallback when driver portrait is missing or fails to load.
- `src/components/StartingGridView.tsx`: Interactive tournament starting grid view integrating live broadcast rendering directly within the dashboard tab and full-bleed fixed modal broadcast overlay (`fixed inset-0 z-[99999] w-screen h-screen`).
- `public/portraits/standing/*.webp`: Complete set of 20 official Formula 1 waist-up transparent cutouts (800x1420 px, ~9:16 aspect ratio).
- `public/audio/f1_starting_grid.mp3`: High-fidelity F1 Starting Grid official theme.
- `public/flags/animated/*.gif`: 17 optimized, local looping waving national flag GIFs.
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
  driverNumber: number; // Canonical F1 driver car number (Yura: 69, Kolya: 67, Denis: 88, Sasha: 95, Manstein: 5)
  teamId: string;
  isAi: boolean;
  avatar: string; // 1:1 square photo (mini icons in Drivers tab & official podium)
  avatarFullWithBg?: string; // 9:16 full standing with background (Standings table announcements & bulletins)
  avatarFullNoBg?: string; // 9:16 full standing transparent cutout (Starting Grid, Driver of the Day, Race Results Broadcast Card winner)
  avatarChampion?: string; // Champion victory art poster and banner avatar
  avatarViceChampion?: string; // Vice-Champion victory art poster and banner avatar
  avatarBronzeChampion?: string; // Bronze Medalist victory art poster and banner avatar
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
