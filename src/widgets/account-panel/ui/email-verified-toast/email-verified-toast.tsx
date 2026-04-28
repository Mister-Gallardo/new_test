'use client'

import { useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { paths } from '@/shared/config/paths'

export function EmailVerifiedToast() {
  const router = useRouter()
  const shown = useRef(false)

  useEffect(() => {
    if (shown.current) return
    shown.current = true

    requestAnimationFrame(() => {
      toast.success('Почта успешно подтверждена!')
    })

    router.replace(paths.account())
  }, [router])

  return null
}
