import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

import { DEFAULT_PAGE_SIZE } from '../config'

const parsers = {
  page: parseAsInteger.withDefault(1),
  q: parseAsString.withDefault(''),
}

export function useTemplatesSearchParams() {
  const [params, setParams] = useQueryStates(parsers, {
    history: 'replace',
    shallow: true,
  })

  const setPage = (page: number) => setParams({ page })
  const setQuery = (q: string) => setParams({ q, page: 1 })

  const getTotalPages = (total: number) => Math.ceil(total / DEFAULT_PAGE_SIZE)

  return {
    page: params.page,
    q: params.q,
    getTotalPages,
    setPage,
    setQuery,
  }
}
