import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const protectedRoutes = ['/templates', '/account']

const guestOnlyRoutes = ['/auth']

const REFRESH_BUFFER_SEC = 60

const COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

/**
 * Декодирует payload JWT без сторонних библиотек (Edge Runtime совместимо).
 * Возвращает `null`, если токен невалиден.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1]
    if (!base64) return null
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

/** Проверяет, истёк ли (или скоро истечёт) access_token */
function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token)
  if (!payload || typeof payload.exp !== 'number') return true
  return payload.exp * 1000 < Date.now() + REFRESH_BUFFER_SEC * 1000
}

/** Обновляет токены через IdentityServer. Возвращает данные или null при ошибке. */
async function refreshTokens(
  refreshToken: string,
): Promise<{ access_token: string; refresh_token: string; id_token: string } | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_IDENTITY_BASEURL}/connect/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_IDENTITY_CLIENT_ID || '',
        grant_type: 'refresh_token',
        scope: process.env.NEXT_PUBLIC_IDENTITY_SCOPE || '',
        refresh_token: refreshToken,
        client_secret: process.env.NEXT_PUBLIC_IDENTITY_CLIENT_SECRET || '',
      }),
    })

    if (!response.ok) return null

    return await response.json()
  } catch {
    return null
  }
}

/** Очищает все auth-куки и redirect на '/' */
function clearSessionAndRedirect(request: NextRequest): NextResponse {
  const response = NextResponse.redirect(new URL('/', request.url))
  response.cookies.delete('access_token')
  response.cookies.delete('refresh_token')
  response.cookies.delete('id_token')
  return response
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  const isAccessExpired = accessToken ? isTokenExpired(accessToken) : true

  if (refreshToken && isAccessExpired) {
    const tokens = await refreshTokens(refreshToken)

    if (!tokens) {
      return clearSessionAndRedirect(request)
    }

    const idPayload = decodeJwtPayload(tokens.id_token)
    const sub = (idPayload?.sub as string) || ''

    const response = NextResponse.next()
    response.cookies.set('access_token', tokens.access_token, COOKIE_OPTIONS)
    response.cookies.set('refresh_token', tokens.refresh_token, COOKIE_OPTIONS)
    response.cookies.set('id_token', sub, COOKIE_OPTIONS)

    return response
  }

  if (isAccessExpired && !refreshToken && accessToken) {
    return clearSessionAndRedirect(request)
  }

  // ─── Route Protection ─────────────────────────────────────────────────
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isGuestOnlyhRoute = guestOnlyRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute && !accessToken) {
    const url = new URL('/auth', request.url)
    // url.searchParams.set('callbackUrl', pathname) // Опционально чтобы вернуть туда где был
    return NextResponse.redirect(url)
  }

  if (isGuestOnlyhRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // ─── Saved Filters Redirect ───────────────────────────────────────────
  if (pathname === '/contracts' && searchParams.toString() === '') {
    const savedFilters = request.cookies.get('search_filters')?.value

    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters)
        const newUrl = new URL(request.url)

        // Превращаем объект из кук в URLSearchParams
        // Например: { laws: ['44-fz'], page: 1 } -> ?laws=44-fz&page=1
        Object.entries(filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => newUrl.searchParams.append(key, v))
          } else {
            newUrl.searchParams.set(key, String(value))
          }
        })

        // Редиректим на URL с параметрами
        return NextResponse.redirect(newUrl)
      } catch (e) {
        console.error('Ошибка парсинга фильтров из кук', e)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
