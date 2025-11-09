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
        // Check for iframe - ads are loaded in iframes
        const iframe = container.querySelector('iframe');
        
        // Also check for any script tags that might indicate ad loading
        const scripts = container.querySelectorAll('script');
        const hasAdScripts = scripts.length >= 2; // options script + invoke script
        
        if (iframe) {
          const iframeSrc = iframe.src || (iframe as any).getAttribute('src') || '';
          const iframeHeight = iframe.offsetHeight || (iframe as any).clientHeight || 0;
          const iframeWidth = iframe.offsetWidth || (iframe as any).clientWidth || 0;
          
          // Debug log for iframe detection
          if (process.env.NODE_ENV === 'development' && !adLoadedRef.current) {
            console.log(`🔍 Checking ad: ${label}`, {
              iframeSrc: iframeSrc.substring(0, 100),
              dimensions: `${iframeWidth}x${iframeHeight}`,
              hasScripts: hasAdScripts
            });
          }
          
          // VERY LENIENT check for ad detection:
          // 1. Iframe exists with any src (even if blank initially)
          // 2. Iframe has any dimensions (even very small)
          // 3. OR iframe src contains ad network domain
          const hasAnySrc = iframeSrc && iframeSrc !== '';
          const hasAnySize = iframeHeight > 10 || iframeWidth > 10;
          
          // Check if src contains ad network domains
          const hasAdDomain = iframeSrc && (
            iframeSrc.includes('adsterra') || 
            iframeSrc.includes('highperformanceformat') ||
            iframeSrc.includes('effectivegate') ||
            iframeSrc.includes('adsterra.net') ||
            iframeSrc.includes('adstera') ||
            iframeSrc.startsWith('http') ||
            iframeSrc.startsWith('https')
          );
          
          // Check if iframe is visible (not hidden)
          const isVisible = iframe.style.display !== 'none' && 
                           iframe.style.visibility !== 'hidden';
          
          // ULTRA LENIENT: For 728x90 banner, if scripts are loaded and iframe exists, consider it loaded
          // Even if iframe is small or src is blank initially, it might be loading
          if (iframe && hasAdScripts) {
            // For large banners (728x90, 468x60), be EXTREMELY lenient
            // If scripts are loaded and iframe exists, show it immediately (even if blank)
            if (width >= 700 || (width >= 400 && width < 500)) {
              // For 728x90 and 468x60: If iframe exists with scripts loaded, show it
              // Don't wait for content - iframe existence means ad is loading
              if (!adLoadedRef.current) {
                // Mark as loaded immediately - iframe existence is enough
                adLoadedRef.current = true;
                setAdLoaded(true);
                setLoading(false);
                if (checkIntervalRef.current) {
                  clearInterval(checkIntervalRef.current);
                  checkIntervalRef.current = null;
                }
                
                // Make container and all parents visible
                const makeVisible = () => {
                  // Make container visible first
                  if (container) {
                    container.style.display = 'block';
                    container.style.visibility = 'visible';
                    container.style.minHeight = `${height}px`;
                    container.style.width = '100%';
                    container.style.position = 'relative';
                  }
                  
                  // Walk up the DOM tree and make all parents visible
                  let element: HTMLElement | null = container.parentElement;
                  while (element) {
                    if (element.style.display === 'none') {
                      element.style.display = 'block';
                      element.style.visibility = 'visible';
                      element.style.position = 'relative';
                      
                      // Add proper styling for ad container parent
                      if (element.id === 'ad-728x90-container' || element.getAttribute('data-ad-container')) {
                        element.style.width = '100%';
                        element.style.minHeight = `${height + 40}px`;
                        element.style.margin = '1rem 0';
                        element.style.padding = '1rem 0';
                      }
                    }
                    element = element.parentElement;
                  }
                  
                  // Also check if container has specific ID (728x90 container)
                  const adContainer = document.getElementById('ad-728x90-container');
                  if (adContainer) {
                    adContainer.style.display = 'block';
                    adContainer.style.visibility = 'visible';
                    adContainer.style.width = '100%';
                    adContainer.style.minHeight = `${height + 40}px`;
                    adContainer.style.margin = '1rem 0';
                    adContainer.style.padding = '1rem 0';
                    
                    // Add wrapper styling
                    const wrapper = adContainer.querySelector('.flex');
                    if (wrapper) {
                      (wrapper as HTMLElement).style.display = 'flex';
                      (wrapper as HTMLElement).style.justifyContent = 'center';
                      (wrapper as HTMLElement).style.width = '100%';
                    }
                  }
                };
                
                // Make visible immediately
                makeVisible();
                
                // Also try after delays in case DOM wasn't ready
                setTimeout(makeVisible, 100);
                setTimeout(makeVisible, 500);
                setTimeout(makeVisible, 1000);
                setTimeout(makeVisible, 2000);
                
                if (process.env.NODE_ENV === 'development') {
                  console.log(`✅ Ad detected (${width >= 700 ? '728x90' : '468x60'}): ${label}`, {
                    src: iframeSrc ? iframeSrc.substring(0, 100) : 'no src',
                    dimensions: `${iframeWidth}x${iframeHeight}`,
                    hasScripts: hasAdScripts,
                    containerVisible: container.style.display !== 'none'
                  });
                }
              }
              return;
            }
            
            // For other sizes (300x250, 320x50), use lenient checks
            // Also apply same logic to 468x60 if not caught above
            if (hasAdDomain || (hasAnySrc && hasAnySize && isVisible) || (iframe && hasAdScripts && iframeHeight > 5)) {
              if (!adLoadedRef.current) {
                adLoadedRef.current = true;
                setAdLoaded(true);
                setLoading(false);
                if (checkIntervalRef.current) {
                  clearInterval(checkIntervalRef.current);
                  checkIntervalRef.current = null;
                }
                if (process.env.NODE_ENV === 'development') {
                  console.log(`✅ Ad detected: ${label} (${width}x${height})`, {
                    src: iframeSrc ? iframeSrc.substring(0, 100) : 'no src',
                    dimensions: `${iframeWidth}x${iframeHeight}`,
                    hasAdDomain: hasAdDomain,
                    hasAnySize: hasAnySize
                  });
                }
              }
              return;
            }
            
            // Additional check for 468x60: If iframe exists with any content, show it
            if (width >= 400 && width < 500 && iframe && hasAdScripts) {
              // For 468x60, be very lenient - if iframe exists, show it
              if (!adLoadedRef.current && (iframeHeight > 0 || iframeWidth > 0 || iframeSrc)) {
                adLoadedRef.current = true;
                setAdLoaded(true);
                setLoading(false);
                if (checkIntervalRef.current) {
                  clearInterval(checkIntervalRef.current);
                  checkIntervalRef.current = null;
                }
                if (process.env.NODE_ENV === 'development') {
                  console.log(`✅ Ad detected (468x60): ${label}`, {
                    src: iframeSrc ? iframeSrc.substring(0, 100) : 'no src',
                    dimensions: `${iframeWidth}x${iframeHeight}`
                  });
                }
                return;
              }
            }
          }
          
          // If scripts are loaded, keep checking - ad might be loading slowly
          if (hasAdScripts && !adLoadedRef.current) {
            // For 728x90 and 468x60, if scripts are loaded, wait a bit and check again
            // Sometimes iframe is created but not immediately accessible
            if (width >= 700 || (width >= 400 && width < 500)) {
              // Wait and check again - iframe might be created soon
              setTimeout(() => {
                const retryIframe = container.querySelector('iframe');
                if (retryIframe && !adLoadedRef.current) {
                  // Iframe found on retry - show it immediately
                  adLoadedRef.current = true;
                  setAdLoaded(true);
                  setLoading(false);
                  if (checkIntervalRef.current) {
                    clearInterval(checkIntervalRef.current);
                    checkIntervalRef.current = null;
                  }
                  
                  // Make visible (for 728x90)
                  const adContainer = document.getElementById('ad-728x90-container');
                  if (adContainer) {
                    adContainer.style.display = 'block';
                    adContainer.style.visibility = 'visible';
                  }
                }
              }, 2000);
            }
            
            // Continue checking - don't give up
            if (process.env.NODE_ENV === 'development') {
              console.log(`⏳ Ad scripts loaded, checking for iframe: ${label}`, {
                hasIframe: !!iframe,
                iframeSrc: iframe ? (iframe.src || '').substring(0, 50) : 'none',
                width: width,
                height: height
              });
            }
          }
        } else if (hasAdScripts) {
          // Scripts are loaded but no iframe yet - ad might be loading
          // For 728x90 and 468x60, wait longer as ads might load slowly
          if (width >= 700 || (width >= 400 && width < 500)) {
            // Keep checking for longer - these banner ads might take time
            if (process.env.NODE_ENV === 'development') {
              console.log(`⏳ Ad scripts loaded, waiting for iframe (${width >= 700 ? '728x90' : '468x60'}): ${label}`);
            }
          } else {
            if (process.env.NODE_ENV === 'development') {
              console.log(`⏳ Ad scripts loaded, waiting for iframe: ${label}`);
            }
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
          // Use simple global atOptions (Adsterra expects this format)
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
          invokeScript.defer = false; // Don't defer - load immediately
          invokeScript.crossOrigin = 'anonymous';
          
          // Debug: Log script URL
          if (process.env.NODE_ENV === 'development') {
            console.log(`📡 Loading ad script for ${label}:`, `https://www.highperformanceformat.com/${adKey}/invoke.js`);
          }
          
          // For 728x90 and 468x60, load immediately - these banners need faster loading
          // This ensures ads load quickly and are detected properly
          if (width >= 700 || (width >= 400 && width < 500)) {
            // Make sure container is accessible
            container.style.position = 'relative';
            container.style.minHeight = `${height}px`;
            
            // Append scripts immediately (no delay for these sizes)
            container.appendChild(optionsScript);
            container.appendChild(invokeScript);
            scriptLoadedRef.current = true;
            
            // Start checking immediately and frequently
            const checkInterval = width >= 700 ? 300 : 400; // 300ms for 728x90, 400ms for 468x60
            setTimeout(() => {
              checkForAd();
              if (!checkIntervalRef.current) {
                checkIntervalRef.current = setInterval(checkForAd, checkInterval);
              }
            }, 300); // Start checking very soon
            
            // Also set up onload handlers for immediate detection
            invokeScript.onload = () => {
              if (process.env.NODE_ENV === 'development') {
                console.log(`✅ Script loaded for ${label} (${adKey})`);
              }
              // Check immediately after script loads
              setTimeout(() => {
                checkForAd();
                if (!checkIntervalRef.current) {
                  checkIntervalRef.current = setInterval(checkForAd, checkInterval);
                }
              }, 200);
            };
            
            invokeScript.onerror = () => {
              // Keep checking even on error
              setTimeout(() => {
                checkForAd();
                if (!checkIntervalRef.current) {
                  checkIntervalRef.current = setInterval(checkForAd, checkInterval);
                }
              }, 500);
            };
            
            return; // Skip the regular delay for these banner sizes
          }

          // Check for iframe after script loads
          invokeScript.onload = () => {
            // Debug log for script load
            if (process.env.NODE_ENV === 'development') {
              console.log(`✅ Script loaded for ${label} (${adKey})`);
            }
            // Start checking immediately after script loads
            // Check more frequently for 728x90 ads (they might load slower)
            const checkInterval = width >= 700 ? 300 : 500;
            setTimeout(() => {
              checkForAd();
              if (!checkIntervalRef.current) {
                checkIntervalRef.current = setInterval(checkForAd, checkInterval);
              }
            }, 500); // Start checking sooner
          };

          invokeScript.onerror = () => {
            // Debug log for script error
            if (process.env.NODE_ENV === 'development') {
              console.warn(`⚠️ Script load error for ${label} (${adKey})`);
            }
            // Don't set error state - keep checking for ads
            // Sometimes ads load even after script error
            const checkInterval = width >= 700 ? 300 : 500;
            setTimeout(() => {
              checkForAd();
              if (!checkIntervalRef.current) {
                checkIntervalRef.current = setInterval(checkForAd, checkInterval);
              }
            }, 500);
          };
          
          // Start checking after script injection
          // For 728x90 and 468x60, check more frequently and for longer
          const isLargeBanner = width >= 700 || (width >= 400 && width < 500);
          const initialDelay = isLargeBanner ? 1000 : 2000;
          const checkInterval = isLargeBanner ? (width >= 700 ? 300 : 400) : 500;
          setTimeout(() => {
            if (!adLoadedRef.current && !checkIntervalRef.current) {
              checkForAd();
              checkIntervalRef.current = setInterval(checkForAd, checkInterval);
              
              // For 728x90 and 468x60, check for up to 30 seconds (ads might load slowly)
              if (isLargeBanner) {
                setTimeout(() => {
                  if (checkIntervalRef.current && !adLoadedRef.current) {
                    clearInterval(checkIntervalRef.current);
                    checkIntervalRef.current = null;
                    // Final check
                    checkForAd();
                  }
                }, 30000); // Check for 30 seconds
              }
            }
          }, initialDelay);

          // Append scripts to container (only if not already appended for 728x90)
          if (!scriptLoadedRef.current) {
            container.appendChild(optionsScript);
            container.appendChild(invokeScript);
            scriptLoadedRef.current = true;
          }

        } catch (err) {
          // Silently fail - don't log in production
          // Keep loading state true so loader continues showing
          if (process.env.NODE_ENV === 'development') {
            console.error(`Ad initialization error for ${label}:`, err);
          }
              // Don't set error to true - keep trying to load
              // Start checking anyway in case ad loads from elsewhere
              setTimeout(() => {
                if (!checkIntervalRef.current && containerRef.current && !adLoadedRef.current) {
                  checkForAd();
                  checkIntervalRef.current = setInterval(checkForAd, 500);
                }
              }, 2000);
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

  // Always render the container
  // For 728x90, container might be hidden initially but will show when ad loads
  const containerStyle: React.CSSProperties = {
    minHeight: `${height}px`, 
    width: '100%',
    maxWidth: `${width}px`,
    margin: '0 auto',
    position: 'relative',
    backgroundColor: 'transparent',
    background: 'transparent',
    // Container is always rendered, visibility controlled by parent or adLoaded state
    display: 'block',
    visibility: 'visible'
  };

  return (
    <div className="w-full" style={{ minHeight: `${height}px`, position: 'relative' }}>
      <div 
        ref={containerRef}
        className={`ad-container-transparent rounded-lg ${className}`}
        style={containerStyle}
        data-ad-key={adKey}
        data-ad-label={label}
        data-ad-width={width}
        data-ad-height={height}
      >
        {/* Ad scripts will be injected here and should create iframe */}
        {/* When ad loads, it will automatically become visible */}
      </div>
    </div>
  );
}

