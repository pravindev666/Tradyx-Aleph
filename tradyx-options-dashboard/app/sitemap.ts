import { MetadataRoute } from 'next';

// Required for static export (Netlify, Cloudflare, Vercel static)
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tradyxa-alephx.pages.dev';
  const currentDate = new Date();
  
  // Calculate last modified dates
  // Homepage updates every 15 minutes during market hours
  const homepageLastModified = new Date(currentDate);
  
  // Static pages update less frequently
  const staticPageLastModified = new Date(currentDate);
  staticPageLastModified.setDate(staticPageLastModified.getDate() - 1);
  
  return [
    {
      url: baseUrl,
      lastModified: homepageLastModified,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: staticPageLastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: staticPageLastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: staticPageLastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/legal/disclaimer`,
      lastModified: staticPageLastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/legal/cookies`,
      lastModified: staticPageLastModified,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/legal/cookie-settings`,
      lastModified: staticPageLastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    // Data endpoint (for API discovery)
    {
      url: `${baseUrl}/data/dashboard.json`,
      lastModified: homepageLastModified,
      changeFrequency: 'hourly',
      priority: 0.7,
    },
  ];
}
