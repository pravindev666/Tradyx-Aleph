'use client';

import { useEffect, useRef, useState } from 'react';

// Global queue for sequential ad loading
declare global {
  interface Window {
    adsterraQueue?: Array<() => void>;
    adsterraProcessing?: boolean;
  }
}

type Props = {
  adKey: string;
  width?: number;
  height?: number;
  className?: string;
};

function queueAdLoad(loadFn: () => void) {
  if (!window.adsterraQueue) {
    window.adsterraQueue = [];
    window.adsterraProcessing = false;
  }
  
  window.adsterraQueue.push(loadFn);
  processNextAd();
}

function processNextAd() {
  if (window.adsterraProcessing || !window.adsterraQueue || window.adsterraQueue.length === 0) {
    return;
  }
  
  window.adsterraProcessing = true;
  const loadFn = window.adsterraQueue.shift();
  
  if (loadFn) {
    loadFn();
    setTimeout(() => {
      window.adsterraProcessing = false;
      processNextAd();
    }, 500);
  } else {
    window.adsterraProcessing = false;
  }
}

export default function HighPerformanceAd({
  adKey,
  width = 728,
  height = 90,
  className = ''
}: Props) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || loadedRef.current || !containerRef.current) return;

    const configScriptId = `hpf-config-${adKey}`;
    const invokeScriptId = `hpf-invoke-${adKey}`;

    // Check if already loaded
    if (document.getElementById(invokeScriptId)) {
      loadedRef.current = true;
      return;
    }

    // Queue this ad for sequential loading
    queueAdLoad(() => {
      if (!containerRef.current) return;

      try {
        // Create config script - EXACT format from user's working code
        const configScript = document.createElement('script');
        configScript.type = 'text/javascript';
        configScript.id = configScriptId;
        configScript.textContent = `atOptions = { 'key' : '${adKey}', 'format' : 'iframe', 'height' : ${height}, 'width' : ${width}, 'params' : {} };`;
        
        // Append config script directly to container
        containerRef.current.appendChild(configScript);
        
        // Force script execution by removing and re-adding
        // This ensures the script executes even in React's virtual DOM
        setTimeout(() => {
          // Create invoke script - EXACT format from user's working code
          const invokeScript = document.createElement('script');
          invokeScript.type = 'text/javascript';
          invokeScript.id = invokeScriptId;
          invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
          invokeScript.async = true;
          
          // Append invoke script to container
          containerRef.current?.appendChild(invokeScript);
          
          // Also append to document.head as fallback to ensure execution
          // Scripts in head execute more reliably than in divs
          const headConfig = document.createElement('script');
          headConfig.type = 'text/javascript';
          headConfig.textContent = configScript.textContent;
          document.head.appendChild(headConfig);
          
          const headInvoke = document.createElement('script');
          headInvoke.type = 'text/javascript';
          headInvoke.src = invokeScript.src;
          headInvoke.async = true;
          document.head.appendChild(headInvoke);
        }, 50);
        
        loadedRef.current = true;
      } catch (e) {
        console.error(`Failed to load HighPerformanceFormat ad ${adKey}:`, e);
        loadedRef.current = true;
      }
    });
  }, [mounted, adKey, width, height]);

  if (!mounted) {
    return (
      <div 
        className={className}
        style={{ 
          width: '100%',
          maxWidth: `${width}px`,
          height: `${height}px`, 
          display: 'block', 
          minHeight: `${height}px` 
        }}
        suppressHydrationWarning
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ 
        width: '100%',
        maxWidth: `${width}px`,
        height: `${height}px`, 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto',
        minHeight: `${height}px`,
        overflow: 'hidden',
        position: 'relative'
      }}
      suppressHydrationWarning
      data-ad-key={adKey}
      id={`hpf-ad-container-${adKey}`}
    />
  );
}
