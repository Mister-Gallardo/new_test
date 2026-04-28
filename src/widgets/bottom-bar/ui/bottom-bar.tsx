'use client'

import { useSession } from '@/entities/user/model/session-provider'
import { LoginPrompt } from '@/features/auth'
import { BottomNav } from '@/features/navigation'

export const BottomBar = () => {
  const { isAuth } = useSession()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-100 bg-white border-t border-border pb-[env(safe-area-inset-bottom)]">
      {!isAuth ? (
        <div className="flex items-center justify-center p-3 h-16">
          <LoginPrompt />
        </div>
      ) : (
        <BottomNav />
      )}
    </div>
  )
}
