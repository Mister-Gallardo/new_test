import { Suspense } from 'react'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

import type { ContractDetail } from '@/entities/contract'
import { fetchContractDetail } from '@/entities/contract'
import { getSession } from '@/entities/user'
import { fetchSubscriptionStatus } from '@/entities/user/api'
import { SubscriptionProvider } from '@/entities/user/model/subscription-provider'
import { fetchTemplateById } from '@/features/contracts-filter'
import { paths } from '@/shared/config/paths'
import { makeQueryClient } from '@/shared/lib/query-client'
import { AppBreadcrumbs } from '@/shared/ui/app-breadcrumbs'
import { ContractDetailPanel, ContractDetailSkeleton } from '@/widgets/contract-detail'
import {
  RecentlyViewedContracts,
  RecentlyViewedSkeleton,
} from '@/widgets/recently-viewed-contracts'

type ContractTemplateDetailsPageProps = {
  contractId: string
  templateId: string
}

export async function ContractTemplateDetailsPage({
  contractId,
  templateId,
}: ContractTemplateDetailsPageProps) {
  const queryClient = makeQueryClient()

  const [{ isAuth }, subscription, templateResult] = await Promise.all([
    getSession(),
    fetchSubscriptionStatus(),
    fetchTemplateById(templateId),
    queryClient.prefetchQuery({
      queryKey: ['contract', contractId],
      queryFn: async () => {
        const result = await fetchContractDetail(contractId)

        if (!result.success) {
          throw new Error(result.error)
        }

        if (!result.data) {
          throw new Error('Ошибка загрузки данных о закупке.')
        }

        return result.data
      },
    }),
  ])

  if (!templateResult.success) {
    throw new Error(templateResult.error)
  }

  const templateLabel = templateResult.data.name ?? 'Шаблон'

  const contractData = queryClient.getQueryData<ContractDetail>(['contract', contractId])

  const subscriptionInfo = subscription.success && subscription.data

  return (
    <div className="flex flex-col gap-6">
      <AppBreadcrumbs
        items={[
          { label: 'Закупки', href: paths.home() },
          { label: 'Шаблоны', href: paths.templates.root() },
          {
            label: templateLabel,
            href: paths.templates.detail(templateId),
          },
          { label: `Закупка №${contractData ? contractData.number : contractId}` },
        ]}
      />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <SubscriptionProvider subscription={subscriptionInfo || null}>
          <Suspense fallback={<ContractDetailSkeleton />}>
            <ContractDetailPanel
              contractId={contractId}
              historySlot={
                isAuth ? (
                  <ErrorBoundary fallback={null}>
                    <Suspense fallback={<RecentlyViewedSkeleton columns={4} />}>
                      <RecentlyViewedContracts columns={4} />
                    </Suspense>
                  </ErrorBoundary>
                ) : null
              }
            />
          </Suspense>
        </SubscriptionProvider>
      </HydrationBoundary>
    </div>
  )
}
