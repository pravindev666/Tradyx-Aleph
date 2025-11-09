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
  
  // Process immediately for fastest loading
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
    processQueue();
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
    // Set atOptions for this ad
    const adOptions = {
      'key': adKey,
      'format': 'iframe',
      'height': height,
      'width': width,
      'params': {}
    };
    
    (window as any).atOptions = adOptions;
    
    // Create invoke script with immediate loading
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
    script.async = true;
    script.defer = false;
    
    // Handle load errors gracefully
    script.onerror = () => {
      console.warn(`Ad ${adKey} failed to load`);
    };
    
    // Append script immediately to container for fast loading
    container.appendChild(script);
    
    // Process next ad with minimal delay (10ms for faster loading vs 700ms before)
    setTimeout(() => {
      window.adsterraProcessing = false;
      processQueue();
    }, 10);
    
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
    
    const containerId = `hpf-ad-${adKey}-${Math.random().toString(36).substr(2, 9)}`;
    containerRef.current.id = containerId;
    
    // Check if already loaded in this container
    const existingScript = containerRef.current.querySelector(`script[src*="${adKey}"]`);
    if (existingScript) {
      loadedRef.current = true;
      return;
    }
    
    // Queue this ad immediately for faster loading
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
