'use client';
import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';

type P = { id:number; x:number; y:number; vx:number; vy:number };

export type MeshRef = {
  particles: Array<{ id: number; x: number; y: number }>;
  connections: Array<{ from: number; to: number }>;
};

const BackgroundMesh = forwardRef<MeshRef>((props, ref) => {
  const [p,setP]=useState<P[]>([]);
  
  useEffect(()=>{
    // Reduced to 25 particles for better performance while maintaining visibility
    const arr = Array.from({length:25},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,vx:(Math.random()-0.5)*0.5,vy:(Math.random()-0.5)*0.5}));
    setP(arr);
    // Slightly slower update interval for better performance
    const t=setInterval(()=> setP(prev=>prev.map(q=>({...q,x:(q.x+q.vx+100)%100,y:(q.y+q.vy+100)%100}))),60);
    return ()=>clearInterval(t);
  },[]);

  // Expose particles and connections to parent via ref
  useImperativeHandle(ref, () => {
    const connections: Array<{ from: number; to: number }> = [];
    p.forEach((a, i) => {
      p.forEach((b, j) => {
        if (i < j) {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d <= 18) {
            connections.push({ from: i, to: j });
          }
        }
      });
    });
    
    return {
      particles: p.map(q => ({ id: q.id, x: q.x, y: q.y })),
      connections
    };
  }, [p]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10" style={{opacity: 'var(--mesh-opacity, 0.7)'}}>
      <svg className="w-full h-full">
        {p.flatMap(a=>p.map(b=>{
          if(a.id>=b.id) return null;
          const dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
          // Reduced connection distance to 18 for less dense connections
          if(d>18) return null;
          // Brighter colors: cyan for light, bright cyan for dark
          const strokeColor = 'var(--mesh-stroke, #06b6d4)';
          return <line key={`${a.id}-${b.id}`} x1={`${a.x}%`} y1={`${a.y}%`} x2={`${b.x}%`} y2={`${b.y}%`} stroke={strokeColor} strokeWidth="1.5" opacity={0.8-d/18*0.5} style={{filter:'drop-shadow(0 0 4px currentColor)'}}/>;
        }))}
        {p.map(q=>{
          const fillColor = 'var(--mesh-fill, #06b6d4)';
          return <circle key={q.id} cx={`${q.x}%`} cy={`${q.y}%`} r="3.5" fill={fillColor} opacity="0.9" style={{filter:'drop-shadow(0 0 8px currentColor)'}}/>;
        })}
      </svg>
    </div>
  );
});

BackgroundMesh.displayName = 'BackgroundMesh';

export default BackgroundMesh;
