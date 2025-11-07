'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Shield, Copyright, AlertTriangle, Gavel, Mail } from 'lucide-react';
import Link from 'next/link';
import ConsentBanner from '@/components/ConsentBanner';

export default function TermsPage() {
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
            Terms of Use
          </h1>
          <p className={`text-lg ${textSecondary}`}>
            User obligations, acceptable use, and legal terms
          </p>
        </div>

        {/* Main Content */}
        <div className={`${cardBg} rounded-lg shadow-lg p-6 sm:p-8 space-y-6 ${borderColor} border`}>
          {/* Acceptance */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <FileText size={24} />
              Acceptance
            </h2>
            <p className={`${textSecondary} leading-relaxed`}>
              By accessing or using this website, you agree to these Terms, the Privacy Policy,
              Cookie Notice, and Disclaimer. If you do not agree, do not use the site.
            </p>
          </section>

          {/* No Advice */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <AlertTriangle size={24} />
              No Advice
            </h2>
            <p className={`${textSecondary} leading-relaxed`}>
              The site provides educational and informational content only. We do not provide
              investment advice. You acknowledge sole responsibility for your trading/investment actions.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Copyright size={24} />
              Intellectual Property
            </h2>
            <p className={`${textSecondary} leading-relaxed`}>
              © {new Date().getFullYear()} Tradyx Analytics. All rights reserved. All code,
              models, visualizations, and branding are protected under applicable laws, including
              the Indian Copyright Act, 1957. Unauthorized reproduction, scraping, framing, or
              redistribution is prohibited. "Tradyx" is a brand identifier; unauthorized use is prohibited.
            </p>
          </section>

          {/* Data Attribution */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Shield size={24} />
              Data Attribution
            </h2>
            <p className={`${textSecondary} leading-relaxed`}>
              Market data © respective owners. Tradyx Analytics is <strong>not affiliated</strong> with
              NSE India or Yahoo Finance. Derived analytics and computed indicators are © Tradyx Analytics.
              Market data may be delayed up to 15 minutes.
            </p>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Shield size={24} />
              Acceptable Use
            </h2>
            <ul className={`list-disc pl-5 ${textSecondary} space-y-2`}>
              <li>No unlawful, abusive, or malicious use of the site or data.</li>
              <li>No automated scraping or bulk extraction of content without prior written consent.</li>
              <li>No reverse engineering of proprietary models or bypassing rate limits.</li>
            </ul>
          </section>

          {/* Ads & Third-Party Content */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <AlertTriangle size={24} />
              Ads & Third-Party Content
            </h2>
            <p className={`${textSecondary} leading-relaxed`}>
              Advertising is provided by third parties (e.g., Google AdSense). We do not control or endorse
              third-party content and are not responsible for claims made in ads. Ads personalization depends
              on your consent via the cookie banner/CMP.
            </p>
          </section>

          {/* Jurisdiction & Contact */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Gavel size={24} />
              Jurisdiction & Contact
            </h2>
            <p className={`${textSecondary} leading-relaxed`}>
              These Terms are governed by the laws of India. All disputes are subject exclusively to the
              courts of <strong>Chennai, Tamil Nadu</strong>. Contact:{' '}
              <a href="mailto:support@tradyx.in" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} underline`}>
                support@tradyx.in
              </a>.
            </p>
          </section>

          {/* Footer Note */}
          <div className={`pt-4 border-t ${borderColor} text-center`}>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Last updated: {new Date().toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
