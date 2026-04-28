'use client'

import { useEffect } from 'react'

import { paths } from '@/shared/config/paths'
import { Button } from '@/shared/ui/button'

interface ImpersonationBannerProps {
  isImpersonating: boolean
  impersonationExpiresAt?: string
}

export const ImpersonationBanner = ({
  isImpersonating,
  impersonationExpiresAt,
}: ImpersonationBannerProps) => {
  useEffect(() => {
    if (!isImpersonating || !impersonationExpiresAt) return

    const expiryTime = new Date(impersonationExpiresAt).getTime()
    const now = Date.now()
    const delay = expiryTime - now

    if (delay <= 0) {
      window.location.href = paths.masquerade.exit()
      return
    }

    const timer = setTimeout(() => {
      window.location.href = paths.masquerade.exit()
    }, delay)

    return () => clearTimeout(timer)
  }, [isImpersonating, impersonationExpiresAt])

  if (!isImpersonating) return null

  const formattedTime = impersonationExpiresAt
    ? new Date(impersonationExpiresAt).toLocaleTimeString('ru-RU', {
        timeZone: 'Europe/Moscow',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <div className="bg-amber-500 text-white px-4 py-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm shrink-0 z-50">
      <div className="flex items-center gap-2 font-medium">
        <span className="flex size-2 rounded-full bg-red-600 animate-pulse" />
        Режим просмотра пользователя
        {formattedTime && (
          <span className="hidden sm:block opacity-90 font-normal">
            (сессия до {formattedTime} МСК)
          </span>
        )}
      </div>

      <Button asChild className="text-xs font-semibold h-auto px-3 py-1 no-underline">
        <a href={paths.masquerade.exit()}>Вернуться в админку</a>
      </Button>
    </div>
  )
}
