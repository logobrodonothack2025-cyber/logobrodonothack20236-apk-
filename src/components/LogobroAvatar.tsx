import React from 'react';

export interface LogobroTheme {
  id: string;
  name: string;
  colors: string[];
}

export const LOGOBRO_THEMES: Record<string, LogobroTheme> = {
  rainbow: {
    id: 'rainbow',
    name: 'Classic Candy Rainbow',
    colors: ['#ff7875', '#6fe4f8', '#fff066', '#67e76d', '#f578e8'],
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neon Cyberpunk',
    colors: ['#ff007f', '#00f0ff', '#7000ff', '#ffe600', '#00ff66'],
  },
  golden: {
    id: 'golden',
    name: 'Golden Solar',
    colors: ['#ffe066', '#f59f00', '#f76707', '#ffd43b', '#ffa94d'],
  },
  cotton: {
    id: 'cotton',
    name: 'Cotton Candy',
    colors: ['#ff9ebb', '#b3e5fc', '#e1bee7', '#fff9c4', '#c8e6c9'],
  },
  glitch: {
    id: 'glitch',
    name: 'Matrix Hacker',
    colors: ['#00ff66', '#00cc44', '#119933', '#88ff88', '#003311'],
  },
  mono: {
    id: 'mono',
    name: 'Monochrome Noir',
    colors: ['#ffffff', '#cccccc', '#999999', '#666666', '#333333'],
  },
};

interface LogobroAvatarProps {
  size?: number;
  themeId?: string;
  customColors?: string[];
  mood?: 'happy' | 'laughing' | 'typing' | 'peeking' | 'wink' | 'cool' | 'shocked' | 'sleepy';
  accessory?: 'none' | 'sunglasses' | 'party' | 'crown' | 'headphones' | 'hacker';
  className?: string;
  isInteractive?: boolean;
  onClick?: () => void;
}

export const LogobroAvatar: React.FC<LogobroAvatarProps> = ({
  size = 120,
  themeId = 'rainbow',
  customColors,
  mood = 'happy',
  accessory = 'none',
  className = '',
  isInteractive = false,
  onClick,
}) => {
  const currentTheme = LOGOBRO_THEMES[themeId] || LOGOBRO_THEMES.rainbow;
  const colors = customColors || currentTheme.colors;

  // Generate stripe sequence with black separators
  const stripeWidth = 14;
  const gapWidth = 5;
  const totalStep = stripeWidth + gapWidth;
  const stripes: { y: number; color: string }[] = [];

  // Repeat sequence across diagonal area (-150 to 350)
  let currentColorIdx = 0;
  for (let pos = -160; pos <= 380; pos += totalStep) {
    stripes.push({
      y: pos,
      color: colors[currentColorIdx % colors.length],
    });
    currentColorIdx++;
  }

  // Mouth paths for different expressions
  const getMouthPath = () => {
    switch (mood) {
      case 'laughing':
        return 'M 48 118 Q 100 185 186 112 Q 130 195 48 118 Z';
      case 'typing':
        return 'M 54 130 Q 100 162 174 124 Q 106 172 54 130 Z';
      case 'shocked':
        return 'M 75 125 C 75 105 125 105 125 125 C 125 165 75 165 75 125 Z';
      case 'sleepy':
        return 'M 60 135 Q 100 148 160 135 Q 100 152 60 135 Z';
      case 'peeking':
        return 'M 58 132 Q 95 158 165 128 Q 100 168 58 132 Z';
      case 'wink':
        return 'M 52 126 Q 100 176 182 118 Q 120 182 52 126 Z';
      case 'happy':
      default:
        // Canonical Logo Bro grin
        return 'M 50 126 Q 98 175 184 116 Q 120 184 50 126 Z';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none transition-transform ${
        isInteractive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Circular mask for the whole head */}
          <clipPath id="logobro-circle-clip">
            <circle cx="100" cy="100" r="92" />
          </clipPath>

          {/* Diagonal transform for the stripes */}
          <pattern
            id="logobro-stripes-pattern"
            patternUnits="userSpaceOnUse"
            width="200"
            height="200"
          >
            {/* Background fill */}
            <rect width="200" height="200" fill="#000000" />
          </pattern>
        </defs>

        {/* Outer Black Border */}
        <circle cx="100" cy="100" r="95" fill="#000000" stroke="#000000" strokeWidth="2" />

        {/* Clipped Head Body */}
        <g clipPath="url(#logobro-circle-clip)">
          {/* Black Base */}
          <rect width="200" height="200" fill="#000000" />

          {/* Diagonal stripes group rotated -45 deg */}
          <g transform="rotate(-45 100 100)">
            {stripes.map((s, idx) => (
              <rect
                key={idx}
                x="-120"
                y={s.y}
                width="440"
                height={stripeWidth}
                fill={s.color}
              />
            ))}
          </g>

          {/* The signature Black Mouth cut-out */}
          <path
            d={getMouthPath()}
            fill="#000000"
            stroke="#000000"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Expression enhancements for specific moods */}
          {mood === 'shocked' && (
            <ellipse cx="100" cy="135" rx="14" ry="18" fill="#ff4d4f" />
          )}

          {mood === 'wink' && (
            <g stroke="#000000" strokeWidth="4" strokeLinecap="round">
              <path d="M 68 85 Q 82 72 96 85" fill="none" />
              <circle cx="132" cy="85" r="7" fill="#000000" />
            </g>
          )}

          {mood === 'sleepy' && (
            <g stroke="#000000" strokeWidth="4" strokeLinecap="round">
              <path d="M 65 88 Q 80 96 95 88" fill="none" />
              <path d="M 115 88 Q 130 96 145 88" fill="none" />
            </g>
          )}

          {mood === 'peeking' && (
            <g>
              {/* Curious open eyes */}
              <circle cx="78" cy="85" r="8" fill="#000000" />
              <circle cx="80" cy="83" r="3" fill="#ffffff" />
              <circle cx="126" cy="85" r="8" fill="#000000" />
              <circle cx="128" cy="83" r="3" fill="#ffffff" />
            </g>
          )}
        </g>

        {/* Accessories Overlay */}
        {accessory === 'sunglasses' && (
          <g>
            <path
              d="M 45 80 L 98 80 L 92 104 L 50 104 Z"
              fill="#111827"
              stroke="#000000"
              strokeWidth="2"
            />
            <path
              d="M 102 80 L 155 80 L 150 104 L 108 104 Z"
              fill="#111827"
              stroke="#000000"
              strokeWidth="2"
            />
            <rect x="94" y="82" width="12" height="4" fill="#111827" />
            {/* Specular glare */}
            <path d="M 52 83 L 70 83 L 56 100 L 52 100 Z" fill="rgba(255,255,255,0.4)" />
            <path d="M 110 83 L 128 83 L 114 100 L 110 100 Z" fill="rgba(255,255,255,0.4)" />
          </g>
        )}

        {accessory === 'party' && (
          <g>
            {/* Party Hat */}
            <polygon points="100,5 72,55 128,55" fill="#ff4081" stroke="#000" strokeWidth="2" />
            <circle cx="100" cy="6" r="6" fill="#ffeb3b" />
            <line x1="82" y1="36" x2="118" y2="36" stroke="#00e5ff" strokeWidth="4" />
            <line x1="88" y1="22" x2="112" y2="22" stroke="#76ff03" strokeWidth="4" />
          </g>
        )}

        {accessory === 'crown' && (
          <g>
            <path
              d="M 68 55 L 72 26 L 86 42 L 100 22 L 114 42 L 128 26 L 132 55 Z"
              fill="#ffd700"
              stroke="#b78103"
              strokeWidth="2"
            />
            <circle cx="72" cy="24" r="3" fill="#ff1744" />
            <circle cx="100" cy="20" r="3.5" fill="#00e5ff" />
            <circle cx="128" cy="24" r="3" fill="#ff1744" />
          </g>
        )}

        {accessory === 'headphones' && (
          <g>
            {/* Headband */}
            <path
              d="M 28 95 A 76 76 0 0 1 172 95"
              fill="none"
              stroke="#222"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Left cup */}
            <rect x="18" y="75" width="16" height="38" rx="8" fill="#ff1744" stroke="#000" strokeWidth="2" />
            {/* Right cup */}
            <rect x="166" y="75" width="16" height="38" rx="8" fill="#ff1744" stroke="#000" strokeWidth="2" />
          </g>
        )}

        {accessory === 'hacker' && (
          <g>
            <rect x="42" y="78" width="116" height="18" rx="4" fill="#00ff66" opacity="0.85" />
            <rect x="44" y="80" width="112" height="14" rx="2" fill="#000000" />
            <text x="50" y="91" fill="#00ff66" fontSize="10" fontFamily="monospace" fontWeight="bold">
              SYSTEM_OK
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
