'use server'

import { env } from '@/shared/config/env'

import type { ActionResult } from '@/shared/lib/types'

import { formatPhone } from '../lib'

export async function checkPhone(phone: string): Promise<ActionResult<{ isRegistered: boolean }>> {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_IDENTITY_BASEURL}/api/registration/check-phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: formatPhone(phone) }),
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return { success: false, error: body.errorMessage ?? 'Ошибка проверки номера телефона.' }
    }

    const data = await res.json()
    return { success: true, data: { isRegistered: data.isRegistered } }
  } catch {
    return { success: false, error: 'Ошибка ввода номера телефона.' }
  }
}

export async function sendVerificationCode(
  phone: string,
  purpose: 'signup' | 'reset',
): Promise<ActionResult> {
  try {
    const url =
      purpose === 'signup'
        ? `${env.NEXT_PUBLIC_IDENTITY_BASEURL}/api/registration/send-code`
        : `${env.NEXT_PUBLIC_IDENTITY_BASEURL}/api/recovery/request`

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: formatPhone(phone) }),
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return {
        success: false,
        error: body.errorMessage ?? 'Не удалось отправить код. Попробуйте позже.',
      }
    }

    const data = await res.json()
    if (!data.isSuccess) {
      return { success: false, error: data.errorMessage ?? 'Не удалось отправить код.' }
    }

    return { success: true, data: null }
  } catch {
    return { success: false, error: 'Не удалось отправить код. Попробуйте позже.' }
  }
}

export async function signIn(
  phone: string,
  password: string,
): Promise<ActionResult<{ accessToken: string; refreshToken: string; idToken: string }>> {
  try {
    const params = new URLSearchParams({
      grant_type: 'password',
      username: formatPhone(phone),
      password,
      scope: env.NEXT_PUBLIC_IDENTITY_SCOPE,
      client_id: env.NEXT_PUBLIC_IDENTITY_CLIENT_ID,
      client_secret: env.NEXT_PUBLIC_IDENTITY_CLIENT_SECRET,
    })

    const res = await fetch(`${env.NEXT_PUBLIC_IDENTITY_BASEURL}/connect/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      cache: 'no-store',
    })

    if (!res.ok) {
      return { success: false, error: 'Неверный логин или пароль.' }
    }

    const data = await res.json()

    if (!data.access_token) {
      return { success: false, error: 'Не удалось получить access_token.' }
    }

    return {
      success: true,
      data: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        idToken: data.id_token,
      },
    }
  } catch {
    return { success: false, error: 'Ошибка авторизации. Попробуйте позже.' }
  }
}

export async function signUp(
  phone: string,
  password: string,
  confirmPassword: string,
  verificationCode: string,
): Promise<ActionResult> {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_IDENTITY_BASEURL}/api/registration/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: formatPhone(phone),
        password,
        confirmPassword,
        verificationCode,
        consentToPersonalDataProcessing: true,
      }),
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return {
        success: false,
        error:
          body.errorMessage ?? body.message ?? 'Неверный код верификации или срок действия истёк.',
      }
    }

    const data = await res.json()
    if (!data.isSuccess) {
      return { success: false, error: data.message ?? 'Ошибка регистрации.' }
    }

    return { success: true, data: null }
  } catch {
    return { success: false, error: 'Ошибка регистрации.' }
  }
}

export async function resetPassword(
  phone: string,
  verificationCode: string,
  newPassword: string,
  confirmPassword: string,
): Promise<ActionResult> {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_IDENTITY_BASEURL}/api/recovery/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: formatPhone(phone),
        verificationCode,
        newPassword,
        confirmPassword,
      }),
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      const msg = body.errorMessage ?? body.message ?? 'Неверный код верификации или срок действия истёк.'

      if (typeof msg === 'string' && msg.includes('пароль')) {
        return { success: false, error: 'Новый пароль не может совпадать с текущим.' }
      }
      if (typeof msg === 'string' && msg.includes('токен')) {
        return { success: false, error: 'Неверный код верификации или срок действия истёк.' }
      }

      return { success: false, error: msg }
    }

    const data = await res.json()
    if (!data.isSuccess) {
      return { success: false, error: data.message ?? 'Ошибка восстановления пароля.' }
    }

    return { success: true, data: null }
  } catch {
    return { success: false, error: 'Ошибка восстановления пароля.' }
  }
}
