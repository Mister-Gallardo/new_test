import type { ZodType } from 'zod'

import type { AuthFormValues, AuthStep } from '../model'
import {
  phoneSchema,
  resetPasswordSchema,
  resetPasswordVerifySchema,
  signinSchema,
  signupSchema,
  signupVerifySchema,
} from '../model'

export function formatPhone(phone: string): string {
  return '+' + phone.replace(/\D/g, '')
}

export function applyPhoneMask(raw: string): string {
  let digits = raw.replace(/\D/g, '')

  if (digits.startsWith('8') && digits.length > 1) {
    digits = '7' + digits.slice(1)
  }

  if (!digits.startsWith('7') && digits.length > 0) {
    digits = '7' + digits
  }

  digits = digits.slice(0, 11)

  let result = '+7'
  const rest = digits.slice(1)

  if (rest.length > 0) result += ' ' + rest.slice(0, 3)
  if (rest.length > 3) result += ' ' + rest.slice(3, 6)
  if (rest.length > 6) result += ' ' + rest.slice(6, 8)
  if (rest.length > 8) result += ' ' + rest.slice(8, 10)

  return result
}

export function getSubmitLabel(step: AuthStep, isPending: boolean): string {
  switch (step) {
    case 'phone':
      return isPending ? 'Проверка...' : 'Далее'
    case 'signin':
      return isPending ? 'Авторизация...' : 'Войти'
    case 'signup':
      return isPending ? 'Отправка...' : 'Отправить код подтверждения'
    case 'signup-verify':
      return isPending ? 'Регистрация...' : 'Зарегистрироваться'
    case 'reset':
      return isPending ? 'Отправка...' : 'Отправить код подтверждения'
    case 'reset-verify':
      return isPending ? 'Восстановление...' : 'Восстановить пароль'
  }
}

export function getSchemaForStep(step: AuthStep): ZodType<AuthFormValues> {
  const schemas = {
    phone: phoneSchema,
    signin: signinSchema,
    signup: signupSchema,
    'signup-verify': signupVerifySchema,
    reset: resetPasswordSchema,
    'reset-verify': resetPasswordVerifySchema,
  } as const

  return schemas[step] as ZodType<AuthFormValues>
}
