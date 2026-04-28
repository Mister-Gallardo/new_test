import 'server-only'

import { cookies } from 'next/headers'

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  const isImpersonating = cookieStore.get('is_impersonating')?.value
  const impersonationExpiresAt = cookieStore.get('impersonation_expires_at')?.value

  return {
    isAuth: !!token,
    impersonation: {
      isImpersonating: isImpersonating === 'true',
      impersonationExpiresAt,
    },
  }
}
