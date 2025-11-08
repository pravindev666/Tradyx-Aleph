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

// Debug logging function
function debugLog(adKey: string, step: string, data?: any) {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
  console.log(`[AD DEBUG ${timestamp}] [${adKey}] ${step}`, data || '');
}

function queueAd(adKey: string, width: number, height: number, containerId: string) {
  debugLog(adKey, 'Queueing ad', { width, height, containerId });
  
  if (!window.adsterraQueue) {
    window.adsterraQueue = [];
    window.adsterraProcessing = false;
    debugLog(adKey, 'Initialized ad queue');
  }
  
  window.adsterraQueue.push({ adKey, width, height, containerId });
  debugLog(adKey, 'Added to queue', { queueLength: window.adsterraQueue.length });
  processQueue();
}

function processQueue() {
  if (window.adsterraProcessing) {
    debugLog('GLOBAL', 'Queue processing - already processing, skipping');
    return;
  }
  
  if (!window.adsterraQueue || window.adsterraQueue.length === 0) {
    debugLog('GLOBAL', 'Queue processing - queue empty');
    return;
  }
  
  window.adsterraProcessing = true;
  const ad = window.adsterraQueue.shift();
  
  if (!ad) {
    debugLog('GLOBAL', 'Queue processing - no ad found');
    window.adsterraProcessing = false;
    return;
  }
  
  const { adKey, width, height, containerId } = ad;
  debugLog(adKey, 'Processing ad from queue', { width, height, containerId });
  
  const container = document.getElementById(containerId);
  
  if (!container) {
    debugLog(adKey, 'ERROR: Container not found', { containerId });
    window.adsterraProcessing = false;
    processQueue();
    return;
  }
  
  debugLog(adKey, 'Container found', { 
    containerId, 
    containerExists: !!container,
    containerHTML: container.outerHTML.substring(0, 100)
  });
  
  try {
    // Step 1: Set atOptions
    debugLog(adKey, 'Step 1: Setting atOptions');
    const atOptions = {
      'key': adKey,
      'format': 'iframe',
      'height': height,
      'width': width,
      'params': {}
    };
    (window as any).atOptions = atOptions;
    debugLog(adKey, 'atOptions set on window', atOptions);
    
    // Step 2: Create config script
    debugLog(adKey, 'Step 2: Creating config script');
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    const configCode = `atOptions = { 'key' : '${adKey}', 'format' : 'iframe', 'height' : ${height}, 'width' : ${width}, 'params' : {} };`;
    configScript.textContent = configCode;
    debugLog(adKey, 'Config script created', { configCode });
    
    // Append config script
    container.appendChild(configScript);
    debugLog(adKey, 'Config script appended to container', {
      scriptId: configScript.id || 'no-id',
      scriptParent: configScript.parentElement?.id || 'no-parent'
    });
    
    // Verify atOptions is accessible
    setTimeout(() => {
      const atOptionsCheck = (window as any).atOptions;
      debugLog(adKey, 'atOptions verification', {
        exists: !!atOptionsCheck,
        key: atOptionsCheck?.key,
        matches: atOptionsCheck?.key === adKey
      });
    }, 50);
    
    // Step 3: Create invoke script after delay
    setTimeout(() => {
      debugLog(adKey, 'Step 3: Creating invoke script');
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      const invokeUrl = `//www.highperformanceformat.com/${adKey}/invoke.js`;
      invokeScript.src = invokeUrl;
      invokeScript.async = true;
      
      // Add event listeners for debugging
      invokeScript.onload = () => {
        debugLog(adKey, 'SUCCESS: Invoke script loaded', { url: invokeUrl });
      };
      invokeScript.onerror = (error) => {
        debugLog(adKey, 'ERROR: Invoke script failed to load', { 
          url: invokeUrl, 
          error: error,
          errorType: (error as any)?.type,
          errorTarget: (error as any)?.target?.src
        });
      };
      
      debugLog(adKey, 'Invoke script created', { url: invokeUrl });
      
      // Append invoke script
      container.appendChild(invokeScript);
      debugLog(adKey, 'Invoke script appended to container', {
        scriptId: invokeScript.id || 'no-id',
        scriptSrc: invokeScript.src,
        containerChildren: container.children.length
      });
      
      // Check if script is actually in DOM
      setTimeout(() => {
        const scriptInDOM = document.querySelector(`script[src*="${adKey}"]`);
        debugLog(adKey, 'Script in DOM check', {
          found: !!scriptInDOM,
          scriptSrc: (scriptInDOM as HTMLScriptElement)?.src,
          scriptParent: scriptInDOM?.parentElement?.id || 'no-parent-id'
        });
        
        // Check for iframe (ad rendered)
        setTimeout(() => {
          const iframes = container.querySelectorAll('iframe');
          debugLog(adKey, 'Iframe check (ad rendered)', {
            iframeCount: iframes.length,
            iframes: Array.from(iframes).map(iframe => ({
              src: iframe.src.substring(0, 50),
              width: iframe.width,
              height: iframe.height,
              style: iframe.style.cssText
            }))
          });
          
          // Check container dimensions
          const rect = container.getBoundingClientRect();
          debugLog(adKey, 'Container dimensions', {
            width: rect.width,
            height: rect.height,
            visible: rect.width > 0 && rect.height > 0,
            display: window.getComputedStyle(container).display,
            visibility: window.getComputedStyle(container).visibility
          });
        }, 1000);
      }, 200);
      
      // Process next ad after delay
      setTimeout(() => {
        debugLog(adKey, 'Queue processing complete, moving to next ad');
        window.adsterraProcessing = false;
        processQueue();
      }, 800);
    }, 150);
    
  } catch (e) {
    debugLog(adKey, 'ERROR: Exception during ad load', {
      error: e,
      errorMessage: (e as Error).message,
      errorStack: (e as Error).stack
    });
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
    debugLog(adKey, 'Component mounting');
    setMounted(true);
  }, [adKey]);

  useEffect(() => {
    if (!mounted) {
      debugLog(adKey, 'Not mounted yet, skipping');
      return;
    }
    
    if (loadedRef.current) {
      debugLog(adKey, 'Already loaded, skipping');
      return;
    }
    
    if (!containerRef.current) {
      debugLog(adKey, 'ERROR: Container ref not available');
      return;
    }
    
    debugLog(adKey, 'Effect running - setting up ad', {
      width,
      height,
      containerExists: !!containerRef.current
    });
    
    const containerId = `hpf-ad-${adKey}`;
    containerRef.current.id = containerId;
    debugLog(adKey, 'Container ID set', { containerId });
    
    // Check if already loaded
    const existingScript = document.querySelector(`script[src*="${adKey}"]`);
    if (existingScript) {
      debugLog(adKey, 'WARNING: Script already exists, skipping', {
        existingScriptSrc: (existingScript as HTMLScriptElement).src
      });
      loadedRef.current = true;
      return;
    }
    
    // Queue this ad
    debugLog(adKey, 'Queueing ad for loading');
    queueAd(adKey, width, height, containerId);
    loadedRef.current = true;
    
  }, [mounted, adKey, width, height]);

  if (!mounted) {
    debugLog(adKey, 'Rendering placeholder (not mounted)');
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
        data-debug-ad-key={adKey}
        data-debug-status="not-mounted"
      />
    );
  }

  debugLog(adKey, 'Rendering container', { width, height });
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
      data-debug-status="mounted"
      data-debug-width={width}
      data-debug-height={height}
    />
  );
}
