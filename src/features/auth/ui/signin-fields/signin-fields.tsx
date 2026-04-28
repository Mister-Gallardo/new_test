'use client'

import { type Control } from 'react-hook-form'

import { PasswordField } from '../password-field'

interface SigninFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export function SigninFields({ control }: SigninFieldsProps) {
  return <PasswordField control={control} name="password" label="Пароль" />
}
