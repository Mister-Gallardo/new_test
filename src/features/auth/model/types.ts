import type { z } from 'zod'

import type {
  phoneSchema,
  resetPasswordSchema,
  resetPasswordVerifySchema,
  signinSchema,
  signupSchema,
  signupVerifySchema,
} from './schema'

export type PhoneFormValues = z.infer<typeof phoneSchema>
export type SigninFormValues = z.infer<typeof signinSchema>
export type SignupFormValues = z.infer<typeof signupSchema>
export type SignupVerifyFormValues = z.infer<typeof signupVerifySchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
export type ResetPasswordVerifyFormValues = z.infer<typeof resetPasswordVerifySchema>
export type AuthFormValues = SigninFormValues &
  Partial<SignupVerifyFormValues> &
  Partial<ResetPasswordVerifyFormValues> & {
    agreeWithPrivacy?: boolean
  }

export type AuthStep = 'phone' | 'signin' | 'signup' | 'signup-verify' | 'reset' | 'reset-verify'