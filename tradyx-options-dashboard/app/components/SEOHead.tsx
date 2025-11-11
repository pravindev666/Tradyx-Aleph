'use client';

import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';

export default function SEOHead() {
  const { data } = useDashboard();
  
  const baseUrl = 'https://tradyxa-alephx.pages.dev';
  
  // Get live data for dynamic OG tags
  const spotPrice = data?.spot ? (data.spot as number).toFixed(2) : '—';
  const vix = data?.vix ? (data.vix as number).toFixed(2) : '—';
  const ivRank = data?.ivRank ? (data.ivRank as number).toFixed(1) : '—';
  const pcr = data?.pcr ? (data.pcr as number).toFixed(2) : '—';
  
  // Determine market regime
  const getRegime = () => {
    if (!data?.vix) return 'Loading...';
    const vixValue = data.vix as number;
    if (vixValue < 13) return 'Calm';
    if (vixValue < 20) return 'Normal';
    return 'Stress';
  };

  const marketRegime = getRegime();
  
  // Dynamic description with live data
  const dynamicDescription = `NIFTY: ₹${spotPrice} | VIX: ${vix}% | IV Rank: ${ivRank}% | PCR: ${pcr} | Regime: ${marketRegime} | Real-time Options Analytics & ML Forecasts`;
  
  // Enhanced title with live data
  const dynamicTitle = `Tradyxa Quant — NIFTY ₹${spotPrice} | VIX ${vix}% | IV Rank ${ivRank}%`;

  return (
    <>
      {/* Dynamic OG Meta Tags with Live Data */}
      <meta property="og:title" content={dynamicTitle} />
      <meta property="og:description" content={dynamicDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={baseUrl} />
      <meta property="og:image" content={`${baseUrl}/og-image.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Tradyxa Quant Dashboard — Real-time NIFTY Options Analytics" />
      <meta property="og:site_name" content="Tradyxa Quant Dashboard" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@tradyxaquant" />
      <meta name="twitter:creator" content="@pravindev666" />
      <meta name="twitter:title" content={dynamicTitle} />
      <meta name="twitter:description" content={dynamicDescription} />
      <meta name="twitter:image" content={`${baseUrl}/og-image.png`} />
      <meta name="twitter:image:alt" content="Tradyxa Quant Dashboard — Real-time NIFTY Options Analytics" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="Zeta Aztra Technologies" />
      <meta name="geo.region" content="IN-TN" />
      <meta name="geo.placename" content="Chennai" />
      <meta name="geo.position" content="13.0827;80.2707" />
      <meta name="ICBM" content="13.0827, 80.2707" />
      
      {/* Article Meta (if applicable) */}
      <meta property="article:author" content="Zeta Aztra Technologies" />
      <meta property="article:publisher" content={baseUrl} />
      
      {/* App-specific Meta Tags */}
      <meta name="apple-itunes-app" content="app-id=your-app-id" />
      <meta name="google-play-app" content="app-id=your-app-id" />
      
      {/* Rich Snippets Support */}
      <meta name="application-name" content="Tradyxa Quant" />
      <meta name="apple-mobile-web-app-title" content="Tradyxa Quant" />
      <meta name="msapplication-TileColor" content="#0f172a" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Live Data JSON-LD for Rich Results */}
      {data && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialProduct",
              "name": "NIFTY Options Analytics",
              "description": dynamicDescription,
              "provider": {
                "@type": "Organization",
                "name": "Zeta Aztra Technologies"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "150"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
              },
              "additionalProperty": [
                {
                  "@type": "PropertyValue",
                  "name": "NIFTY Spot Price",
                  "value": spotPrice
                },
                {
                  "@type": "PropertyValue",
                  "name": "India VIX",
                  "value": vix
                },
                {
                  "@type": "PropertyValue",
                  "name": "IV Rank",
                  "value": ivRank
                },
                {
                  "@type": "PropertyValue",
                  "name": "Put-Call Ratio",
                  "value": pcr
                },
                {
                  "@type": "PropertyValue",
                  "name": "Market Regime",
                  "value": marketRegime
                }
              ]
            })
          }}
        />
      )}
    </>
  );
}
