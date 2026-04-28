import Image from 'next/image'
import Link from 'next/link'

import notFoundImg from '@/shared/assets/images/not-found.svg'
import { paths } from '@/shared/config/paths'
import { Button } from '@/shared/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4">
      <Image
        className="w-4/5 sm:w-2/4 md:w-2/5 max-w-100 mb-6 aspect-auto"
        src={notFoundImg}
        loading="eager"
        alt="Страница не найдена"
      />
      <h2 className="text-xl md:text-2xl text-center font-semibold mb-2">404 — Страница не найдена</h2>
      <p className="text-sm md:text-md mb-6 text-center text-muted-foreground">
        Такой страницы не существует или она была перемещена.
      </p>
      <Button
        className="w-52 font-medium no-underline hover:text-brand-primary hover:bg-brand-primary/5"
        variant="outline"
        size="lg"
        asChild
        aria-label="Перейти на главную"
      >
        <Link href={paths.home()}>На главную</Link>
      </Button>
    </div>
  )
}
