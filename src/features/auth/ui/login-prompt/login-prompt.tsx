import Link from 'next/link'

import { paths } from '@/shared/config/paths'
import { Button } from '@/shared/ui/button'

export const LoginPrompt = () => (
  <Button
    asChild
    variant="outline"
    className="border-brand-accent px-8 py-4.5 text-foreground hover:bg-brand-accent/5 no-underline"
  >
    <Link href={paths.auth()}>Вход / Регистрация</Link>
  </Button>
)
