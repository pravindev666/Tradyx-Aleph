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
      if (!target) return;
      
      // Check if clicked element or any parent is a button, link, or interactive element
      let element: HTMLElement | null = target;
      while (element && element !== document.body) {
        // Check tag name
        const tagName = element.tagName?.toUpperCase();
        if (tagName === 'BUTTON' || tagName === 'A' || tagName === 'INPUT' || 
            tagName === 'SELECT' || tagName === 'TEXTAREA') {
          return; // Don't trigger on interactive elements
        }
        
        // Check for data attribute that excludes smartlink
        if (element.hasAttribute('data-no-smartlink') || 
            element.hasAttribute('data-exclude-smartlink')) {
          return;
        }
        
        // Check for role="button"
        if (element.getAttribute('role') === 'button') {
          return;
        }
        
        // Check if element has onclick handler (indicates it's clickable)
        if (element.onclick || element.getAttribute('onclick')) {
          // But allow tiles that open modals - we want those to work
          const hasModalHandler = element.closest('[class*="tile-hover-gold"]');
          if (!hasModalHandler) {
            return;
          }
        }
        
        element = element.parentElement;
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
            document.removeEventListener('click', clickHandlerRef.current, false);
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
        // Use bubble phase (false) so button handlers run first, then we check if it was a button
        // This ensures buttons work correctly and don't trigger popunder
        document.addEventListener('click', openPopunder, false);
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
        document.removeEventListener('click', clickHandlerRef.current, false);
        clickHandlerRef.current = null;
      }
    };
  }, [url, enabled]);

  // This component doesn't render anything visible
  return null;
}

