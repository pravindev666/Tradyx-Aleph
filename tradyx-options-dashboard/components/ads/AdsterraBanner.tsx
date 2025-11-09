'use client';

import { useEffect, useRef, useState } from 'react';

interface AdsterraBannerProps {
  adKey: string;
  width: number;
  height: number;
  className?: string;
  label?: string;
  loadDelay?: number; // Optional custom delay for staggered loading
}

export default function AdsterraBanner({ 
  adKey, 
  width, 
  height, 
  className = '',
  label = 'Advertisement',
  loadDelay
}: AdsterraBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const loadAttemptedRef = useRef(false);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate loading
    if (loadAttemptedRef.current || !containerRef.current || scriptLoadedRef.current) {
      return;
    }
    
    loadAttemptedRef.current = true;

    // Staggered loading: Use provided delay or random 500-1500ms delay
    const delay = loadDelay !== undefined 
      ? loadDelay 
      : Math.random() * 1000 + 500; // 500-1500ms random delay
    
    const timeoutId = setTimeout(() => {
      if (!containerRef.current) return;

      try {
        // Clear any existing content
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // Check if script already exists globally
        const existingScript = document.querySelector(`script[src*="${adKey}"]`);
        if (existingScript) {
          console.log(`Ad ${label} (${adKey.substring(0, 8)}) already loaded`);
          setLoading(false);
          setAdLoaded(true);
          return;
        }

        // Create options script
        const optionsScript = document.createElement('script');
        optionsScript.type = 'text/javascript';
        optionsScript.innerHTML = `
          atOptions = {
            'key': '${adKey}',
            'format': 'iframe',
            'height': ${height},
            'width': ${width},
            'params': {}
          };
        `;
        
        // Create invoke script
        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
        invokeScript.async = true;

        // Check for iframe after script loads
        invokeScript.onload = () => {
          // Wait a bit for iframe to be created
          setTimeout(() => {
            if (containerRef.current) {
              const iframe = containerRef.current.querySelector('iframe');
              if (iframe && iframe.src && iframe.src !== 'about:blank' && !iframe.src.includes('about:')) {
                setAdLoaded(true);
                if (process.env.NODE_ENV === 'development') {
                  console.log(`✅ Ad loaded: ${label} (${adKey.substring(0, 8)})`);
                }
              } else {
                if (process.env.NODE_ENV === 'development') {
                  console.warn(`⚠️ No ad inventory: ${label} (${adKey.substring(0, 8)})`);
                }
              }
              setLoading(false);
            }
          }, 2000);
        };

        invokeScript.onerror = () => {
          console.error(`❌ Failed to load ad: ${label} (${adKey.substring(0, 8)})`);
          setLoading(false);
          setAdLoaded(false);
        };

        // Append scripts to container
        if (containerRef.current) {
          containerRef.current.appendChild(optionsScript);
          containerRef.current.appendChild(invokeScript);
          scriptLoadedRef.current = true;
        }

      } catch (err) {
        console.error(`Ad initialization error for ${label}:`, err);
        setLoading(false);
        setAdLoaded(false);
      }
    }, delay);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
    };
  }, [adKey, width, height, label, loadDelay]);

  return (
    <div className="w-full">
      <div 
        ref={containerRef}
        className={`ad-container-transparent rounded-lg overflow-hidden ${className}`}
        style={{ 
          minHeight: `${height}px`, 
          width: '100%',
          maxWidth: `${width}px`,
          margin: '0 auto',
          position: 'relative'
        }}
        data-ad-key={adKey}
        data-ad-label={label}
      >
        {loading && !adLoaded && (
          <div 
            className="flex items-center justify-center h-full" 
            style={{ minHeight: `${height}px` }}
          >
            <div className="text-center opacity-50">
              <div className="animate-pulse text-gray-400 text-xs">{label}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

