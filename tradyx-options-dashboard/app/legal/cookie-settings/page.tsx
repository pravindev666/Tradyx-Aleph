'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Cookie, Settings, Shield } from 'lucide-react';
import Link from 'next/link';
import ConsentBanner from '@/components/ConsentBanner';

export default function CookieSettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = typeof window !== 'undefined' ? localStorage.getItem('tradyx-theme') : null;
    if (saved) {
      setDarkMode(saved === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleOpenConsent = () => {
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.__tcfapi === "function") {
      // @ts-ignore
      window.__tcfapi("displayConsentUi", 2, () => {});
    } else {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent("tradyx:openConsent"));
      }
    }
  };

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-700';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      {/* Consent Banner */}
      <ConsentBanner darkMode={darkMode} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className={`inline-flex items-center gap-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors mb-4`}
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className={`text-3xl sm:text-4xl font-bold ${textPrimary} mb-2`}>
            Cookie Settings
          </h1>
          <p className={`text-lg ${textSecondary}`}>
            Manage your cookie and consent preferences
          </p>
        </div>

        {/* Main Content */}
        <div className={`${cardBg} rounded-lg shadow-lg p-6 sm:p-8 space-y-6 ${borderColor} border`}>
          {/* Introduction */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Cookie size={24} />
              Manage Your Preferences
            </h2>
            <p className={`${textSecondary} leading-relaxed`}>
              You can change your cookie and consent preferences at any time. Click the button below to
              open the consent management interface where you can accept, reject, or customize your preferences
              for analytics cookies.
            </p>
            <div className={`mt-4 p-4 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <button
                onClick={handleOpenConsent}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  darkMode 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                type="button"
              >
                Open Cookie Settings
              </button>
              <p className={`text-sm mt-3 ${textSecondary}`}>
                This will open the consent banner or CMP (Consent Management Platform) where you can
                review and update your preferences.
              </p>
            </div>
          </section>

          {/* Cookie Categories */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Settings size={24} />
              Cookie Categories
            </h2>
            <div className={`space-y-3 ${textSecondary}`}>
              <div className={`p-3 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <p className="font-semibold mb-1">Strictly Necessary / Security</p>
                <p className="text-sm">Required for basic operation and security; always enabled. Cannot be disabled.</p>
              </div>
              <div className={`p-3 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <p className="font-semibold mb-1">Functionality</p>
                <p className="text-sm">Theme preference (dark/light), UI settings. Stored in browser localStorage.</p>
              </div>
              <div className={`p-3 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <p className="font-semibold mb-1">Analytics</p>
                <p className="text-sm">Anonymized traffic and performance metrics. Enabled only with your consent.</p>
              </div>
            </div>
          </section>

          {/* Consent Management */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Shield size={24} />
              Consent Management
            </h2>
            <p className={`${textSecondary} leading-relaxed`}>
              We provide a consent banner to manage your preferences. Your choices are stored locally
              in your browser and will persist until you change them or clear your browser data.
            </p>
          </section>

          {/* Footer Note */}
          <div className={`pt-4 border-t ${borderColor} text-center`}>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              For more information, see our{' '}
              <Link href="/legal/cookies" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} underline`}>
                Cookie Notice
              </Link>
              {' '}and{' '}
              <Link href="/legal/privacy" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} underline`}>
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

