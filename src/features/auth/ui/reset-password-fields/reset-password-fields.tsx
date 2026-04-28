'use client'

import { type Control } from 'react-hook-form'

import { PasswordField } from '../password-field'
import { VerificationCodeField } from '../verification-code-field'

interface ResetPasswordFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  codeSent: boolean
  onResendCode: () => Promise<void> | void
}

export function ResetPasswordFields({ control, codeSent, onResendCode }: ResetPasswordFieldsProps) {
  return (
    <div className="flex flex-col gap-3">
      <PasswordField
        control={control}
        name="newPassword"
        label="Новый пароль"
        disabled={codeSent}
      />
      <PasswordField
        control={control}
        name="confirmPassword"
        label="Повторите пароль"
        disabled={codeSent}
      />

      {codeSent && (
        <VerificationCodeField control={control} name="verificationCode" onResend={onResendCode} />
      )}
    </div>
  )
}
