import { Suspense } from 'react'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

import type { ContractDetail } from '@/entities/contract'
import { fetchContractDetail } from '@/entities/contract'
import { fetchSharedContractDetail } from '@/entities/contract/api/routes'
import { getSession } from '@/entities/user'
import { fetchSubscriptionStatus } from '@/entities/user/api'
import { SubscriptionProvider } from '@/entities/user/model/subscription-provider'
import { paths } from '@/shared/config/paths'
import { makeQueryClient } from '@/shared/lib/query-client'
import { AppBreadcrumbs } from '@/shared/ui/app-breadcrumbs'
import { ContractDetailPanel } from '@/widgets/contract-detail'
import { ContractDetailSkeleton } from '@/widgets/contract-detail'
import {
  RecentlyViewedContracts,
  RecentlyViewedSkeleton,
} from '@/widgets/recently-viewed-contracts'

type ContractSearchDetailsPageProps = {
  contractId: string
  isSharedContract?: boolean
}

export async function ContractSearchDetailsPage({
  contractId,
  isSharedContract = false,
}: ContractSearchDetailsPageProps) {
  const queryClient = makeQueryClient()

  const [{ isAuth }, subscription] = await Promise.all([
    getSession(),
    fetchSubscriptionStatus(),
    queryClient.prefetchQuery({
      queryKey: [isSharedContract ? 'sharedContract' : 'contract', contractId],
      queryFn: async () => {
        const result = isSharedContract
          ? await fetchSharedContractDetail(contractId)
          : await fetchContractDetail(contractId)

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

  const contractData = queryClient.getQueryData<ContractDetail>([
    isSharedContract ? 'sharedContract' : 'contract',
    contractId,
  ])

  const subscriptionInfo = subscription.success && subscription.data

  return (
    <div className="flex flex-col gap-6">
      <AppBreadcrumbs
        items={[
          { label: 'Закупки', href: paths.home() },
          { label: `Закупка №${contractData ? contractData.number : contractId}` },
        ]}
      />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <SubscriptionProvider subscription={subscriptionInfo || null}>
          <Suspense fallback={<ContractDetailSkeleton />}>
            <ContractDetailPanel
              contractId={contractId}
              isSharedContract={isSharedContract}
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
