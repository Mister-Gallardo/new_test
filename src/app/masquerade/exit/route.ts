import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
  const cookieStore = await cookies()

  const adminReturnUrl =
    cookieStore.get('admin_return_url')?.value ?? 'https://admin.app.tender-grad.ru'

  const cookiesToClear = [
    'access_token',
    'refresh_token',
    'id_token',
    'is_impersonating',
    'admin_return_url',
    'impersonation_expires_at',
  ]

  cookiesToClear.forEach((cookieName) => {
    cookieStore.delete(cookieName)
  })

  redirect(adminReturnUrl)
}
