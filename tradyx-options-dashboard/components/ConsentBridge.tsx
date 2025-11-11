'use client';

import { useEffect } from 'react';

export default function ConsentBridge() {
  useEffect(() => {
    // Listen for custom event to re-open consent banner
    const handler = () => {
      // Clear saved consent to trigger banner to show again
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tradyxa-consent');
        // Reload page to show banner
        window.location.reload();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('tradyxa:openConsent', handler);
      return () => {
        window.removeEventListener('tradyxa:openConsent', handler);
      };
    }
  }, []);

  return null;
}

