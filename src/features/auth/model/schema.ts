import { z } from 'zod'

const phoneRegex = /^\+7\d{10}$/

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, 'Введите номер телефона')
    .regex(phoneRegex, 'Введите корректный номер телефона'),
})

export const passwordRules = z
  .string()
  .min(8, 'Минимум 8 символов')
  .regex(
    /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/,
    'Только латинские буквы, цифры и спецсимволы',
  )
  .regex(/[a-z]/, 'Минимум одна строчная буква')
  .regex(/[A-Z]/, 'Минимум одна заглавная буква')
  .regex(/[0-9]/, 'Минимум одна цифра')

export const signinSchema = phoneSchema.extend({
  password: z.string().min(1, 'Введите пароль'),
})

export const signupSchema = phoneSchema
  .extend({
    password: passwordRules,
    confirmPassword: z.string().min(1, 'Повторите пароль'),
    agreeWithPrivacy: z.boolean().refine((val) => val === true, {
      message: 'Необходимо согласие на обработку данных',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

export const signupVerifySchema = phoneSchema
  .extend({
    password: passwordRules,
    confirmPassword: z.string().min(1, 'Повторите пароль'),
    agreeWithPrivacy: z.boolean().refine((val) => val === true, {
      message: 'Необходимо согласие на обработку данных',
    }),
    verificationCode: z.string().min(1, 'Введите код из SMS').regex(/^\d+$/, 'Только цифры'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

export const resetPasswordSchema = phoneSchema
  .extend({
    newPassword: passwordRules,
    confirmPassword: z.string().min(1, 'Повторите пароль'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

export const resetPasswordVerifySchema = phoneSchema
  .extend({
    newPassword: passwordRules,
    confirmPassword: z.string().min(1, 'Повторите пароль'),
    verificationCode: z.string().min(1, 'Введите код').regex(/^\d+$/, 'Только цифры'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })
