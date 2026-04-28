import type { AuthStep } from '../model'

export const STEP_TITLES: Record<AuthStep, string> = {
  phone: 'Войти или зарегистрироваться',
  signin: 'Авторизация',
  signup: 'Регистрация',
  'signup-verify': 'Регистрация',
  reset: 'Восстановление пароля',
  'reset-verify': 'Восстановление пароля',
}

export const FORM_DEFAULT_VALUES = {
  phone: '',
  password: '',
  confirmPassword: '',
  agreeWithPrivacy: false,
  verificationCode: '',
  newPassword: '',
}

export const TIMER_DURATION = 120
