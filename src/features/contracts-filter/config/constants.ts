import type { FilterFormValues } from '../model'

export const LAW_OPTIONS = [
  { label: 'ФЗ-44', value: 'Law44' },
  { label: 'ФЗ-223', value: 'Law223' },
  { label: 'ПП РФ-615', value: 'Law615' },
  { label: 'Коммерческие', value: 'Commercial' },
] as const

export const DEFAULT_FILTERS: FilterFormValues = {
  keywords: '',
  ignoreKeywords: '',
  priceFrom: '',
  priceTo: '',
  kladrItems: [],
  laws: [],
  searchInDocuments: false,
  searchInLots: true,
}

export const MAX_PRICE = 999_999_999_999_999
export const PAGE_SIZE = 10
export const DEBOUNCE_MS = 500
