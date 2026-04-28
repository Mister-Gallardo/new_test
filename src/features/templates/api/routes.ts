import { env } from '@/shared/config/env'

import type { TemplateMailing } from '@/entities/template'
import { clientFetch } from '@/shared/api/client-fetch'
import type { ActionResult } from '@/shared/lib/types'

export const fetchTemplatesMailings = async (): Promise<ActionResult<TemplateMailing[]>> => {
  try {
    const res = await clientFetch(`${env.NEXT_PUBLIC_API_URI}/api/contracts/templates/mailings`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return {
        success: false,
        error: body.errorMessage ?? body.message ?? 'Ошибка получения настроек рассылки.',
      }
    }

    const data = await res.json()

    return { success: true, data: data.value as TemplateMailing[] }
  } catch {
    return {
      success: false,
      error: 'Ошибка получения настроек рассылки.',
    }
  }
}