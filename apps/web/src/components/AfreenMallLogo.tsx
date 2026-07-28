import React from 'react';

interface AfreenMallLogoProps {
  size?: 'small' | 'medium' | 'large' | 'huge';
  className?: string;
}

export const AfreenMallLogo: React.FC<AfreenMallLogoProps> = ({ size = 'medium', className = '' }) => {
  let width = 280;
  let height = 220;

  if (size === 'small') {
    width = 160;
    height = 50;
  } else if (size === 'medium') {
    width = 240;
    height = 180;
  } else if (size === 'large') {
    width = 380;
    height = 280;
  } else if (size === 'huge') {
    width = 460;
    height = 340;
  }

  // Small horizontal inline variant for Sidebar / Topbar
  if (size === 'small') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 320 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Emblem Group */}
        <g transform="translate(10, 5) scale(0.18)">
          {/* Circular Swoosh Arc */}
          <path
            d="M 220 40 A 180 180 0 1 0 380 340"
            stroke="#E4FD97"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          {/* A Monogram (Deep Teal) */}
          <path
            d="M 180 320 L 250 100 L 320 320 H 290 L 270 260 H 230 L 210 320 Z M 240 220 H 260 L 250 170 Z"
            fill="#004741"
          />
          {/* M Monogram (Lime Accent) */}
          <path
            d="M 270 320 L 270 120 L 340 320 L 410 120 L 410 320 H 380 L 380 190 L 345 310 H 335 L 300 190 L 300 320 Z"
            fill="#E4FD97"
          />
          {/* Swoosh Underline */}
          <path
            d="M 140 240 Q 280 190 420 280"
            stroke="#E4FD97"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          {/* Speed Cart */}
          <g transform="translate(80, 230)">
            <path d="M 0 15 H 25 L 45 60 H 105 L 120 15 H 140" stroke="#E4FD97" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 15 25 H -15 M 10 35 H -25 M 20 45 H -20" stroke="#E4FD97" strokeWidth="5" strokeLinecap="round" />
            <circle cx="55" cy="75" r="9" fill="#E4FD97" />
            <circle cx="95" cy="75" r="9" fill="#E4FD97" />
            {/* Leaves inside cart */}
            <path d="M 65 30 C 50 10 80 0 85 20 C 90 0 120 10 105 30 Z" fill="#E4FD97" />
          </g>
        </g>

        {/* Text "AFREEN MALL" */}
        <text
          x="105"
          y="58"
          fontFamily="'Times New Roman', Times, serif"
          fontSize="24"
          fontWeight="bold"
          letterSpacing="4"
          fill="var(--text-main)"
        >
          AFREEN MALL
        </text>
      </svg>
    );
  }

  // Large / Huge Standalone Aesthetic Emblem (Matching exact requested logo style)
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }} className={className}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 500 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 16px rgba(228, 253, 151, 0.15))' }}
      >
        {/* Background Subtle Glow Circle */}
        <circle cx="250" cy="180" r="160" fill="url(#logoGlow)" opacity="0.08" />

        <defs>
          <radialGradient id="logoGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E4FD97" />
            <stop offset="100%" stopColor="#171717" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Main Outer Curved Arc */}
        <path
          d="M 180 50 A 170 170 0 1 1 360 330"
          stroke="#E4FD97"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* 2. Intertwined "A" Monogram (Deep Teal / Emerald) */}
        <path
          d="M 175 250 L 225 80 L 275 250 H 252 L 238 200 H 212 L 198 250 Z M 225 155 L 217 184 H 233 Z"
          fill="#004741"
          stroke="#2A5C50"
          strokeWidth="1.5"
        />

        {/* 3. Intertwined "M" Monogram (Lime Accent) */}
        <path
          d="M 245 250 L 245 95 L 305 250 L 365 95 L 365 250 H 342 L 342 145 L 312 240 H 298 L 268 145 L 268 250 Z"
          fill="#E4FD97"
        />

        {/* 4. Elegant Swoosh Arc Across Monogram */}
        <path
          d="M 135 235 C 230 170 330 210 395 300"
          stroke="#E4FD97"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* 5. Speed Shopping Cart with Fresh Sprouting Leaves */}
        <g transform="translate(90, 240) scale(1.1)">
          {/* Speed motion trails */}
          <line x1="-15" y1="20" x2="5" y2="20" stroke="#E4FD97" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-25" y1="28" x2="0" y2="28" stroke="#E4FD97" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-18" y1="36" x2="-2" y2="36" stroke="#E4FD97" strokeWidth="2.5" strokeLinecap="round" />

          {/* Cart Basket */}
          <path
            d="M 10 15 H 28 L 44 50 H 90 L 102 15 H 115"
            stroke="#E4FD97"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path d="M 28 27 H 100 M 34 38 H 94" stroke="#E4FD97" strokeWidth="2" strokeOpacity="0.7" />

          {/* Wheels */}
          <circle cx="52" cy="62" r="6" fill="#E4FD97" />
          <circle cx="52" cy="62" r="2.5" fill="#171717" />
          <circle cx="82" cy="62" r="6" fill="#E4FD97" />
          <circle cx="82" cy="62" r="2.5" fill="#171717" />

          {/* Sprouting Organic Leaves Inside Cart */}
          <path
            d="M 52 24 C 38 4 65 -5 72 14 C 79 -5 106 4 92 24 C 78 30 60 30 52 24 Z"
            fill="#E4FD97"
            stroke="#171717"
            strokeWidth="0.8"
          />
          <path d="M 64 20 Q 72 8 72 14" stroke="#171717" strokeWidth="1" fill="none" />
        </g>

        {/* 6. High-Class Serif Typography "A F R E E N   M A L L" (No down words underneath) */}
        <text
          x="250"
          y="395"
          textAnchor="middle"
          fontFamily="'Times New Roman', Times, serif"
          fontSize="36"
          fontWeight="normal"
          letterSpacing="14"
          fill="var(--text-main)"
        >
          AFREEN MALL
        </text>

        {/* Elegant Bottom Accent Line with Mini Bag */}
        <g transform="translate(170, 420)">
          <line x1="0" y1="5" x2="60" y2="5" stroke="#E4FD97" strokeWidth="1" strokeOpacity="0.6" />
          <path
            d="M 75 0 H 85 L 87 10 H 73 Z M 77 0 C 77 -3 83 -3 83 0"
            stroke="#E4FD97"
            strokeWidth="1"
            fill="none"
            transform="translate(0, 0)"
          />
          <line x1="100" y1="5" x2="160" y2="5" stroke="#E4FD97" strokeWidth="1" strokeOpacity="0.6" />
        </g>
      </svg>
    </div>
  );
};
