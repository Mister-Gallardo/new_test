import type { MetadataRoute } from 'next'

import { SEO } from '@/shared/config/seo.config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/auth/',
          '/account/',
          '/masquerade/',
          '/settings/',
          '/templates/',
          '/contracts/shared/',
        ],
      },
    ],
    sitemap: `${SEO.baseUrl}/sitemap.xml`,
    host: SEO.baseUrl,
  }
}
