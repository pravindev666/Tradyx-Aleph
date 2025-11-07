import React, { useEffect, useState } from 'react';
import './background.css';

type Particle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export function NeonGridBackground({ dark }: { dark: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Create initial particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    }));
    setParticles(newParticles);

    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.vx + 100) % 100,
        y: (p.y + p.vy + 100) % 100
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className={`background-mesh ${dark ? 'dark' : 'light'}`} />
      <svg className="w-full h-full opacity-20">
        {particles.map(p1 => particles.map(p2 => {
          if (p1.id >= p2.id) return null;
          const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
          if (dist > 20) return null;
          return (
            <line 
              key={`${p1.id}-${p2.id}`} 
              x1={`${p1.x}%`} 
              y1={`${p1.y}%`} 
              x2={`${p2.x}%`} 
              y2={`${p2.y}%`} 
              stroke={dark ? '#0ea5e9' : '#0284c7'} 
              strokeWidth="1" 
              opacity={1 - dist / 20} 
            />
          );
        }))}
        {particles.map(p => (
          <circle 
            key={p.id} 
            cx={`${p.x}%`} 
            cy={`${p.y}%`} 
            r="3" 
            fill={dark ? '#0ea5e9' : '#0284c7'}
          >
            <animate 
              attributeName="r" 
              values="3;5;3" 
              dur="2s" 
              repeatCount="indefinite" 
            />
          </circle>
        ))}
      </svg>
    </div>
  );
}