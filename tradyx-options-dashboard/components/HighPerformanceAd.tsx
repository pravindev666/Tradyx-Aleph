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
  
  // Check if this ad is already queued
  const alreadyQueued = window.adsterraQueue.some(ad => ad.containerId === containerId);
  if (alreadyQueued) {
    return;
  }
  
  window.adsterraQueue.push({ adKey, width, height, containerId });
  
  // Process queue immediately (loads in parallel with small stagger)
  if (!window.adsterraProcessing) {
    processQueue();
  }
}

function loadAdDirectly(adKey: string, width: number, height: number, containerId: string) {
  // Retry logic for container detection
  let retries = 0;
  const maxRetries = 10;
  
  const attemptLoad = () => {
    const container = document.getElementById(containerId);
    
    if (!container) {
      retries++;
      if (retries < maxRetries) {
        // Retry after a short delay if container not found
        setTimeout(attemptLoad, 100);
        return;
      } else {
        console.warn(`Ad container ${containerId} not found after ${maxRetries} attempts`);
        return;
      }
    }
    
    // Check if ad already loaded
    if (container.querySelector(`script[src*="${adKey}"]`)) {
      return; // Already loaded
    }
    
    try {
      // Clear container first
      container.innerHTML = '';
      
      // Create config script (must be inline and execute first)
      const configScript = document.createElement('script');
      configScript.type = 'text/javascript';
      configScript.textContent = `atOptions = { 'key' : '${adKey}', 'format' : 'iframe', 'height' : ${height}, 'width' : ${width}, 'params' : {} };`;
      
      // Create invoke script
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
      invokeScript.async = true;
      invokeScript.crossOrigin = 'anonymous';
      
      // Error handling
      invokeScript.onerror = () => {
        console.warn(`Ad ${adKey.substring(0, 8)}... failed to load - check Adsterra dashboard`);
        // Don't show error in production, just log
      };
      
      // Success logging (only in dev)
      invokeScript.onload = () => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Ad ${adKey.substring(0, 8)}... loaded successfully`);
        }
      };
      
      // Append scripts in correct order
      container.appendChild(configScript);
      // Small delay to ensure config executes before invoke
      setTimeout(() => {
        container.appendChild(invokeScript);
      }, 10);
      
    } catch (e) {
      console.error(`Error loading ad ${adKey}:`, e);
    }
  };
  
  // Start loading attempt
  attemptLoad();
}

function processQueue() {
  if (!window.adsterraQueue || window.adsterraQueue.length === 0) {
    window.adsterraProcessing = false;
    return;
  }
  
  // Process all ads in parallel for faster loading
  const adsToLoad = [...window.adsterraQueue];
  window.adsterraQueue = [];
  
  adsToLoad.forEach((ad, index) => {
    // Stagger loading slightly to avoid conflicts (10ms apart)
    setTimeout(() => {
      loadAdDirectly(ad.adKey, ad.width, ad.height, ad.containerId);
    }, index * 10);
  });
  
  window.adsterraProcessing = false;
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
    
    // Use a stable ID based on adKey instead of random
    const containerId = `hpf-ad-${adKey}`;
    
    // Set container ID immediately
    if (containerRef.current) {
      containerRef.current.id = containerId;
    }
    
    // Check if already loaded
    if (containerRef.current?.querySelector(`script[src*="${adKey}"]`)) {
      loadedRef.current = true;
      return;
    }
    
    // Wait for DOM to be ready, then load ad
    const loadAd = () => {
      if (!containerRef.current) return;
      
      const container = document.getElementById(containerId);
      if (!container) {
        // Retry if container not found
        setTimeout(loadAd, 50);
        return;
      }
      
      // Queue ad for loading
      queueAd(adKey, width, height, containerId);
      loadedRef.current = true;
    };
    
    // Use multiple strategies to ensure container is ready
    if (document.readyState === 'complete') {
      // DOM already loaded
      setTimeout(loadAd, 100);
    } else {
      // Wait for DOM to be ready
      window.addEventListener('load', loadAd, { once: true });
      // Also try immediately in case it's already ready
      requestAnimationFrame(() => {
        setTimeout(loadAd, 50);
      });
    }
    
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
