import type { Metadata } from 'next'

import { getOpenGraph, SEO } from '@/shared/config/seo.config'
import { TemplatesPage } from '@/views/templates'

export const metadata: Metadata = {
  title: 'Мои шаблоны',
  description: 'Управление шаблонами поиска закупок. Создавайте и настраивайте шаблоны для быстрого поиска тендеров.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: getOpenGraph({
    title: 'Мои шаблоны | Тендерград',
    description:
      'Управление шаблонами поиска закупок. Создавайте и настраивайте шаблоны для быстрого поиска тендеров.',
    url: `${SEO.baseUrl}/templates`,
  }),
}

export default function Page() {
  return <TemplatesPage />
}
