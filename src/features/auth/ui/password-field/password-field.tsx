'use client'

import { useState } from 'react'

import { Eye, EyeOff, Lock } from 'lucide-react'
import { type Control, Controller } from 'react-hook-form'

import { MAX_LENGTH_MEDIUM } from '@/shared/config/constants'
import { Field, FieldError } from '@/shared/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/shared/ui/input-group'

interface PasswordFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  label?: string
  disabled?: boolean
}

export function PasswordField({ control, name, label = 'Пароль', disabled }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible((v) => !v)
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => (
        <Field data-invalid={!!fieldState.error || undefined}>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>
                <Lock className="size-4 text-muted-foreground" />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              {...field}
              type={visible ? 'text' : 'password'}
              placeholder={label}
              disabled={disabled}
              aria-invalid={!!fieldState.error}
              maxLength={MAX_LENGTH_MEDIUM}
              autoComplete={
                name.includes('new') || name.includes('confirm')
                  ? 'new-password'
                  : 'current-password'
              }
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                onClick={toggleVisibility}
                aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldError>{fieldState.error?.message}</FieldError>
        </Field>
      )}
    />
  )
}
