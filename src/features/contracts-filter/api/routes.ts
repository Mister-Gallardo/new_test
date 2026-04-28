import { env } from '@/shared/config/env'

import type { PurchaseResponse } from '@/entities/contract'
import { clientFetch } from '@/shared/api/client-fetch'
import type { ActionResult } from '@/shared/lib/types'

import { DEFAULT_FILTERS, PAGE_SIZE } from '../config'
import type { FilterFormValues, KladrItem } from '../model'
import { buildSearchBody } from '../model'

import type { MailingStatusResponse, TemplateRawResponse } from './types'

export const fetchContracts = async (
  filters: FilterFormValues,
  page: number = 1,
): Promise<ActionResult<PurchaseResponse>> => {
  try {
    const res = await clientFetch(
      `${env.NEXT_PUBLIC_API_URI}/api/purchases/search?pageNumber=${page}&pageSize=${PAGE_SIZE}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildSearchBody(filters)),
        cache: 'no-store',
      },
    )

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return {
        success: false,
        error: body.errorMessage ?? body.message ?? 'Ошибка поиска контрактов.',
      }
    }

    const data = await res.json()

    return { success: true, data: data.value as PurchaseResponse }
  } catch {
    return {
      success: false,
      error: 'Ошибка поиска контрактов.',
    }
  }
}

export const fetchKladrs = async (keyword: string): Promise<ActionResult<KladrItem[]>> => {
  try {
    const res = await clientFetch(`${env.NEXT_PUBLIC_KLADR_URI}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Keyword: keyword.trim(), Size: 5 }),
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return { success: false, error: body.errorMessage ?? 'Ошибка поиска регионов.' }
    }

    const data = await res.json()

    return { success: true, data }
  } catch {
    return { success: false, error: 'Ошибка поиска регионов.' }
  }
}

const fetchKladrsByCodes = async (codes: string[]): Promise<KladrItem[]> => {
  if (!codes.length) return []

  try {
    const res = await clientFetch(`${env.NEXT_PUBLIC_KLADR_URI}/api/by-kladrcodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codes }),
      cache: 'no-store',
    })

    if (!res.ok) return []

    return await res.json()
  } catch {
    return []
  }
}

export const fetchTemplateById = async (
  id: string,
): Promise<ActionResult<{ filters: FilterFormValues; name: string }>> => {
  try {
    const res = await clientFetch(`${env.NEXT_PUBLIC_API_URI}/api/contracts/templates/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return {
        success: false,
        error: body.errorMessage ?? body.message ?? 'Ошибка получения шаблона.',
      }
    }

    const data = await res.json()
    const raw = data.value as TemplateRawResponse

    const kladrItems = await fetchKladrsByCodes(raw.kladrCodes ?? [])

    const filters: FilterFormValues = {
      keywords: raw.keywords?.join(',') || DEFAULT_FILTERS.keywords,
      ignoreKeywords: raw.ignoreKeywords?.join(',') || DEFAULT_FILTERS.ignoreKeywords,
      priceFrom: raw.priceFrom || DEFAULT_FILTERS.priceFrom,
      priceTo: raw.priceTo || DEFAULT_FILTERS.priceTo,
      kladrItems,
      laws: raw.laws?.length && raw.laws.length < 4 ? raw.laws : DEFAULT_FILTERS.laws,
      searchInDocuments: raw.searchInDocuments ?? DEFAULT_FILTERS.searchInDocuments,
      searchInLots: raw.searchInLots ?? DEFAULT_FILTERS.searchInLots,
    }

    return { success: true, data: { filters, name: raw.name } }
  } catch {
    return {
      success: false,
      error: 'Ошибка получения шаблона.',
    }
  }
}

export const fetchMailingStatus = async (
  templateId: string,
): Promise<ActionResult<MailingStatusResponse>> => {
  try {
    const res = await clientFetch(
      `${env.NEXT_PUBLIC_API_URI}/api/contracts/templates/mailings/${templateId}`,
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
        error: body.errorMessage ?? body.message ?? 'Ошибка получения статуса рассылки.',
      }
    }

    const data = await res.json()
    return { success: true, data: data.value as MailingStatusResponse }
  } catch {
    return { success: false, error: 'Ошибка получения статуса рассылки.' }
  }
}
