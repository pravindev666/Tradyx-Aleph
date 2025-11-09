'use client';

import React from 'react';

interface InfinityLoaderProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function InfinityLoader({ 
  width = 120, 
  height = 60,
  className = ''
}: InfinityLoaderProps) {
  // Generate unique IDs for gradients to avoid conflicts with multiple loaders
  const uniqueId = React.useMemo(() => Math.random().toString(36).substring(2, 11), []);
  const electricGradientId = `electricGradient-${uniqueId}`;
  const glowGradientId = `glowGradient-${uniqueId}`;
  const particleGradientId = `particleGradient-${uniqueId}`;
  const electricGlowFilterId = `electricGlow-${uniqueId}`;

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 70"
        className="relative"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Electric gradient - flows through the infinity symbol */}
          <linearGradient id={electricGradientId} x1="0%" y1="50%" x2="100%" y2="50%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e40af" stopOpacity="0.4">
              <animate
                attributeName="stop-opacity"
                values="0.4;1;0.4"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="25%" stopColor="#3b82f6" stopOpacity="0.7">
              <animate
                attributeName="stop-opacity"
                values="0.7;1;0.7"
                dur="2s"
                repeatCount="indefinite"
                begin="0.3s"
              />
            </stop>
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="1">
              <animate
                attributeName="stop-opacity"
                values="1;0.6;1"
                dur="2s"
                repeatCount="indefinite"
                begin="0.6s"
              />
            </stop>
            <stop offset="75%" stopColor="#3b82f6" stopOpacity="0.7">
              <animate
                attributeName="stop-opacity"
                values="0.7;1;0.7"
                dur="2s"
                repeatCount="indefinite"
                begin="0.9s"
              />
            </stop>
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.4">
              <animate
                attributeName="stop-opacity"
                values="0.4;1;0.4"
                dur="2s"
                repeatCount="indefinite"
                begin="1.2s"
              />
            </stop>
          </linearGradient>

          {/* Glow gradient for secondary effect */}
          <linearGradient id={glowGradientId} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.3" />
          </linearGradient>

          {/* Particle gradient */}
          <radialGradient id={particleGradientId}>
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="1" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
          </radialGradient>

          {/* Electric glow filter */}
          <filter id={electricGlowFilterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main Infinity Symbol Path - Left Loop */}
        <path
          className="infinity-path-left"
          d="M 25 35 Q 35 25 45 35 Q 55 45 45 55 Q 35 65 25 55 Q 15 45 25 35"
          fill="none"
          stroke={`url(#${electricGradientId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${electricGlowFilterId})`}
          style={{
            strokeDasharray: '80',
            strokeDashoffset: '80',
          }}
        />

        {/* Main Infinity Symbol Path - Right Loop */}
        <path
          className="infinity-path-right"
          d="M 75 35 Q 85 25 95 35 Q 105 45 95 55 Q 85 65 75 55 Q 65 45 75 35"
          fill="none"
          stroke={`url(#${electricGradientId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${electricGlowFilterId})`}
          style={{
            strokeDasharray: '80',
            strokeDashoffset: '80',
          }}
        />
        
        {/* Secondary Glow Layer - Left */}
        <path
          className="infinity-glow-left"
          d="M 25 35 Q 35 25 45 35 Q 55 45 45 55 Q 35 65 25 55 Q 15 45 25 35"
          fill="none"
          stroke={`url(#${glowGradientId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
          style={{
            strokeDasharray: '80',
            strokeDashoffset: '80',
          }}
        />

        {/* Secondary Glow Layer - Right */}
        <path
          className="infinity-glow-right"
          d="M 75 35 Q 85 25 95 35 Q 105 45 95 55 Q 85 65 75 55 Q 65 45 75 35"
          fill="none"
          stroke={`url(#${glowGradientId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
          style={{
            strokeDasharray: '80',
            strokeDashoffset: '80',
          }}
        />

        {/* Electric Particles flowing through - Left Loop */}
        <circle r="4" fill={`url(#${particleGradientId})`} filter={`url(#${electricGlowFilterId})`}>
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path="M 25 35 Q 35 25 45 35 Q 55 45 45 55 Q 35 65 25 55 Q 15 45 25 35"
            rotate="auto"
          />
          <animate
            attributeName="r"
            values="3;5;3"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
        
        <circle r="3.5" fill={`url(#${particleGradientId})`} filter={`url(#${electricGlowFilterId})`} opacity="0.8">
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            begin="0.5s"
            path="M 25 35 Q 35 25 45 35 Q 55 45 45 55 Q 35 65 25 55 Q 15 45 25 35"
            rotate="auto"
          />
          <animate
            attributeName="r"
            values="3;4.5;3"
            dur="1s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        </circle>

        {/* Electric Particles flowing through - Right Loop */}
        <circle r="4" fill={`url(#${particleGradientId})`} filter={`url(#${electricGlowFilterId})`}>
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            begin="1s"
            path="M 75 35 Q 85 25 95 35 Q 105 45 95 55 Q 85 65 75 55 Q 65 45 75 35"
            rotate="auto"
          />
          <animate
            attributeName="r"
            values="3;5;3"
            dur="1s"
            repeatCount="indefinite"
            begin="1s"
          />
        </circle>
        
        <circle r="3.5" fill={`url(#${particleGradientId})`} filter={`url(#${electricGlowFilterId})`} opacity="0.8">
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            begin="1.5s"
            path="M 75 35 Q 85 25 95 35 Q 105 45 95 55 Q 85 65 75 55 Q 65 45 75 35"
            rotate="auto"
          />
          <animate
            attributeName="r"
            values="3;4.5;3"
            dur="1s"
            repeatCount="indefinite"
            begin="1.5s"
          />
        </circle>
      </svg>

    </div>
  );
}
