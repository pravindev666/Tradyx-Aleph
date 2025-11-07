'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Database, Lock, Eye, Cookie } from 'lucide-react';
import Link from 'next/link';
import ConsentBanner from '@/components/ConsentBanner';

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className={`text-lg ${textSecondary}`}>
            How we handle your data and protect your privacy
          </p>
        </div>

        {/* Main Content */}
        <div className={`${cardBg} rounded-lg shadow-lg p-6 sm:p-8 space-y-6 ${borderColor} border`}>
          {/* Overview */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Eye size={24} />
              Overview
            </h2>
            <p className={`${textSecondary} leading-relaxed`}>
              This website does <strong>not collect, store, or process personally identifiable
              information (PII)</strong>. Tradyx Quant Dashboard uses publicly available market
              data (e.g., Yahoo Finance, NSE India) and does not require user accounts or
              user-submitted data for access.
            </p>
          </section>

          {/* Hosting & Logs */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Database size={24} />
              Hosting & Logs
            </h2>
            <p className={`${textSecondary} leading-relaxed`}>
              The site is hosted by <strong>Vercel Inc.</strong> (U.S./EU). For security and
              performance, Vercel may process limited technical information such as IP address,
              user agent, and timestamps in server logs. <strong>We do not persist or export</strong>
              these logs. To the best of our knowledge, host logs are auto-purged within a short
              retention window (typically ≤ 7 days). We do not combine logs with any other data
              to identify individuals.
            </p>
          </section>

          {/* Analytics */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Eye size={24} />
              Analytics
            </h2>
            <p className={`${textSecondary} leading-relaxed`}>
              We may use <strong>anonymous, aggregate analytics</strong> (e.g., Vercel Analytics)
              for performance monitoring only. If Google Analytics is enabled, it will operate
              under <strong>Google Consent Mode v2</strong> and respect your consent choices.
              IP anonymization is enabled where applicable.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Cookie size={24} />
              Cookies
            </h2>
            <p className={`${textSecondary} leading-relaxed`}>
              We use minimal cookies for <strong>theme preferences (dark/light)</strong> and basic
              site functionality. Analytics and advertising cookies (if any) are used
              <strong> only with your consent</strong>. Users in the EEA/UK are shown a
              <strong> Google-certified CMP</strong> (Funding Choices) implementing
              <strong> IAB TCF v2.2</strong>. You can change your choices at any time via the Cookie
              Settings/Preferences link or banner.
            </p>
            <div className={`mt-4 p-3 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <button
                onClick={handleOpenConsent}
                className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} underline font-semibold`}
                aria-label="Open Cookie Settings"
                type="button"
              >
                Cookie Settings / Preferences
              </button>
            </div>
          </section>

          {/* Compliance */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Shield size={24} />
              International & Indian Compliance
            </h2>
            <ul className={`list-disc pl-5 ${textSecondary} space-y-2`}>
              <li>India: Information Technology Act, 2000; SPDI Rules 2011; SEBI IA Regulations (not an adviser).</li>
              <li>EU/UK: GDPR/UK-GDPR – lawful basis: legitimate interests and consent (where required).</li>
              <li>California: CCPA/CPRA – we do not sell personal information.</li>
            </ul>
          </section>

          {/* Your Choices */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Lock size={24} />
              Your Choices
            </h2>
            <p className={`${textSecondary} leading-relaxed`}>
              You may request removal of any retained technical data by contacting us. Provide a
              detailed description (date/time/region) so we can coordinate with our host.
              For cookie choices, use the Cookie Settings link above to review or modify consent.
            </p>
          </section>

          {/* Footer Note */}
          <div className={`pt-4 border-t ${borderColor} text-center`}>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Operated by Tradyx Analytics (India) • Jurisdiction: Chennai, Tamil Nadu • Contact:{' '}
              <a href="mailto:support@tradyx.in" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} underline`}>
                support@tradyx.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
