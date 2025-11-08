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
    // Wait for scripts to load before processing next ad
    setTimeout(() => {
      window.adsterraProcessing = false;
      processNextAd();
    }, 500); // Increased delay to ensure scripts execute
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
        
        // Append config script to container
        containerRef.current.appendChild(configScript);
        
        // Wait for config to execute, then load invoke script
        setTimeout(() => {
          if (!containerRef.current) return;
          
          const invokeScript = document.createElement('script');
          invokeScript.type = 'text/javascript';
          invokeScript.id = invokeScriptId;
          // Use protocol-relative URL exactly as user's working code
          invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
          invokeScript.async = true;
          
          // Append invoke script to container
          containerRef.current.appendChild(invokeScript);
        }, 100);
        
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
          width: `${width}px`, 
          height: `${height}px`, 
          display: 'block', 
          minWidth: `${width}px`, 
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
        width: `${width}px`, 
        height: `${height}px`, 
        display: 'block',
        margin: '0 auto',
        minWidth: `${width}px`,
        minHeight: `${height}px`,
        overflow: 'hidden',
        position: 'relative'
      }}
      suppressHydrationWarning
      data-ad-key={adKey}
    />
  );
}
