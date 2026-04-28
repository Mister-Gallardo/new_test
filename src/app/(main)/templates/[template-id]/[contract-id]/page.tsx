import type { Metadata } from 'next'

import { ContractTemplateDetailsPage } from '@/views/contract-template-details'

type PageProps = {
  params: Promise<{ 'template-id': string; 'contract-id': string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { 'contract-id': contractId } = await params

  return {
    title: `Закупка №${contractId}`,
    description: `Детальная информация о закупке №${contractId}. Победитель, цена, лоты и документация.`,
    alternates: {
      canonical: `/contracts/${contractId}`,
    },
    openGraph: {
      title: `Закупка №${contractId} | Тендерград`,
      description: `Детальная информация о закупке №${contractId}. Победитель, цена, лоты и документация.`,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { 'template-id': templateId, 'contract-id': contractId } = await params

  return <ContractTemplateDetailsPage templateId={templateId} contractId={contractId} />
}
