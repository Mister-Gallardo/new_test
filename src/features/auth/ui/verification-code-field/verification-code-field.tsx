'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { type Control, Controller } from 'react-hook-form'

import { Button } from '@/shared/ui/button'
import { Field, FieldError } from '@/shared/ui/field'
import { Input } from '@/shared/ui/input'

import { TIMER_DURATION } from '../../configs'

interface VerificationCodeFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  onResend: () => Promise<void> | void
  /** Авто-старт таймера при маунте */
  autoStartTimer?: boolean
}

export function VerificationCodeField({
  control,
  name,
  onResend,
  autoStartTimer = true,
}: VerificationCodeFieldProps) {
  const [timer, setTimer] = useState(autoStartTimer ? TIMER_DURATION : 0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          timerRef.current = null
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [])

  useEffect(() => {
    if (autoStartTimer) {
      startTimer()
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [autoStartTimer, startTimer])

  const handleResend = useCallback(async () => {
    if (timer > 0) return
    await onResend()
    setTimer(TIMER_DURATION)
    startTimer()
  }, [timer, onResend, startTimer])

  return (
    <div className="flex flex-col gap-1.5">
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error || undefined}>
            <Input
              {...field}
              placeholder="Код подтверждения"
              inputMode="numeric"
              maxLength={4}
              aria-invalid={!!fieldState.error}
              onChange={(e) => {
                const value = e.target.value
                if (/^\d{0,4}$/.test(value)) {
                  field.onChange(value)
                }
              }}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />
      <div className="flex justify-end">
        <Button
          type="button"
          variant="link"
          size="sm"
          disabled={timer > 0}
          onClick={handleResend}
          className="h-auto p-0 text-xs"
        >
          {timer > 0 ? `Отправить код повторно (${timer} сек)` : 'Отправить код повторно'}
        </Button>
      </div>
    </div>
  )
}
