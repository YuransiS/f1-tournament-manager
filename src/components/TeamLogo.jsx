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

// Optimal scale adjustments for visual balance
const TEAM_SCALE_MAP = {
  'aston-martin': { maxWidth: '52px', maxHeight: '24px' },
  'mercedes': { maxWidth: '44px', maxHeight: '28px' },
  'mclaren': { maxWidth: '46px', maxHeight: '26px' },
  'red-bull': { maxWidth: '46px', maxHeight: '28px' },
  'williams': { maxWidth: '42px', maxHeight: '24px' },
  'alpine': { maxWidth: '40px', maxHeight: '26px' },
  'ferrari': { maxWidth: '28px', maxHeight: '32px' },
  'alfa-romeo': { maxWidth: '30px', maxHeight: '30px' },
  'alphatauri': { maxWidth: '32px', maxHeight: '30px' },
  'haas': { maxWidth: '34px', maxHeight: '30px' }
};

export default function TeamLogo({ teamId, style = {}, className = '', alt = '', size = 'md' }) {
  const logoSrc = TEAM_LOGO_MAP[teamId] || `/teams/${teamId}.png`;

  // Standard container dimensions: small (Drivers table), medium (Constructors table)
  const isSmall = size === 'sm';
  const containerWidth = isSmall ? '34px' : '52px';
  const containerHeight = isSmall ? '24px' : '34px';

  const scale = TEAM_SCALE_MAP[teamId] || { maxWidth: '100%', maxHeight: '100%' };

  return (
    <div
      className={className}
      style={{
        width: containerWidth,
        height: containerHeight,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style
      }}
    >
      <img
        src={logoSrc}
        alt={alt || teamId}
        style={{
          maxWidth: isSmall ? '28px' : scale.maxWidth,
          maxHeight: isSmall ? '20px' : scale.maxHeight,
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
          background: 'transparent',
          filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))'
        }}
        onError={(e) => {
          if (e.target.src.endsWith('.png')) {
            e.target.src = `/teams/${teamId}.svg`;
          }
        }}
      />
    </div>
  );
}
