'use client'

import { useSearchParams, useSearchStore } from '@/features/contracts-filter'

import { ContractsList } from '../contracts-list'

export const SearchListController = () => {
  const { qFilters, qPage, setQPage } = useSearchParams()
  const { setZPage } = useSearchStore()

  const handlePageChange = (page: number) => {
    setQPage(page)
    setZPage(page)
  }

  return <ContractsList qFilters={qFilters} qPage={qPage} onPageChange={handlePageChange} />
}
