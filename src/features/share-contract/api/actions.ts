'use server'

import { env } from '@/shared/config/env'

import { clientFetch } from '@/shared/api/client-fetch'
import type { ActionResult } from '@/shared/lib/types'

export const fetchShareLink = async (contractId: string): Promise<ActionResult<string>> => {
  try {
    const res = await clientFetch(`${env.NEXT_PUBLIC_API_URI}/api/contracts/${contractId}/share`, {
      method: 'POST',
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return {
        success: false,
        error: body.errorMessage ?? body.message ?? 'Ошибка получения ссылки.',
      }
    }

    const data = await res.json()

    if (!data.isSuccess) {
      return {
        success: false,
        error: 'Ошибка получения ссылки.',
      }
    }

    return { success: true, data: data.value.fullUrl }
  } catch {
    return {
      success: false,
      error: 'Ошибка получения ссылки.',
    }
  }
}
