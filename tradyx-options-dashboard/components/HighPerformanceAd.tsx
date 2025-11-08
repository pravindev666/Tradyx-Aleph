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
      // Set atOptions in an IIFE that immediately loads the invoke script
      // This ensures atOptions is set right before the script executes
      const configAndInvokeScript = document.createElement('script');
      configAndInvokeScript.type = 'text/javascript';
      configAndInvokeScript.id = scriptId;
      configAndInvokeScript.innerHTML = `
        (function() {
          var container = document.getElementById('${containerId}');
          if (!container) return;
          
          // Set atOptions for this specific ad
          window.atOptions = {
            'key': '${adKey}',
            'format': 'iframe',
            'height': ${height},
            'width': ${width},
            'params': {}
          };
          
          // Immediately load the invoke script
          var invokeScript = document.createElement('script');
          invokeScript.type = 'text/javascript';
          invokeScript.src = 'https://www.highperformanceformat.com/${adKey}/invoke.js';
          invokeScript.async = true;
          container.appendChild(invokeScript);
        })();
      `;

      // Append to container
      if (containerRef.current) {
        containerRef.current.appendChild(configAndInvokeScript);
        loadedRef.current = true;
      }
    } catch (e) {
      loadedRef.current = true;
    }
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
        overflow: 'hidden',
        position: 'relative'
      }}
      suppressHydrationWarning
      data-ad-key={adKey}
    />
  );
}

