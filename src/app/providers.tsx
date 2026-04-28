'use client'

import { useState } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { SessionProvider } from '@/entities/user/model/session-provider'
import { makeQueryClient } from '@/shared/lib/query-client'
import { TooltipProvider } from '@/shared/ui/tooltip'

export function Providers({ children, isAuth }: { children: React.ReactNode; isAuth: boolean }) {
  const [queryClient] = useState(() => makeQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <TooltipProvider>
          <SessionProvider isAuth={isAuth}>{children}</SessionProvider>
        </TooltipProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  )
}
