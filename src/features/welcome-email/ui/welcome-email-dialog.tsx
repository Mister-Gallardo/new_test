'use client'

import { env } from '@/shared/config/env'

import { useState, useTransition } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Mail, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { sendVerificationEmail } from '@/entities/user/api'
import { type EmailForm, EmailFormSchema } from '@/entities/user/model/schema'
import { formatTimeMessage } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Field, FieldError } from '@/shared/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/shared/ui/input-group'

const SESSION_KEY = 'isJustRegistered'

export function WelcomeEmailDialog() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') return false

    return sessionStorage.getItem(SESSION_KEY) === 'true'
  })
  const [isPending, startTransition] = useTransition()

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<EmailForm>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: { email: '', agree: false },
  })

  const [agree, email] = useWatch({ control, name: ['agree', 'email'] })

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.removeItem(SESSION_KEY)
  }

  const onSubmit = handleSubmit((data: EmailForm) => {
    startTransition(async () => {
      const result = await sendVerificationEmail(data.email)

      if (result.success) {
        handleClose()
        toast.success('Подтвердите почту по ссылке в письме')
        router.refresh()
      } else if (result.error?.includes('уже используется')) {
        setError('email', { message: result.error })
      } else if (result.timeUntilNextSendSeconds && result.timeUntilNextSendSeconds > 0) {
        toast.warning(
          `Подождите ${formatTimeMessage(result.timeUntilNextSendSeconds)} перед повторной отправкой`,
        )
      } else {
        toast.error(result.error ?? 'Не удалось отправить письмо.')
      }
    })
  })

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-120 p-0 overflow-hidden gap-0">
        <div className="relative bg-linear-to-br from-primary/90 to-primary px-6 pt-10 pb-8 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15)_0%,transparent_60%)]" />
          <div className="relative flex flex-col items-center gap-3 text-center">
            <div className="flex items-center justify-center size-12 rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
              <Sparkles className="size-6" />
            </div>
            <DialogHeader className="items-center gap-1">
              <DialogTitle className="text-lg font-semibold">
                Добро пожаловать в Тендерград!
              </DialogTitle>
              <DialogDescription className="text-white/80 text-sm leading-relaxed max-w-xs">
                Укажите почту для получения информационной рассылки с контрактами
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 p-6">
          <Field data-invalid={!!errors.email || undefined}>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <Mail className="size-4 text-muted-foreground/80" />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                autoFocus
                type="email"
                placeholder="mail@mail.ru"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
            </InputGroup>
            <FieldError>{errors.email?.message}</FieldError>
          </Field>

          <label className="flex select-none items-center gap-2 text-xs text-muted-foreground">
            <Checkbox
              checked={agree}
              onCheckedChange={(checked) => setValue('agree', checked === true)}
              className="mt-0.5 shrink-0"
            />
            <span>
              Даю свое согласие на получение{' '}
              <Link
                href={`${env.NEXT_PUBLIC_API_URI}/privacy`}
                target="_blank"
                className="font-bold"
              >
                информационной рассылки
              </Link>
            </span>
          </label>

          <div className="flex flex-col gap-2 pt-1">
            <Button
              type="submit"
              size="lg"
              disabled={!agree || !email || isPending}
              className="w-full"
            >
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isPending ? 'Отправка...' : 'Подтвердить почту'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="py-4 text-muted-foreground"
            >
              Пропустить
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
