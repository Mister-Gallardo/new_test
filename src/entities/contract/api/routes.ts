import { env } from '@/shared/config/env'

import { apiFetch } from '@/shared/api/api'
import { clientFetch } from '@/shared/api/client-fetch'
import type { ActionResult } from '@/shared/lib/types'

import type { ArbitrPage, ContractDetail, FinancePage } from '../model'

/**
 * Лёгкая версия для generateMetadata — без redirect-сайд-эффектов.
 * При любой ошибке возвращает { success: false }, никогда не редиректит.
 */
export const fetchContractDetailForMetadata = async (
  id: string,
): Promise<ActionResult<ContractDetail>> => {
  try {
    const res = await apiFetch(`${env.NEXT_PUBLIC_API_URI}/api/purchases/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })

    if (!res.ok) {
      return { success: false, error: 'Ошибка загрузки данных о закупке.' }
    }

    const data = await res.json()
    return { success: true, data: data.value as ContractDetail }
  } catch {
    return { success: false, error: 'Ошибка загрузки данных о закупке.' }
  }
}


export const fetchContractDetail = async (id: string): Promise<ActionResult<ContractDetail>> => {
  try {
    const res = await clientFetch(`${env.NEXT_PUBLIC_API_URI}/api/purchases/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return {
        success: false,
        error: body.errorMessage ?? body.message ?? 'Ошибка загрузки данных о закупке.',
      }
    }

    const data = await res.json()
    return { success: true, data: data.value as ContractDetail }
  } catch {
    return {
      success: false,
      error: 'Ошибка загрузки данных о закупке.',
    }
  }
}

export const fetchSharedContractDetail = async (
  id: string,
): Promise<ActionResult<ContractDetail>> => {
  try {
    const res = await clientFetch(`${env.NEXT_PUBLIC_API_URI}/api/contracts/shared/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return {
        success: false,
        error: body.errorMessage ?? body.message ?? 'Ошибка загрузки данных о закупке.',
      }
    }

    const data = await res.json()
    return { success: true, data: data.value as ContractDetail }
  } catch {
    return {
      success: false,
      error: 'Ошибка загрузки данных о закупке.',
    }
  }
}

export const fetchFinance = async (
  inn: string,
  page: number = 1,
): Promise<ActionResult<FinancePage>> => {
  try {
    const res = await clientFetch(
      `${env.NEXT_PUBLIC_API_URI}/api/finance?inn=${encodeURIComponent(inn)}&page=${page}`,
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
        error: body.errorMessage ?? body.message ?? 'Ошибка загрузки финансовых данных.',
      }
    }

    const data = await res.json()
    return { success: true, data: data.value as FinancePage }
  } catch {
    return {
      success: false,
      error: 'Ошибка загрузки финансовых данных.',
    }
  }
}

export const fetchArbitr = async (
  inn: string,
  page: number = 1,
): Promise<ActionResult<ArbitrPage>> => {
  try {
    const res = await clientFetch(
      `${env.NEXT_PUBLIC_API_URI}/api/arbitr/search?inn=${encodeURIComponent(inn)}&page=${page}`,
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
        error: body.errorMessage ?? body.message ?? 'Ошибка загрузки арбитражных данных.',
      }
    }

    const data = await res.json()
    return { success: true, data: data.value as ArbitrPage }
  } catch {
    return {
      success: false,
      error: 'Ошибка загрузки арбитражных данных.',
    }
  }
}
