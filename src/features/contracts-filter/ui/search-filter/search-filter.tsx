'use client'

import { useEffect, useRef, useState, useTransition } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { Bookmark, Filter, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import isEqual from 'react-fast-compare'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { useSession } from '@/entities/user/model/session-provider'
import { paths } from '@/shared/config/paths'
import { useDebounce } from '@/shared/lib/use-debounce'
import { AppTooltip } from '@/shared/ui/app-tooltip'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'

import { createTemplate } from '../../api'
import { DEBOUNCE_MS, DEFAULT_FILTERS } from '../../config'
import { sanitize } from '../../lib'
import type { FilterFormValues } from '../../model'
import { isStateDefault, useSearchParams, useSearchStore } from '../../model'
import { FilterFormFields } from '../filter-form-fields'

export function SearchFilter() {
  const { isAuth } = useSession()

  const queryClient = useQueryClient()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [templateName, setTemplateName] = useState('')

  const [isPending, startTransition] = useTransition()

  const isTemplateNameValid = templateName.length >= 3 && templateName.length <= 20

  const isInitialized = useRef(false)
  const isSystemUpdate = useRef(false)

  const { zFilters, zPage, _hasZHydrated, setZFilters, setZPage, resetZFilters } = useSearchStore()
  const { qFilters, qPage, setQFilters, resetQFilters } = useSearchParams()

  const { control, reset } = useForm<FilterFormValues>({
    defaultValues: DEFAULT_FILTERS,
  })

  const formFilters = useWatch({ control })

  useEffect(() => {
    if (!_hasZHydrated || isInitialized.current) return

    const isUrlEmpty = !window.location.search
    const isStoreDefault = isStateDefault(zFilters) && zPage === 1

    if (!isUrlEmpty) {
      setZFilters(qFilters)
      if (qPage) setZPage(qPage)
      reset(qFilters)
    } else if (!isStoreDefault) {
      reset(zFilters)
      setTimeout(() => {
        setQFilters({ ...zFilters, page: zPage })
      }, 0)
    } else {
      reset(DEFAULT_FILTERS)
    }

    isInitialized.current = true
    isSystemUpdate.current = true
  }, [_hasZHydrated, zFilters, zPage, qFilters, qPage, setQFilters, reset, setZFilters, setZPage])

  const debouncedUpdateFilter = useDebounce((values: FilterFormValues) => {
    const filtersToSync = {
      ...values,
      keywords: sanitize(values.keywords),
      ignoreKeywords: sanitize(values.ignoreKeywords),
      laws: values.laws?.length ? values.laws : DEFAULT_FILTERS.laws,
    }

    setQFilters({ ...filtersToSync, page: 1 })
    setZFilters(filtersToSync)
  }, DEBOUNCE_MS)

  useEffect(() => {
    if (!isInitialized.current) return

    if (isSystemUpdate.current) {
      if (isEqual(formFilters, zFilters)) {
        isSystemUpdate.current = false
      }
      return
    }

    if (isEqual(formFilters, zFilters)) return

    debouncedUpdateFilter(formFilters as FilterFormValues)
  }, [formFilters, zFilters, debouncedUpdateFilter])

  const handleReset = () => {
    resetQFilters()
    resetZFilters()
    reset(DEFAULT_FILTERS)
    isSystemUpdate.current = true
  }

  const onSubmit = (formData: FormData) => {
    const name = formData.get('templateName') as string

    if (name.length < 3 || name.length > 20) return

    setIsModalOpen(false)

    startTransition(async () => {
      const res = await createTemplate(name, formFilters as FilterFormValues)
      if (!res.success) {
        toast.error(res.error)
        return
      }

      toast.success('Шаблон успешно сохранен')
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      setTemplateName('')
    })
  }

  return (
    <aside className="w-full lg:w-85 shrink-0 mb-5 lg:mb-0">
      <div className="sticky top-21 z-10 rounded-xl border bg-primary-foreground p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Filter className="fill-brand-accent size-5 text-brand-accent" />
          <h2 className="text-base font-semibold">Фильтры</h2>
        </div>

        <div className="flex flex-col gap-4">
          <FilterFormFields control={control} />

          {!isAuth ? (
            <AppTooltip
              content={
                <p>
                  <Link href={paths.auth()}>Авторизуйтесь,</Link> чтобы сохранить фильтры.
                </p>
              }
            >
              <Button
                size="lg"
                className="w-full gap-2 cursor-not-allowed"
                disabled={isStateDefault(formFilters as FilterFormValues)}
              >
                <Bookmark className="size-4" />
                Сохранить как шаблон
              </Button>
            </AppTooltip>
          ) : (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  type="button"
                  className="w-full gap-2"
                  disabled={isStateDefault(formFilters as FilterFormValues)}
                >
                  <Bookmark className="size-4" />
                  Сохранить как шаблон
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-150 flex flex-col">
                <form action={onSubmit}>
                  <DialogHeader className="shrink-0">
                    <DialogTitle>Название шаблона</DialogTitle>
                    <DialogDescription>
                      Введите понятное название для фильтров. Длина от 3 до 20 символов.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="py-4">
                    <Input
                      name="templateName"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Например: Закупки IT"
                      minLength={3}
                      maxLength={20}
                      autoFocus
                    />
                    <div className="mt-2 text-right text-xs text-muted-foreground">
                      {templateName.length} / 20
                    </div>
                  </div>

                  <DialogFooter className="shrink-0 gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsModalOpen(false)}
                      disabled={isPending}
                    >
                      Отмена
                    </Button>
                    <Button type="submit" disabled={isPending || !isTemplateNameValid}>
                      Сохранить
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}

          <Button
            variant="ghost"
            className="w-full -mt-1 gap-2 text-muted-foreground hover:text-destructive"
            onClick={handleReset}
          >
            <RotateCcw className="size-4" />
            Сбросить всё
          </Button>
        </div>
      </div>
    </aside>
  )
}
