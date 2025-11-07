'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle(){
  const [dark,setDark]=useState(false);
  useEffect(()=>{
    const d=localStorage.getItem('theme')==='dark';
    setDark(d);
    document.documentElement.classList.toggle('dark', d);
  },[]);
  const flip=()=>{
    const n=!dark; setDark(n);
    document.documentElement.classList.toggle('dark', n);
    localStorage.setItem('theme', n?'dark':'light');
  };
  return (
    <button onClick={flip} className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
      {dark?'Light':'Dark'}
    </button>
  );
}