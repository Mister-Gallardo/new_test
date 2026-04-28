import Image from 'next/image'
import Link from 'next/link'

import { getSession } from '@/entities/user'
import logoImg from '@/shared/assets/images/logo.webp'
import { paths } from '@/shared/config/paths'
import { cn } from '@/shared/lib/utils'
import { AppContainer } from '@/shared/ui/app-container'
import { AppTooltip } from '@/shared/ui/app-tooltip'

const navigationLinks = [
  {
    label: 'Личный кабинет',
    href: '/account',
    external: false,
    requiresAuth: true,
  },
  { label: 'Шаблоны', href: '/templates', external: false, requiresAuth: true },
  // { label: "Избранное", href: "/favorites", external: false, requiresAuth: true },
  {
    label: 'О нас',
    href: 'https://tender-grad.ru/presentation',
    external: true,
    requiresAuth: false,
  },
  {
    label: 'Как пользоваться сервисом',
    href: 'https://guide.tender-grad.ru/auth',
    external: true,
    requiresAuth: false,
  },
  {
    label: 'Политика конфиденциальности',
    href: 'https://tender-grad.ru/app_privacy',
    external: true,
    requiresAuth: false,
  },
]

export const Footer = async ({ className }: { className?: string }) => {
  const { isAuth } = await getSession()

  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn('bg-[#2d2d2d] text-secondary mt-25 py-10 px-8', className)}>
      <AppContainer className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:items-center gap-4">
          <Link href={paths.home()}>
            <Image className="w-46 h-8.5" src={logoImg} alt="ТЕНДЕРГРАД" />
          </Link>
          <p className="text-sm text-muted-foreground">© 2015-{currentYear} ТЕНДЕРГРАД</p>
        </div>

        <div className="flex flex-col items-start gap-4">
          {navigationLinks.map((link) =>
            link.external ? (
              <a
                className="text-sm text-[#D1D1DC]"
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ) : link.requiresAuth ? (
              <AppTooltip
                key={link.href}
                enabled={!isAuth}
                content={
                  <p>
                    <Link href={paths.auth()}>Авторизуйтесь,</Link> чтобы получить полный доступ.
                  </p>
                }
              >
                {isAuth ? (
                  <Link className="text-sm text-[#D1D1DC]" href={link.href}>
                    {link.label}
                  </Link>
                ) : (
                  <span className="text-sm text-[#D1D1DC] cursor-not-allowed">
                    {link.label}
                  </span>
                )}
              </AppTooltip>
            ) : (
              <Link className="text-sm text-[#D1D1DC]" key={link.href} href={link.href}>
                {link.label}
              </Link>
            ),
          )}
        </div>

        <div className="flex flex-col items-start md:items-end">
          <a className="text-sm text-[#D1D1DC]" href="mailto:support@tender-grad.ru">
            support@tender-grad.ru
          </a>
        </div>
      </AppContainer>
    </footer>
  )
}
