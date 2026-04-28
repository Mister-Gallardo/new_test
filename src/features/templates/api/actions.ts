'use server'

import { env } from '@/shared/config/env'

import type { TemplateMailing } from '@/entities/template'
import { clientFetch } from '@/shared/api/client-fetch'
import type { ActionResult } from '@/shared/lib/types'

export const activateTemplatesMailing = async (
  templates: TemplateMailing[],
): Promise<ActionResult<void>> => {
  try {
    const res = await clientFetch(`${env.NEXT_PUBLIC_API_URI}/api/contracts/templates/mailings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mailingStatusTemplateIds: templates,
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return {
        success: false,
        error: body.errorMessage ?? body.message ?? 'Ошибка настройки рассылки.',
      }
    }

    return { success: true, data: undefined }
  } catch {
    return {
      success: false,
      error: 'Ошибка настройки рассылки.',
    }
  }
}
