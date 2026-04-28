import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsJson,
  parseAsString,
} from 'nuqs/server'

import type { KladrItem } from '../model/schema'

import { DEFAULT_FILTERS } from './constants'

export const contractsParsers = {
  keywords: parseAsString.withDefault(DEFAULT_FILTERS.keywords),
  ignoreKeywords: parseAsString.withDefault(DEFAULT_FILTERS.ignoreKeywords),
  priceFrom: parseAsInteger,
  priceTo: parseAsInteger,
  kladrItems: parseAsJson<KladrItem[]>((v) => {
    if (!Array.isArray(v)) return DEFAULT_FILTERS.kladrItems
    return v
  }).withDefault(DEFAULT_FILTERS.kladrItems),
  laws: parseAsArrayOf(parseAsString).withDefault(DEFAULT_FILTERS.laws),
  searchInDocuments: parseAsBoolean.withDefault(DEFAULT_FILTERS.searchInDocuments),
  searchInLots: parseAsBoolean.withDefault(DEFAULT_FILTERS.searchInLots),
  page: parseAsInteger.withDefault(1),
}

export const searchParamsCache = createSearchParamsCache(contractsParsers)
