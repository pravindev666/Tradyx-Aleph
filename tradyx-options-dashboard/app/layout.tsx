import './globals.css';
import localFont from 'next/font/local';

// Arteks font configuration using .otf files
const arteks = localFont({
  src: [
    {
      path: './fonts/Arteks Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Arteks Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Arteks Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Arteks Light.otf',
      weight: '300',
      style: 'normal',
    },
  ],
  variable: '--font-arteks',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  display: 'swap',
});

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tradyx Quant Dashboard — NIFTY Options Volatility & Forecast Lab",
  description:
    "Tradyx Quant Dashboard delivers real-time NIFTY options analytics, volatility forecasting, and machine learning-based market sentiment insights. Built for professional traders, quant analysts, and volatility researchers.",
  keywords: [
    "NIFTY Options",
    "India VIX",
    "Volatility Forecast",
    "Machine Learning",
    "Quant Dashboard",
    "Options Analytics",
    "Realized Volatility",
    "HV-IV Spread",
    "IV Rank",
    "Volatility Risk Premium",
    "Trading Indicators",
    "Options Strategy Lab",
    "Tradyx Analytics",
    "Nifty ML Model",
    "NIFTY Machine Learning",
    "Options Volatility Prediction",
    "India Options Trading",
    "NSE Options Analytics",
  ],
  authors: [{ name: "Pravin A. Mathew", url: "https://tradyx.in" }],
  creator: "Pravin A. Mathew",
  publisher: "Tradyx Analytics",
  metadataBase: new URL("https://tradyx.vercel.app"),
  openGraph: {
    type: "website",
    url: "https://tradyx.vercel.app",
    title: "Tradyx Quant Dashboard — NIFTY Options Volatility & Forecast Lab",
    description:
      "Advanced NIFTY options analytics and machine learning forecasts. Monitor volatility, correlations, and risk indicators in real-time. Built with Next.js, Tailwind, and Python models.",
    siteName: "Tradyx Quant Dashboard",
    images: [
      {
        url: "https://tradyx.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tradyx Quant Dashboard — Advanced Options Analytics",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    site: "@tradyxquant",
    creator: "@pravindev666",
    title: "Tradyx Quant Dashboard — NIFTY Options Volatility & Forecast Lab",
    description:
      "Advanced NIFTY options analytics and ML-based forecasts powered by Tradyx Quant Engine.",
    images: ["https://tradyx.vercel.app/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  themeColor: "#0f172a",
  alternates: {
    canonical: "https://tradyx.vercel.app",
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
};

export default function RootLayout({ children }:{ children:React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={arteks.variable}>
      <head>
        {/* Google Consent Mode v2 defaults: deny everything except security BEFORE any tags */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
                functionality_storage: 'denied',
                security_storage: 'granted'
              });
            `
          }}
        />

        {/* Google tag (gtag.js) - GA4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-YRNPEZK1GW"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YRNPEZK1GW', { anonymize_ip: true });
            `
          }}
        />

        {/* AdSense loader */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3773170640876257"
          crossOrigin="anonymous"
        ></script>

        {/* Google Funding Choices — certified CMP (IAB TCF v2.2) for EEA/UK */}
        <script
          async
          src="https://fundingchoicesmessages.google.com/i/ca-pub-3773170640876257?ers=1"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function signalGooglefcPresent() {
                  if (!window.frames['__fc_frame']) {
                    if (document.body) {
                      const iframe = document.createElement('iframe');
                      iframe.style = 'width:0;height:0;border:0;display:none';
                      iframe.name = '__fc_frame';
                      document.body.appendChild(iframe);
                    } else {
                      setTimeout(signalGooglefcPresent, 50);
                    }
                  }
                }
                signalGooglefcPresent();
              })();
            `
          }}
        />
      </head>
      <body className={`${arteks.className} bg-zinc-50 dark:bg-zinc-950`}>{children}</body>
    </html>
  );
}