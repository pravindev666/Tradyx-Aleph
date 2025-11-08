'use client';

import { useEffect, useRef, useState } from 'react';

// Sequential loading queue
declare global {
  interface Window {
    adsterraQueue?: Array<{ adKey: string; width: number; height: number; containerId: string }>;
    adsterraProcessing?: boolean;
  }
}

type Props = {
  adKey: string;
  width?: number;
  height?: number;
  className?: string;
};

function queueAd(adKey: string, width: number, height: number, containerId: string) {
  if (!window.adsterraQueue) {
    window.adsterraQueue = [];
    window.adsterraProcessing = false;
  }
  
  window.adsterraQueue.push({ adKey, width, height, containerId });
  processQueue();
}

function processQueue() {
  if (window.adsterraProcessing || !window.adsterraQueue || window.adsterraQueue.length === 0) {
    return;
  }
  
  window.adsterraProcessing = true;
  const ad = window.adsterraQueue.shift();
  
  if (!ad) {
    window.adsterraProcessing = false;
    return;
  }
  
  const { adKey, width, height, containerId } = ad;
  const container = document.getElementById(containerId);
  
  if (!container) {
    window.adsterraProcessing = false;
    processQueue();
    return;
  }
  
  try {
    // CRITICAL: Set atOptions on window object FIRST (before any scripts run)
    (window as any).atOptions = {
      'key': adKey,
      'format': 'iframe',
      'height': height,
      'width': width,
      'params': {}
    };
    
    // Create and execute config script using a method that guarantees execution
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.textContent = `window.atOptions = { 'key' : '${adKey}', 'format' : 'iframe', 'height' : ${height}, 'width' : ${width}, 'params' : {} };`;
    
    // Append to document.head first to ensure it executes
    document.head.appendChild(configScript);
    
    // Wait a moment for config to be set, then create invoke script
    setTimeout(() => {
      // Double-check atOptions is set
      if (!(window as any).atOptions || (window as any).atOptions.key !== adKey) {
        // Re-set if missing
        (window as any).atOptions = {
          'key': adKey,
          'format': 'iframe',
          'height': height,
          'width': width,
          'params': {}
        };
      }
      
      // Create invoke script
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
      invokeScript.async = true;
      
      // Append to container (Adsterra needs it here to know where to render)
      container.appendChild(invokeScript);
      
      // Process next ad after delay
      setTimeout(() => {
        window.adsterraProcessing = false;
        processQueue();
      }, 600);
    }, 100);
    
  } catch (e) {
    console.error(`Error loading ad ${adKey}:`, e);
    window.adsterraProcessing = false;
    processQueue();
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
    
    const containerId = `hpf-ad-${adKey}`;
    containerRef.current.id = containerId;
    
    // Check if already loaded
    const existingScript = document.querySelector(`script[src*="${adKey}"]`);
    if (existingScript) {
      loadedRef.current = true;
      return;
    }
    
    // Queue this ad
    queueAd(adKey, width, height, containerId);
    loadedRef.current = true;
    
  }, [mounted, adKey, width, height]);

  if (!mounted) {
    return (
      <div 
        className={className}
        style={{ 
          width: '100%',
          maxWidth: `${width}px`,
          height: `${height}px`, 
          minHeight: `${height}px`,
          display: 'block'
        }}
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
        minHeight: `${height}px`,
        display: 'block',
        margin: '0 auto',
        overflow: 'hidden',
        position: 'relative'
      }}
      data-ad-key={adKey}
    />
  );
}
