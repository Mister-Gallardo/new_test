'use client'

import { useState } from 'react'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { ContractCard } from '@/entities/contract'
import { ShareContractButton } from '@/features/share-contract'
import { paths } from '@/shared/config/paths'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'

import { fetchContractsHistory } from '../../api'

type RecentlyViewedContractsProps = {
  columns?: 3 | 4
  excludeContractId?: string
}

export function RecentlyViewedContracts({ columns = 3 }: RecentlyViewedContractsProps) {
  const params = useParams()
  const { 'template-id': templateId } = params as { 'template-id': string }

  const maxItems = columns * 2
  const [size, setSize] = useState<number>(columns)

  const { data } = useSuspenseQuery({
    queryKey: ['contractsHistory', size],
    queryFn: async () => {
      const result = await fetchContractsHistory(size)

      if (!result.success) {
        throw new Error(result.error)
      }

      return result.data
    },
  })

  const handleShowAll = () => {
    setSize(maxItems)
  }

  // const items = data?.items?.filter((c) => !excludeContractId || c.contractId !== excludeContractId)

  if (!data.items.length) return null

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-semibold">Вы недавно смотрели</h3>
        {size < maxItems && data.total > columns && (
          <Button
            variant="ghost"
            onClick={handleShowAll}
            className="text-sm text-brand-primary transition-colors hover:text-brand-primary"
          >
            Смотреть все
          </Button>
        )}
      </div>

      <div
        className={cn(
          'grid gap-3',
          columns === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-4',
        )}
      >
        {data.items.map((contract) => {
          const href = templateId
            ? paths.templates.contract(templateId, contract.contractId)
            : paths.contracts.detail(contract.contractId)

          return (
            <ContractCard
              key={contract.contractId}
              data={contract}
              href={href}
              variant="compact"
              actions={<ShareContractButton contractId={contract.contractId} isCompact={true} />}
            />
          )
        })}
      </div>
    </section>
  )
}
