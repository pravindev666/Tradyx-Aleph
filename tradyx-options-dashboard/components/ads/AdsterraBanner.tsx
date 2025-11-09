'use client';

import { useEffect, useRef, useState } from 'react';
// InfinityLoader removed - no longer showing loader in ad placeholders

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

    // If ad is already loaded, don't do anything
    if (adLoadedRef.current || adLoaded) {
      setLoading(false);
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
        if (iframe) {
          const iframeSrc = iframe.src || (iframe as any).getAttribute('src') || '';
          const iframeHeight = iframe.offsetHeight || (iframe as any).clientHeight || 0;
          const iframeWidth = iframe.offsetWidth || (iframe as any).clientWidth || 0;
          
          // More lenient check for ad detection:
          // 1. Iframe has a valid src (not blank, not about:blank)
          // 2. Iframe has any dimensions (reduced from 50px to 30px for smaller banners)
          // 3. Iframe src contains ad network domain OR starts with http
          const hasValidSrc = iframeSrc && 
                            iframeSrc !== 'about:blank' && 
                            !iframeSrc.includes('about:') &&
                            (iframeSrc.includes('adsterra') || 
                             iframeSrc.includes('highperformanceformat') ||
                             iframeSrc.includes('effectivegate') ||
                             iframeSrc.includes('adsterra.net') ||
                             iframeSrc.startsWith('http'));
          
          // Reduced minimum size for smaller banners (468x60, 320x50)
          // This helps detect ads that might be loading in smaller containers
          const minSize = Math.min(height, width) < 100 ? 30 : 50;
          const hasSubstantialSize = iframeHeight >= minSize && iframeWidth >= minSize;
          
          // Additional check: Make sure iframe is actually visible and has content
          // Some iframes might have dimensions but no actual content
          const isVisible = iframe.style.display !== 'none' && 
                           iframe.style.visibility !== 'hidden' &&
                           iframe.offsetHeight > 0 &&
                           iframe.offsetWidth > 0;
          
          // More lenient: Check if iframe exists and has any src (even if small)
          // This helps catch ads that are loading but haven't reached full size yet
          if ((hasValidSrc && hasSubstantialSize && isVisible) || 
              (iframeSrc && iframeSrc !== 'about:blank' && iframeHeight > 20 && iframeWidth > 20)) {
            // Mark as loaded immediately (more lenient for smaller banners)
            if (!adLoadedRef.current) {
              adLoadedRef.current = true;
              setAdLoaded(true);
              setLoading(false);
              if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
                checkIntervalRef.current = null;
              }
              // Debug log (only in development)
              if (process.env.NODE_ENV === 'development') {
                console.log(`✅ Ad loaded: ${label} (${width}x${height})`, {
                  src: iframeSrc,
                  dimensions: `${iframeWidth}x${iframeHeight}`
                });
              }
            }
            return;
          }
        }
        
        // Don't check for non-script children - ads should be in iframes
        // This prevents false positives from scripts or other elements
      } catch (e) {
        // Continue checking on error (cross-origin iframe access errors are normal)
        // Don't log errors as they're expected with cross-origin iframes
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
          // Check if ad is already loaded - if so, don't reinitialize
          if (adLoadedRef.current) {
            return;
          }

          // Check if script already exists globally (safely)
          let existingScript = null;
          try {
            existingScript = document.querySelector(`script[src*="${adKey}"]`);
            // Also check if container already has an iframe with valid src
            const existingIframe = container.querySelector('iframe');
            if (existingIframe && existingIframe.src && existingIframe.src !== 'about:blank' && !existingIframe.src.includes('about:') && existingIframe.offsetHeight > 0) {
              // Ad already loaded, don't reinitialize
              adLoadedRef.current = true;
              setAdLoaded(true);
              setLoading(false);
              return;
            }
          } catch (e) {
            // Ignore querySelector errors
          }

          // Only clear container if no ad is present
          if (!existingScript) {
            container.innerHTML = '';
          } else {
            // Script exists but ad might not be loaded yet, don't clear
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
            // Wait at least 2 seconds after script loads before checking
            // Ads need time to render in iframes
            setTimeout(() => {
              checkForAd();
              if (!checkIntervalRef.current) {
                // Check every 1 second (slower than before to reduce false positives)
                checkIntervalRef.current = setInterval(checkForAd, 1000);
              }
            }, 2000);
          };

          invokeScript.onerror = () => {
            // Don't set error state - keep checking for ads
            // Sometimes ads load even after script error
            setTimeout(() => {
              checkForAd();
              if (!checkIntervalRef.current) {
                checkIntervalRef.current = setInterval(checkForAd, 1000);
              }
            }, 2000);
          };
          
          // Start checking after a delay (ads need time to load)
          // Don't check too early to avoid false positives
          setTimeout(() => {
            if (!adLoadedRef.current && !checkIntervalRef.current) {
              checkForAd();
              checkIntervalRef.current = setInterval(checkForAd, 1000);
            }
          }, 3000);

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
              // But wait longer to avoid false positives
              setTimeout(() => {
                if (!checkIntervalRef.current && containerRef.current && !adLoadedRef.current) {
                  checkForAd();
                  checkIntervalRef.current = setInterval(checkForAd, 1000);
                }
              }, 3000);
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

  // Don't show loader - just show empty placeholder if ad doesn't load
  // This prevents the infinity symbol from appearing when ads don't load
  const showLoader = false; // Always hide loader - let ads show naturally

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
        {/* No loader - just show empty placeholder if ad doesn't load */}
        {/* The transparent border will be visible when no ad is present */}
      </div>
    </div>
  );
}

