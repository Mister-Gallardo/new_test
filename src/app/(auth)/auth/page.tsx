import type { Metadata } from 'next'

import { getOpenGraph, SEO } from '@/shared/config/seo.config'
import { AuthPage } from '@/views/auth'

export const metadata: Metadata = {
  title: 'Вход в систему',
  description: 'Войдите в Тендерград для поиска субподряда у победителей закупок.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: getOpenGraph({
    title: 'Вход в систему | Тендерград',
    description: 'Войдите в Тендерград для поиска субподряда у победителей закупок.',
    url: `${SEO.baseUrl}/auth`,
  }),
}

export default function Page() {
  return <AuthPage />
}
