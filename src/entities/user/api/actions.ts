'use server'

import { env } from '@/shared/config/env'

import { clientFetch } from '@/shared/api/client-fetch'

import type { SendEmailResult } from './types'

export async function sendVerificationEmail(email: string): Promise<SendEmailResult> {
  try {
    const res = await clientFetch(
      `${env.NEXT_PUBLIC_IDENTITY_BASEURL}/api/account/email/verification/send-link`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consentToMailing: true }),
        cache: 'no-store',
      },
    )

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      const errorMessage: string = data.errorMessage ?? 'Ошибка отправки письма.'

      return {
        success: false,
        error: errorMessage.includes('другим пользователем')
          ? 'Email уже используется'
          : errorMessage,
        timeUntilNextSendSeconds: data.timeUntilNextSendSeconds,
      }
    }

    if (!data.isSuccess) {
      return {
        success: false,
        error: data.errorMessage ?? 'Ошибка отправки письма.',
        timeUntilNextSendSeconds: data.timeUntilNextSendSeconds,
      }
    }

    return {
      success: true,
      timeUntilNextSendSeconds: data.timeUntilNextSendSeconds,
    }
  } catch {
    return { success: false, error: 'Ошибка отправки письма. Попробуйте позже.' }
  }
}
