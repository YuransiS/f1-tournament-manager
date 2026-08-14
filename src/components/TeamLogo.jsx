import React from 'react';

// Exact high-resolution, transparent PNG & vector SVG logos provided by user
const TEAM_LOGO_MAP = {
  'red-bull': '/teams/red-bull.png',
  'mercedes': '/teams/mercedes.svg',
  'ferrari': '/teams/ferrari.png',
  'mclaren': '/teams/mclaren.svg',
  'aston-martin': '/teams/aston-martin.png',
  'alpine': '/teams/alpine.svg',
  'williams': '/teams/williams.png',
  'alphatauri': '/teams/alphatauri.png',
  'alfa-romeo': '/teams/alfa-romeo.png',
  'haas': '/teams/haas.png'
};

export default function TeamLogo({ teamId, style = {}, className = '', alt = '' }) {
  const logoSrc = TEAM_LOGO_MAP[teamId] || `/teams/${teamId}.png`;

  return (
    <img
      src={logoSrc}
      alt={alt || teamId}
      className={className}
      style={{
        height: '36px',
        maxWidth: '80px',
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        background: 'transparent',
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.65))',
        ...style
      }}
      onError={(e) => {
        // Fallback to SVG if PNG fails
        if (e.target.src.endsWith('.png')) {
          e.target.src = `/teams/${teamId}.svg`;
        }
      }}
    />
  );
}
