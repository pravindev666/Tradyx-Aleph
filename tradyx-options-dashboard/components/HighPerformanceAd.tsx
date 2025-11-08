'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  adKey: string;
  width?: number;
  height?: number;
  className?: string;
};

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
    const scriptId = `hpf-script-${adKey}`;
    
    // Check if already loaded
    if (document.getElementById(scriptId)) {
      loadedRef.current = true;
      return;
    }
    
    // Set container ID
    if (containerRef.current) {
      containerRef.current.id = containerId;
    }

    try {
      // Create a wrapper script that sets atOptions and then loads the invoke script
      // This ensures each ad has its own isolated configuration
      const wrapperScript = document.createElement('script');
      wrapperScript.type = 'text/javascript';
      wrapperScript.id = scriptId;
      wrapperScript.innerHTML = `
        (function() {
          var adKey = '${adKey}';
          var container = document.getElementById('${containerId}');
          if (!container) return;
          
          // Set atOptions for this specific ad
          window.atOptions = {
            'key': adKey,
            'format': 'iframe',
            'height': ${height},
            'width': ${width},
            'params': {}
          };
          
          // Load the invoke script
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = 'https://www.highperformanceformat.com/' + adKey + '/invoke.js';
          script.async = true;
          container.appendChild(script);
        })();
      `;

      // Append wrapper script to container
      if (containerRef.current) {
        containerRef.current.appendChild(wrapperScript);
        loadedRef.current = true;
      }
    } catch (e) {
      console.error('HighPerformanceAd error:', e);
      loadedRef.current = true;
    }

    // No cleanup needed - scripts persist
    return () => {
      loadedRef.current = false;
    };
  }, [mounted, adKey, width, height]);

  if (!mounted) {
    return (
      <div 
        className={className}
        style={{ width: `${width}px`, height: `${height}px`, display: 'block', minWidth: `${width}px`, minHeight: `${height}px` }}
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

