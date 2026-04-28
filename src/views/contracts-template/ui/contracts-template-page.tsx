import { Suspense } from 'react'

import { ErrorBoundary } from 'react-error-boundary'

import { getSession } from '@/entities/user'
import { fetchEmailStatus, fetchSubscriptionStatus } from '@/entities/user/api'
import { EmailProvider } from '@/entities/user/model/email-provider'
import { SubscriptionProvider } from '@/entities/user/model/subscription-provider'
import { getEmailStatus } from '@/entities/user/model/utils'
import { fetchTemplateById, TemplateFilter } from '@/features/contracts-filter'
import { paths } from '@/shared/config/paths'
import { AppBreadcrumbs } from '@/shared/ui/app-breadcrumbs'
import { ContractsPanel } from '@/widgets/contracts-panel'
import { TemplateListController } from '@/widgets/contracts-panel/ui/template-list-controller'
import {
  RecentlyViewedContracts,
  RecentlyViewedSkeleton,
} from '@/widgets/recently-viewed-contracts'

type ContractsLibraryPageProps = {
  templateId: string
}

export const ContractsTemplatePage = async ({ templateId }: ContractsLibraryPageProps) => {
  const [{ isAuth }, subscription, templateResult, email] = await Promise.all([
    getSession(),
    fetchSubscriptionStatus(),
    fetchTemplateById(templateId),
    fetchEmailStatus(),
  ])

  if (!templateResult.success) {
    throw new Error(templateResult.error)
  }

  const template = templateResult.data

  const initialFilters = template.filters

  const emailStatus = email.success ? getEmailStatus(email.data) : 'none'

  const subscriptionInfo = subscription.success && subscription.data

  return (
    <ContractsPanel
      filterSlot={
        <EmailProvider status={emailStatus}>
          <TemplateFilter
            name={template.name}
            initialFilters={initialFilters}
            templateId={templateId}
          />
        </EmailProvider>
      }
      breadcrumbsSlot={
        <AppBreadcrumbs
          items={[
            { label: 'Закупки', href: paths.home() },
            { label: 'Шаблоны', href: paths.templates.root() },
            { label: `Шаблон «${template.name}»` },
          ]}
        />
      }
      listSlot={
        <SubscriptionProvider subscription={subscriptionInfo || null}>
          <TemplateListController />
        </SubscriptionProvider>
      }
      historySlot={
        isAuth ? (
          <ErrorBoundary fallback={null}>
            <Suspense fallback={<RecentlyViewedSkeleton columns={3} />}>
              <RecentlyViewedContracts />
            </Suspense>
          </ErrorBoundary>
        ) : null
      }
    />
  )
}
