import type { Metadata } from 'next'

import { searchParamsCache } from '@/features/contracts-filter/config/search-params'
import { ContractsTemplatePage } from '@/views/contracts-template'

type PageProps = {
  params: Promise<{ 'template-id': string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { 'template-id': templateId } = await params

  return {
    title: `Шаблон поиска №${templateId.slice(0, 8)}`,
    description: 'Результаты поиска закупок по сохранённому шаблону.',
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const [{ 'template-id': templateId }] = await Promise.all([
    params,
    searchParamsCache.parse(searchParams),
  ])

  return <ContractsTemplatePage templateId={templateId} />
}
