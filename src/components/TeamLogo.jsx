import React from 'react';

// 100% Transparent, crisp SVG team emblems without any background boxes or white pads!
export default function TeamLogo({ teamId, style = {}, className = '' }) {
  const baseStyle = {
    height: '28px',
    width: 'auto',
    display: 'inline-block',
    verticalAlign: 'middle',
    objectFit: 'contain',
    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))',
    ...style
  };

  switch (teamId) {
    case 'red-bull':
      return (
        <svg style={baseStyle} viewBox="0 0 120 70" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Yellow Sun */}
          <circle cx="60" cy="35" r="22" fill="#FFD700" />
          {/* Charging Red Bull Silhouette Left */}
          <path d="M20 48 C28 42, 38 34, 52 36 C50 28, 42 24, 34 26 C28 20, 22 22, 14 30 C22 34, 20 40, 20 48 Z" fill="#E10600" />
          {/* Charging Red Bull Silhouette Right */}
          <path d="M100 48 C92 42, 82 34, 68 36 C70 28, 78 24, 86 26 C92 20, 98 22, 106 30 C98 34, 100 40, 100 48 Z" fill="#E10600" />
          {/* Center Impact clash */}
          <polygon points="56,32 64,32 60,44" fill="#E10600" />
        </svg>
      );

    case 'mercedes':
      return (
        <svg style={baseStyle} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="none" stroke="#00A19B" strokeWidth="5" />
          <polygon points="40,8 45,38 40,36 35,38" fill="#FFFFFF" />
          <polygon points="12,56 38,42 36,40 34,44" fill="#FFFFFF" />
          <polygon points="68,56 46,44 44,40 42,42" fill="#FFFFFF" />
          <circle cx="40" cy="40" r="4" fill="#00A19B" />
        </svg>
      );

    case 'ferrari':
      return (
        <svg style={baseStyle} viewBox="0 0 60 75" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Ferrari Yellow Shield */}
          <path d="M5 5 H55 V45 C55 60, 30 72, 30 72 C30 72, 5 60, 5 45 Z" fill="#FFF200" stroke="#000" strokeWidth="2" />
          {/* Italian Tricolore Top Bar */}
          <rect x="5" y="5" width="16.6" height="7" fill="#009246" />
          <rect x="21.6" y="5" width="16.8" height="7" fill="#FFFFFF" />
          <rect x="38.4" y="5" width="16.6" height="7" fill="#CE2B37" />
          {/* Black Prancing Horse */}
          <path d="M32 20 C34 16, 38 18, 36 24 C34 26, 32 28, 33 32 C35 34, 40 32, 42 36 C40 38, 36 37, 34 40 C35 44, 38 48, 36 52 C33 55, 30 50, 29 46 C27 48, 25 54, 22 55 C24 50, 27 46, 26 42 C23 44, 20 43, 18 41 C21 39, 25 40, 27 36 C25 32, 28 26, 30 22 Z" fill="#000000" />
          {/* S F Letters */}
          <text x="14" y="66" fill="#000" fontSize="12" fontWeight="900" fontFamily="serif">S</text>
          <text x="38" y="66" fill="#000" fontSize="12" fontWeight="900" fontFamily="serif">F</text>
        </svg>
      );

    case 'mclaren':
      return (
        <svg style={baseStyle} viewBox="0 0 100 45" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* McLaren Papaya Speedmark */}
          <path d="M10 35 C35 15, 65 8, 92 12 C75 18, 50 28, 28 38 C20 42, 12 40, 10 35 Z" fill="#FF8000" />
          <path d="M45 22 C60 14, 80 12, 95 14 C82 20, 62 28, 48 34 Z" fill="#FF1801" opacity="0.85" />
        </svg>
      );

    case 'aston-martin':
      return (
        <svg style={baseStyle} viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Aston Martin Wings */}
          <path d="M10 20 C25 8, 50 8, 60 18 C70 8, 95 8, 110 20 C95 22, 75 16, 60 26 C45 16, 25 22, 10 20 Z" fill="#006F62" stroke="#00D2BE" strokeWidth="1.5" />
          <rect x="42" y="16" width="36" height="12" rx="2" fill="#00352F" stroke="#00D2BE" strokeWidth="1" />
          <text x="60" y="25" fill="#FFFFFF" fontSize="6.5" fontWeight="900" textAnchor="middle" letterSpacing="0.5" fontFamily="sans-serif">ASTON MARTIN</text>
        </svg>
      );

    case 'alpine':
      return (
        <svg style={baseStyle} viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Alpine Iconic 'A' */}
          <path d="M40 8 L18 58 H32 L40 38 L48 58 H62 Z" fill="#0090FF" />
          {/* Crossbar with French Tricolore */}
          <rect x="28" y="44" width="8" height="5" fill="#002395" />
          <rect x="36" y="44" width="8" height="5" fill="#FFFFFF" />
          <rect x="44" y="44" width="8" height="5" fill="#ED2939" />
          {/* Alpine Arrow Tip */}
          <polygon points="40,16 35,28 45,28" fill="#FFFFFF" />
        </svg>
      );

    case 'williams':
      return (
        <svg style={baseStyle} viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Williams Iconic 'W' Chevron */}
          <path d="M10 12 L28 48 L45 22 L62 48 L80 12 H66 L55 36 L45 18 L35 36 L24 12 Z" fill="#00A0DE" />
          <polygon points="45,24 52,38 38,38" fill="#005AFF" />
        </svg>
      );

    case 'alphatauri':
      return (
        <svg style={baseStyle} viewBox="0 0 90 70" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* AlphaTauri Stylized Bull & A */}
          <circle cx="45" cy="35" r="30" fill="none" stroke="#4E7C9B" strokeWidth="4" />
          <path d="M45 15 L25 55 H37 L45 38 L53 55 H65 Z" fill="#FFFFFF" />
          <polygon points="35,25 45,12 55,25 45,30" fill="#4E7C9B" />
        </svg>
      );

    case 'alfa-romeo':
      return (
        <svg style={baseStyle} viewBox="0 0 75 75" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Alfa Romeo Biscione / Cross Circle */}
          <circle cx="37.5" cy="37.5" r="34" fill="none" stroke="#900000" strokeWidth="4" />
          <rect x="35" y="12" width="5" height="40" fill="#900000" />
          <rect x="18" y="29" width="38" height="5" fill="#900000" />
          {/* Biscione Snake */}
          <path d="M48 20 C54 24, 46 30, 52 36 C56 40, 48 48, 54 54" fill="none" stroke="#009246" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="18" r="3" fill="#E10600" />
        </svg>
      );

    case 'haas':
      return (
        <svg style={baseStyle} viewBox="0 0 90 75" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Haas Red Circle with White 'H' */}
          <circle cx="45" cy="37.5" r="32" fill="#E6002B" />
          <path d="M30 20 h11 v14 h18 v-14 h11 v35 h-11 v-13 h-18 v13 h-11 z" fill="#FFFFFF" />
        </svg>
      );

    default:
      return (
        <span style={{ fontSize: '1.4rem', ...style }}>🏎️</span>
      );
  }
}
