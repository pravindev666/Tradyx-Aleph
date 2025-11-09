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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only load once when mounted and container is ready
    if (!mounted || !containerRef.current || scriptLoadedRef.current) {
      return;
    }

    const container = containerRef.current;
    
    // Check if script already exists (prevent double loading)
    if (container.querySelector(`script[src*="${adKey}"]`)) {
      scriptLoadedRef.current = true;
      return;
    }

    // Load ad - simplified approach matching test HTML exactly
    const loadAd = () => {
      if (!container || scriptLoadedRef.current) return;

      // Double-check container is still in DOM
      if (!document.contains(container)) {
        console.warn(`Ad container removed from DOM before ad could load: ${adKey.substring(0, 8)}`);
        return;
      }

      try {
        // Step 1: Create config script (sets atOptions global variable)
        const configScript = document.createElement('script');
        configScript.type = 'text/javascript';
        // Use innerHTML instead of textContent for immediate execution
        configScript.innerHTML = `atOptions = { 'key' : '${adKey}', 'format' : 'iframe', 'height' : ${height}, 'width' : ${width}, 'params' : {} };`;
        
        // Step 2: Create invoke script (loads the ad)
        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
        invokeScript.async = true;
        
        // Add error handler for debugging
        invokeScript.onerror = (error) => {
          console.debug(`[Ad Debug] Script failed to load for ad ${adKey.substring(0, 8)}...`, error);
        };
        
        invokeScript.onload = () => {
          console.debug(`[Ad Debug] Script loaded successfully for ad ${adKey.substring(0, 8)}...`);
        };
        
        // Append both scripts to container
        // Order matters: config first, then invoke
        container.appendChild(configScript);
        container.appendChild(invokeScript);
        
        scriptLoadedRef.current = true;
        
        // Debug log
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Ad Debug] Loading ad ${adKey.substring(0, 8)}... in container`, container);
        }

      } catch (error) {
        console.error(`[Ad Error] Failed to load ad ${adKey.substring(0, 8)}...:`, error);
      }
    };

    // Wait for next frame to ensure React has finished rendering
    // This gives the container time to be fully in the DOM
    const timeoutId = setTimeout(() => {
      if (containerRef.current && document.contains(containerRef.current)) {
        loadAd();
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };

  }, [mounted, adKey, width, height]);

  // Render container - must have proper dimensions for Adsterra
  return (
    <div
      ref={containerRef}
      className={className}
      style={{ 
        width: '100%',
        maxWidth: `${width}px`,
        minHeight: `${height}px`,
        display: 'block',
        margin: '0 auto',
        position: 'relative',
        // Ensure container is visible and has dimensions
        visibility: 'visible',
        overflow: 'visible'
      }}
      data-ad-key={adKey}
      data-ad-width={width}
      data-ad-height={height}
      suppressHydrationWarning
    />
  );
}
