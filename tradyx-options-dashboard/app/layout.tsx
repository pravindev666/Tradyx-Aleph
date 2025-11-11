import './globals.css';
import { Inter, JetBrains_Mono, Manrope } from 'next/font/google';

// Inter - Primary UI font (optimized for dashboards)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

// JetBrains Mono - Numeric/Value areas (perfect alignment for volatility metrics)
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  fallback: ['monospace', 'Courier New', 'mono'],
});

// Manrope - Brand/Logo font (high-tech premium edge)
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Tradyxa Quant Dashboard — NIFTY Options Volatility & ML Forecast Lab",
    template: "%s | Tradyxa Quant Dashboard"
  },
  description:
    "Advanced NIFTY options analytics platform with real-time volatility forecasting, machine learning predictions, IV Rank, VRP, and Market Mood Index. Professional-grade tools for quantitative traders, options strategists, and volatility researchers in India.",
  keywords: [
    "tradyxa",
    "tradyxa quant",
    "tradyxa dashboard",
    "tradyxa options",
    "NIFTY Options",
    "NIFTY Options Analytics",
    "India VIX",
    "Volatility Forecast",
    "Machine Learning Trading",
    "Quant Dashboard",
    "Options Analytics India",
    "Realized Volatility",
    "HV-IV Spread",
    "IV Rank",
    "Volatility Risk Premium",
    "VRP",
    "Market Mood Index",
    "MMI",
    "Trading Indicators",
    "Options Strategy Lab",
    "Zeta Aztra Technologies",
    "Nifty ML Model",
    "NIFTY Machine Learning",
    "Options Volatility Prediction",
    "India Options Trading",
    "NSE Options Analytics",
    "NIFTY 50 Options",
    "Options Chain Analysis",
    "PCR Ratio",
    "Max Pain",
    "Put Call Ratio",
    "Volatility Indicators",
    "Quantitative Trading",
    "Algorithmic Trading India",
    "Options Greeks",
    "Delta Gamma Theta Vega",
    "LSTM Volatility Prediction",
    "Random Forest Options",
    "Options Backtesting",
  ],
  authors: [{ name: "Zeta Aztra Technologies" }],
  creator: "Zeta Aztra Technologies",
  publisher: "Zeta Aztra Technologies",
  metadataBase: new URL("https://tradyxa-alephx.pages.dev"),
  applicationName: "Tradyxa Quant Dashboard",
  category: "Finance",
  classification: "Financial Analytics Software",
  openGraph: {
    type: "website",
    url: "https://tradyxa-alephx.pages.dev",
    title: "Tradyxa Quant Dashboard — NIFTY Options Volatility & ML Forecast Lab",
    description:
      "Advanced NIFTY options analytics with real-time volatility forecasting, ML predictions, IV Rank, VRP, and Market Mood Index. Professional tools for quantitative traders and options strategists.",
    siteName: "Tradyxa Quant Dashboard",
    locale: "en_IN",
    alternateLocale: ["en_US", "en_GB"],
    images: [
      {
        url: "https://tradyxa-alephx.pages.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tradyxa Quant Dashboard — Advanced NIFTY Options Analytics & Machine Learning Forecasts",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tradyxaquant",
    creator: "@pravindev666",
    title: "Tradyxa Quant Dashboard — NIFTY Options Volatility & ML Forecast Lab",
    description:
      "Advanced NIFTY options analytics and ML-based forecasts. Real-time volatility indicators, IV Rank, VRP, and 5 ML prediction models for professional traders.",
    images: [
      {
        url: "https://tradyxa-alephx.pages.dev/og-image.png",
        alt: "Tradyxa Quant Dashboard",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  alternates: {
    canonical: "https://tradyxa-alephx.pages.dev",
    languages: {
      "en-IN": "https://tradyxa-alephx.pages.dev",
      "en-US": "https://tradyxa-alephx.pages.dev",
    },
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Tradyxa Quant",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#0f172a",
    "theme-color": "#0f172a",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({ children }:{ children:React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} ${manrope.variable}`}>
      <head>
        {/* Google Consent Mode v2 defaults: deny analytics before any tags */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                functionality_storage: 'denied',
                security_storage: 'granted'
              });
            `
          }}
        />

        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-YRNPEZK1GW"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YRNPEZK1GW');
            `
          }}
        />

      </head>
      <body className={`${inter.className} bg-zinc-50 dark:bg-zinc-950`}>{children}</body>
    </html>
  );
}