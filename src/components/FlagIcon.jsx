import React from 'react';

// Self-contained, highly reliable SVG flags for Windows PC & PNG export compatibility!
export default function FlagIcon({ countryCode = 'UA', style = {} }) {
  const code = (countryCode || 'UA').toUpperCase();

  const baseStyle = {
    width: '24px',
    height: '16px',
    borderRadius: '2px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.6)',
    display: 'inline-block',
    verticalAlign: 'middle',
    objectFit: 'cover',
    flexShrink: 0,
    ...style
  };

  switch (code) {
    case 'UA': // Ukraine 🇺🇦
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="240" fill="#0057B7" />
          <rect y="240" width="640" height="240" fill="#FFD700" />
        </svg>
      );

    case 'IT': // Italy 🇮🇹
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="213.3" height="480" fill="#009246" />
          <rect x="213.3" width="213.4" height="480" fill="#FFFFFF" />
          <rect x="426.7" width="213.3" height="480" fill="#CE2B37" />
        </svg>
      );

    case 'BH': // Bahrain 🇧🇭
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#CE1126" />
          <polygon points="0,0 160,0 220,48 160,96 220,144 160,192 220,240 160,288 220,336 160,384 220,432 160,480 0,480" fill="#FFFFFF" />
        </svg>
      );

    case 'AT': // Austria 🇦🇹
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="160" fill="#ED2939" />
          <rect y="160" width="640" height="160" fill="#FFFFFF" />
          <rect y="320" width="640" height="160" fill="#ED2939" />
        </svg>
      );

    case 'SA': // Saudi Arabia 🇸🇦
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#165D31" />
          <rect x="180" y="270" width="280" height="18" fill="#FFFFFF" rx="4" />
          <polygon points="180,265 140,279 180,293" fill="#FFFFFF" />
          <text x="320" y="230" textAnchor="middle" fill="#FFFFFF" fontSize="64" fontWeight="bold" fontFamily="sans-serif">🇸🇦</text>
        </svg>
      );

    case 'AZ': // Azerbaijan 🇦🇿
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="160" fill="#00B5E2" />
          <rect y="160" width="640" height="160" fill="#EF3340" />
          <rect y="320" width="640" height="160" fill="#509E2F" />
          <circle cx="320" cy="240" r="45" fill="#FFFFFF" />
          <circle cx="330" cy="240" r="38" fill="#EF3340" />
          <polygon points="345,240 338,232 348,234 344,225 351,231 354,222 355,232 364,228 358,236 368,240 358,244 364,252 355,248 354,258 351,249 344,255 348,246 338,248" fill="#FFFFFF" />
        </svg>
      );

    case 'ES': // Spain 🇪🇸
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="120" fill="#AA1520" />
          <rect y="120" width="640" height="240" fill="#F1BF00" />
          <rect y="360" width="640" height="120" fill="#AA1520" />
        </svg>
      );

    case 'US': // USA 🇺🇸
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#BB133E" />
          <path d="M0 37h640M0 111h640M0 185h640M0 259h640M0 333h640M0 407h640" stroke="#FFF" strokeWidth="37" />
          <rect width="256" height="259" fill="#002147" />
          <circle cx="64" cy="64" r="10" fill="#FFF" />
          <circle cx="128" cy="64" r="10" fill="#FFF" />
          <circle cx="192" cy="64" r="10" fill="#FFF" />
          <circle cx="96" cy="128" r="10" fill="#FFF" />
          <circle cx="160" cy="128" r="10" fill="#FFF" />
          <circle cx="64" cy="192" r="10" fill="#FFF" />
          <circle cx="128" cy="192" r="10" fill="#FFF" />
          <circle cx="192" cy="192" r="10" fill="#FFF" />
        </svg>
      );

    case 'TH': // Thailand 🇹🇭
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="80" fill="#A51931" />
          <rect y="80" width="640" height="80" fill="#F4F5F8" />
          <rect y="160" width="640" height="160" fill="#2D2A4A" />
          <rect y="320" width="640" height="80" fill="#F4F5F8" />
          <rect y="400" width="640" height="80" fill="#A51931" />
        </svg>
      );

    case 'FR': // France 🇫🇷
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="213" height="480" fill="#002395" />
          <rect x="213" width="214" height="480" fill="#FFFFFF" />
          <rect x="427" width="213" height="480" fill="#ED2939" />
        </svg>
      );

    case 'GB': // United Kingdom 🇬🇧
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#012169" />
          <path d="M0 0l640 480M640 0L0 480" stroke="#FFF" strokeWidth="60" />
          <path d="M0 0l640 480M640 0L0 480" stroke="#C8102E" strokeWidth="40" />
          <path d="M320 0v480M0 240h640" stroke="#FFF" strokeWidth="100" />
          <path d="M320 0v480M0 240h640" stroke="#C8102E" strokeWidth="60" />
        </svg>
      );

    case 'DE': // Germany 🇩🇪
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="160" fill="#000000" />
          <rect y="160" width="640" height="160" fill="#DD0000" />
          <rect y="320" width="640" height="160" fill="#FFCC00" />
        </svg>
      );

    case 'FI': // Finland 🇫🇮
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#FFFFFF" />
          <rect x="175" width="105" height="480" fill="#003580" />
          <rect y="187" width="640" height="105" fill="#003580" />
        </svg>
      );

    case 'CA': // Canada 🇨🇦
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="160" height="480" fill="#FF0000" />
          <rect x="160" width="320" height="480" fill="#FFFFFF" />
          <rect x="480" width="160" height="480" fill="#FF0000" />
          <path d="M320 140l20 50 50-20-20 60 40 30-60 10 10 70-40-30-40 30 10-70-60-10 40-30-20-60 50 20z" fill="#FF0000" />
        </svg>
      );

    case 'DK': // Denmark 🇩🇰
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#C8102E" />
          <rect x="210" width="70" height="480" fill="#FFFFFF" />
          <rect y="205" width="640" height="70" fill="#FFFFFF" />
        </svg>
      );

    case 'MX': // Mexico 🇲🇽
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="213" height="480" fill="#006847" />
          <rect x="213" width="214" height="480" fill="#FFFFFF" />
          <rect x="427" width="213" height="480" fill="#CE1126" />
          <circle cx="320" cy="240" r="45" fill="#8B5A2B" />
        </svg>
      );

    case 'MC': // Monaco 🇲🇨
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="240" fill="#CE1126" />
          <rect y="240" width="640" height="240" fill="#FFFFFF" />
        </svg>
      );

    case 'NL': // Netherlands 🇳🇱
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="160" fill="#AE1C28" />
          <rect y="160" width="640" height="160" fill="#FFFFFF" />
          <rect y="320" width="640" height="160" fill="#21468B" />
        </svg>
      );

    case 'AU': // Australia 🇦🇺
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#00008B" />
          <path d="M0 0l320 240M320 0L0 240" stroke="#FFF" strokeWidth="40" />
          <path d="M0 0l320 240M320 0L0 240" stroke="#CC0000" strokeWidth="25" />
          <path d="M160 0v240M0 120h320" stroke="#FFF" strokeWidth="60" />
          <path d="M160 0v240M0 120h320" stroke="#CC0000" strokeWidth="40" />
          <circle cx="480" cy="120" r="14" fill="#FFF" />
          <circle cx="560" cy="200" r="14" fill="#FFF" />
          <circle cx="440" cy="300" r="14" fill="#FFF" />
          <circle cx="520" cy="380" r="14" fill="#FFF" />
        </svg>
      );

    case 'CN': // China 🇨🇳
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#EE1C25" />
          <circle cx="120" cy="120" r="35" fill="#FFFF00" />
        </svg>
      );

    case 'JP': // Japan 🇯🇵
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#FFFFFF" />
          <circle cx="320" cy="240" r="100" fill="#BC002D" />
        </svg>
      );

    default: // Default fallback (Ukraine 🇺🇦)
      return (
        <svg style={baseStyle} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="240" fill="#0057B7" />
          <rect y="240" width="640" height="240" fill="#FFD700" />
        </svg>
      );
  }
}
