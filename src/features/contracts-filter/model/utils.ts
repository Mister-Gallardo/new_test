import isEqual from 'react-fast-compare'

import { DEFAULT_FILTERS } from '../config'

import type { FilterFormValues } from './schema'

export const buildSearchBody = (filters: FilterFormValues) => {
  return {
    keywords: filters.keywords ? filters.keywords.trim().split(',') : [],
    ignoreKeywords: filters.ignoreKeywords ? filters.ignoreKeywords.trim().split(',') : [],
    priceFrom: filters.priceFrom || undefined,
    priceTo: filters.priceTo || undefined,
    kladrCodes: filters.kladrItems.length ? filters.kladrItems.map((kladr) => kladr.code) : [],
    laws: filters.laws.length ? filters.laws : ['Commercial', 'Law223', 'Law44', 'Law615'],
    searchInDocuments: filters.searchInDocuments,
    searchInLots: filters.searchInLots,
  }
}

export const isStateDefault = (filters: FilterFormValues): boolean => {
  if (!filters) return true
  return (
    filters.keywords === DEFAULT_FILTERS.keywords &&
    filters.ignoreKeywords === DEFAULT_FILTERS.ignoreKeywords &&
    filters.priceFrom === DEFAULT_FILTERS.priceFrom &&
    filters.priceTo === DEFAULT_FILTERS.priceTo &&
    filters.searchInDocuments === DEFAULT_FILTERS.searchInDocuments &&
    filters.searchInLots === DEFAULT_FILTERS.searchInLots &&
    isEqual(filters.kladrItems, DEFAULT_FILTERS.kladrItems) &&
    isEqual(filters.laws, DEFAULT_FILTERS.laws)
  )
}
