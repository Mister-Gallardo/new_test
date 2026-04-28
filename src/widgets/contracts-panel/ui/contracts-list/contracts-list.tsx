'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { ContractCard } from '@/entities/contract'
import type { FilterFormValues } from '@/features/contracts-filter'
import { fetchContracts, PAGE_SIZE } from '@/features/contracts-filter'
import { Pagination } from '@/features/pagination'
import { ShareContractButton } from '@/features/share-contract'
import { paths } from '@/shared/config/paths'

import { ContractsEmptyGuide } from './contracts-empty-guide'

type ContractsListProps = {
  qFilters: FilterFormValues
  qPage: number
  onPageChange: (page: number) => void
}

export const ContractsList = ({ qFilters, qPage, onPageChange }: ContractsListProps) => {
  const params = useParams()
  const { 'template-id': templateId } = params as { 'template-id': string }

  const { data } = useSuspenseQuery({
    queryKey: [
      'contracts',
      { ...qFilters, laws: qFilters.laws.length === 4 ? [] : qFilters.laws.sort() },
      qPage,
    ],
    queryFn: async () => {
      const result = await fetchContracts(
        { ...qFilters, laws: qFilters.laws.length === 4 ? [] : qFilters.laws.sort() },
        qPage,
      )

      if (!result.success) {
        throw new Error(result.error)
      }

      return result.data
    },
  })

  if (!data.items.length) {
    return <ContractsEmptyGuide />
  }

  const totalPages = Math.ceil(data?.total / PAGE_SIZE)

  return (
    <div className="flex flex-1 flex-col gap-3">
      {data.items.map((contract) => {
        const href = templateId
          ? paths.templates.contract(templateId, contract.contractId)
          : paths.contracts.detail(contract.contractId)

        return (
          <ContractCard
            key={contract.contractId}
            data={contract}
            href={href}
            actions={<ShareContractButton contractId={contract.contractId} />}
          />
        )
      })}

      {totalPages > 1 && (
        <Pagination currentPage={qPage} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  )
}
