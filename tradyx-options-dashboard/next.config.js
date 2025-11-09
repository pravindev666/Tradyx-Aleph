/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: https://www.highperformanceformat.com https://pl28016046.effectivegatecpm.com;",
              "connect-src 'self' https:;",
              "img-src 'self' https: data: blob:;",
              "style-src 'self' 'unsafe-inline' https:;",
              "frame-src https: data: https://www.highperformanceformat.com https://pl28016046.effectivegatecpm.com;",
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
  output: 'standalone',
  
  // Experimental features for production
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
