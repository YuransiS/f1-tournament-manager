import { GridPilot } from '../components/F1StartingGrid';

// 2026 Official Formula 1 Starting Grid Dataset (Monza GP / Realistic classification)
export const MOCK_F1_STARTING_GRID: GridPilot[] = [
  {
    id: 'pilot-verstappen',
    position: 1,
    realName: 'Max Verstappen',
    nickname: 'VERSTAPPEN',
    driverNumber: 1,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png',
    countryFlagUrl: '🇳🇱',
    lapTimeOrDelta: '1:21.083',
    team: {
      id: 'red-bull',
      name: 'Oracle Red Bull Racing',
      shortCode: 'VER',
      primaryColor: '#00327D',
      secondaryColor: '#EF1A2D',
      logoUrl: '/teams/red-bull.png',
      backgroundPatternUrl: 'carbon'
    }
  },
  {
    id: 'pilot-norris',
    position: 2,
    realName: 'Lando Norris',
    nickname: 'NORRIS',
    driverNumber: 4,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png',
    countryFlagUrl: '🇬🇧',
    lapTimeOrDelta: '+0.055',
    team: {
      id: 'mclaren',
      name: 'McLaren Formula 1 Team',
      shortCode: 'NOR',
      primaryColor: '#FF8000',
      secondaryColor: '#47C7FC',
      logoUrl: '/teams/mclaren.svg',
      backgroundPatternUrl: 'papaya'
    }
  },
  {
    id: 'pilot-leclerc',
    position: 3,
    realName: 'Charles Leclerc',
    nickname: 'LECLERC',
    driverNumber: 16,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png',
    countryFlagUrl: '🇲🇨',
    lapTimeOrDelta: '+0.118',
    team: {
      id: 'ferrari',
      name: 'Scuderia Ferrari HP',
      shortCode: 'LEC',
      primaryColor: '#E80020',
      secondaryColor: '#FFF200',
      logoUrl: '/teams/ferrari.png'
    }
  },
  {
    id: 'pilot-piastri',
    position: 4,
    realName: 'Oscar Piastri',
    nickname: 'PIASTRI',
    driverNumber: 81,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png',
    countryFlagUrl: '🇦🇺',
    lapTimeOrDelta: '+0.192',
    team: {
      id: 'mclaren',
      name: 'McLaren Formula 1 Team',
      shortCode: 'PIA',
      primaryColor: '#FF8000',
      secondaryColor: '#47C7FC',
      logoUrl: '/teams/mclaren.svg'
    }
  },
  {
    id: 'pilot-russell',
    position: 5,
    realName: 'George Russell',
    nickname: 'RUSSELL',
    driverNumber: 63,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png',
    countryFlagUrl: '🇬🇧',
    lapTimeOrDelta: '+0.274',
    team: {
      id: 'mercedes',
      name: 'Mercedes-AMG PETRONAS F1',
      shortCode: 'RUS',
      primaryColor: '#00A19B',
      secondaryColor: '#FFFFFF',
      logoUrl: '/teams/mercedes.svg'
    }
  },
  {
    id: 'pilot-hamilton',
    position: 6,
    realName: 'Lewis Hamilton',
    nickname: 'HAMILTON',
    driverNumber: 44,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png',
    countryFlagUrl: '🇬🇧',
    lapTimeOrDelta: '+0.315',
    team: {
      id: 'ferrari',
      name: 'Scuderia Ferrari HP',
      shortCode: 'HAM',
      primaryColor: '#E80020',
      secondaryColor: '#FFF200',
      logoUrl: '/teams/ferrari.png'
    }
  },
  {
    id: 'pilot-sainz',
    position: 7,
    realName: 'Carlos Sainz',
    nickname: 'SAINZ',
    driverNumber: 55,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png',
    countryFlagUrl: '🇪🇸',
    lapTimeOrDelta: '+0.421',
    team: {
      id: 'williams',
      name: 'Williams Racing',
      shortCode: 'SAI',
      primaryColor: '#00A0DE',
      secondaryColor: '#005AFF',
      logoUrl: '/teams/williams.png'
    }
  },
  {
    id: 'pilot-alonso',
    position: 8,
    realName: 'Fernando Alonso',
    nickname: 'ALONSO',
    driverNumber: 14,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png',
    countryFlagUrl: '🇪🇸',
    lapTimeOrDelta: '+0.490',
    team: {
      id: 'aston-martin',
      name: 'Aston Martin Aramco F1',
      shortCode: 'ALO',
      primaryColor: '#006F62',
      secondaryColor: '#CEDC00',
      logoUrl: '/teams/aston-martin.png'
    }
  },
  {
    id: 'pilot-antonelli',
    position: 9,
    realName: 'Andrea Kimi Antonelli',
    nickname: 'ANTONELLI',
    driverNumber: 12,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/K/KIMANT01_Kimi_Antonelli/kimant01.png',
    countryFlagUrl: '🇮🇹',
    lapTimeOrDelta: '+0.560',
    team: {
      id: 'mercedes',
      name: 'Mercedes-AMG PETRONAS F1',
      shortCode: 'ANT',
      primaryColor: '#00A19B',
      secondaryColor: '#FFFFFF',
      logoUrl: '/teams/mercedes.svg'
    }
  },
  {
    id: 'pilot-albon',
    position: 10,
    realName: 'Alexander Albon',
    nickname: 'ALBON',
    driverNumber: 23,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png',
    countryFlagUrl: '🇹🇭',
    lapTimeOrDelta: '+0.612',
    team: {
      id: 'williams',
      name: 'Williams Racing',
      shortCode: 'ALB',
      primaryColor: '#00A0DE',
      secondaryColor: '#005AFF',
      logoUrl: '/teams/williams.png'
    }
  },
  {
    id: 'pilot-gasly',
    position: 11,
    realName: 'Pierre Gasly',
    nickname: 'GASLY',
    driverNumber: 10,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png',
    countryFlagUrl: '🇫🇷',
    lapTimeOrDelta: '+0.680',
    team: {
      id: 'alpine',
      name: 'BWT Alpine F1 Team',
      shortCode: 'GAS',
      primaryColor: '#0090FF',
      secondaryColor: '#FF87BC',
      logoUrl: '/teams/alpine.svg'
    }
  },
  {
    id: 'pilot-tsunoda',
    position: 12,
    realName: 'Yuki Tsunoda',
    nickname: 'TSUNODA',
    driverNumber: 22,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png',
    countryFlagUrl: '🇯🇵',
    lapTimeOrDelta: '+0.742',
    team: {
      id: 'rb',
      name: 'Visa Cash App RB F1 Team',
      shortCode: 'TSU',
      primaryColor: '#1634CB',
      secondaryColor: '#6692FF',
      logoUrl: '/teams/alphatauri.png'
    }
  },
  {
    id: 'pilot-hulkenberg',
    position: 13,
    realName: 'Nico Hülkenberg',
    nickname: 'HULKENBERG',
    driverNumber: 27,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png',
    countryFlagUrl: '🇩🇪',
    lapTimeOrDelta: '+0.810',
    team: {
      id: 'sauber',
      name: 'Stake F1 Team Kick Sauber',
      shortCode: 'HUL',
      primaryColor: '#52E252',
      secondaryColor: '#000000',
      logoUrl: '/teams/alfa-romeo.png'
    }
  },
  {
    id: 'pilot-ocon',
    position: 14,
    realName: 'Esteban Ocon',
    nickname: 'OCON',
    driverNumber: 31,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png',
    countryFlagUrl: '🇫🇷',
    lapTimeOrDelta: '+0.880',
    team: {
      id: 'haas',
      name: 'MoneyGram Haas F1 Team',
      shortCode: 'OCO',
      primaryColor: '#B6BABD',
      secondaryColor: '#E6002B',
      logoUrl: '/teams/haas.png'
    }
  },
  {
    id: 'pilot-bearman',
    position: 15,
    realName: 'Oliver Bearman',
    nickname: 'BEARMAN',
    driverNumber: 87,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png',
    countryFlagUrl: '🇬🇧',
    lapTimeOrDelta: '+0.930',
    team: {
      id: 'haas',
      name: 'MoneyGram Haas F1 Team',
      shortCode: 'BEA',
      primaryColor: '#B6BABD',
      secondaryColor: '#E6002B',
      logoUrl: '/teams/haas.png'
    }
  },
  {
    id: 'pilot-lawson',
    position: 16,
    realName: 'Liam Lawson',
    nickname: 'LAWSON',
    driverNumber: 30,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png',
    countryFlagUrl: '🇳🇿',
    lapTimeOrDelta: '+0.985',
    team: {
      id: 'rb',
      name: 'Visa Cash App RB F1 Team',
      shortCode: 'LAW',
      primaryColor: '#1634CB',
      secondaryColor: '#6692FF',
      logoUrl: '/teams/alphatauri.png'
    }
  },
  {
    id: 'pilot-stroll',
    position: 17,
    realName: 'Lance Stroll',
    nickname: 'STROLL',
    driverNumber: 18,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png',
    countryFlagUrl: '🇨🇦',
    lapTimeOrDelta: '+1.045',
    team: {
      id: 'aston-martin',
      name: 'Aston Martin Aramco F1',
      shortCode: 'STR',
      primaryColor: '#006F62',
      secondaryColor: '#CEDC00',
      logoUrl: '/teams/aston-martin.png'
    }
  },
  {
    id: 'pilot-doohan',
    position: 18,
    realName: 'Jack Doohan',
    nickname: 'DOOHAN',
    driverNumber: 7,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/J/JACDOO01_Jack_Doohan/jacdoo01.png',
    countryFlagUrl: '🇦🇺',
    lapTimeOrDelta: '+1.110',
    team: {
      id: 'alpine',
      name: 'BWT Alpine F1 Team',
      shortCode: 'DOO',
      primaryColor: '#0090FF',
      secondaryColor: '#FF87BC',
      logoUrl: '/teams/alpine.svg'
    }
  },
  {
    id: 'pilot-bortoleto',
    position: 19,
    realName: 'Gabriel Bortoleto',
    nickname: 'BORTOLETO',
    driverNumber: 5,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabbor01.png',
    countryFlagUrl: '🇧🇷',
    lapTimeOrDelta: '+1.230',
    team: {
      id: 'sauber',
      name: 'Stake F1 Team Kick Sauber',
      shortCode: 'BOR',
      primaryColor: '#52E252',
      secondaryColor: '#000000',
      logoUrl: '/teams/alfa-romeo.png'
    }
  },
  {
    id: 'pilot-colapinto',
    position: 20,
    realName: 'Franco Colapinto',
    nickname: 'COLAPINTO',
    driverNumber: 43,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png',
    countryFlagUrl: '🇦🇷',
    lapTimeOrDelta: '+1.340',
    team: {
      id: 'red-bull',
      name: 'Oracle Red Bull Racing',
      shortCode: 'COL',
      primaryColor: '#00327D',
      secondaryColor: '#EF1A2D',
      logoUrl: '/teams/red-bull.png'
    }
  }
];

// Tournament Grid Preset (Using the local tournament drivers & portraits)
export const MOCK_TOURNAMENT_STARTING_GRID: GridPilot[] = [
  {
    id: 'tourn-1',
    position: 1,
    realName: 'Mark',
    nickname: 'MARK',
    driverNumber: 1,
    avatarUrl: '/portraits/mark_pole.png',
    countryFlagUrl: '🇺🇦',
    lapTimeOrDelta: '1:21.083',
    team: {
      id: 'williams',
      name: 'Williams Racing',
      shortCode: 'MRK',
      primaryColor: '#00A0DE',
      secondaryColor: '#005AFF',
      logoUrl: '/teams/williams.png'
    }
  },
  {
    id: 'tourn-2',
    position: 2,
    realName: 'Mykola Yarema',
    nickname: 'KOLYA',
    driverNumber: 2,
    avatarUrl: '/portraits/kolya.png',
    countryFlagUrl: '🇺🇦',
    lapTimeOrDelta: '+0.062',
    team: {
      id: 'red-bull',
      name: 'Red Bull Racing',
      shortCode: 'KOL',
      primaryColor: '#1E41FF',
      secondaryColor: '#FF0000',
      logoUrl: '/teams/red-bull.png'
    }
  },
  {
    id: 'tourn-3',
    position: 3,
    realName: 'Yurii Zakharchuk',
    nickname: 'YURA',
    driverNumber: 3,
    avatarUrl: '/portraits/yura.png',
    countryFlagUrl: '🇺🇦',
    lapTimeOrDelta: '+0.115',
    team: {
      id: 'mercedes',
      name: 'Mercedes-AMG F1',
      shortCode: 'YUR',
      primaryColor: '#00A19B',
      secondaryColor: '#6CD3BF',
      logoUrl: '/teams/mercedes.svg'
    }
  },
  {
    id: 'tourn-4',
    position: 4,
    realName: 'Denys Kovalenko',
    nickname: 'DENYA',
    driverNumber: 4,
    avatarUrl: '/portraits/denya.png',
    countryFlagUrl: '🇺🇦',
    lapTimeOrDelta: '+0.178',
    team: {
      id: 'red-bull',
      name: 'Red Bull Racing',
      shortCode: 'DEN',
      primaryColor: '#1E41FF',
      secondaryColor: '#FF0000',
      logoUrl: '/teams/red-bull.png'
    }
  },
  {
    id: 'tourn-5',
    position: 5,
    realName: 'Alexsandr Gromov',
    nickname: 'SASHKO',
    driverNumber: 5,
    avatarUrl: '/portraits/sashko.png',
    countryFlagUrl: '🇺🇦',
    lapTimeOrDelta: '+0.245',
    team: {
      id: 'mercedes',
      name: 'Mercedes-AMG F1',
      shortCode: 'SAS',
      primaryColor: '#00A19B',
      secondaryColor: '#6CD3BF',
      logoUrl: '/teams/mercedes.svg'
    }
  },
  {
    id: 'tourn-6',
    position: 6,
    realName: 'Vadim Manstein',
    nickname: 'MANSTEIN',
    driverNumber: 6,
    avatarUrl: '/portraits/manstein.png',
    countryFlagUrl: '🇺🇦',
    lapTimeOrDelta: '+0.312',
    team: {
      id: 'red-bull',
      name: 'Red Bull Racing',
      shortCode: 'MAN',
      primaryColor: '#1E41FF',
      secondaryColor: '#FF0000',
      logoUrl: '/teams/red-bull.png'
    }
  },
  {
    id: 'tourn-7',
    position: 7,
    realName: 'Charles Leclerc',
    nickname: 'LECLERC',
    driverNumber: 16,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png',
    countryFlagUrl: '🇲🇨',
    lapTimeOrDelta: '+0.395',
    team: {
      id: 'ferrari',
      name: 'Scuderia Ferrari',
      shortCode: 'LEC',
      primaryColor: '#E80020',
      secondaryColor: '#FFF200',
      logoUrl: '/teams/ferrari.png'
    }
  },
  {
    id: 'tourn-8',
    position: 8,
    realName: 'Lando Norris',
    nickname: 'NORRIS',
    driverNumber: 4,
    avatarUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png',
    countryFlagUrl: '🇬🇧',
    lapTimeOrDelta: '+0.440',
    team: {
      id: 'mclaren',
      name: 'McLaren F1 Team',
      shortCode: 'NOR',
      primaryColor: '#FF8000',
      secondaryColor: '#FF9E1B',
      logoUrl: '/teams/mclaren.svg'
    }
  }
];
