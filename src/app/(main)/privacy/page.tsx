import type { Metadata } from 'next'

import { getOpenGraph, SEO } from '@/shared/config/seo.config'
import { PrivacyPage } from '@/views/privacy'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description:
    'Политика конфиденциальности сервиса Тендерград. Узнайте, как мы обрабатываем и защищаем ваши персональные данные.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: getOpenGraph({
    title: 'Политика конфиденциальности | Тендерград',
    description:
      'Политика конфиденциальности сервиса Тендерград. Узнайте, как мы обрабатываем и защищаем ваши персональные данные.',
    url: `${SEO.baseUrl}/privacy`,
  }),
}

export default function Page() {
  return <PrivacyPage />
}
