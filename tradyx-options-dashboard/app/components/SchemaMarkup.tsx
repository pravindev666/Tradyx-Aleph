'use client';

import Script from 'next/script';

export default function SchemaMarkup() {
  const schemaData = {
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
      "10 Volatility Indicators",
      "Nifty ML Model",
      "NIFTY Machine Learning Predictions"
    ]
  };

  return (
    <Script
      id="schema-markup"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

