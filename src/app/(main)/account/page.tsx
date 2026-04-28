import type { Metadata } from 'next'

import { getOpenGraph } from '@/shared/config/seo.config'
import { AccountPage } from '@/views/account'

export const metadata: Metadata = {
  title: 'Личный кабинет',
  description: 'Управление профилем и настройками аккаунта в Тендерград.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: getOpenGraph({
    title: 'Личный кабинет | Тендерград',
    description: 'Управление профилем и настройками аккаунта в Тендерград.',
  }),
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const emailVerified = params.emailVerified === 'true'

  return <AccountPage emailVerified={emailVerified} />
}
