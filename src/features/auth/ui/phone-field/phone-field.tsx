'use client'

import { type ChangeEvent } from 'react'

import { Phone } from 'lucide-react'
import { type Control, Controller } from 'react-hook-form'

import { Field, FieldError } from '@/shared/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/shared/ui/input-group'

import { applyPhoneMask } from '../../lib/utils'

interface PhoneFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name?: string
  disabled?: boolean
}

export function PhoneField({ control, name = 'phone', disabled }: PhoneFieldProps) {
  const handleChange =
    (onChange: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      let raw = e.target.value.replace(/\D/g, '')

      // Если вставили длинный номер с кодом (7 или 8), отсекаем его код
      if (raw.length >= 11 && (raw.startsWith('7') || raw.startsWith('8'))) {
        // Если это длинный номер (например, +79991234567 -> 79991234567), берем последние 10 цифр (999...)
        raw = raw.slice(-10)
      }

      // Если первый оставшийся символ не 9 — игнорируем, либо если пытаются ввести любую другую цифру первой
      if (raw.length > 0 && raw[0] !== '9') {
        return
      }

      // Ограничиваем длину 10 цифрами
      raw = raw.slice(0, 10)

      const rawPhone = raw.length > 0 ? '+7' + raw : ''
      onChange(rawPhone)
    }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => {
        const displayValue = field.value ? applyPhoneMask(field.value).replace(/^\+7\s?/, '') : ''

        return (
          <Field data-invalid={!!fieldState.error || undefined}>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupText className="gap-0.5">
                  <Phone className="size-4 text-muted-foreground mr-1" />
                  <span className="font-medium text-base md:text-sm">+7</span>
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                {...field}
                value={displayValue}
                onChange={handleChange(field.onChange)}
                placeholder="999 999 99 99"
                inputMode="numeric"
                disabled={disabled}
                aria-invalid={!!fieldState.error}
                autoComplete="tel"
              />
            </InputGroup>
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )
      }}
    />
  )
}
