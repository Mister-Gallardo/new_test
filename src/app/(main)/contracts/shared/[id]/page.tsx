import type { Metadata } from 'next'

import { getOpenGraph } from '@/shared/config/seo.config'
import { ContractSearchDetailsPage } from '@/views/contract-search-details'

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params

  return {
    title: `Закупка №${id}`,
    description: `Детальная информация о закупке №${id}. Победитель, цена, лоты и документация.`,
    robots: {
      index: false,
      follow: false,
    },

    openGraph: getOpenGraph({
      title: `Закупка №${id} | Тендерград`,
      description: `Детальная информация о закупке №${id}. Победитель, цена, лоты и документация.`,
    }),
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  return <ContractSearchDetailsPage contractId={id} isSharedContract={true} />
}
