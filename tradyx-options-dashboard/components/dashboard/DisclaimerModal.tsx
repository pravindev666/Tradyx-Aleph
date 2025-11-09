'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface DisclaimerModalProps {
  darkMode: boolean;
  onClose: () => void;
}

export default function DisclaimerModal({ darkMode, onClose }: DisclaimerModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className={`
          ${bgClass} 
          rounded-2xl 
          shadow-2xl 
          max-w-4xl 
          w-full 
          max-h-[90vh] 
          overflow-hidden
          border-2
          ${darkMode ? 'border-yellow-500/50' : 'border-yellow-400'}
          relative
          transform
          transition-all
        `}
        style={{
          boxShadow: '0 0 40px rgba(255, 215, 0, 0.5), 0 0 80px rgba(255, 215, 0, 0.3)'
        }}
      >
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} px-6 py-4 border-b ${borderColor} flex items-center justify-center`}>
          <h2 className={`text-xl font-bold ${textPrimary}`}>Disclaimer</h2>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-6">
          <div className={`space-y-4 ${textSecondary} text-sm leading-relaxed`}>
            <p className="font-semibold text-base">
              The information, analytics, indicators, and visualizations provided on this website are intended solely for educational and informational purposes. Nothing contained herein constitutes financial, investment, trading, or legal advice. The content should not be interpreted as a recommendation to buy, sell, or hold any securities, options, or other financial instruments.
            </p>

            <p>
              The website, its owner, developers, and any associated entities are not registered investment advisers or research analysts under the Securities and Exchange Board of India (SEBI) regulations. All trading and investment decisions made based on the information provided herein are done entirely at the user's own discretion and risk.
            </p>

            <p>
              The website owner, developers, and affiliates explicitly disclaim any and all liability for financial losses, direct or indirect damages, or other consequences arising out of the use of, reliance upon, or inability to use the data, charts, indicators, or models presented on this platform. Users are strongly advised to consult a SEBI-registered financial adviser before making any trading or investment decisions.
            </p>

            <p>
              This website may display third-party advertisements or contain external links for informational or promotional purposes. The website owner does not endorse, control, or take responsibility for the accuracy, quality, legality, or reliability of any third-party content, products, or services accessed through such links. Interacting with any third-party content or advertisements is done solely at the user's own risk. <strong>Ad placements are managed by third-party providers; Tradyx Analytics is not responsible for their content or claims.</strong>
            </p>

            <p>
              Market data, charts, and analytics are derived from publicly available sources such as Yahoo Finance, NSE India, and other open financial data providers. While reasonable efforts are made to ensure data accuracy and timely updates, no warranties or guarantees are made regarding the completeness, reliability, or fitness of such data for any specific trading or investment purpose.
            </p>

            <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
              <p className="font-semibold mb-2">By accessing and using this website, you acknowledge and agree that:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>You understand the inherent risks of financial markets and derivatives trading.</li>
                <li>You bear full responsibility for your own financial and trading decisions.</li>
                <li>The website owner, developers, and contributors shall not be held liable under any law, including but not limited to the Information Technology Act, 2000, for any losses, damages, or claims arising from your use of this website or reliance on its content.</li>
                <li>Use of this website implies full acceptance of this disclaimer and all terms of use.</li>
              </ul>
            </div>

            <div className={`mt-6 pt-4 border-t ${borderColor} space-y-3`}>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} space-y-2`}>
                <p><strong>Data Protection:</strong> This site does not collect or store any personally identifiable information. The site is hosted by Vercel Inc. (U.S./EU), which may automatically log IPs for technical purposes. No personal data is stored; server logs are automatically deleted within 7 days by the host. Anonymous usage statistics may be processed by Vercel for performance analytics only. To request deletion of any stored technical data, email support@tradyx.in</p>
                <p><strong>Jurisdiction:</strong> This site operates under Indian law. All disputes subject to Chennai, Tamil Nadu courts.</p>
                <p><strong>Intellectual Property:</strong> Visual models and code protected under Copyright Act, 1957 (India). Unauthorized use of the Tradyx name, logo, or visuals is strictly prohibited.</p>
              </div>
              <div className={`text-center pt-2 border-t ${borderColor}`}>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  © 2025 Tradyx Analytics | <Link href="/about" className="hover:text-blue-400 underline">About</Link> | Disclaimer | Privacy Policy | Terms
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Close Button */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} px-6 py-4 border-t ${borderColor} flex justify-center`}>
          <button
            onClick={onClose}
            className={`
              px-8 py-3 
              rounded-lg 
              font-semibold 
              transition-all 
              duration-300
              ${darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
              shadow-lg
              hover:shadow-xl
              transform
              hover:scale-105
            `}
          >
            I Understand and Agree
          </button>
        </div>
      </div>
    </div>
  );
}

