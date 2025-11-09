'use client';

import { useEffect, useRef } from 'react';

interface AntiAdblockSmartlinkProps {
  url: string;
  enabled?: boolean;
  triggerOnButtonClick?: boolean;
  storageKey?: string; // Allow different storage keys for different smartlinks
}

/**
 * Utility function to open smartlink popunder manually
 * Can be called from buttons or other UI elements
 * @param url - The smartlink URL to open
 * @param storageKey - SessionStorage key to track if already opened (prevents multiple opens)
 * @param force - If true, opens even if already opened in this session
 */
export function openSmartlink(url: string, storageKey: string = 'popunder-opened', force: boolean = false): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Don't open in development (comment this out for testing)
  if (process.env.NODE_ENV === 'development') {
    // Uncomment below to test in development
    // console.log('Smartlink would open:', url);
    return false;
  }

  // Check if already opened (unless force is true)
  if (!force && sessionStorage.getItem(storageKey) === 'true') {
    return false;
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
      
      // Mark as opened with the specific storage key
      sessionStorage.setItem(storageKey, 'true');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Popunder opened successfully:', url);
      }
      return true;
    }
  } catch (err) {
    // Silently fail if popup blocked
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Popunder blocked by browser:', err);
    }
  }
  return false;
}

/**
 * Anti-Adblock Smartlink Component
 * Loads a popunder/smartlink ad that opens in a new window when user interacts with the page
 * This is typically used as an anti-adblock solution
 */
export default function AntiAdblockSmartlink({ 
  url, 
  enabled = true,
  triggerOnButtonClick = false,
  storageKey = 'popunder-opened'
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
      // Skip if user clicked on interactive elements (unless triggerOnButtonClick is true)
      if (!triggerOnButtonClick) {
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
      }

      // Check if already opened with this storage key
      if (sessionStorage.getItem(storageKey)) {
        return;
      }

      // Use the utility function to open
      openSmartlink(url, storageKey);
      
      // Remove click handler after first successful open
      if (clickHandlerRef.current) {
        document.removeEventListener('click', clickHandlerRef.current, true);
        clickHandlerRef.current = null;
      }
    };

    // Add click handler after a delay to avoid interfering with initial page load
    // Popunder should activate after user has had time to interact with the page
    const timeoutId = setTimeout(() => {
      // Only add listener if not already opened with this storage key
      if (!sessionStorage.getItem(storageKey)) {
        clickHandlerRef.current = openPopunder;
        // Use capture phase (true) to catch clicks early, before other handlers
        document.addEventListener('click', openPopunder, true);
        loadedRef.current = true;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🎯 Popunder click handler activated:', url);
        }
      }
    }, triggerOnButtonClick ? 0 : 5000); // No delay if triggerOnButtonClick is true

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      if (clickHandlerRef.current) {
        document.removeEventListener('click', clickHandlerRef.current, true);
        clickHandlerRef.current = null;
      }
    };
  }, [url, enabled, triggerOnButtonClick, storageKey]);

  // This component doesn't render anything visible
  return null;
}

