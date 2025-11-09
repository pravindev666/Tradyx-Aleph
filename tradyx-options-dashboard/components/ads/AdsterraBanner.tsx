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
  // Always start as false to match server render
  const [isClient, setIsClient] = useState(false);
  const [mounted, setMounted] = useState(false);
  const loadAttemptedRef = useRef(false);
  const scriptLoadedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const adLoadedRef = useRef(false);

  // Set mounted flag after hydration to avoid hydration mismatch
  // Add a delay to keep the spinner visible longer (user requested - show for 3 seconds)
  useEffect(() => {
    // Keep spinner visible for at least 3 seconds before switching to InfinityLoader
    const timer = setTimeout(() => {
      setMounted(true);
      setIsClient(true);
    }, 3000); // 3 second delay - gives user time to see the nice spinner animation
    
    return () => clearTimeout(timer);
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

  // Show infinity loader continuously until ad loads
  // Always show loader initially, hide only when ad is confirmed loaded
  const showLoader = !adLoaded || loading;

  // Always render the container - ensures space is reserved and loader is visible
  return (
    <div className="w-full" style={{ minHeight: `${height}px`, position: 'relative' }}>
      <div 
        ref={containerRef}
        className={`ad-container-transparent rounded-lg ${className}`}
        style={{ 
          minHeight: `${height}px`, 
          width: '100%',
          maxWidth: `${width}px`,
          margin: '0 auto',
          position: 'relative',
          backgroundColor: 'transparent',
          background: 'transparent'
        }}
        data-ad-key={adKey}
        data-ad-label={label}
      >
        {/* Show Infinity Loader continuously until ad loads */}
        {/* Always render the container to avoid hydration mismatch */}
        {showLoader && (
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none ad-loader-container"
            style={{ 
              backgroundColor: 'transparent',
              borderRadius: '0.5rem',
              minHeight: `${height}px`,
              width: '100%',
              zIndex: 10
            }}
            suppressHydrationWarning
          >
            {/* Use key to force re-render after mount, but render same structure initially */}
            <div key={mounted ? 'infinity' : 'placeholder'} className="flex items-center justify-center">
              {mounted ? (
                <InfinityLoader 
                  width={Math.min(width * 0.7, 180)} 
                  height={Math.min(height * 0.7, 90)}
                />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <svg 
                    aria-hidden="true" 
                    role="status" 
                    className="inline w-8 h-8 text-blue-400 animate-spin dark:text-blue-500" 
                    viewBox="0 0 100 101" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" 
                      fill="currentColor"
                      opacity="0.3"
                    />
                    <path 
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" 
                      fill="currentColor"
                    />
                  </svg>
                  <div className="animate-pulse text-blue-300 text-xs font-medium opacity-90">
                    Loading ad...
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

