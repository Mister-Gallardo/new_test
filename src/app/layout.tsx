import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import { getOpenGraph, SEO } from '@/shared/config/seo.config'
import { JsonLd } from '@/shared/ui/json-ld'

import { Providers } from './providers'

import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: SEO.themeColor,
}

export const metadata: Metadata = {
  metadataBase: new URL(SEO.baseUrl),

  title: {
    default: SEO.defaultTitle,
    template: `%s | ${SEO.siteName}`,
  },

  description: SEO.defaultDescription,

  keywords: [...SEO.keywords],

  icons: {
    icon: '/favicon.svg',
    apple: '/apple-icon.png',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: '/',
  },

  openGraph: getOpenGraph(),

  twitter: {
    card: 'summary_large_image',
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    images: [new URL(SEO.ogImage, SEO.baseUrl).toString()],
  },

  verification: {
    google: 'x1i5mgrtQveS2vzWTBlnC60r3sBQyjGBsci6jRWeuVI',
    ...(SEO.yandexVerification ? { yandex: SEO.yandexVerification } : {}),
  },

  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  category: 'business',
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SEO.siteName,
  url: SEO.baseUrl,
  description: SEO.defaultDescription,
  inLanguage: 'ru',
  publisher: {
    '@type': 'Organization',
    name: SEO.siteName,
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SEO.siteName,
  url: SEO.baseUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${SEO.baseUrl}/favicon.svg`,
  },
  description: SEO.defaultDescription,
  // TODO: Заполнить sameAs реальными ссылками на соцсети из seo.config.ts
  ...(SEO.socialLinks.telegram || SEO.socialLinks.vk
    ? {
        sameAs: [SEO.socialLinks.telegram, SEO.socialLinks.vk].filter(Boolean),
      }
    : {}),
}

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SEO.siteName,
  url: SEO.baseUrl,
  description: SEO.defaultDescription,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  inLanguage: 'ru',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  featureList: [
    'Поиск закупок по победителям',
    'Проверка заказчика',
    'Шаблоны поиска',
    'Детальная информация о лотах',
    'Субподряд у победителей тендеров',
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isAuth  = false

  return (
    <html lang="ru">
      <body className={`${inter.className} antialiased`}>
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={webApplicationJsonLd} />
        <Providers isAuth={isAuth}>{children}</Providers>
        {/* <Toaster closeButton theme="light" /> */}
      </body>
    </html>
  )
}
