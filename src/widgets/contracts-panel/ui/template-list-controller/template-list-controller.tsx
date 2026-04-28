'use client'

import { useTemplateParams, useTemplateStore } from '@/features/contracts-filter'

import { ContractsList } from '../contracts-list'

export const TemplateListController = () => {
  const { qFilters, qPage, setQPage } = useTemplateParams()
  const { setZPage } = useTemplateStore()

  const handlePageChange = (page: number) => {
    setQPage(page)
    setZPage(page)
  }

  return <ContractsList qFilters={qFilters} qPage={qPage} onPageChange={handlePageChange} />
}
