'use client'

import { useEffect, useTransition } from 'react'

import { useQuery } from '@tanstack/react-query'
import isEqual from 'react-fast-compare'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import type { Template, TemplateMailing } from '@/entities/template'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'

import { activateTemplatesMailing, fetchTemplatesMailings } from '../api'

type FormValues = {
  templateIds: string[]
}

type TemplatesMailingDialogProps = {
  open: boolean
  onClose: () => void
  templates: Template[]
}

export const TemplatesMailingDialog = ({
  open,
  onClose,
  templates,
}: TemplatesMailingDialogProps) => {
  const [isPending, startTransition] = useTransition()

  const { data: mailingsData = [], refetch: mailingsRefetch } = useQuery({
    queryKey: ['templatesMailings'],
    queryFn: async () => {
      const res = await fetchTemplatesMailings()
      if (!res.success) throw new Error(res.error)
      return res.data
    },
    enabled: open,
  })

  const activeTemplateIds = mailingsData.filter((t) => t.isActive).map((t) => t.templateId)

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { templateIds: [] },
  })

  const formTemplateIds = useWatch({ control }).templateIds || []

  useEffect(() => {
    if (open) {
      reset({ templateIds: activeTemplateIds })
    }
  }, [open, activeTemplateIds, reset])

  const handleClose = () => {
    onClose()
    reset({ templateIds: activeTemplateIds })
  }

  const isChanged = !isEqual([...formTemplateIds].sort(), [...activeTemplateIds].sort())

  const onSubmit = handleSubmit((data) => {
    handleClose()

    startTransition(async () => {
      const payload: TemplateMailing[] = templates.map((item) => ({
        templateId: item.id,
        isActive: data.templateIds.includes(item.id),
      }))

      const res = await activateTemplatesMailing(payload)

      if (!res.success) {
        toast.error(res.error)
        return
      }

      toast.success('Рассылка успешно настроена!')
      mailingsRefetch()
    })
  })

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-120 max-h-[95dvh] sm:max-h-[80dvh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Шаблоны для рассылки</DialogTitle>

          <DialogDescription className="bg-black/5 rounded-xl p-3 mt-2 text-sm font-medium">
            Рассылка выполняется в 12:00 по МСК во вторник, четверг и пятницу
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto pr-2 flex flex-col gap-1">
          <Controller
            name="templateIds"
            control={control}
            render={({ field }) => (
              <>
                {templates.map((item) => {
                  const isChecked = field.value.includes(item.id)
                  return (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 py-2 cursor-pointer group"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          field.onChange(
                            checked
                              ? [...field.value, item.id]
                              : field.value.filter((id) => id !== item.id),
                          )
                        }}
                      />
                      <span className="text-sm wrap-break-word flex-1 group-hover:text-brand-primary transition-colors">
                        {item.name}
                      </span>
                    </label>
                  )
                })}
              </>
            )}
          />
        </div>

        <DialogFooter className="shrink-0 gap-2">
          <Button variant="ghost" onClick={handleClose} disabled={isPending}>
            Отмена
          </Button>
          <Button onClick={onSubmit} disabled={isPending || !isChanged}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
