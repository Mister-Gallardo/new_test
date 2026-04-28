'use client'

import { env } from '@/shared/config/env'

import { useEffect, useTransition } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, CircleCheck, Loader2, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import type { EmailInfo } from '@/entities/user'
import { sendVerificationEmail } from '@/entities/user/api'
import type { EmailForm } from '@/entities/user/model/schema'
import { EmailFormSchema } from '@/entities/user/model/schema'
import { formatTimeMessage } from '@/shared/lib/utils'
import { AppTooltip } from '@/shared/ui/app-tooltip'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { FieldError } from '@/shared/ui/field'
import { Input } from '@/shared/ui/input'

type EmailFormProps = {
  emailInfo: EmailInfo
}

export function EmailFormGroup({ emailInfo }: EmailFormProps) {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<EmailForm>({
    defaultValues: {
      email: emailInfo.confirmedEmail ?? '',
      agree: false,
    },
    resolver: zodResolver(EmailFormSchema),
  })

  useEffect(() => {
    const initialEmail = emailInfo.confirmedEmail ?? ''

    setValue('email', initialEmail)
  }, [emailInfo, setValue])

  const [agree, email] = useWatch({
    control,
    name: ['agree', 'email'],
  })

  const onSubmit = handleSubmit((data) => {
    if (emailInfo.confirmedEmail === data.email) {
      setError('email', { message: 'Введите новый email' })
      return
    }

    startTransition(async () => {
      const result = await sendVerificationEmail(data.email)

      if (result.success) {
        toast.success('Подтвердите почту по ссылке в письме')
        router.refresh()
        setValue('agree', false)
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

  return (
    <div className="rounded-lg border bg-background p-4 transition-all hover:shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <Mail className="size-4 text-primary stroke-2" />
        <p className="text-xs font-medium text-muted-foreground">Почта для рыссылки</p>

        {emailInfo.confirmedEmail && <CircleCheck className="size-4 text-green-500" />}
        {emailInfo.newEmail && (
          <AppTooltip
            content={
              <p>
                Письмо подтверждения отправлено на{' '}
                <span className="font-bold">{emailInfo.newEmail}</span>
              </p>
            }
          >
            <CircleAlert className="size-4 cursor-help text-amber-500" />
          </AppTooltip>
        )}

        {!emailInfo.confirmedEmail && !emailInfo.newEmail && (
          <CircleAlert className="size-4 text-amber-500" />
        )}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="mail@mail.ru"
              {...register('email')}
              aria-invalid={!!errors.email}
            />
            <FieldError className="text-xs mt-1">{errors.email?.message}</FieldError>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!agree || !email || isPending}
            className="w-full shrink-0 sm:w-auto"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {emailInfo.confirmedEmail ? 'Изменить почту' : 'Добавить почту'}
          </Button>
        </div>

        <label className="flex select-none items-center gap-2 text-xs text-muted-foreground">
          <Checkbox
            checked={agree}
            onCheckedChange={(checked) => setValue('agree', checked === true)}
          />
          <span>
            Даю свое согласие на получение{' '}
            <Link href={`${env.NEXT_PUBLIC_API_URI}/privacy`} target="_blank" className="font-bold">
              информационной рассылки
            </Link>
          </span>
        </label>
      </form>
    </div>
  )
}
