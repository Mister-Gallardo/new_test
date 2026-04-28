'use client'

import { useEffect, useRef, useTransition } from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Filter, InfoIcon, RotateCcw, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import isEqual from 'react-fast-compare'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { useEmail } from '@/entities/user/model/email-provider'
import type { FilterFormValues } from '@/features/contracts-filter/model'
import { paths } from '@/shared/config/paths'
import { useDebounce } from '@/shared/lib/use-debounce'
import { cn } from '@/shared/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog'
import { AppTooltip } from '@/shared/ui/app-tooltip'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import { Switch } from '@/shared/ui/switch'

import { deleteTemplate, fetchMailingStatus, toggleMailing, updateTemplate } from '../../api'
import { DEBOUNCE_MS, DEFAULT_FILTERS } from '../../config'
import { sanitize } from '../../lib'
import { isStateDefault } from '../../model'
import { useTemplateParams, useTemplateStore } from '../../model'
import { FilterFormFields } from '../filter-form-fields'

type TemplateFilterProps = {
  name: string
  initialFilters: FilterFormValues
  templateId: string
}

export function TemplateFilter({ name, initialFilters, templateId }: TemplateFilterProps) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { status } = useEmail()

  const isEmailConfirmed = status === 'confirmed'
  const isEmailVerifying = status === 'verifying'

  const [isPending, startTransition] = useTransition()

  const isInitialized = useRef(false)
  const isSystemUpdate = useRef(false)

  const {
    zFilters,
    zPage,
    templateId: zTemplateId,
    _hasZHydrated,
    setZFilters,
    setZPage,
    setTemplateId,
    resetZFilters,
    resetStore,
  } = useTemplateStore()

  const { qFilters, qPage, setQFilters, resetQFilters } = useTemplateParams()

  const { control, reset, getValues } = useForm<FilterFormValues>({
    defaultValues: initialFilters,
  })

  const formFilters = useWatch({ control })

  useEffect(() => {
    setTemplateId(templateId)
  }, [templateId, setTemplateId])

  const { data: mailingActive, isLoading: mailingLoading } = useQuery({
    queryKey: ['mailingStatus', templateId],
    queryFn: async () => {
      const res = await fetchMailingStatus(templateId)

      if (!res.success) throw new Error(res.error)

      return res?.data?.isActive ?? false
    },
  })

  useEffect(() => {
    if (!_hasZHydrated || isInitialized.current) return

    const isUrlEmpty = !window.location.search
    const isStoreDefault = isStateDefault(zFilters) && zPage === 1 && !zTemplateId

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
      reset(initialFilters)
      setZFilters(initialFilters)
      setTimeout(() => {
        setQFilters({ ...initialFilters, page: 1 })
      }, 0)
    }

    isInitialized.current = true
    isSystemUpdate.current = true
  }, [
    _hasZHydrated,
    zFilters,
    zPage,
    qFilters,
    qPage,
    initialFilters,
    setQFilters,
    reset,
    setZFilters,
    setZPage,
    zTemplateId,
  ])

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

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateTemplate(templateId, name, getValues())

      if (res.success) {
        toast.success('Шаблон сохранён')
      } else {
        toast.error(res.error)
      }
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteTemplate(templateId)

      if (res.success) {
        resetStore()
        queryClient.invalidateQueries({ queryKey: ['templates'] })
        toast.success('Шаблон успешно удалён')
        router.push(paths.templates.root())
      } else {
        toast.error(res.error)
      }
    })
  }

  const handleMailingToggle = (checked: boolean) => {
    if (!isEmailConfirmed) return

    queryClient.setQueryData(['mailingStatus', templateId], checked)

    startTransition(async () => {
      const res = await toggleMailing(templateId, checked)

      if (!res.success) {
        toast.error(res.error)
        queryClient.invalidateQueries({ queryKey: ['mailingStatus', templateId] })
      }
    })
  }

  return (
    <aside className="w-full lg:w-85 shrink-0 mb-5 lg:mb-0">
      <div className="sticky top-21 z-10 rounded-xl border bg-primary-foreground p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Filter className="fill-brand-accent size-5 text-brand-accent" />
          <h2 className="text-base font-semibold">{name ?? 'Фильтры'}</h2>
        </div>

        <div className="flex flex-col gap-4">
          <FilterFormFields control={control} />

          <AppTooltip
            enabled={!isEmailConfirmed}
            content={
              <p>
                {isEmailVerifying ? (
                  <>
                    Необходимо <Link href={paths.account()}>подтвердить</Link> почту в личном
                    кабинете.
                  </>
                ) : (
                  <>
                    Необходимо <Link href={paths.account()}>добавить</Link> почту в личном кабинете.
                  </>
                )}
              </p>
            }
          >
            <div
              className={cn(
                'flex items-center justify-between py-1 cursor-pointer',
                !isEmailConfirmed && 'cursor-not-allowed',
              )}
            >
              <div
                className={cn(
                  'flex flex-1 items-center justify-between',
                  !isEmailConfirmed && 'pointer-events-none',
                )}
              >
                <Label
                  htmlFor="mailing-toggle"
                  className={cn(
                    'flex flex-1 items-center gap-2 cursor-pointer py-1',
                    !isEmailConfirmed && 'cursor-not-allowed',
                  )}
                >
                  <span className="text-sm font-normal">Рассылка на почту</span>

                  {isEmailConfirmed && (
                    <AppTooltip
                      content={
                        <p>Рассылка выполняется в 12:00 по МСК во вторник, четверг и пятницу.</p>
                      }
                    >
                      <InfoIcon className="text-brand-primary size-4.5 opacity-80" />
                    </AppTooltip>
                  )}
                </Label>
                <Switch
                  id="mailing-toggle"
                  checked={mailingActive ?? false}
                  onCheckedChange={handleMailingToggle}
                  disabled={mailingLoading || isPending || !isEmailConfirmed}
                />
              </div>
            </div>
          </AppTooltip>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="lg"
                className="w-full gap-2"
                disabled={
                  isPending ||
                  isEqual(initialFilters, formFilters) ||
                  isStateDefault(formFilters as FilterFormValues)
                }
              >
                <Save className="size-4" />
                Сохранить изменения
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Сохранить изменения?</AlertDialogTitle>
                <AlertDialogDescription>
                  Текущие фильтры будут сохранены в шаблон.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={handleSave}>Сохранить</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full gap-2" disabled={isPending}>
                <Trash2 className="size-4" />
                Удалить шаблон
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить шаблон?</AlertDialogTitle>
                <AlertDialogDescription>
                  Это действие необратимо. Шаблон будет удалён без возможности восстановления.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive! text-destructive-foreground"
                >
                  Удалить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

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
