import Cookies from 'js-cookie'

/**
 * Выход из сессии — только клиентская сторона.
 * Серверный 401 обрабатывается в clientFetch через redirect('/').
 */

export async function performLogout() {
  console.info('Выход из сессии...')

  Cookies.remove('access_token', { path: '/' })
  Cookies.remove('refresh_token', { path: '/' })
  Cookies.remove('id_token', { path: '/' })
  Cookies.remove('is_impersonating', { path: '/' })
  Cookies.remove('admin_return_url', { path: '/' })
  Cookies.remove('impersonation_expires_at', { path: '/' })

  window.location.href = '/'
}
