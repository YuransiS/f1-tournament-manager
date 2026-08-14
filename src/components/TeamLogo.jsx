import React from 'react';

// Official, 100% transparent vector SVGs and BrandPalettes PNG logos without any white boxes or background pads!
const TEAM_LOGO_MAP = {
  'red-bull': '/teams/red-bull.png',
  'mercedes': '/teams/mercedes.svg',
  'ferrari': '/teams/ferrari.svg',
  'mclaren': '/teams/mclaren.svg',
  'aston-martin': '/teams/aston-martin.svg',
  'alpine': '/teams/alpine.svg',
  'williams': '/teams/williams.svg',
  'alphatauri': '/teams/alphatauri.svg',
  'alfa-romeo': '/teams/alfa-romeo.svg',
  'haas': '/teams/haas.svg'
};

export default function TeamLogo({ teamId, style = {}, className = '', alt = '' }) {
  const logoSrc = TEAM_LOGO_MAP[teamId] || `/teams/${teamId}.svg`;

  return (
    <img
      src={logoSrc}
      alt={alt || teamId}
      className={className}
      style={{
        height: '32px',
        maxWidth: '85px',
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        background: 'transparent',
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))',
        ...style
      }}
      onError={(e) => {
        // graceful fallback if missing
        e.target.style.display = 'none';
      }}
    />
  );
}
