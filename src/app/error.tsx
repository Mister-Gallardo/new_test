'use client'

import { useEffect } from 'react'

import Image from 'next/image'

import errorImg from '@/shared/assets/images/cancel.svg'
import { Button } from '@/shared/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4">
      <Image
        className="w-4/5 sm:w-2/4 md:w-1/5 max-w-100 mb-6 aspect-auto"
        src={errorImg}
        loading="eager"
        alt="Ошибка"
      />
      <h2 className="text-xl md:text-2xl text-center font-semibold mb-2">Что-то пошло не так</h2>
      <p className="text-sm md:text-md mb-6 text-center text-muted-foreground">
        Произошла непредвиденная ошибка. Пожалуйста, попробуйте еще раз.
      </p>
      <Button
        onClick={reset}
        className="w-52 font-medium no-underline hover:text-brand-primary hover:bg-brand-primary/5"
        variant="outline"
        size="lg"
        aria-label="Попробовать снова"
      >
        Попробовать снова
      </Button>
    </div>
  )
}
