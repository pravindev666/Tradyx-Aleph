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
  const scriptLoadedRef = useRef(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Only render on client to avoid hydration mismatch
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || scriptLoadedRef.current || !containerRef.current) return;

    // Create a unique container ID for this ad
    const containerId = `hpf-ad-container-${adKey}`;

    try {
      // Check if script already exists for this specific ad
      const existingScript = document.querySelector(`script[data-ad-key="${adKey}"]`);
      if (existingScript && containerRef.current.querySelector(`#${containerId}`)) {
        scriptLoadedRef.current = true;
        return;
      }

      // Create container div for the ad
      const adContainer = document.createElement('div');
      adContainer.id = containerId;
      containerRef.current.appendChild(adContainer);

      // Create inline script to set atOptions BEFORE loading the invoke script
      // This must be done inline because the invoke script reads atOptions immediately
      const configScript = document.createElement('script');
      configScript.type = 'text/javascript';
      configScript.innerHTML = `
        (function() {
          var atOptions = {
            'key': '${adKey}',
            'format': 'iframe',
            'height': ${height},
            'width': ${width},
            'params': {}
          };
          window.atOptions_${adKey} = atOptions;
          window.atOptions = atOptions;
        })();
      `;
      document.head.appendChild(configScript);

      // Create and load the invoke script
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
      invokeScript.async = true;
      invokeScript.setAttribute('data-ad-key', adKey);
      scriptRef.current = invokeScript;
      
      invokeScript.onload = () => {
        scriptLoadedRef.current = true;
      };

      invokeScript.onerror = () => {
        // Silently handle - ads may not always load due to network or ad availability
        scriptLoadedRef.current = false;
      };

      // Small delay to ensure atOptions is set before script executes
      setTimeout(() => {
        if (containerRef.current) {
          document.head.appendChild(invokeScript);
        }
      }, 10);
    } catch (e) {
      // Silently handle errors
      scriptLoadedRef.current = false;
    }

    // Cleanup function
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
      // @ts-ignore
      if (window[`atOptions_${adKey}`]) {
        // @ts-ignore
        delete window[`atOptions_${adKey}`];
      }
      scriptLoadedRef.current = false;
    };
  }, [mounted, adKey, width, height]);

  // Don't render on server to prevent hydration mismatch
  if (!mounted) {
    return (
      <div 
        className={className}
        style={{ width: `${width}px`, height: `${height}px`, display: 'block', minWidth: `${width}px`, minHeight: `${height}px` }}
        suppressHydrationWarning
      >
        {/* Placeholder for ad */}
      </div>
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
        overflow: 'hidden'
      }}
      suppressHydrationWarning
      id={`hpf-ad-${adKey}`}
    />
  );
}

