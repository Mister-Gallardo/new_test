'use client'

import { useState, useTransition } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { saveTokens } from '@/shared/api/actions'
import { paths } from '@/shared/config/paths'
import { Button } from '@/shared/ui/button'

import { checkPhone, resetPassword, sendVerificationCode, signIn, signUp } from '../api'
import { FORM_DEFAULT_VALUES, STEP_TITLES } from '../configs'
import { getSchemaForStep, getSubmitLabel } from '../lib'
import type { AuthFormValues } from '../model'
import {
  type AuthStep,
  resetFields,
  type ResetPasswordVerifyFormValues,
  type SigninFormValues,
  type SignupVerifyFormValues,
} from '../model'

import { PhoneField } from './phone-field'
import { ResetPasswordFields } from './reset-password-fields'
import { SigninFields } from './signin-fields'
import { SignupFields } from './signup-fields'

export function AuthForm() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const [step, setStep] = useState<AuthStep>('phone')
  const [isPending, startTransition] = useTransition()

  const { handleSubmit, control, setError, reset, getValues } = useForm<AuthFormValues>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(getSchemaForStep(step) as any),
    defaultValues: FORM_DEFAULT_VALUES,
  })

  const handleResendCode = async () => {
    const phone = getValues('phone')
    const purpose = step === 'signup-verify' ? 'signup' : 'reset'
    const result = await sendVerificationCode(phone, purpose)

    if (!result.success) {
      toast.error(result.error)
    }
  }

  const handleSignIn = async (
    data: SigninFormValues,
    step: Extract<AuthStep, 'signin' | 'signup-verify' | 'reset-verify'>,
  ) => {
    const signinResult = await signIn(data.phone, data.password)
    if (!signinResult.success) {
      setError(step === 'reset-verify' ? 'newPassword' : 'password', {
        message: signinResult.error,
      })
      toast.error(signinResult.error)
      return
    }

    const decoded = jwtDecode<{ sub: string }>(signinResult.data.idToken)

    await saveTokens(signinResult.data.accessToken, signinResult.data.refreshToken, decoded.sub)

    queryClient.clear()

    startTransition(() => {
      router.refresh()
      router.push(paths.home())
    })
  }

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      switch (step) {
        case 'phone': {
          const checkResult = await checkPhone(data.phone)
          if (!checkResult.success) {
            toast.error(checkResult.error)
            return
          }
          setStep(checkResult.data.isRegistered ? 'signin' : 'signup')
          reset(undefined, { keepValues: true })
          break
        }

        case 'signin': {
          const signInData = data as SigninFormValues
          await handleSignIn(signInData, 'signin')
          break
        }

        case 'signup': {
          const codeResult = await sendVerificationCode(data.phone, 'signup')
          if (!codeResult.success) {
            toast.error(codeResult.error)
            return
          }
          setStep('signup-verify')
          reset(undefined, { keepValues: true })
          break
        }

        case 'signup-verify': {
          const signupData = data as SignupVerifyFormValues
          const regResult = await signUp(
            signupData.phone,
            signupData.password,
            signupData.confirmPassword,
            signupData.verificationCode,
          )
          if (!regResult.success) {
            setError('verificationCode', { message: regResult.error })
            return
          }
          sessionStorage.setItem('isJustRegistered', 'true')
          await handleSignIn(
            { phone: signupData.phone, password: signupData.password },
            'signup-verify',
          )
          break
        }

        case 'reset': {
          const codeResult = await sendVerificationCode(data.phone, 'reset')
          if (!codeResult.success) {
            toast.error(codeResult.error)
            return
          }
          setStep('reset-verify')
          reset(undefined, { keepValues: true })
          break
        }

        case 'reset-verify': {
          const resetData = data as ResetPasswordVerifyFormValues
          const resetResult = await resetPassword(
            resetData.phone,
            resetData.verificationCode,
            resetData.newPassword,
            resetData.confirmPassword,
          )
          if (!resetResult.success) {
            setError('verificationCode', { message: resetResult.error })
            return
          }
          await handleSignIn(
            { phone: resetData.phone, password: resetData.newPassword },
            'reset-verify',
          )
          break
        }
      }
    })
  })

  const handleBack = () => {
    switch (step) {
      case 'signin':
      case 'signup':
        resetFields(reset, getValues, step)
        setStep('phone')
        break
      case 'signup-verify':
        resetFields(reset, getValues, step)
        setStep('signup')
        break
      case 'reset':
        resetFields(reset, getValues, step)
        setStep('signin')
        break
      case 'reset-verify':
        resetFields(reset, getValues, step)
        setStep('reset')
        break
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <h1 className="text-center text-lg font-medium">{STEP_TITLES[step]}</h1>

      <form onSubmit={onSubmit} className="flex w-full max-w-110 min-w-77 flex-col gap-3 px-3">
        <PhoneField control={control} disabled={step !== 'phone'} />

        {step === 'signin' && <SigninFields control={control} />}

        {(step === 'signup' || step === 'signup-verify') && (
          <SignupFields
            control={control}
            codeSent={step === 'signup-verify'}
            onResendCode={handleResendCode}
          />
        )}

        {(step === 'reset' || step === 'reset-verify') && (
          <ResetPasswordFields
            control={control}
            codeSent={step === 'reset-verify'}
            onResendCode={handleResendCode}
          />
        )}

        <Button type="submit" size="lg" disabled={isPending} className="mt-1 w-full">
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          {getSubmitLabel(step, isPending)}
        </Button>

        {step === 'signin' && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => {
              resetFields(reset, getValues, 'signin')
              setStep('reset')
            }}
          >
            Восстановить пароль
          </Button>
        )}

        {/* Кнопка «Назад» */}
        {step !== 'phone' && (
          <Button type="button" variant="ghost" size="lg" className="w-full" onClick={handleBack}>
            Назад
          </Button>
        )}
      </form>
    </div>
  )
}
