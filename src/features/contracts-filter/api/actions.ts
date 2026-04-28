'use server'

import { env } from '@/shared/config/env'

import { clientFetch } from '@/shared/api/client-fetch'
import type { ActionResult } from '@/shared/lib/types'

import type { FilterFormValues } from '../model'
import { buildSearchBody } from '../model'

export const createTemplate = async (
  name: string,
  filters: FilterFormValues,
): Promise<ActionResult> => {
  try {
    const res = await clientFetch(`${env.NEXT_PUBLIC_API_URI}/api/contracts/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        ...buildSearchBody(filters),
      }),
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return {
        success: false,
        error: body.errorMessage ?? body.message ?? 'Ошибка создания шаблона.',
      }
    }

    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Ошибка создания шаблона.' }
  }
}

export const updateTemplate = async (
  id: string,
  name: string,
  filters: FilterFormValues,
): Promise<ActionResult> => {
  try {
    const res = await clientFetch(`${env.NEXT_PUBLIC_API_URI}/api/contracts/templates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        ...buildSearchBody(filters),
      }),
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return {
        success: false,
        error: body.errorMessage ?? body.message ?? 'Ошибка сохранения шаблона.',
      }
    }

    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Ошибка сохранения шаблона.' }
  }
}

export const deleteTemplate = async (id: string): Promise<ActionResult> => {
  try {
    const res = await clientFetch(`${env.NEXT_PUBLIC_API_URI}/api/contracts/templates/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return {
        success: false,
        error: body.errorMessage ?? body.message ?? 'Ошибка удаления шаблона.',
      }
    }

    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Ошибка удаления шаблона.' }
  }
}

export const toggleMailing = async (
  templateId: string,
  activate: boolean,
): Promise<ActionResult> => {
  const action = activate ? 'activate' : 'deactivate'

  try {
    const res = await clientFetch(
      `${env.NEXT_PUBLIC_API_URI}/api/contracts/templates/mailings/${templateId}/${action}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      },
    )

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return {
        success: false,
        error: body.errorMessage ?? body.message ?? 'Ошибка переключения рассылки.',
      }
    }

    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Ошибка переключения рассылки.' }
  }
}
