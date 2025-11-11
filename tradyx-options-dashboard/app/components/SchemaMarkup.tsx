'use client';

import Script from 'next/script';
import { useDashboard } from '@/hooks/useDashboard';

export default function SchemaMarkup() {
  const { data } = useDashboard();
  
  const baseUrl = 'https://tradyxa-alephx.pages.dev';
  const currentDate = new Date().toISOString();
  
  // Get dynamic data for schema
  const spotPrice = data?.spot ? (data.spot as number).toFixed(2) : null;
  const vix = data?.vix ? (data.vix as number).toFixed(2) : null;
  
  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Zeta Aztra Technologies",
    "legalName": "Zeta Aztra Technologies (Individual Proprietorship)",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": "Financial technology company specializing in quantitative trading analytics and machine learning-based market forecasting for Indian equity markets.",
    "foundingDate": "2025",
    "founder": {
      "@type": "Person",
      "name": "Zeta Aztra Technologies"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "zetaaztratech@gmail.com",
      "contactType": "Customer Service",
      "areaServed": "IN",
      "availableLanguage": ["en", "en-IN"]
    },
    "sameAs": [
      // Add your social media profiles here
      // "https://twitter.com/tradyxaquant",
      // "https://linkedin.com/company/tradyxa",
    ]
  };

  // WebSite Schema with SearchAction
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Tradyxa Quant Dashboard",
    "alternateName": ["Tradyxa Options Analytics", "tradyxa", "tradyxa quant"],
    "url": baseUrl,
    "description": "Advanced NIFTY options analytics platform with real-time volatility forecasting and machine learning predictions for Indian equity markets.",
    "publisher": {
      "@type": "Organization",
      "name": "Zeta Aztra Technologies"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "en-IN",
    "datePublished": "2025-01-01",
    "dateModified": currentDate
  };

  // SoftwareApplication Schema
  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Tradyxa Quant Dashboard",
    "alternateName": ["tradyxa", "tradyxa quant", "Tradyxa Options Analytics"],
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Real-time NIFTY Options Chain Analytics",
      "Machine Learning Volatility Forecasts",
      "IV Rank and Volatility Risk Premium (VRP)",
      "Market Mood Index (MMI) Calculation",
      "5 ML-based Prediction Models (Linear, Logistic, Random Forest, Quantile, LSTM)",
      "10+ Volatility Indicators",
      "Put-Call Ratio (PCR) Analysis",
      "Max Pain Calculation",
      "Realized vs Implied Volatility Spread",
      "Historical Volatility Analysis",
      "Options Greeks Visualization",
      "Market Regime Detection",
      "Automated Data Updates (Every 15 minutes during market hours)"
    ],
    "screenshot": `${baseUrl}/og-image.png`,
    "softwareVersion": "1.0.0",
    "releaseNotes": "Initial release with comprehensive NIFTY options analytics",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "permissions": "No special permissions required",
    "url": baseUrl,
    "publisher": {
      "@type": "Organization",
      "name": "Zeta Aztra Technologies"
    },
    "datePublished": "2025-01-01",
    "dateModified": currentDate
  };

  // FinancialProduct Schema (for NIFTY Options)
  const financialProductSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "NIFTY Options Analytics",
    "description": "Comprehensive analytics and forecasting tools for NIFTY 50 index options trading on NSE India",
    "category": "Options Trading",
    "provider": {
      "@type": "Organization",
      "name": "Zeta Aztra Technologies"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Professional Traders, Quantitative Analysts, Options Strategists"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };

  // Dataset Schema (for market data)
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "NIFTY Options Market Data",
    "description": "Real-time and historical NIFTY options chain data, volatility metrics, and ML predictions",
    "keywords": "NIFTY, Options, Volatility, VIX, IV Rank, Market Data",
    "creator": {
      "@type": "Organization",
      "name": "Zeta Aztra Technologies"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Zeta Aztra Technologies"
    },
    "temporalCoverage": "2025-01-01/..",
    "spatialCoverage": {
      "@type": "Country",
      "name": "India"
    },
    "distribution": {
      "@type": "DataDownload",
      "contentUrl": `${baseUrl}/data/dashboard.json`,
      "encodingFormat": "application/json"
    },
    "license": `${baseUrl}/legal/terms`,
    "datePublished": "2025-01-01",
    "dateModified": currentDate
  };

  // BreadcrumbList Schema (for navigation)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "About",
        "item": `${baseUrl}/about`
      }
    ]
  };

  // FAQPage Schema (if you have FAQs)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Tradyxa Quant Dashboard?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tradyxa Quant Dashboard is an advanced NIFTY options analytics platform that provides real-time volatility forecasting, machine learning predictions, IV Rank, VRP, and Market Mood Index for professional traders and quantitative analysts."
        }
      },
      {
        "@type": "Question",
        "name": "How often is the data updated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The dashboard data is updated every 15 minutes during market hours (9:15 AM to 3:30 PM IST, Monday to Friday) using automated GitHub Actions workflows."
        }
      },
      {
        "@type": "Question",
        "name": "Is Tradyxa Quant Dashboard free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Tradyxa Quant Dashboard is completely free to use. The platform is supported by advertising revenue."
        }
      },
      {
        "@type": "Question",
        "name": "What machine learning models are used?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The platform uses 5 ML models: Linear Regression, Logistic Regression, Random Forest, Quantile Regression, and LSTM neural networks for volatility forecasting and market predictions."
        }
      }
    ]
  };

  // HowTo Schema (for using the dashboard)
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Use Tradyxa Quant Dashboard",
    "description": "Step-by-step guide to using the NIFTY options analytics dashboard",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Access the Dashboard",
        "text": "Visit the Tradyxa Quant Dashboard homepage to view real-time NIFTY options analytics."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "View Market Metrics",
        "text": "Check the top strip for current NIFTY spot price, VIX, PCR ratio, and other key market indicators."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Analyze Volatility Indicators",
        "text": "Review the 10+ volatility indicators including IV Rank, VRP, and Market Mood Index for trading insights."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Review ML Predictions",
        "text": "Examine predictions from 5 machine learning models to understand market sentiment and volatility forecasts."
      }
    ]
  };

  // Combine all schemas
  const allSchemas = [
    organizationSchema,
    websiteSchema,
    softwareApplicationSchema,
    financialProductSchema,
    datasetSchema,
    breadcrumbSchema,
    faqSchema,
    howToSchema
  ];

  return (
    <>
      {allSchemas.map((schema, index) => (
        <Script
          key={index}
          id={`schema-markup-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
