import React from 'react';

// Official, 100% transparent high-res PNG team logos without any white boxes or background pads!
const TEAM_LOGO_MAP = {
  'red-bull': '/teams/red-bull.png',
  'mercedes': '/teams/mercedes.png',
  'ferrari': '/teams/ferrari.png',
  'mclaren': '/teams/mclaren.png',
  'aston-martin': '/teams/aston-martin.png',
  'alpine': '/teams/alpine.png',
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
        height: '28px',
        maxWidth: '70px',
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        background: 'transparent',
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))',
        ...style
      }}
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
  );
}
