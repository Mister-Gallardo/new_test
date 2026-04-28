import Image from 'next/image'
import Link from 'next/link'

import { getSession } from '@/entities/user'
import { LoginPrompt } from '@/features/auth'
import { DesktopNav } from '@/features/navigation'
import logoImg from '@/shared/assets/images/logo.webp'
import { paths } from '@/shared/config/paths'
import { AppContainer } from '@/shared/ui/app-container'

import { DesktopProfileMenu } from './desktop-profile-menu'
import { MobileMenuToggle } from './mobile-menu-toggle'

export const Header = async () => {
  const { isAuth } = await getSession()

  return (
    <header className="sticky top-0 hidden md:flex  z-50 w-full bg-white shadow-sm">
      <AppContainer className="relative flex h-16 items-center justify-between">
        <Link
          href={paths.home()}
          aria-label="На главную страницу"
          className="relative z-10 shrink-0"
        >
          <Image src={logoImg} alt="ТЕНДЕРГРАД" width={184} height={34} priority />
        </Link>

        {isAuth ? (
          <>
            <DesktopNav />

            <DesktopProfileMenu />
          </>
        ) : (
          <div className="hidden md:flex">
            <LoginPrompt />
          </div>
        )}

        <MobileMenuToggle />
      </AppContainer>
    </header>
  )
}
