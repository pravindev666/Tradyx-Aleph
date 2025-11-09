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
    // Create config script first (matches Adsterra test HTML format exactly)
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.textContent = `atOptions = { 'key' : '${adKey}', 'format' : 'iframe', 'height' : ${height}, 'width' : ${width}, 'params' : {} };`;
    
    // Create invoke script with https protocol
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
    invokeScript.async = true;
    
    // Handle load errors
    invokeScript.onerror = () => {
      console.warn(`Ad ${adKey} failed to load`);
      window.adsterraProcessing = false;
      processQueue();
    };
    
    // Append scripts in order (config first, then invoke)
    // Scripts execute sequentially when appended to DOM
    container.appendChild(configScript);
    container.appendChild(invokeScript);
    
    // Process next ad after minimal delay
    setTimeout(() => {
      window.adsterraProcessing = false;
      processQueue();
    }, 50);
    
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
    
    // Wait for next tick to ensure container is fully in DOM
    requestAnimationFrame(() => {
      if (containerRef.current && document.getElementById(containerId)) {
        // Queue this ad immediately for faster loading
        queueAd(adKey, width, height, containerId);
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
