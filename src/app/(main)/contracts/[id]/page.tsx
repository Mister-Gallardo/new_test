import type { Metadata } from 'next'

import { fetchContractDetail, fetchContractDetailForMetadata } from '@/entities/contract'
import { getOpenGraph, SEO } from '@/shared/config/seo.config'
import { JsonLd } from '@/shared/ui/json-ld'
import { ContractSearchDetailsPage } from '@/views/contract-search-details'

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const result = await fetchContractDetailForMetadata(id)

  if (!result.success || !result.data) {
    return {
      title: `Закупка ${id}`,
      description: `Детальная информация о закупке. Победитель, цена, лоты и документация.`,
      alternates: { canonical: `/contracts/${id}` },
    }
  }

  const contract = result.data
  const number = contract.number ?? id
  const titleSubject = contract.title
    ? contract.title.length > 60
      ? `${contract.title.slice(0, 60)}…`
      : contract.title
    : null

  const title = titleSubject
    ? `Закупка №${number} — ${titleSubject}`
    : `Закупка №${number}`

  const winner = contract.winnerCompany?.name
  const price =
    contract.price && contract.price !== -1
      ? new Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'RUB',
          maximumFractionDigits: 0,
        }).format(contract.price)
      : null

  const descParts = [
    contract.title,
    winner ? `Победитель: ${winner}` : null,
    price ? `Цена: ${price}` : null,
    `Заказчик: ${contract.customerOrganization.name}`,
  ].filter(Boolean)

  const description = descParts.join('. ').slice(0, 160)

  return {
    title,
    description,
    alternates: {
      canonical: `/contracts/${id}`,
    },
    openGraph: getOpenGraph({
      type: 'website',
      title: `${title} | ${SEO.siteName}`,
      description,
      url: `${SEO.baseUrl}/contracts/${id}`,
    }),
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const result = await fetchContractDetail(id)
  const contract = result.success ? result.data : null

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Закупки',
        item: `${SEO.baseUrl}/contracts`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: contract?.number ? `Закупка №${contract.number}` : 'Карточка закупки',
        item: `${SEO.baseUrl}/contracts/${id}`,
      },
    ],
  }

  const governmentServiceJsonLd = contract
    ? {
        '@context': 'https://schema.org',
        '@type': 'GovernmentService',
        name: contract.title ?? `Закупка №${contract.number ?? id}`,
        url: `${SEO.baseUrl}/contracts/${id}`,
        description: contract.title,
        provider: {
          '@type': 'GovernmentOrganization',
          name: contract.customerOrganization.name,
        },
        ...(contract.auctionType
          ? { serviceType: contract.auctionType.sourceName }
          : {}),
        ...(contract.region
          ? {
              areaServed: {
                '@type': 'AdministrativeArea',
                name: contract.region,
              },
            }
          : {}),
        ...(contract.price && contract.price !== -1
          ? {
              offers: {
                '@type': 'Offer',
                price: contract.price,
                priceCurrency: 'RUB',
              },
            }
          : {}),
      }
    : null

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      {governmentServiceJsonLd && <JsonLd data={governmentServiceJsonLd} />}
      <ContractSearchDetailsPage contractId={id} />
    </>
  )
}
