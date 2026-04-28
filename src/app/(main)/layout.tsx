// import { getSession } from '@/entities/user'
// import { ImpersonationBanner } from '@/features/impersonation'
// import { WelcomeEmailDialog } from '@/features/welcome-email'
import { getSession } from '@/entities/user'
import { ImpersonationBanner } from '@/features/impersonation'
import { WelcomeEmailDialog } from '@/features/welcome-email'
import { AppContainer } from '@/shared/ui/app-container'
import { BottomBar } from '@/widgets/bottom-bar'
import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'
// import { Footer } from '@/widgets/footer'
// import { Header } from '@/widgets/header'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { impersonation } = await getSession()

  return (
    <div className="flex flex-col min-h-dvh">
      <ImpersonationBanner
        isImpersonating={impersonation.isImpersonating}
        impersonationExpiresAt={impersonation.impersonationExpiresAt}
      />

      {/* <Header /> */}

      <main className="mt-5 grow">
        <AppContainer>{children}</AppContainer>
      </main>

      {/* <BottomBar /> */}

      {/* <Footer className="pb-22 md:pb-10" />

      <WelcomeEmailDialog /> */}
    </div>
  )
}
