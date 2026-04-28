import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const impersonation_token = searchParams.get('impersonation_token')
  const id_token = searchParams.get('user_id')
  const expires_at = searchParams.get('expires_at')
  const return_url = searchParams.get('return_url')

  if (!impersonation_token || !id_token) {
    redirect('/')
  }

  const cookieStore = await cookies()

  const authCookies = [
    'access_token',
    'refresh_token',
    'id_token',
    'admin_return_url',
    'is_impersonating',
  ]

  authCookies.forEach((name) => {
    cookieStore.delete(name)
  })

  const options = {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expires_at ? new Date(expires_at) : undefined,
  } as const

  cookieStore.set('access_token', impersonation_token, options)

  cookieStore.set('id_token', id_token, options)

  cookieStore.set('is_impersonating', 'true', { path: '/' })

  cookieStore.set('impersonation_expires_at', expires_at ?? '', { path: '/' })

  cookieStore.set('admin_return_url', return_url ?? 'https://admin.app.tender-grad.ru', {
    path: '/',
  })

  redirect('/account')
}
