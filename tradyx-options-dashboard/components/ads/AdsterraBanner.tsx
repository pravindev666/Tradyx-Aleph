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
  const mutationObserverRef = useRef<MutationObserver | null>(null);

  // Set mounted flag after hydration to avoid hydration mismatch
  // Load ads immediately after hydration
  useEffect(() => {
    // Load immediately - no delay needed
    setMounted(true);
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

    // Check if container is already marked as loaded (persistent check)
    if (containerRef.current) {
      const container = containerRef.current;
      if (container.getAttribute('data-ad-loaded') === 'true') {
        // Container is marked as loaded - verify iframe still exists
        const existingIframe = container.querySelector('iframe[data-ad-iframe="true"]');
        if (existingIframe) {
          // Iframe exists and is marked - ad is loaded
          if (!adLoadedRef.current) {
            adLoadedRef.current = true;
            setAdLoaded(true);
            setLoading(false);
          }
          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ Ad already loaded (persistent check): ${label}`);
          }
          return;
        } else {
          // Container marked but iframe missing - might have been removed
          // Remove the marker and allow re-initialization
          container.removeAttribute('data-ad-loaded');
          if (process.env.NODE_ENV === 'development') {
            console.log(`⚠️ Container marked loaded but iframe missing, resetting: ${label}`);
          }
        }
      }
    }

    // If ad is already loaded, don't do anything
    if (adLoadedRef.current || adLoaded) {
      setLoading(false);
      return;
    }

    // Prevent duplicate loading
    if (loadAttemptedRef.current || scriptLoadedRef.current) {
      // But check if container is marked - if so, we're done
      if (containerRef.current?.getAttribute('data-ad-loaded') === 'true') {
        return;
      }
    }

    // Continuous check for ad loading - keep checking until ad loads
    // Defined outside initAd so it can be referenced in catch block
    const checkForAd = () => {
      const container = containerRef.current;
      if (!container) {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
        return;
      }
      
      // CRITICAL: If ad was loaded but iframe disappeared, detect and restore
      if (adLoadedRef.current || container.getAttribute('data-ad-loaded') === 'true') {
        const existingIframe = container.querySelector('iframe[data-ad-iframe="true"]');
        if (!existingIframe) {
          // Ad was marked as loaded but iframe is missing - it might have been removed
          // Check for any iframe (might have been recreated without our marker)
          const anyIframe = container.querySelector('iframe');
          if (!anyIframe || (anyIframe && (!anyIframe.src || anyIframe.src === 'about:blank'))) {
            // No valid iframe - ad disappeared, reset and allow re-initialization
            if (process.env.NODE_ENV === 'development') {
              console.warn(`⚠️ Ad iframe disappeared for ${label}, resetting...`);
            }
            container.removeAttribute('data-ad-loaded');
            adLoadedRef.current = false;
            setAdLoaded(false);
            setLoading(true);
            // Don't return - continue to check/reinitialize
          } else {
            // Iframe exists but not marked - mark it
            anyIframe.setAttribute('data-ad-iframe', 'true');
            anyIframe.setAttribute('data-ad-key', adKey);
          }
        }
      }
      
      // If ad is loaded and iframe exists, stop checking
      if (adLoadedRef.current && container.querySelector('iframe[data-ad-iframe="true"]')) {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
        return;
      }
      
      try {
        // Check for iframe - ads might be loaded in iframes (for iframe format)
        const iframe = container.querySelector('iframe');
        
        // Check for ANY content in container (Adsterra might inject various elements)
        const hasAnyContent = container.children.length > 2; // More than just the 2 scripts we added
        const hasAnyVisibleContent = Array.from(container.children).some((child) => {
          const el = child as HTMLElement;
          return el.tagName !== 'SCRIPT' && 
                 (el.offsetHeight > 0 || el.offsetWidth > 0 || 
                  el.style.display !== 'none' || el.style.visibility !== 'hidden');
        });
        
        // Check for native ad content (divs, images, links) - native format injects directly
        const nativeAdContent = container.querySelector('a[href*="adsterra"]') || 
                                container.querySelector('a[href*="honeywhyvowel"]') ||
                                container.querySelector('img[src*="adsterra"]') ||
                                container.querySelector('img[src*="honeywhyvowel"]') ||
                                container.querySelector('div[id*="ad"]') ||
                                container.querySelector('div[class*="ad"]') ||
                                container.querySelector('div[style*="display"]') ||
                                container.querySelector('span[style*="display"]');
        
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
            iframeSrc.includes('honeywhyvowel') ||
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
          
          // Check for ANY content first - if scripts loaded and container has content, ad is likely loaded
          if (hasAdScripts && (hasAnyContent || hasAnyVisibleContent || nativeAdContent)) {
            // Content detected - mark as loaded immediately
            if (!adLoadedRef.current) {
              adLoadedRef.current = true;
              setAdLoaded(true);
              setLoading(false);
              if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
                checkIntervalRef.current = null;
              }
              container.setAttribute('data-ad-loaded', 'true');
              container.setAttribute('data-ad-key', adKey);
              console.log(`✅ Ad content detected: ${label}`, {
                hasIframe: !!iframe,
                hasNativeContent: !!nativeAdContent,
                hasAnyContent: hasAnyContent,
                childrenCount: container.children.length
              });
            }
            return;
          }
          
          // Check for native ad content (native format works better)
          if (nativeAdContent && hasAdScripts) {
            // Native ad content detected - mark as loaded immediately
            if (!adLoadedRef.current) {
              adLoadedRef.current = true;
              setAdLoaded(true);
              setLoading(false);
              if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
                checkIntervalRef.current = null;
              }
              container.setAttribute('data-ad-loaded', 'true');
              container.setAttribute('data-ad-key', adKey);
              console.log(`✅ Native ad content detected: ${label}`);
            }
            return;
          }
          
          // ULTRA LENIENT: If scripts are loaded and iframe exists (even if blank), consider it loaded
          // Adsterra creates iframes even if they're initially blank - they populate later
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
                
                // CRITICAL: Lock the container to prevent re-initialization
                container.setAttribute('data-ad-loaded', 'true');
                container.setAttribute('data-ad-key', adKey);
                
                // Lock the iframe - prevent it from being removed
                if (iframe) {
                  iframe.setAttribute('data-ad-iframe', 'true');
                  iframe.setAttribute('data-ad-key', adKey);
                  // Ensure iframe styles are locked
                  iframe.style.display = 'block';
                  iframe.style.visibility = 'visible';
                  iframe.style.width = width >= 700 ? '728px' : '468px';
                  iframe.style.height = `${height}px`;
                  iframe.style.minHeight = `${height}px`;
                  iframe.style.maxHeight = `${height}px`;
                  iframe.style.border = 'none';
                  iframe.style.margin = '0';
                  iframe.style.padding = '0';
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
                    // Prevent container from being cleared
                    container.style.pointerEvents = 'auto';
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
                  console.log(`✅ Ad detected and LOCKED (${width >= 700 ? '728x90' : '468x60'}): ${label}`, {
                    src: iframeSrc ? iframeSrc.substring(0, 100) : 'no src',
                    dimensions: `${iframeWidth}x${iframeHeight}`,
                    hasScripts: hasAdScripts,
                    containerVisible: container.style.display !== 'none',
                    containerLocked: container.getAttribute('data-ad-loaded') === 'true'
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
            // Also prevent re-initialization once ad is loaded
            if (width >= 400 && width < 500 && iframe && hasAdScripts) {
              // For 468x60, be very lenient - if iframe exists, show it
              // Also check if iframe has any src attribute (even if blank initially)
              const iframeHasSrc = iframe.src && iframe.src !== '' && iframe.src !== 'about:blank';
              const iframeHasDimensions = iframeHeight > 0 || iframeWidth > 0;
              const iframeExists = iframe && iframe.offsetParent !== null; // Check if visible
              
              if (!adLoadedRef.current && (iframeHasDimensions || iframeHasSrc || iframeExists)) {
                adLoadedRef.current = true;
                setAdLoaded(true);
                setLoading(false);
                if (checkIntervalRef.current) {
                  clearInterval(checkIntervalRef.current);
                  checkIntervalRef.current = null;
                }
                
                // IMPORTANT: Lock the container - prevent any future clearing
                // Mark container with data attribute to prevent re-initialization
                container.setAttribute('data-ad-loaded', 'true');
                container.setAttribute('data-ad-key', adKey);
                
                // Ensure iframe stays visible
                iframe.style.display = 'block';
                iframe.style.visibility = 'visible';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.minHeight = `${height}px`;
                
                if (process.env.NODE_ENV === 'development') {
                  console.log(`✅ Ad detected (468x60): ${label}`, {
                    src: iframeSrc ? iframeSrc.substring(0, 100) : 'no src',
                    dimensions: `${iframeWidth}x${iframeHeight}`,
                    hasSrc: iframeHasSrc,
                    hasDimensions: iframeHasDimensions,
                    isVisible: iframeExists
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
          // Scripts are loaded - check for ANY content (Adsterra might inject content in various ways)
          if (hasAnyContent || hasAnyVisibleContent || nativeAdContent) {
            // Content found - mark as loaded
            if (!adLoadedRef.current) {
              adLoadedRef.current = true;
              setAdLoaded(true);
              setLoading(false);
              if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
                checkIntervalRef.current = null;
              }
              container.setAttribute('data-ad-loaded', 'true');
              container.setAttribute('data-ad-key', adKey);
              console.log(`✅ Ad content detected (no iframe): ${label}`, {
                hasAnyContent: hasAnyContent,
                hasVisibleContent: hasAnyVisibleContent,
                hasNativeContent: !!nativeAdContent,
                childrenCount: container.children.length
              });
            }
            return;
          }
          
          // Scripts are loaded but no content yet - log what we're seeing for debugging
          console.log(`⏳ Ad scripts loaded, waiting for content: ${label}`, {
            childrenCount: container.children.length,
            hasIframe: false,
            scriptCount: scripts.length,
            containerHTML: container.innerHTML.substring(0, 200)
          });
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
      
      const container = containerRef.current;
      
      // CRITICAL: Check if ad is already loaded and marked - don't reinitialize
      if (container.getAttribute('data-ad-loaded') === 'true') {
        if (process.env.NODE_ENV === 'development') {
          console.log(`⏭️ Skipping initialization - ad already loaded: ${label}`);
        }
        // Mark as loaded in state
        if (!adLoadedRef.current) {
          adLoadedRef.current = true;
          setAdLoaded(true);
          setLoading(false);
        }
        return;
      }
      
      // Check if iframe already exists - if so, mark as loaded and don't reinitialize
      const existingIframe = container.querySelector('iframe');
      if (existingIframe && existingIframe.src && existingIframe.src !== 'about:blank') {
        // Ad iframe exists - mark as loaded and prevent re-initialization
        container.setAttribute('data-ad-loaded', 'true');
        container.setAttribute('data-ad-key', adKey);
        adLoadedRef.current = true;
        setAdLoaded(true);
        setLoading(false);
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Ad already present, marking as loaded: ${label}`);
        }
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

          // CRITICAL CHECK: If container is marked as loaded, never reinitialize
          if (container.getAttribute('data-ad-loaded') === 'true') {
            if (process.env.NODE_ENV === 'development') {
              console.log(`⏭️ Container marked as loaded, skipping: ${label}`);
            }
            return;
          }
          
          // Check if script already exists globally (safely)
          let existingScript = null;
          try {
            existingScript = document.querySelector(`script[src*="${adKey}"]`);
            // Also check if container already has an iframe with valid src
            const existingIframe = container.querySelector('iframe');
            if (existingIframe) {
              // Iframe exists - check if it's a real ad
              const iframeSrc = existingIframe.src || '';
              const iframeHeight = existingIframe.offsetHeight || 0;
              
              // If iframe has src or dimensions, it's likely an ad - don't clear it
              if (iframeSrc !== 'about:blank' || iframeHeight > 0) {
                // Ad already loaded, mark it and don't reinitialize
                container.setAttribute('data-ad-loaded', 'true');
                container.setAttribute('data-ad-key', adKey);
                adLoadedRef.current = true;
                setAdLoaded(true);
                setLoading(false);
                
                // Ensure iframe stays visible
                existingIframe.style.display = 'block';
                existingIframe.style.visibility = 'visible';
                
                if (process.env.NODE_ENV === 'development') {
                  console.log(`✅ Ad iframe exists, marking as loaded: ${label}`, {
                    src: iframeSrc.substring(0, 50),
                    height: iframeHeight
                  });
                }
                return;
              }
            }
          } catch (e) {
            // Ignore querySelector errors
          }

          // Only clear container if:
          // 1. No existing script for this ad
          // 2. No iframe exists
          // 3. Container is not marked as loaded
          const existingIframeCheck = container.querySelector('iframe');
          if (!existingScript && !existingIframeCheck && container.getAttribute('data-ad-loaded') !== 'true') {
            // Safe to clear - no ad content exists
            container.innerHTML = '';
          } else {
            // Something exists - don't clear, don't reinitialize
            if (process.env.NODE_ENV === 'development') {
              console.log(`⏭️ Skipping clear - ad content exists: ${label}`, {
                hasScript: !!existingScript,
                hasIframe: !!existingIframeCheck,
                isMarkedLoaded: container.getAttribute('data-ad-loaded') === 'true'
              });
            }
            return;
          }

          // Create options script - EXACT format from Adsterra (no modifications)
          const optionsScript = document.createElement('script');
          optionsScript.type = 'text/javascript';
          // Use EXACT format as provided by Adsterra - don't modify quotes or spacing
          optionsScript.innerHTML = `atOptions = {
	'key' : '${adKey}',
	'format' : 'iframe',
	'height' : ${height},
	'width' : ${width},
	'params' : {}
};`;
          
          // Create invoke script - EXACT format from Adsterra
          const invokeScript = document.createElement('script');
          invokeScript.type = 'text/javascript';
          // Use protocol-relative URL exactly as Adsterra provides (//honeywhyvowel.com)
          invokeScript.src = `//honeywhyvowel.com/${adKey}/invoke.js`;
          // Don't add async/defer/crossOrigin - use exactly as Adsterra provides
          
          // Debug: Log script URL
          console.log(`📡 Loading ad script (exact Adsterra format):`, `//honeywhyvowel.com/${adKey}/invoke.js`);
          console.log(`   Ad Key: ${adKey}, Size: ${width}x${height}, Format: iframe`);
          
          // For 728x90 and 468x60, load immediately - these banners need faster loading
          // This ensures ads load quickly and are detected properly
          if (width >= 700 || (width >= 400 && width < 500)) {
            // Make sure container is accessible
            container.style.position = 'relative';
            container.style.minHeight = `${height}px`;
            
            // Append scripts immediately (no delay for these sizes)
            // Append exactly as Adsterra expects - no modifications
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
            
            invokeScript.onerror = (error) => {
              // Log error for debugging (helps identify if script fails to load)
              console.warn(`⚠️ Ad script failed to load for ${label}:`, error);
              // Keep checking even on error - sometimes ads load despite script errors
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

          invokeScript.onerror = (error) => {
            // Log error for debugging (always log to help identify issues)
            console.warn(`⚠️ Ad script failed to load for ${label} (${adKey}):`, error);
            console.warn(`   Script URL: //honeywhyvowel.com/${adKey}/invoke.js`);
            console.warn(`   Possible causes: Ad blocker, network issue, CSP blocking, or invalid ad key`);
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

          // Append scripts to container (only if not already appended)
          // Append exactly as Adsterra expects - no wrapping, no modifications
          if (!scriptLoadedRef.current) {
            container.appendChild(optionsScript);
            container.appendChild(invokeScript);
            scriptLoadedRef.current = true;
            
            // Set up MutationObserver to watch for iframe creation/removal
            // This helps detect when Adsterra creates or removes the iframe
            if (!mutationObserverRef.current && typeof MutationObserver !== 'undefined') {
              mutationObserverRef.current = new MutationObserver((mutations) => {
                const container = containerRef.current;
                if (!container) return;
                
                // Check if iframe was added or removed
                mutations.forEach((mutation) => {
                  mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && (node as HTMLElement).tagName === 'IFRAME') {
                      const iframe = node as HTMLIFrameElement;
                      // Iframe was added - mark it immediately
                      iframe.setAttribute('data-ad-iframe', 'true');
                      iframe.setAttribute('data-ad-key', adKey);
                      container.setAttribute('data-ad-loaded', 'true');
                      
                      // Lock iframe styles
                      iframe.style.display = 'block';
                      iframe.style.visibility = 'visible';
                      iframe.style.width = width >= 700 ? '728px' : (width >= 400 ? '468px' : '100%');
                      iframe.style.height = `${height}px`;
                      iframe.style.minHeight = `${height}px`;
                      
                      // Mark as loaded
                      if (!adLoadedRef.current) {
                        adLoadedRef.current = true;
                        setAdLoaded(true);
                        setLoading(false);
                      }
                      
                      if (process.env.NODE_ENV === 'development') {
                        console.log(`✅ Iframe detected by MutationObserver for ${label}`);
                      }
                    }
                  });
                  
                  mutation.removedNodes.forEach((node) => {
                    if (node.nodeType === 1 && (node as HTMLElement).tagName === 'IFRAME') {
                      const iframe = node as HTMLIFrameElement;
                      if (iframe.getAttribute('data-ad-key') === adKey) {
                        // Our iframe was removed - reset
                        if (process.env.NODE_ENV === 'development') {
                          console.warn(`⚠️ Iframe removed for ${label}, will re-detect`);
                        }
                        container.removeAttribute('data-ad-loaded');
                        adLoadedRef.current = false;
                        setAdLoaded(false);
                        setLoading(true);
                        // Restart checking
                        setTimeout(() => {
                          checkForAd();
                          if (!checkIntervalRef.current) {
                            checkIntervalRef.current = setInterval(checkForAd, width >= 700 || (width >= 400 && width < 500) ? 400 : 500);
                          }
                        }, 1000);
                      }
                    }
                  });
                });
              });
              
              // Start observing
              mutationObserverRef.current.observe(container, {
                childList: true,
                subtree: true
              });
            }
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
        if (mutationObserverRef.current) {
          mutationObserverRef.current.disconnect();
          mutationObserverRef.current = null;
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
        if (mutationObserverRef.current) {
          mutationObserverRef.current.disconnect();
          mutationObserverRef.current = null;
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

