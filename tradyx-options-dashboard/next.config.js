/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  // Disable image optimization for static export (works on all platforms)
  images: {
    unoptimized: true, // Required for static export (Netlify, Cloudflare, Vercel static)
    formats: ['image/avif', 'image/webp'],
    domains: [],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Removed X-Frame-Options to allow Adsterra iframes
          // { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
          { 
            key: "Content-Security-Policy",
            value: [
              "default-src 'self' https: data: blob:;",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: https://honeywhyvowel.com https://www.highperformanceformat.com https://*.adsterra.com https://pl28016046.effectivegatecpm.com;",
              "connect-src 'self' https: http:;",
              "img-src 'self' https: data: blob:;",
              "style-src 'self' 'unsafe-inline' https:;",
              "frame-src https: http: data: https://honeywhyvowel.com https://www.highperformanceformat.com https://*.adsterra.com https://pl28016046.effectivegatecpm.com blob:;",
              "font-src 'self' data: https:"
            ].join(' ')
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains"
          }
        ]
      }
    ]
  },
  
  // Output configuration
  // Use 'export' for static hosting (works on Netlify, Cloudflare Pages, Vercel static)
  // This creates a fully static site that works on all platforms
  output: 'export',
  
  // Disable trailing slash for better compatibility
  trailingSlash: false,
  
  // Experimental features for production
  // Note: Some experimental features may not work with static export
  // experimental: {
  //   optimizeCss: true,
  // },
}

module.exports = nextConfig
