'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import './mesh.css';
import BackgroundMesh, { MeshRef } from '../../components/visual/BackgroundMesh';

type Flash = { path: Array<{ x: number; y: number }>; active: boolean; progress: number };

export default function AnimatedMeshBackground({ dark }: { dark: boolean }) {
  const [flash, setFlash] = useState<Flash>({ path: [], active: false, progress: 0 });
  const meshRef = useRef<MeshRef>(null);

  // Update mesh data periodically from the actual mesh component
  useEffect(() => {
    const updateMeshData = () => {
      if (meshRef.current) {
        // Mesh data is already available via ref
        return;
      }
    };
    
    const interval = setInterval(updateMeshData, 100);
    return () => clearInterval(interval);
  }, []);

  const mkNeuralPath = useMemo(() => () => {
    if (!meshRef.current || !meshRef.current.particles || meshRef.current.connections.length === 0) {
      // Fallback to simple path if mesh not ready
      return [];
    }

    const { particles, connections } = meshRef.current;
    if (particles.length === 0 || connections.length === 0) return [];

    // Start from a random particle
    const startIdx = Math.floor(Math.random() * particles.length);
    const path: Array<{ x: number; y: number }> = [{ x: particles[startIdx].x, y: particles[startIdx].y }];
    
    // Follow connections to create a neural pathway (3-5 hops)
    let currentIdx = startIdx;
    const visited = new Set([startIdx]);
    const pathLength = 3 + Math.floor(Math.random() * 3); // 3-5 hops
    
    for (let i = 1; i < pathLength; i++) {
      // Find connected particles
      const connected = connections
        .filter(c => (c.from === currentIdx && !visited.has(c.to)) || (c.to === currentIdx && !visited.has(c.from)))
        .map(c => c.from === currentIdx ? c.to : c.from);
      
      if (connected.length === 0) break;
      
      // Pick a random connected particle
      const nextIdx = connected[Math.floor(Math.random() * connected.length)];
      path.push({ x: particles[nextIdx].x, y: particles[nextIdx].y });
      visited.add(nextIdx);
      currentIdx = nextIdx;
    }
    
    return path;
  }, []);

  useEffect(() => {
    let cancelled = false;
    let animationFrame: number;
    
    const arm = () => {
      const delay = 2000 + Math.random() * 3000;
      const t = setTimeout(() => {
        if (cancelled) return;
        const path = mkNeuralPath();
        if (path.length > 1) {
          setFlash({ path, active: true, progress: 0 });
          
          // Sudden flash - show entire path immediately, then fade
          setFlash({ path, active: true, progress: 1 });
          
          // Brief flash duration (100-200ms)
          const flashDuration = 100 + Math.random() * 100;
          const startTime = Date.now();
          
          const animate = () => {
            if (cancelled) return;
            const elapsed = Date.now() - startTime;
            const fadeProgress = Math.min(1, elapsed / flashDuration);
            
            // Fade out
            setFlash(f => ({ ...f, progress: 1 - fadeProgress * 0.3 }));
            
            if (fadeProgress < 1) {
              animationFrame = requestAnimationFrame(animate);
            } else {
              setFlash({ path: [], active: false, progress: 0 });
              arm();
            }
          };
          
          animate();
        } else {
          arm();
        }
      }, delay);
      return () => clearTimeout(t);
    };
    
    const cancel = arm();
    return () => {
      cancelled = true;
      if (typeof cancel === 'function') cancel();
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [mkNeuralPath]);

  return (
    <div className="mesh-container">
      <div className={`animated-mesh ${dark ? 'dark' : 'light'}`} />

      {/* soft moving gradient blobs */}
      <div className="mesh-overlay">
        <div className="mesh-gradient-1" />
        <div className="mesh-gradient-2" />
        <div className="mesh-gradient-3" />
      </div>

      {/* interconnected particle mesh */}
      <BackgroundMesh ref={meshRef} />

      {/* neural pathway lightning - sudden bright flash */}
      {flash.active && flash.path.length > 1 && (
        <svg className="lightning-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
          {flash.path.map((point, idx, arr) => {
            if (idx === 0) return null;
            const prevPoint = arr[idx - 1];
            return (
              <line
                key={idx}
                x1={`${prevPoint.x}%`}
                y1={`${prevPoint.y}%`}
                x2={`${point.x}%`}
                y2={`${point.y}%`}
                className="neural-pathway"
                style={{
                  opacity: flash.progress
                }}
              />
            );
          })}
        </svg>
      )}
    </div>
  );
}