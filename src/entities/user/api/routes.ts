import { env } from '@/shared/config/env'

import { clientFetch } from '@/shared/api/client-fetch'
import type { ActionResult } from '@/shared/lib/types'

import type { AccountInfo, EmailInfo, Subscription } from './types'

export const fetchSubscriptionStatus = async (): Promise<ActionResult<Subscription>> => {
  try {
    const res = await clientFetch(`${env.NEXT_PUBLIC_API_URI}/api/subscriptions/current`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })

    if (!res.ok) {
      return { success: false, error: 'Ошибка загрузки подписки.' }
    }
    const data = await res.json()

    return { success: true, data: data as Subscription }
  } catch {
    return { success: false, error: 'Ошибка загрузки подписки.' }
  }
}

export const fetchAccountInfo = async (): Promise<ActionResult<AccountInfo>> => {
  try {
    const res = await clientFetch(`${env.NEXT_PUBLIC_IDENTITY_BASEURL}/api/account/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })

    if (!res.ok) {
      return { success: false, error: 'Ошибка загрузки данных аккаунта.' }
    }

    const data = await res.json()

    return { success: true, data: data as AccountInfo }
  } catch {
    return { success: false, error: 'Ошибка загрузки данных аккаунта.' }
  }
}

export const fetchEmailStatus = async (): Promise<ActionResult<EmailInfo>> => {
  try {
    const res = await clientFetch(
      `${env.NEXT_PUBLIC_IDENTITY_BASEURL}/api/account/email/verification/status`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      },
    )

    if (!res.ok) {
      return { success: false, error: 'Ошибка загрузки статуса email.' }
    }

    const data = await res.json()

    return { success: true, data: data as EmailInfo }
  } catch {
    return { success: false, error: 'Ошибка загрузки статуса email.' }
  }
}
