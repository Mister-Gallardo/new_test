import type { Metadata } from 'next'

import { searchParamsCache } from '@/features/contracts-filter'
import { getOpenGraph, SEO } from '@/shared/config/seo.config'

export const metadata: Metadata = {
  title: 'Поиск закупок',
  description:
    'Поиск закупок и тендеров для субподряда. Найдите актуальные госзакупки и коммерческие тендеры с проверенными победителями.',
  alternates: {
    canonical: '/contracts',
  },
  openGraph: getOpenGraph({
    title: 'Поиск закупок | Тендерград',
    description:
      'Поиск закупок и тендеров для субподряда. Найдите актуальные госзакупки и коммерческие тендеры с проверенными победителями.',
    url: `${SEO.baseUrl}/contracts`,
  }),
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  await searchParamsCache.parse(searchParams)

  // return <ContractsSearchPage />
  return <h1>ЗАГЛУШКА 2</h1>
}
