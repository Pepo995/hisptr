import type { MetadataRoute } from 'next';

const BASE_URL = 'https://bookhipstr.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/book-now'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
