'use client';

import { useEffect, useRef, useState } from 'react';

// Global queue to ensure ads load sequentially and don't overwrite each other's atOptions
declare global {
  interface Window {
    adsterraQueue?: Array<() => void>;
    adsterraLoading?: boolean;
  }
}

type Props = {
  adKey: string;
  width?: number;
  height?: number;
  className?: string;
};

function loadAdSequentially(loadFn: () => void) {
  if (!window.adsterraQueue) {
    window.adsterraQueue = [];
    window.adsterraLoading = false;
  }

  window.adsterraQueue.push(loadFn);
  processAdQueue();
}

function processAdQueue() {
  if (window.adsterraLoading || !window.adsterraQueue || window.adsterraQueue.length === 0) {
    return;
  }

  window.adsterraLoading = true;
  const loadFn = window.adsterraQueue.shift();
  
  if (loadFn) {
    try {
      loadFn();
      // Wait for the scripts to be added to DOM and start loading
      // This ensures atOptions is set and invoke.js has started before next ad loads
      setTimeout(() => {
        window.adsterraLoading = false;
        processAdQueue();
      }, 100);
    } catch (e) {
      console.error('Error loading ad in queue:', e);
      window.adsterraLoading = false;
      processAdQueue();
    }
  } else {
    window.adsterraLoading = false;
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
    const configScriptId = `hpf-config-${adKey}`;
    const invokeScriptId = `hpf-invoke-${adKey}`;

    // Check if already loaded
    if (document.getElementById(invokeScriptId)) {
      loadedRef.current = true;
      return;
    }

    // Set container ID
    if (containerRef.current) {
      containerRef.current.id = containerId;
    }

    // Load ad through queue to prevent conflicts
    loadAdSequentially(() => {
      try {
        if (!containerRef.current) return;

        // Create an isolated execution context for this ad
        // This ensures each ad's atOptions is set and its invoke script loads
        // before the next ad starts loading
        const adConfig = {
          key: adKey,
          format: 'iframe',
          height: height,
          width: width,
          params: {}
        };

        // Create a wrapper script that sets atOptions and loads invoke.js
        // All in one script to ensure atomicity
        const wrapperScript = document.createElement('script');
        wrapperScript.type = 'text/javascript';
        wrapperScript.id = configScriptId;
        wrapperScript.innerHTML = `
          (function() {
            var container = document.getElementById('${containerId}');
            if (!container) return;
            
            // Set atOptions for this specific ad
            atOptions = {
              'key': '${adConfig.key}',
              'format': '${adConfig.format}',
              'height': ${adConfig.height},
              'width': ${adConfig.width},
              'params': {}
            };
            
            // Create and append invoke script immediately
            var invokeScript = document.createElement('script');
            invokeScript.type = 'text/javascript';
            invokeScript.id = '${invokeScriptId}';
            invokeScript.src = 'https://www.highperformanceformat.com/${adConfig.key}/invoke.js';
            invokeScript.async = true;
            invokeScript.onerror = function() {
              console.warn('Failed to load ad script for ${adConfig.key}');
            };
            container.appendChild(invokeScript);
          })();
        `;
        
        // Append wrapper script to container
        containerRef.current.appendChild(wrapperScript);
        
        loadedRef.current = true;
      } catch (e) {
        console.error(`Failed to load HighPerformanceFormat ad script for ${adKey}:`, e);
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
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto',
        minWidth: `${width}px`,
        minHeight: `${height}px`,
        overflow: 'visible',
        position: 'relative'
      }}
      suppressHydrationWarning
      data-ad-key={adKey}
    />
  );
}

