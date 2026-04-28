'use client'

import { useRef, useState } from 'react'

import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

import { fetchArbitr } from '@/entities/contract'
import type { ArbitrCase } from '@/entities/contract/model/types'
import { useInfiniteScroll } from '@/shared/lib/use-infinite-scroll'
import { formatDate } from '@/shared/lib/utils'

import { TableEmpty } from './table-empty'

const ROLE_MAP: Record<string, string> = {
  Other: 'Прочее',
  Plaintiff: 'Истец',
  Respondent: 'Ответчик',
  Third: 'Третье лицо',
}

type ArbitrTableProps = {
  inn: string
}

export function ArbitrTable({ inn }: ArbitrTableProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ['arbitr', inn],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fetchArbitr(inn, pageParam)
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
    return <TableEmpty text="Суды отсутствуют" />
  }

  return (
    <div data-state="data" className="flex w-full flex-col lg:flex-3">
      <div className="mb-4 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Суды</p>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div ref={containerRef} className="max-h-80 overflow-auto rounded-lg border">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm">
            <tr>
              <th className="w-8 px-2.5 py-2.5" />
              <th className="px-4 py-2.5 text-left font-semibold whitespace-nowrap">Тип дела</th>
              <th className="px-4 py-2.5 text-right font-semibold whitespace-nowrap">Номер дела</th>
              <th className="px-4 py-2.5 text-right font-semibold whitespace-nowrap">Дата</th>
              <th className="px-4 py-2.5 text-right font-semibold whitespace-nowrap">Ссылка</th>
            </tr>
          </thead>
          <tbody>
            {allItems.map((row, idx) => (
              <ArbitrRow key={`${row.caseNumber}-${idx}`} row={row} />
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

function ArbitrRow({ row }: { row: ArbitrCase }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <tr className="border-b border-border/80 hover:bg-muted/30">
        <td className="px-1.5 py-2">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="rounded p-0.5 hover:bg-muted"
            aria-label="Развернуть участников"
          >
            {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        </td>
        <td className="px-4 py-2 whitespace-nowrap ">{row.typeTitle || '—'}</td>
        <td className="px-4 py-2 text-right whitespace-nowrap ">{row.caseNumber || '—'}</td>
        <td className="px-4 py-2 text-right whitespace-nowrap ">{formatDate(row.date) || '—'}</td>
        <td className="px-4 py-2 text-right ">
          {row.url ? (
            <a href={row.url} target="_blank" rel="noopener noreferrer">
              Перейти
            </a>
          ) : (
            '—'
          )}
        </td>
      </tr>

      {open && row.participants?.length > 0 && (
        <tr>
          <td colSpan={5} className="px-4 pb-3 pt-1">
            <p className="mb-2 text-sm font-semibold">Участники</p>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="pb-1 pr-4 text-left font-normal">Имя</th>
                  <th className="pb-1 px-4 text-right font-normal">Адрес</th>
                  <th className="pb-1 px-4 text-right font-normal">Тип</th>
                  <th className="pb-1 pl-4 text-right font-normal">ИНН</th>
                </tr>
              </thead>
              <tbody>
                {row.participants.map((p, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-1.5 pr-4 align-top">{p.name || '—'}</td>
                    <td className="py-1.5 px-4 text-right align-top">{p.address || '—'}</td>
                    <td className="py-1.5 px-4 text-right align-top">{ROLE_MAP[p.type] ?? '—'}</td>
                    <td className="py-1.5 pl-4 text-right align-top">{p.inn || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  )
}
