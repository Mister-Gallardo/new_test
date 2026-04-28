import { Suspense } from 'react'

import Image from 'next/image'

import { AuthForm } from '@/features/auth'
import logoImg from '@/shared/assets/images/logo.webp'

export function AuthPage() {
  return (
    <div className="flex w-full grow items-center justify-center">
      <div className="flex w-full flex-col items-center gap-4 py-6">
        <Image className="w-60 h-auto" src={logoImg} alt="Логотип Тендерград" priority />
        <Suspense>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  )
}
