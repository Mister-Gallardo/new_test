import { env } from '@/shared/config/env'

import type { TemplatesResponse } from '@/entities/template'
import { clientFetch } from '@/shared/api/client-fetch'
import type { ActionResult } from '@/shared/lib/types'

export const fetchTemplates = async (
  page: number = 1,
  pageSize: number = 50,
): Promise<ActionResult<TemplatesResponse>> => {
  try {
    const res = await clientFetch(
      `${env.NEXT_PUBLIC_API_URI}/api/contracts/templates?pageNumber=${page}&pageSize=${pageSize}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      },
    )

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return {
        success: false,
        error: body.errorMessage ?? body.message ?? 'Ошибка получения шаблонов.',
      }
    }

    const data = await res.json()

    return { success: true, data: data.value as TemplatesResponse }
  } catch {
    return {
      success: false,
      error: 'Ошибка получения шаблонов.',
    }
  }
}
