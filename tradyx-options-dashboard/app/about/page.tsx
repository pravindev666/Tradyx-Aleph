'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Code, Database, TrendingUp, Shield, Mail } from 'lucide-react';
import Link from 'next/link';
import ConsentBanner from '@/components/ConsentBanner';

export default function AboutPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = typeof window !== 'undefined' ? localStorage.getItem('tradyx-theme') : null;
    if (saved) {
      setDarkMode(saved === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
    // Sync with document
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
            About Tradyx Quant Dashboard
          </h1>
          <p className={`text-lg ${textSecondary}`}>
            Advanced NIFTY Options Analytics & Machine Learning Forecasts
          </p>
        </div>

        {/* Main Content */}
        <div className={`${cardBg} rounded-lg shadow-lg p-6 sm:p-8 space-y-6 ${borderColor} border`}>
          {/* Purpose */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <TrendingUp size={24} />
              Purpose
            </h2>
            <p className={`${textSecondary} leading-relaxed`}>
              Tradyx Quant Dashboard is an educational platform designed to provide advanced options analytics, 
              volatility indicators, and machine learning-based forecasts for NIFTY options trading. The dashboard 
              aggregates real-time market data from NSE India and Yahoo Finance to compute various metrics including 
              IV Rank, Volatility Risk Premium, Market Mood Index, and predictive models using Linear Regression, 
              Logistic Regression, Random Forest, Quantile Regression, and LSTM neural networks.
            </p>
            <p className={`${textSecondary} leading-relaxed mt-3`}>
              <strong>Important:</strong> This dashboard is for educational purposes only and does not constitute 
              financial, investment, trading, or legal advice. All trading decisions are made at your own risk.
            </p>
          </section>

          {/* Tech Stack */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Code size={24} />
              Technology Stack
            </h2>
            <div className={`${textSecondary} space-y-2`}>
              <p><strong>Frontend:</strong> Next.js 16, React 18, TypeScript, Tailwind CSS</p>
              <p><strong>Data Sources:</strong> NSE India API, Yahoo Finance</p>
              <p><strong>Analytics Engine:</strong> Python (pandas, numpy, scikit-learn, statsmodels, TensorFlow/Keras)</p>
              <p><strong>Machine Learning Models:</strong> Linear Regression, Logistic Regression, Random Forest, Quantile Regression, LSTM</p>
              <p><strong>Hosting:</strong> Vercel</p>
              <p><strong>Version:</strong> v1.0.0</p>
            </div>
          </section>

          {/* Data Sources */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Database size={24} />
              Data Sources & Attribution
            </h2>
            <div className={`${textSecondary} space-y-2`}>
              <p><strong>NSE India:</strong> Real-time option chain data, historical prices</p>
              <p><strong>Yahoo Finance:</strong> Market data, VIX, historical OHLC data</p>
              <p className="text-sm text-gray-500 mt-2">
                Market data © respective owners. Tradyx Analytics is unaffiliated with NSE India or Yahoo Finance. 
                Market data may be delayed up to 30 minutes.
              </p>
            </div>
          </section>

          {/* Legal & Privacy */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Shield size={24} />
              Legal & Privacy
            </h2>
            <div className={`${textSecondary} space-y-3 text-sm`}>
              <div>
                <p><strong>Operated by:</strong> Tradyx Analytics (Individual Proprietorship, India)</p>
                <p><strong>Developer:</strong> Pravin A. Mathew</p>
                <p><strong>Jurisdiction:</strong> Chennai, Tamil Nadu, India</p>
                <p><strong>Contact:</strong> <a href="mailto:support@tradyx.in" className="text-blue-400 hover:underline">support@tradyx.in</a></p>
              </div>
              <div className={`p-3 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <p><strong>Data Protection:</strong> This site does not collect or store any personally identifiable information. 
                Server logs are automatically deleted within 7 days by the host (Vercel).</p>
              </div>
              <div className={`p-3 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <p><strong>Intellectual Property:</strong> Visual models and code protected under Copyright Act, 1957 (India). 
                Unauthorized use of the Tradyx name, logo, or visuals is strictly prohibited.</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Mail size={24} />
              Contact & Support
            </h2>
            <div className={`${textSecondary} space-y-2`}>
              <p>For inquiries, support, or data deletion requests:</p>
              <p>
                <a href="mailto:support@tradyx.in" className="text-blue-400 hover:underline font-semibold">
                  support@tradyx.in
                </a>
              </p>
            </div>
          </section>

          {/* Footer Note */}
          <div className={`pt-4 border-t ${borderColor} text-center`}>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              © 2025 Tradyx Analytics | All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

