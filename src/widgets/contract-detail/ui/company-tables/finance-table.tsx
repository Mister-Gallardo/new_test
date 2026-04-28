'use client'

import { useRef } from 'react'

import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { fetchFinance } from '@/entities/contract'
import { useInfiniteScroll } from '@/shared/lib/use-infinite-scroll'
import { formatNumber } from '@/shared/lib/utils'

import { TableEmpty } from './table-empty'

type FinanceTableProps = {
  inn: string
}

export function FinanceTable({ inn }: FinanceTableProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ['finance', inn],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fetchFinance(inn, pageParam)

      if (!result.success) throw new Error(result.error)

      return result.data
    },
    getNextPageParam: (lastPage) =>
      lastPage?.pageNumber < lastPage?.totalPages ? lastPage?.pageNumber + 1 : undefined,
    initialPageParam: 1,
  })

  useInfiniteScroll({
    loadMoreRef,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    rootRef: containerRef,
  })

  const allItems = data.pages.flatMap((p) => p?.items ?? []).filter((item) => item != null)

  if (!allItems.length) {
    return <TableEmpty text="Финансовые показатели отсутствуют" />
  }

  const allItemsSorted = data.pages
    .flatMap((p) => p.items)
    .map((item) => ({
      year: Number(item.year),
      revenue: item.revenue,
      profit: item.profit,
    }))
    .sort((a, b) => b.year - a.year)

  return (
    <div data-state="data" className="flex w-full flex-col lg:flex-2">
      <div className="mb-4 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Финансовые показатели
        </p>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div ref={containerRef} className="max-h-80 overflow-y-auto rounded-lg border">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm">
            <tr>
              <th className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">Год</th>
              <th className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">
                Выручка (₽)
              </th>
              <th className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">
                Чистая прибыль (₽)
              </th>
            </tr>
          </thead>
          <tbody>
            {allItemsSorted.map(({ year, revenue, profit }) => (
              <tr key={year} className="border-b border-border/30 hover:bg-muted/30">
                <td className="px-3 py-2.5 whitespace-nowrap">{year}</td>
                <td className="px-3 py-2.5 text-right whitespace-nowrap">
                  {revenue != null ? formatNumber(revenue) : '—'}
                </td>
                <td className="px-3 py-2.5 text-right whitespace-nowrap">
                  {profit != null ? formatNumber(profit) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div ref={loadMoreRef} className="h-px" />

        {isFetchingNextPage && (
          <div className="flex justify-center p-3">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  )
}
