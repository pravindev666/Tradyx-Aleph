'use client';

import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';

export default function SEOHead() {
  const { data } = useDashboard();
  
  // Get live data for dynamic OG tags
  const spotPrice = data?.spot ? (data.spot as number).toFixed(2) : '—';
  const vix = data?.vix ? (data.vix as number).toFixed(2) : '—';
  const ivRank = data?.ivRank ? (data.ivRank as number).toFixed(1) : '—';
  
  // Determine market regime
  const getRegime = () => {
    if (!data?.vix) return 'Loading...';
    const vixValue = data.vix as number;
    if (vixValue < 13) return 'Calm';
    if (vixValue < 20) return 'Normal';
    return 'Stress';
  };

  const dynamicDescription = `NIFTY Spot: ₹${spotPrice} | VIX: ${vix}% | IV Rank: ${ivRank}% | Regime: ${getRegime()}`;

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Tradyx Quant Dashboard",
            "operatingSystem": "Web",
            "applicationCategory": "FinancialApplication",
            "url": "https://tradyx.vercel.app",
            "author": {
              "@type": "Person",
              "name": "Pravin A. Mathew",
              "url": "https://tradyx.in"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Tradyx Analytics",
              "url": "https://tradyx.vercel.app"
            },
            "description": "Advanced NIFTY options volatility analytics and machine learning forecasts. Built for quantitative traders and data-driven investors.",
            "offers": {
              "@type": "Offer",
              "price": "0.00",
              "priceCurrency": "INR"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5.0",
              "ratingCount": "100"
            },
            "featureList": [
              "Real-time NIFTY Options Analytics",
              "Machine Learning Volatility Forecasts",
              "IV Rank and Volatility Risk Premium",
              "Market Mood Index (MMI)",
              "5 ML-based Prediction Models",
              "10 Volatility Indicators"
            ]
          })
        }}
      />
      
      {/* Dynamic OG Meta Tags */}
      <meta property="og:title" content={`Tradyx Quant Dashboard — ${dynamicDescription}`} />
      <meta property="og:description" content={dynamicDescription} />
      <meta name="twitter:title" content={`Tradyx Quant Dashboard — ${dynamicDescription}`} />
      <meta name="twitter:description" content={dynamicDescription} />
    </>
  );
}

