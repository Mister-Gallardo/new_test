import { Suspense } from 'react'

import { ErrorBoundary } from 'react-error-boundary'

import { getSession } from '@/entities/user'
import { fetchSubscriptionStatus } from '@/entities/user/api'
import { SubscriptionProvider } from '@/entities/user/model/subscription-provider'
import { SearchFilter } from '@/features/contracts-filter'
import { ContractsPanel } from '@/widgets/contracts-panel'
import { SearchListController } from '@/widgets/contracts-panel/ui/search-list-controller'
import {
  RecentlyViewedContracts,
  RecentlyViewedSkeleton,
} from '@/widgets/recently-viewed-contracts'

export const ContractsSearchPage = async () => {
  const [{ isAuth }, subscription] = await Promise.all([getSession(), fetchSubscriptionStatus()])

  const subscriptionInfo = subscription.success && subscription.data

  return (
    <ContractsPanel
      filterSlot={<SearchFilter />}
      listSlot={
        <SubscriptionProvider subscription={subscriptionInfo || null}>
          <SearchListController />
        </SubscriptionProvider>
      }
      historySlot={
        isAuth ? (
          <ErrorBoundary fallback={null}>
            <Suspense fallback={<RecentlyViewedSkeleton columns={3} />}>
              <RecentlyViewedContracts />
            </Suspense>
          </ErrorBoundary>
        ) : null
      }
    />
  )
}
