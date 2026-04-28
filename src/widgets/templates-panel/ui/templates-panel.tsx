'use client'

import { useEffect, useState } from 'react'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'
import Link from 'next/link'

import { fetchTemplates, TemplateCard } from '@/entities/template'
import { useEmail } from '@/entities/user/model/email-provider'
import { useTemplateStore } from '@/features/contracts-filter'
import { Pagination } from '@/features/pagination'
import {
  DEFAULT_PAGE_SIZE,
  TemplatesMailingDialog,
  useTemplatesSearchParams,
} from '@/features/templates'
import { paths } from '@/shared/config/paths'
import { useDebounce } from '@/shared/lib/use-debounce'
import { cn } from '@/shared/lib/utils'
import { AppListEmpty } from '@/shared/ui/app-list-empty'
import { AppTooltip } from '@/shared/ui/app-tooltip'
import { Button } from '@/shared/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/shared/ui/input-group'

import { TemplatesSkeleton } from './templates-skeleton'

export const TemplatesPanel = () => {
  const { status } = useEmail()

  const { resetStore } = useTemplateStore()

  const { page, q, getTotalPages, setPage, setQuery } = useTemplatesSearchParams()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [localSearch, setLocalSearch] = useState(q)

  useEffect(() => {
    resetStore()
  }, [resetStore])

  const { data, isFetching } = useQuery({
    queryKey: ['templates', page],
    queryFn: async () => {
      const res = await fetchTemplates(page, DEFAULT_PAGE_SIZE)

      if (!res.success) throw new Error(res.error)

      return res.data
    },
    placeholderData: keepPreviousData,
  })

  const debouncedSetQuery = useDebounce((value: string) => setQuery(value), 400)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalSearch(value)
    debouncedSetQuery(value)
  }

  const handleClear = () => {
    setLocalSearch('')
    setQuery('')
  }

  const handleOpenDialog = () => setDialogOpen(true)

  const filteredItems =
    data?.items?.filter((item) => item.name.toLowerCase().includes(q.toLowerCase())) || []

  const totalPages = getTotalPages(data?.total || 0)

  if (isFetching && !data) {
    return (
      <div className="w-full">
        <TemplatesSkeleton />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-12 w-full">
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-5">
        <InputGroup className="px-2 w-full md:w-100 order-2 md:order-1">
          <InputGroupInput
            value={localSearch}
            onChange={handleInputChange}
            placeholder="Поиск по названию"
            id="input-group-url"
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          {q && (
            <InputGroupAddon align="inline-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="px-1.5 rounded-full"
              >
                <X />
              </Button>
            </InputGroupAddon>
          )}
        </InputGroup>

        <AppTooltip
          enabled={status !== 'confirmed'}
          content={
            <p>
              {status === 'verifying' ? (
                <>
                  Необходимо <Link href={paths.account()}>подтвердить</Link> почту в личном кабинете.
                </>
              ) : (
                <>
                  Необходимо <Link href={paths.account()}>добавить</Link> почту в личном кабинете.
                </>
              )}
            </p>
          }
        >
          <Button
            variant="outline"
            onClick={() => {
              if (status === 'confirmed') {
                handleOpenDialog()
              }
            }}
            className={cn(
              'border-brand-primary text-brand-primary hover:text-brand-primary hover:bg-brand-primary/10 order-1 md:order-2 px-10 h-10',
              status !== 'confirmed' && 'cursor-not-allowed',
            )}
          >
            Настройка рассылки
          </Button>
        </AppTooltip>
      </div>

      {filteredItems.length ? (
        <>
          <div className="flex flex-wrap gap-x-6 gap-y-4 w-full">
            {filteredItems.map((item) => (
              <TemplateCard item={item} key={item.id} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      ) : (
        <AppListEmpty contentText="Попробуйте изменить параметры поиска или добавить фильтры в шаблон" />
      )}

      <TemplatesMailingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        templates={data?.items || []}
      />
    </div>
  )
}
