'use client';

import { useEffect, useState } from 'react';

type ConsentChoices = {
  analytics: boolean;
};

const KEY = 'tradyx-consent';
const defaultChoices: ConsentChoices = { analytics: false };

export default function ConsentBanner({ darkMode }: { darkMode: boolean }) {
  const [show, setShow] = useState(false);
  const [choices, setChoices] = useState<ConsentChoices>(defaultChoices);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (!saved) {
      setShow(true);
    }

    // Listen for custom event to re-open consent
    const handler = () => {
      setShow(true);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('tradyx:openConsent', handler);
      return () => {
        window.removeEventListener('tradyx:openConsent', handler);
      };
    }
  }, []);

  function updateMode(c: ConsentChoices) {
    const analytics = c.analytics ? 'granted' : 'denied';
    
    // @ts-ignore
    if (typeof window !== 'undefined' && window.gtag) {
      // @ts-ignore
      window.gtag('consent', 'update', {
        analytics_storage: analytics
      });
    }
    localStorage.setItem(KEY, JSON.stringify(c));
  }

  function acceptAll() {
    const c = { analytics: true };
    updateMode(c);
    setChoices(c);
    setShow(false);
  }

  function rejectAll() {
    const c = { analytics: false };
    updateMode(c);
    setChoices(c);
    setShow(false);
  }

  function save() {
    updateMode(choices);
    setShow(false);
  }

  if (!show) return null;

  const bgClass = darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 z-[10000] rounded-2xl border-2 ${bgClass} p-4 sm:p-5 shadow-2xl ${darkMode ? 'backdrop-blur-sm' : ''}`}>
      <div className={`text-sm sm:text-base font-semibold mb-2 ${textPrimary}`}>Cookies & Advertising Consent</div>
      <p className={`text-xs sm:text-sm ${textSecondary} mb-3`}>
        We use cookies for theme preferences and performance. Our advertising partner (Adsterra) may also use cookies to show you relevant ads. You can control this below.
      </p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm mb-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={choices.analytics}
            onChange={(e) => setChoices((c) => ({ ...c, analytics: e.target.checked }))}
            className="w-4 h-4"
          />
          <span className={textSecondary}>Allow Analytics & Advertising (Adsterra)</span>
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={acceptAll}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
        >
          Accept all
        </button>
        <button
          onClick={rejectAll}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold transition-colors"
        >
          Reject all
        </button>
        <button
          onClick={save}
          className="ml-auto px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
        >
          Save choices
        </button>
      </div>
      <div className={`mt-3 text-[11px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <a href="/legal/privacy" className="hover:underline">Privacy</a> · <a href="/legal/cookies" className="hover:underline">Cookies</a> · <a href="/legal/terms" className="hover:underline">Terms</a>
      </div>
    </div>
  );
}

