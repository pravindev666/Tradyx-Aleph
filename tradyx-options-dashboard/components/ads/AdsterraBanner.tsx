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
  const [error, setError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const loadAttemptedRef = useRef(false);
  const scriptLoadedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Only render on client side after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run on client side after hydration
    if (!isClient || typeof window === 'undefined' || typeof document === 'undefined') {
      setLoading(false);
      setError(true);
      return;
    }

    // Prevent duplicate loading
    if (loadAttemptedRef.current || scriptLoadedRef.current) {
      return;
    }

    // Wait for DOM to be ready
    const initAd = () => {
      if (!containerRef.current) {
        return;
      }
      
      loadAttemptedRef.current = true;

      // Staggered loading: Use provided delay or random 500-1500ms delay
      const delay = loadDelay !== undefined 
        ? loadDelay 
        : Math.random() * 1000 + 500; // 500-1500ms random delay
      
      timeoutRef.current = setTimeout(() => {
        const container = containerRef.current;
        if (!container) {
          setLoading(false);
          setError(true);
          return;
        }

        try {
          // Clear any existing content
          container.innerHTML = '';

          // Check if script already exists globally (safely)
          let existingScript = null;
          try {
            existingScript = document.querySelector(`script[src*="${adKey}"]`);
          } catch (e) {
            // Ignore querySelector errors
          }

          if (existingScript) {
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
              if (container) {
                try {
                  const iframe = container.querySelector('iframe');
                  if (iframe && iframe.src && iframe.src !== 'about:blank' && !iframe.src.includes('about:')) {
                    setAdLoaded(true);
                  }
                } catch (e) {
                  // Ignore query errors
                }
                setLoading(false);
              }
            }, 2000);
          };

          invokeScript.onerror = () => {
            setLoading(false);
            setAdLoaded(false);
            setError(true);
          };

          // Append scripts to container
          container.appendChild(optionsScript);
          container.appendChild(invokeScript);
          scriptLoadedRef.current = true;

        } catch (err) {
          // Silently fail - don't log in production
          if (process.env.NODE_ENV === 'development') {
            console.error(`Ad initialization error for ${label}:`, err);
          }
          setLoading(false);
          setAdLoaded(false);
          setError(true);
        }
      }, delay);
    };

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAd);
      return () => {
        document.removeEventListener('DOMContentLoaded', initAd);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    } else {
      // DOM already ready, initialize after a short delay
      const checkTimeout = setTimeout(initAd, 50);
      return () => {
        clearTimeout(checkTimeout);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [isClient, adKey, width, height, label, loadDelay]);

  // Don't render during SSR or if there's an error (silent fail)
  if (!isClient || (error && !adLoaded)) {
    return null;
  }

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
        {loading && !adLoaded && !error && (
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

