'use client';

import { useEffect, useRef } from 'react';

interface AntiAdblockSmartlinkProps {
  url: string;
  enabled?: boolean;
}

/**
 * Anti-Adblock Smartlink Component
 * Loads a popunder/smartlink ad that opens in a new window when user interacts with the page
 * This is typically used as an anti-adblock solution
 */
export default function AntiAdblockSmartlink({ 
  url, 
  enabled = true 
}: AntiAdblockSmartlinkProps) {
  const loadedRef = useRef(false);
  const clickHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);

  useEffect(() => {
    // Only load once and if enabled
    if (!enabled || loadedRef.current || typeof window === 'undefined') {
      return;
    }

    // Don't load in development to avoid popunders during development
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    // Create a function to open the popunder
    // Popunder ads typically open on user interaction (click)
    const openPopunder = (e: MouseEvent) => {
      // Skip if user clicked on interactive elements
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea')
      ) {
        return;
      }

      // Only open once per session to avoid being intrusive
      if (sessionStorage.getItem('popunder-opened')) {
        return;
      }

      try {
        // Open popunder - this is a standard popunder implementation
        // The popunder opens in a new window but stays behind the main window
        const popunder = window.open(url, '_blank', 'noopener,noreferrer');
        if (popunder) {
          // Immediately blur and move popunder behind main window
          popunder.blur();
          // Focus back on the main window (popunder stays in background)
          window.focus();
          
          // Mark as opened in this session
          sessionStorage.setItem('popunder-opened', 'true');
          
          // Remove click handler after first successful open
          if (clickHandlerRef.current) {
            document.removeEventListener('click', clickHandlerRef.current, true);
            clickHandlerRef.current = null;
          }
          
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Popunder opened successfully');
          }
        }
      } catch (err) {
        // Silently fail if popup blocked
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Popunder blocked by browser:', err);
        }
      }
    };

    // Add click handler after a delay to avoid interfering with initial page load
    // Popunder should activate after user has had time to interact with the page
    const timeoutId = setTimeout(() => {
      // Only add listener if not already opened in this session
      if (!sessionStorage.getItem('popunder-opened')) {
        clickHandlerRef.current = openPopunder;
        // Use capture phase (true) to catch clicks early, before other handlers
        document.addEventListener('click', openPopunder, true);
        loadedRef.current = true;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🎯 Popunder click handler activated');
        }
      }
    }, 5000); // Wait 5 seconds after page load - gives user time to interact naturally

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      if (clickHandlerRef.current) {
        document.removeEventListener('click', clickHandlerRef.current, true);
        clickHandlerRef.current = null;
      }
    };
  }, [url, enabled]);

  // This component doesn't render anything visible
  return null;
}

