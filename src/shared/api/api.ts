import { env } from '@/shared/config/env'

import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

import { saveTokens } from './actions'

let refreshPromise: Promise<string | null> | null = null

async function getToken(name: 'access_token' | 'refresh_token') {
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers')
    return (await cookies()).get(name)?.value || null
  }

  return Cookies.get(name) || null
}

export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = await getToken('access_token')

  const headers = new Headers(options.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const config = { ...options, headers }

  const response = await fetch(url, config)

  if (response.status === 401) {
    // На сервере refresh выполняется в proxy ДО рендера.
    // Если всё равно 401 — сессия мертва, возвращаем как есть.
    if (typeof window === 'undefined') {
      return response
    }

    // На клиенте — пытаемся обновить токен через js-cookie
    try {
      const newToken = await getClientRefreshPromise()

      if (!newToken) throw new Error('No token after refresh')

      const retryHeaders = new Headers(options.headers)
      retryHeaders.set('Authorization', `Bearer ${newToken}`)

      return fetch(url, { ...options, headers: retryHeaders })
    } catch {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  return response
}

/**
 * Singleton promise для клиентского refresh — предотвращает параллельные запросы
 * при одновременных вызовах apiFetch из нескольких useQuery.
 */
function getClientRefreshPromise(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getToken('refresh_token')
  if (!refreshToken) return null

  console.info('🔄 Refresh token: ', refreshToken)

  try {
    const response = await fetch(`${env.NEXT_PUBLIC_IDENTITY_BASEURL}/connect/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.NEXT_PUBLIC_IDENTITY_CLIENT_ID || '',
        grant_type: 'refresh_token',
        scope: env.NEXT_PUBLIC_IDENTITY_SCOPE || '',
        refresh_token: refreshToken,
        client_secret: env.NEXT_PUBLIC_IDENTITY_CLIENT_SECRET || '',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Refresh error:', response.status, errorText)
      throw new Error(`Refresh failed: ${response.status}`)
    }

    const data = await response.json()
    const decoded = jwtDecode<{ sub: string }>(data.id_token)

    await saveTokens(data.access_token, data.refresh_token, decoded.sub)

    return data.access_token
  } catch (e) {
    console.error('❌ Refresh failed', e)
    return null
  }
}
