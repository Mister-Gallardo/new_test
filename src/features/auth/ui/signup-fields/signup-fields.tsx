import { env } from '@/shared/config/env'

import Link from 'next/link'
import { type Control, Controller } from 'react-hook-form'

import { Checkbox } from '@/shared/ui/checkbox'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/shared/ui/field'

import { PasswordField } from '../password-field'
import { VerificationCodeField } from '../verification-code-field'

interface SignupFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  codeSent: boolean
  onResendCode: () => Promise<void> | void
}

export function SignupFields({ control, codeSent, onResendCode }: SignupFieldsProps) {
  return (
    <div className="flex flex-col gap-3">
      <PasswordField control={control} name="password" label="Пароль" disabled={codeSent} />

      <PasswordField
        control={control}
        name="confirmPassword"
        label="Повторите пароль"
        disabled={codeSent}
      />

      {codeSent && (
        <VerificationCodeField control={control} name="verificationCode" onResend={onResendCode} />
      )}

      <Controller
        name="agreeWithPrivacy"
        control={control}
        defaultValue={false}
        render={({ field, fieldState }) => (
          <Field orientation="horizontal" data-disabled={codeSent || undefined}>
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-row items-center gap-2">
                <Checkbox
                  id="agreeWithPrivacy"
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  disabled={codeSent}
                />
                <FieldLabel htmlFor="agreeWithPrivacy" className="flex flex-col gap-1.5">
                  <FieldContent>
                    <FieldDescription>
                      Я согласен на{' '}
                      <Link
                        href={`${env.NEXT_PUBLIC_API_URI}/privacy`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        обработку персональных данных
                      </Link>
                    </FieldDescription>
                  </FieldContent>
                </FieldLabel>
              </div>
              <FieldError errors={[fieldState.error]} />
            </div>
          </Field>
        )}
      />
    </div>
  )
}
