import React from 'react';

interface AfreenMallLogoProps {
  size?: 'small' | 'medium' | 'large' | 'huge';
  className?: string;
}

export const AfreenMallLogo: React.FC<AfreenMallLogoProps> = ({ size = 'medium', className = '' }) => {
  let height = 110;
  let width = 160;

  if (size === 'small') {
    height = 32;
    width = 160;
  } else if (size === 'medium') {
    height = 80;
    width = 110;
  } else if (size === 'large') {
    height = 110;
    width = 150;
  } else if (size === 'huge') {
    height = 135;
    width = 180;
  }

  // Small horizontal inline variant for Sidebar & Topbar
  if (size === 'small') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 320 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ display: 'block' }}
      >
        {/* Emblem Group */}
        <g transform="translate(10, 0) scale(0.16)">
          {/* Circular Swoosh Arc */}
          <path
            d="M 220 40 A 180 180 0 1 0 380 340"
            stroke="var(--accent-lime)"
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
            fill="var(--accent-lime)"
          />
          {/* Swoosh Underline */}
          <path
            d="M 140 240 Q 280 190 420 280"
            stroke="var(--accent-lime)"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          {/* Speed Cart */}
          <g transform="translate(80, 230)">
            <path d="M 0 15 H 25 L 45 60 H 105 L 120 15 H 140" stroke="var(--accent-lime)" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 15 25 H -15 M 10 35 H -25 M 20 45 H -20" stroke="var(--accent-lime)" strokeWidth="5" strokeLinecap="round" />
            <circle cx="55" cy="75" r="9" fill="var(--accent-lime)" />
            <circle cx="95" cy="75" r="9" fill="var(--accent-lime)" />
            <path d="M 65 30 C 50 10 80 0 85 20 C 90 0 120 10 105 30 Z" fill="var(--accent-lime)" />
          </g>
        </g>

        {/* Text "AFREEN MALL" */}
        <text
          x="100"
          y="48"
          fontFamily="'Times New Roman', Times, serif"
          fontSize="22"
          fontWeight="bold"
          letterSpacing="3"
          fill="var(--text-main)"
        >
          AFREEN MALL
        </text>
      </svg>
    );
  }

  // Centered Vector Emblem (Transparent Background, Perfectly Proportioned & Compact)
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }} className={className}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 500 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 1. Main Outer Curved Arc */}
        <path
          d="M 180 50 A 170 170 0 1 1 360 330"
          stroke="var(--accent-lime)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* 2. Intertwined "A" Monogram (Deep Teal / Emerald) */}
        <path
          d="M 175 250 L 225 80 L 275 250 H 252 L 238 200 H 212 L 198 250 Z M 225 155 L 217 184 H 233 Z"
          fill="#004741"
          stroke="#1A5C4E"
          strokeWidth="1"
        />

        {/* 3. Intertwined "M" Monogram (Lime Accent) */}
        <path
          d="M 245 250 L 245 95 L 305 250 L 365 95 L 365 250 H 342 L 342 145 L 312 240 H 298 L 268 145 L 268 250 Z"
          fill="var(--accent-lime)"
        />

        {/* 4. Elegant Swoosh Arc */}
        <path
          d="M 135 235 C 230 170 330 210 395 300"
          stroke="var(--accent-lime)"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* 5. Speed Shopping Cart with Fresh Sprouting Leaves */}
        <g transform="translate(90, 240) scale(1.1)">
          <line x1="-15" y1="20" x2="5" y2="20" stroke="var(--accent-lime)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-25" y1="28" x2="0" y2="28" stroke="var(--accent-lime)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-18" y1="36" x2="-2" y2="36" stroke="var(--accent-lime)" strokeWidth="2.5" strokeLinecap="round" />

          <path
            d="M 10 15 H 28 L 44 50 H 90 L 102 15 H 115"
            stroke="var(--accent-lime)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path d="M 28 27 H 100 M 34 38 H 94" stroke="var(--accent-lime)" strokeWidth="2" strokeOpacity="0.7" />

          <circle cx="52" cy="62" r="6" fill="var(--accent-lime)" />
          <circle cx="52" cy="62" r="2.5" fill="var(--bg-color)" />
          <circle cx="82" cy="62" r="6" fill="var(--accent-lime)" />
          <circle cx="82" cy="62" r="2.5" fill="var(--bg-color)" />

          <path
            d="M 52 24 C 38 4 65 -5 72 14 C 79 -5 106 4 92 24 C 78 30 60 30 52 24 Z"
            fill="var(--accent-lime)"
          />
        </g>

        {/* 6. Typography "AFREEN MALL" */}
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

        {/* Bottom Accent Line */}
        <g transform="translate(170, 420)">
          <line x1="0" y1="5" x2="60" y2="5" stroke="var(--accent-lime)" strokeWidth="1.2" strokeOpacity="0.7" />
          <path
            d="M 75 0 H 85 L 87 10 H 73 Z M 77 0 C 77 -3 83 -3 83 0"
            stroke="var(--accent-lime)"
            strokeWidth="1.2"
            fill="none"
          />
          <line x1="100" y1="5" x2="160" y2="5" stroke="var(--accent-lime)" strokeWidth="1.2" strokeOpacity="0.7" />
        </g>
      </svg>
    </div>
  );
};
