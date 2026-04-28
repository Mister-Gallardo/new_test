import type { UseFormGetValues, UseFormReset } from 'react-hook-form'

import { FORM_DEFAULT_VALUES } from '../configs'

import type { AuthFormValues, AuthStep } from './types'

export const resetFields = (
  reset: UseFormReset<AuthFormValues>,
  getValues: UseFormGetValues<AuthFormValues>,
  step?: AuthStep,
) => {
  const currentPhone = getValues('phone') || ''
  const currentValues = getValues()

  if (!step) {
    reset(
      { ...FORM_DEFAULT_VALUES, phone: currentPhone },
      { keepErrors: false, keepTouched: false, keepIsSubmitted: false },
    )
    return
  }

  const newValues = { ...currentValues, phone: currentPhone }

  switch (step) {
    case 'signin':
      newValues.password = ''
      break
    case 'signup':
      newValues.password = ''
      newValues.confirmPassword = ''
      newValues.agreeWithPrivacy = false
      break
    case 'signup-verify':
      newValues.verificationCode = ''
      break
    case 'reset':
      newValues.newPassword = ''
      newValues.confirmPassword = ''
      break
    case 'reset-verify':
      newValues.verificationCode = ''
      break
  }

  reset(newValues, {
    keepErrors: false,
    keepTouched: false,
    keepIsSubmitted: false,
  })
}
