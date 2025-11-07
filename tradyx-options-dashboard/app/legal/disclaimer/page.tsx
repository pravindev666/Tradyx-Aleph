'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, Shield, FileWarning, Info } from 'lucide-react';
import Link from 'next/link';
import ConsentBanner from '@/components/ConsentBanner';

export default function DisclaimerPage() {
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
            Disclaimer
          </h1>
          <p className={`text-lg ${textSecondary}`}>
            Educational and informational use only. Not financial advice.
          </p>
        </div>

        {/* Main Content */}
        <div className={`${cardBg} rounded-lg shadow-lg p-6 sm:p-8 space-y-6 ${borderColor} border`}>
          {/* Purpose */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Info size={24} />
              Educational Purpose Only
            </h2>
            <p className={`${textSecondary} leading-relaxed`}>
              The information, analytics, indicators, models, forecasts, and visualizations on this
              website are provided <strong>solely for educational and informational purposes</strong>.
              Nothing here constitutes financial, investment, trading, tax, accounting, or legal advice.
            </p>
          </section>

          {/* SEBI Notice */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Shield size={24} />
              SEBI Notice
            </h2>
            <p className={`${textSecondary} leading-relaxed`}>
              Tradyx Analytics, its owner(s), developers, and affiliates are <strong>not SEBI-registered
              investment advisers or research analysts</strong>. All trading and investment decisions
              made based on the information presented here are taken <strong>entirely at the user's
              own risk</strong>.
            </p>
          </section>

          {/* Liability Disclaimer */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <FileWarning size={24} />
              Liability Disclaimer
            </h2>
            <p className={`${textSecondary} leading-relaxed`}>
              We explicitly <strong>disclaim any and all liability</strong> for losses, damages, or other
              consequences arising from use of, reliance upon, or inability to use the content, data,
              indicators, or models on this website. Users should consider consulting a
              <strong> SEBI-registered financial adviser</strong>.
            </p>
          </section>

          {/* Third-Party Content */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <AlertTriangle size={24} />
              Third-Party Content
            </h2>
            <p className={`${textSecondary} leading-relaxed`}>
              This website may display advertisements and links to external websites. Tradyx does
              <strong> not endorse or control</strong> third-party content or claims, and assumes no
              responsibility for any products, services, or information provided by third parties.
              Interactions with such content are at your own discretion and risk.
            </p>
          </section>

          {/* Data Accuracy */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Info size={24} />
              Data Accuracy
            </h2>
            <p className={`${textSecondary} leading-relaxed`}>
              Market data and prices are sourced from publicly available providers (e.g., Yahoo Finance,
              NSE India). While reasonable efforts are made to ensure accuracy and timely updates,
              <strong> no guarantee or warranty</strong> is given regarding completeness, reliability,
              timeliness, suitability, or availability for any purpose. Market data may be delayed
              up to 15 minutes.
            </p>
          </section>

          {/* User Acknowledgment */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Shield size={24} />
              User Acknowledgment
            </h2>
            <div className={`${darkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50 border border-gray-200'} p-4 rounded-lg`}>
              <p className={`${textSecondary} leading-relaxed mb-3`}>
                By using this website, you acknowledge and agree that you bear full responsibility for your
                trading and investment decisions, and that Tradyx Analytics and contributors shall have
                <strong> no liability whatsoever</strong> for any loss or damage that may result.
              </p>
            </div>
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
