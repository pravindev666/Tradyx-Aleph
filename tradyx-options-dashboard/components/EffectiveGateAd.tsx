'use client';

import { useEffect, useRef, useState } from 'react';

type EffectiveGateAdProps = {
  className?: string;
};

export default function EffectiveGateAd({ className = '' }: EffectiveGateAdProps) {
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
    if (container.querySelector('script[src*="effectivegatecpm"]')) {
      scriptLoadedRef.current = true;
      return;
    }

    // Load ad script
    const loadAd = () => {
      if (!container || scriptLoadedRef.current) return;

      // Double-check container is still in DOM
      if (!document.contains(container)) {
        console.warn('EffectiveGate ad container removed from DOM before ad could load');
        return;
      }

      try {
        // Create container div FIRST (ad script looks for this by ID)
        const adContainer = document.createElement('div');
        adContainer.id = 'container-1aebc3db7e036cadd6ff6b71bf70649b';
        
        // Create and configure the ad script
        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = 'https://pl28016046.effectivegatecpm.com/1aebc3db7e036cadd6ff6b71bf70649b/invoke.js';
        
        // Add error handler
        script.onerror = () => {
          console.debug('[Ad Debug] EffectiveGate ad script failed to load');
        };
        
        script.onload = () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Ad Debug] EffectiveGate ad script loaded successfully');
          }
        };
        
        // Append container FIRST, then script
        // Order matters: container must exist before script loads
        container.appendChild(adContainer);
        container.appendChild(script);
        
        scriptLoadedRef.current = true;

        // Debug log
        if (process.env.NODE_ENV === 'development') {
          console.log('[Ad Debug] Loading EffectiveGate ad in container', container);
        }

      } catch (error) {
        console.error('[Ad Error] Failed to load EffectiveGate ad:', error);
      }
    };

    // Wait for next frame to ensure React has finished rendering
    const timeoutId = setTimeout(() => {
      if (containerRef.current && document.contains(containerRef.current)) {
        loadAd();
      }
    }, 200);

    return () => {
      clearTimeout(timeoutId);
    };

  }, [mounted]);

  // Render container
  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        display: 'block',
        margin: '0 auto',
        position: 'relative',
        minHeight: '50px',
        textAlign: 'center'
      }}
      suppressHydrationWarning
    />
  );
}

