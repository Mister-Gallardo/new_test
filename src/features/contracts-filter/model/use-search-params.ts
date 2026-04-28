'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useQueryStates } from 'nuqs'

import { contractsParsers, DEFAULT_FILTERS, PAGE_SIZE } from '../config'

import type { ContractsSearchParams, FilterFormValues } from './schema'

export function useSearchParams() {
  const router = useRouter()
  const pathname = usePathname()

  const [params, setParams] = useQueryStates(contractsParsers, {
    history: 'replace',
    shallow: true,
  })

  const setPage = (page: number) => setParams({ page })

  const setFilters = (partial: Partial<ContractsSearchParams>) => {
    const cleaned = Object.fromEntries(
      Object.entries({ ...partial }).map(([k, v]) => {
        const isEmptyArray = Array.isArray(v) && v.length === 0

        const isPriceKey = k === 'priceFrom' || k === 'priceTo'
        const isEmptyPrice = isPriceKey && (v === 0 || v === '' || v === '0')

        const isNothing = v === null || v === undefined

        const finalValue = isEmptyArray || isEmptyPrice || isNothing ? null : v

        return [k, finalValue]
      }),
    )
    return setParams(cleaned)
  }

  const resetFilters = () => router.replace(pathname)

  const totalPages = (total: number) => Math.ceil(total / PAGE_SIZE)

  const qFilters: FilterFormValues = {
    keywords: params.keywords ?? DEFAULT_FILTERS.keywords,
    ignoreKeywords: params.ignoreKeywords ?? DEFAULT_FILTERS.ignoreKeywords,
    priceFrom: params.priceFrom ?? DEFAULT_FILTERS.priceFrom,
    priceTo: params.priceTo ?? DEFAULT_FILTERS.priceTo,
    kladrItems: params.kladrItems ?? DEFAULT_FILTERS.kladrItems,
    laws: params.laws ?? DEFAULT_FILTERS.laws,
    searchInDocuments: params.searchInDocuments ?? DEFAULT_FILTERS.searchInDocuments,
    searchInLots: params.searchInLots ?? DEFAULT_FILTERS.searchInLots,
  }

  return {
    qFilters,
    qPage: params.page,
    setQParams: setParams,
    setQFilters: setFilters,
    setQPage: setPage,
    resetQFilters: resetFilters,
    qTotalPages: totalPages,
  }
}
