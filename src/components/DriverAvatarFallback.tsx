import React from 'react';
import { GridPilot } from './F1StartingGrid';

interface DriverAvatarFallbackProps {
  pilot: GridPilot;
  isRight?: boolean;
}

export const DriverAvatarFallback: React.FC<DriverAvatarFallbackProps> = ({ pilot, isRight }) => {
  return (
    <div className="w-full h-full flex items-end justify-center relative select-none pointer-events-none pb-2">
      <svg
        viewBox="0 0 400 620"
        className={`w-full max-h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] ${
          isRight ? 'scale-x-[-1]' : ''
        }`}
      >
        <defs>
          <linearGradient id={`suitGrad-${pilot.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={pilot.team.primaryColor || '#E10600'} />
            <stop offset="55%" stopColor="#141923" />
            <stop offset="100%" stopColor="#080a0f" />
          </linearGradient>
          <linearGradient id={`accentGrad-${pilot.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={pilot.team.secondaryColor || '#ffffff'} />
            <stop offset="100%" stopColor={pilot.team.primaryColor || '#E10600'} />
          </linearGradient>
          <linearGradient id={`visorGrad-${pilot.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d2ff" />
            <stop offset="50%" stopColor="#3a7bd5" />
            <stop offset="100%" stopColor="#9d50bb" />
          </linearGradient>
        </defs>

        <path
          d="M90,620 C90,490 120,410 150,370 C130,335 120,300 120,250 C120,165 160,115 200,115 C240,115 280,165 280,250 C280,300 270,335 250,370 C280,410 310,490 310,620 Z"
          fill={`url(#suitGrad-${pilot.id})`}
        />
        <path d="M125,400 L150,370 L170,415 L145,445 Z" fill={`url(#accentGrad-${pilot.id})`} opacity="0.9" />
        <path d="M275,400 L250,370 L230,415 L255,445 Z" fill={`url(#accentGrad-${pilot.id})`} opacity="0.9" />
        <rect x="175" y="325" width="50" height="295" rx="3" fill="#000000" opacity="0.25" />

        <ellipse cx="200" cy="210" rx="64" ry="78" fill="#1b202a" stroke={pilot.team.secondaryColor || '#ffffff'} strokeWidth="3" />
        <path d="M185,135 Q200,130 215,135 L218,175 Q200,172 182,175 Z" fill={pilot.team.secondaryColor || '#ffffff'} opacity="0.8" />
        <path
          d="M146,200 Q200,185 254,200 Q244,232 200,238 Q156,232 146,200 Z"
          fill={`url(#visorGrad-${pilot.id})`}
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.85"
        />
        <ellipse cx="195" cy="204" rx="20" ry="3" fill="#ffffff" opacity="0.5" />

        <text
          x="200"
          y="490"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="52"
          fontWeight="900"
          fontFamily="sans-serif"
          opacity="0.2"
        >
          {pilot.driverNumber}
        </text>
      </svg>
    </div>
  );
};

export default DriverAvatarFallback;
