import { paths } from '@/shared/config/paths'
import { AppBreadcrumbs } from '@/shared/ui/app-breadcrumbs'
import { AccountPanel } from '@/widgets/account-panel'
import { EmailVerifiedToast } from '@/widgets/account-panel'

type AccountPageProps = {
  emailVerified?: boolean
}

export function AccountPage({ emailVerified }: AccountPageProps) {
  return (
    <div className="flex flex-col gap-6">
      {emailVerified && <EmailVerifiedToast />}

      <AppBreadcrumbs
        items={[{ label: 'Закупки', href: paths.home() }, { label: 'Личный кабинет' }]}
      />

      <AccountPanel />
    </div>
  )
}
