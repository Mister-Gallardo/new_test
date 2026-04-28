import { env } from '@/shared/config/env'

import type { PurchaseResponse } from '@/entities/contract'
import { clientFetch } from '@/shared/api/client-fetch'
import type { ActionResult } from '@/shared/lib/types'

export const fetchContractsHistory = async (
  pageSize: number = 3,
): Promise<ActionResult<PurchaseResponse>> => {
  try {
    const res = await clientFetch(
      `${env.NEXT_PUBLIC_API_URI}/api/purchases/history?pageNumber=1&pageSize=${pageSize}`,
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
        error: body.errorMessage ?? body.message ?? 'Ошибка поиска истории просмотров.',
      }
    }

    const data = await res.json()
    return { success: true, data: { ...data.value, total: data.value.totalCount } }
  } catch {
    return {
      success: false,
      error: 'Ошибка поиска истории просмотров.',
    }
  }
}
