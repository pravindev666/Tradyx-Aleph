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
    setTimeout(() => {
      window.adsterraProcessing = false;
      processNextAd();
    }, 500);
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
        // FIXED: Use innerHTML method which works reliably in React/Next.js
        // This ensures scripts execute in the correct order
        
        // Create wrapper div for scripts
        const scriptWrapper = document.createElement('div');
        scriptWrapper.id = `ad-wrapper-${adKey}`;
        
        // Insert both scripts as HTML (this WILL execute them)
        scriptWrapper.innerHTML = `
          <script type="text/javascript" id="${configScriptId}">
            atOptions = {
              'key': '${adKey}',
              'format': 'iframe',
              'height': ${height},
              'width': ${width},
              'params': {}
            };
          </script>
          <script type="text/javascript" id="${invokeScriptId}" src="//www.highperformanceformat.com/${adKey}/invoke.js" async></script>
        `;
        
        // Append to container
        containerRef.current.appendChild(scriptWrapper);
        
        // Alternative method: manually execute scripts (fallback)
        const scripts = scriptWrapper.getElementsByTagName('script');
        Array.from(scripts).forEach((oldScript) => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.textContent = oldScript.textContent;
          oldScript.parentNode?.replaceChild(newScript, oldScript);
        });
        
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
          width: '100%',
          maxWidth: `${width}px`,
          height: `${height}px`, 
          display: 'block', 
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
        width: '100%',
        maxWidth: `${width}px`,
        height: `${height}px`, 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto',
        minHeight: `${height}px`,
        overflow: 'hidden',
        position: 'relative'
      }}
      suppressHydrationWarning
      data-ad-key={adKey}
      id={`hpf-ad-container-${adKey}`}
    />
  );
}
