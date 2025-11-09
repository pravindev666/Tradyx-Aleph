'use client';

import { useEffect, useRef, useState } from 'react';
import InfinityLoader from './InfinityLoader';

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
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const adLoadedRef = useRef(false);

  // Only render on client side after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sync ref with state
  useEffect(() => {
    adLoadedRef.current = adLoaded;
  }, [adLoaded]);

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

    // Continuous check for ad loading - keep checking until ad loads
    // Defined outside initAd so it can be referenced in catch block
    const checkForAd = () => {
      const container = containerRef.current;
      if (!container || adLoadedRef.current) {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
        return;
      }
      
      try {
        const iframe = container.querySelector('iframe');
        // Check if iframe exists and has a valid src (not blank)
        if (iframe && iframe.src && iframe.src !== 'about:blank' && !iframe.src.includes('about:')) {
          // Also check if iframe has content (height > 0 means ad loaded)
          if (iframe.offsetHeight > 0) {
            // Ad loaded! Hide loader and show ad
            adLoadedRef.current = true;
            setAdLoaded(true);
            setLoading(false);
            if (checkIntervalRef.current) {
              clearInterval(checkIntervalRef.current);
              checkIntervalRef.current = null;
            }
            return;
          }
        }
        
        // Also check for any content in the container (ads might render differently)
        if (container.children.length > 2) {
          // Options script + invoke script + ad content
          const hasAdContent = Array.from(container.children).some((child) => {
            if (child.tagName === 'IFRAME') {
              const iframeChild = child as HTMLIFrameElement;
              return iframeChild.offsetHeight > 0 && 
                     iframeChild.src && 
                     iframeChild.src !== 'about:blank';
            }
            return (child as HTMLElement).innerHTML.trim().length > 0;
          });
          if (hasAdContent) {
            adLoadedRef.current = true;
            setAdLoaded(true);
            setLoading(false);
            if (checkIntervalRef.current) {
              clearInterval(checkIntervalRef.current);
              checkIntervalRef.current = null;
            }
            return;
          }
        }
      } catch (e) {
        // Continue checking on error (cross-origin iframe access errors are normal)
      }
    };

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
            // Start checking immediately, then every 500ms
            setTimeout(checkForAd, 500);
            if (!checkIntervalRef.current) {
              checkIntervalRef.current = setInterval(checkForAd, 500);
            }
          };

          invokeScript.onerror = () => {
            // Don't set error state - keep checking for ads
            // Sometimes ads load even after script error
            setTimeout(checkForAd, 500);
            if (!checkIntervalRef.current) {
              checkIntervalRef.current = setInterval(checkForAd, 500);
            }
          };
          
          // Also start checking immediately (some ads load quickly)
          setTimeout(() => {
            checkForAd();
            if (!checkIntervalRef.current) {
              checkIntervalRef.current = setInterval(checkForAd, 500);
            }
          }, 1000);

          // Append scripts to container
          container.appendChild(optionsScript);
          container.appendChild(invokeScript);
          scriptLoadedRef.current = true;

        } catch (err) {
          // Silently fail - don't log in production
          // Keep loading state true so loader continues showing
          if (process.env.NODE_ENV === 'development') {
            console.error(`Ad initialization error for ${label}:`, err);
          }
          // Don't set error to true - keep trying to load
          // Start checking anyway in case ad loads from elsewhere
          setTimeout(() => {
            if (!checkIntervalRef.current && containerRef.current) {
              checkIntervalRef.current = setInterval(checkForAd, 500);
            }
          }, 1000);
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
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
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
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
      };
    }
  }, [isClient, adKey, width, height, label, loadDelay]);

  // Don't render during SSR
  if (!isClient) {
    return null;
  }

  // Show infinity loader continuously until ad loads
  // Keep showing even if there are errors - ads might load later
  const showLoader = !adLoaded;

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
          position: 'relative',
          backgroundColor: 'transparent'
        }}
        data-ad-key={adKey}
        data-ad-label={label}
      >
        {/* Show Infinity Loader continuously until ad loads */}
        {showLoader && (
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            style={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(4px)',
              borderRadius: '0.5rem'
            }}
          >
            <InfinityLoader 
              width={Math.min(width * 0.7, 180)} 
              height={Math.min(height * 0.7, 90)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

