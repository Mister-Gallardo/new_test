'use client'

import { useEffect } from 'react'

import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { fetchContractDetail, fetchSharedContractDetail } from '@/entities/contract/api/routes'
import { useSession } from '@/entities/user/model/session-provider'

import { AdditionalInfo } from './additional-info'
import { CompanyTables } from './company-tables'
import { ContractHeader } from './contract-header'
import { LotsTable } from './lots-table'
import { WinnerCompany } from './winner-company'
import { WinnerContacts } from './winner-contacts'

type ContractDetailPanelProps = {
  contractId: string
  isSharedContract?: boolean
  historySlot?: React.ReactNode
}

export function ContractDetailPanel({
  contractId,
  isSharedContract = false,
  historySlot,
}: ContractDetailPanelProps) {
  const { isAuth } = useSession()

  const queryClient = useQueryClient()

  const { data: contractData } = useSuspenseQuery({
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
  })

  useEffect(() => {
    if (contractData) {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })

      queryClient.invalidateQueries({ queryKey: ['contractsHistory'] })
    }
  }, [contractData, queryClient])

  return (
    <div className="flex flex-col gap-6">
      <ContractHeader contract={contractData} isAuth={isAuth} />

      <section className="rounded-xl bg-card p-4 shadow-sm sm:p-5">
        <h2 className="mb-4 text-sm font-semibold sm:text-lg">Компания-победитель</h2>

        <div className="rounded-lg border bg-primary-foreground mb-6 p-4 flex flex-col gap-5 justify-between lg:flex-row">
          <WinnerCompany company={contractData.winnerCompany} isAuth={isAuth} />

          <WinnerContacts employees={contractData.winnerCompany?.employees} isAuth={isAuth} />
        </div>

        <CompanyTables inn={contractData.winnerCompany?.inn} />
      </section>

      <AdditionalInfo contract={contractData} isAuth={isAuth} />

      {/* Лоты */}
      <LotsTable lots={contractData.lots} />

      {/* История */}
      {historySlot}
    </div>
  )
}
