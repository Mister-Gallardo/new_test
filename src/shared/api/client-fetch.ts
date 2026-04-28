import { redirect } from 'next/navigation'

import { performLogout } from '@/features/auth/model'
import { apiFetch } from '@/shared/api/api'

export const clientFetch = async (url: string, options: RequestInit = {}) => {
  const response = await apiFetch(url, options)

  if (response.status === 401) {
    // На сервере: proxy уже пытался refresh — если всё равно 401, сессия мертва
    if (typeof window === 'undefined') {
      redirect('/')
    }

    // На клиенте: очищаем куки и перенаправляем
    await performLogout()
  }

  return response
}
