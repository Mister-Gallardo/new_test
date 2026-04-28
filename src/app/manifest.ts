import type { MetadataRoute } from 'next'

import { SEO } from '@/shared/config/seo.config'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SEO.defaultTitle,
    short_name: SEO.siteName,
    description: SEO.defaultDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: SEO.themeColor,
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
