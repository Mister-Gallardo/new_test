import { Suspense } from 'react'

import { ScrollToTopButton } from '@/shared/ui/scroll-to-top-button'

import { ContractsListSkeleton } from './contracts-list'

type ContractsPanelProps = {
  filterSlot: React.ReactNode
  breadcrumbsSlot?: React.ReactNode
  listSlot: React.ReactNode
  historySlot?: React.ReactNode
}

export const ContractsPanel = ({
  filterSlot,
  breadcrumbsSlot,
  listSlot,
  historySlot,
}: ContractsPanelProps) => {
  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      {filterSlot}

      <div className="flex flex-1 flex-col gap-4 lg:pl-4">
        {breadcrumbsSlot}

        <Suspense fallback={<ContractsListSkeleton />}>{listSlot}</Suspense>

        {historySlot}
      </div>

      <ScrollToTopButton />
    </div>
  )
}
