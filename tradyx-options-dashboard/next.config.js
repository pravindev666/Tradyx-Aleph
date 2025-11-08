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
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
          { 
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.highperformanceformat.com http://www.highperformanceformat.com http://highperformanceformat.com https://highperformanceformat.com;",
              "img-src 'self' data: https://*.googleusercontent.com https://*.google.com https://*.gstatic.com https://*.highperformanceformat.com http://*.highperformanceformat.com;",
              "style-src 'self' 'unsafe-inline';",
              "connect-src 'self' https://raw.githubusercontent.com https://*.github.io https://www.google-analytics.com https://www.googletagmanager.com https://*.highperformanceformat.com http://*.highperformanceformat.com;",
              "frame-src 'self' https://*.highperformanceformat.com http://*.highperformanceformat.com;",
              "font-src 'self' data:;"
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
