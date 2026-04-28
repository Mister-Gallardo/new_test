'use client'

import { useSyncExternalStore } from 'react'

import { RecentlyViewedContracts } from './recently-viewed-contracts'
import { RecentlyViewedSkeleton } from './recently-viewed-skeleton'

const emptySubscribe = () => () => {}

type Props = {
  columns?: 3 | 4
  excludeContractId?: string
}

export function ClientOnlyRecentlyViewed(props: Props) {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false)

  if (!isClient) {
    return <RecentlyViewedSkeleton columns={props.columns || 3} />
  }

  return <RecentlyViewedContracts {...props} />
}

