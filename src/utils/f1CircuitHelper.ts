export interface F1RaceDetails {
  roundNumber: number;
  countryName: string;
  countryCode: string;
  circuitCity: string;
  circuitName: string;
  eventTitle: string;
}

export function extractF1RaceDetails(race?: any): F1RaceDetails {
  if (!race) {
    return {
      roundNumber: 17,
      countryName: 'SINGAPORE',
      countryCode: 'sg',
      circuitCity: 'Singapore',
      circuitName: 'MARINA BAY STREET CIRCUIT',
      eventTitle: 'SINGAPORE GRAND PRIX'
    };
  }

  // Extract round number from id or subtitle (e.g. "race-17" or "RACE 17")
  let roundNum = 1;
  if (typeof race.id === 'string' && race.id.startsWith('race-')) {
    const parsed = parseInt(race.id.replace('race-', ''), 10);
    if (!isNaN(parsed)) roundNum = parsed;
  } else if (race.subtitle) {
    const match = race.subtitle.match(/RACE\s+(\d+)/i);
    if (match) roundNum = parseInt(match[1], 10);
  }

  const rawTitle = (race.title || '').trim();
  const rawSub = (race.subtitle || '').trim();
  const text = `${rawTitle} ${rawSub}`.toLowerCase();

  let countryName = 'SINGAPORE';
  let countryCode = 'sg';
  let circuitCity = 'Singapore';
  let circuitName = rawSub.split('-')[0]?.trim() || 'MARINA BAY STREET CIRCUIT';

  if (text.includes('japan') || text.includes('suzuka')) {
    countryName = 'JAPAN';
    countryCode = 'jp';
    circuitCity = 'Suzuka';
    circuitName = 'SUZUKA INTERNATIONAL RACING COURSE';
  } else if (text.includes('australia') || text.includes('melbourne') || text.includes('albert park')) {
    countryName = 'AUSTRALIA';
    countryCode = 'au';
    circuitCity = 'Melbourne';
    circuitName = 'ALBERT PARK CIRCUIT';
  } else if (text.includes('bahrain') || text.includes('sakhir')) {
    countryName = 'BAHRAIN';
    countryCode = 'bh';
    circuitCity = 'Sakhir';
    circuitName = 'BAHRAIN INTERNATIONAL CIRCUIT';
  } else if (text.includes('saudi') || text.includes('jeddah')) {
    countryName = 'SAUDI ARABIA';
    countryCode = 'sa';
    circuitCity = 'Jeddah';
    circuitName = 'JEDDAH CORNICHE CIRCUIT';
  } else if (text.includes('azerbaijan') || text.includes('baku')) {
    countryName = 'AZERBAIJAN';
    countryCode = 'az';
    circuitCity = 'Baku';
    circuitName = 'BAKU CITY CIRCUIT';
  } else if (text.includes('miami')) {
    countryName = 'USA';
    countryCode = 'us';
    circuitCity = 'Miami';
    circuitName = 'MIAMI INTERNATIONAL AUTODROME';
  } else if (text.includes('imola') || text.includes('emilia')) {
    countryName = 'ITALY';
    countryCode = 'it';
    circuitCity = 'Imola';
    circuitName = 'AUTODROMO ENZO E DINO FERRARI';
  } else if (text.includes('monaco') || text.includes('monte carlo')) {
    countryName = 'MONACO';
    countryCode = 'mc';
    circuitCity = 'Monaco';
    circuitName = 'CIRCUIT DE MONACO';
  } else if (text.includes('canada') || text.includes('montreal')) {
    countryName = 'CANADA';
    countryCode = 'ca';
    circuitCity = 'Montreal';
    circuitName = 'CIRCUIT GILLES VILLENEUVE';
  } else if (text.includes('spain') || text.includes('barcelona') || text.includes('catalunya')) {
    countryName = 'SPAIN';
    countryCode = 'es';
    circuitCity = 'Barcelona';
    circuitName = 'CIRCUIT DE BARCELONA-CATALUNYA';
  } else if (text.includes('austria') || text.includes('spielberg') || text.includes('red bull ring')) {
    countryName = 'AUSTRIA';
    countryCode = 'at';
    circuitCity = 'Spielberg';
    circuitName = 'RED BULL RING';
  } else if (text.includes('silverstone') || text.includes('british') || text.includes('united kingdom')) {
    countryName = 'GREAT BRITAIN';
    countryCode = 'gb';
    circuitCity = 'Silverstone';
    circuitName = 'SILVERSTONE CIRCUIT';
  } else if (text.includes('hungary') || text.includes('budapest') || text.includes('hungaroring')) {
    countryName = 'HUNGARY';
    countryCode = 'hu';
    circuitCity = 'Budapest';
    circuitName = 'HUNGARORING';
  } else if (text.includes('belgian') || text.includes('belgium') || text.includes('spa')) {
    countryName = 'BELGIUM';
    countryCode = 'be';
    circuitCity = 'Spa-Francorchamps';
    circuitName = 'CIRCUIT DE SPA-FRANCORCHAMPS';
  } else if (text.includes('netherlands') || text.includes('dutch') || text.includes('zandvoort')) {
    countryName = 'NETHERLANDS';
    countryCode = 'nl';
    circuitCity = 'Zandvoort';
    circuitName = 'CIRCUIT ZANDVOORT';
  } else if (text.includes('monza') || text.includes('italian')) {
    countryName = 'ITALY';
    countryCode = 'it';
    circuitCity = 'Monza';
    circuitName = 'AUTODROMO NAZIONALE MONZA';
  } else if (text.includes('singapore') || text.includes('marina bay')) {
    countryName = 'SINGAPORE';
    countryCode = 'sg';
    circuitCity = 'Singapore';
    circuitName = 'MARINA BAY STREET CIRCUIT';
  } else if (text.includes('qatar') || text.includes('lusail')) {
    countryName = 'QATAR';
    countryCode = 'qa';
    circuitCity = 'Lusail';
    circuitName = 'LUSAIL INTERNATIONAL CIRCUIT';
  } else if (text.includes('austin') || text.includes('cota') || text.includes('united states')) {
    countryName = 'USA';
    countryCode = 'us';
    circuitCity = 'Austin';
    circuitName = 'CIRCUIT OF THE AMERICAS';
  } else if (text.includes('mexico') || text.includes('hermanos')) {
    countryName = 'MEXICO';
    countryCode = 'mx';
    circuitCity = 'Mexico City';
    circuitName = 'AUTÓDROMO HERMANOS RODRÍGUEZ';
  } else if (text.includes('brazil') || text.includes('interlagos') || text.includes('são paulo')) {
    countryName = 'BRAZIL';
    countryCode = 'br';
    circuitCity = 'São Paulo';
    circuitName = 'AUTÓDROMO JOSÉ CARLOS PACE';
  } else if (text.includes('vegas')) {
    countryName = 'USA';
    countryCode = 'us';
    circuitCity = 'Las Vegas';
    circuitName = 'LAS VEGAS STRIP CIRCUIT';
  } else if (text.includes('abu dhabi') || text.includes('yas marina')) {
    countryName = 'ABU DHABI';
    countryCode = 'ae';
    circuitCity = 'Abu Dhabi';
    circuitName = 'YAS MARINA CIRCUIT';
  }

  const eventTitle = rawTitle ? rawTitle.toUpperCase() : `${countryName} GRAND PRIX`;

  return {
    roundNumber: roundNum,
    countryName,
    countryCode,
    circuitCity,
    circuitName,
    eventTitle
  };
}
