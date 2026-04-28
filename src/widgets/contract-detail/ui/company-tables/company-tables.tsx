import { Suspense } from 'react'

import { ErrorBoundary } from 'react-error-boundary'

import { useSubscription } from '@/entities/user/model/subscription-provider'

import { ArbitrTable } from './arbitr-table'
import { FinanceTable } from './finance-table'
import { TableEmpty } from './table-empty'
import { TableSkeleton } from './table-skeleton'

type CompanyTablesSectionProps = {
  inn?: string
}

export function CompanyTables({ inn }: CompanyTablesSectionProps) {
  const { isActive } = useSubscription()

  if (!isActive || !inn) {
    return (
      <div className="flex flex-col gap-4 lg:flex-row">
        <TableEmpty text="Финансовые показатели отсутствуют" />
        <TableEmpty text="Суды отсутствуют" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 lg:[&:not(:has([data-state='empty']):has([data-state='data']))]:flex-row *:data-[state='data']:order-1 *:data-[state='empty']:order-2">
      <ErrorBoundary fallback={<TableEmpty text="Финансовые показатели отсутствуют" />}>
        <Suspense fallback={<TableSkeleton text="Загрузка финансов..." />}>
          <FinanceTable inn={inn} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary fallback={<TableEmpty text="Суды отсутствуют" />}>
        <Suspense fallback={<TableSkeleton text="Загрузка судов..." />}>
          <ArbitrTable inn={inn} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
