import Cookies from 'js-cookie'

export async function saveTokens(access_token: string, refresh_token: string, idToken: string) {
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()

    const options = {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    }

    cookieStore.set('access_token', access_token, options)
    cookieStore.set('refresh_token', refresh_token, options)
    cookieStore.set('id_token', idToken, options)
  } else {
    const options = {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    }

    Cookies.set('access_token', access_token, options)
    Cookies.set('refresh_token', refresh_token, options)
    Cookies.set('id_token', idToken, options)
  }
}

export async function clearTokens() {
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')
    cookieStore.delete('id_token')
  } else {
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
    Cookies.remove('id_token')
  }
}
