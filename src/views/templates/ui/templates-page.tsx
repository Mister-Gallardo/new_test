import { fetchEmailStatus } from '@/entities/user/api'
import { EmailProvider } from '@/entities/user/model/email-provider'
import { getEmailStatus } from '@/entities/user/model/utils'
import { paths } from '@/shared/config/paths'
import { AppBreadcrumbs } from '@/shared/ui/app-breadcrumbs'
import { TemplatesPanel } from '@/widgets/templates-panel'

export const TemplatesPage = async () => {
  const email = await fetchEmailStatus()

  const emailStatus = email.success ? getEmailStatus(email.data) : 'none'

  return (
    <div className="flex flex-col gap-6">
      <AppBreadcrumbs items={[{ label: 'Закупки', href: paths.home() }, { label: 'Шаблоны' }]} />

      <EmailProvider status={emailStatus}>
        <TemplatesPanel />
      </EmailProvider>
    </div>
  )
}
