import type { AccountInfo, EmailInfo, Subscription } from '@/entities/user'
import { fetchAccountInfo, fetchEmailStatus, fetchSubscriptionStatus } from '@/entities/user/api'

// import { Button } from '@/shared/ui/button'
import { CredentialsCard } from './account-credentials'
import { SubscriptionCard } from './account-subscription'

export async function AccountPanel() {
  const [accountResult, emailResult, subscriptionResult] = await Promise.all([
    fetchAccountInfo(),
    fetchEmailStatus(),
    fetchSubscriptionStatus(),
  ])

  const account: AccountInfo = accountResult.success ? accountResult.data : {}
  const emailInfo: EmailInfo = emailResult.success ? emailResult.data : {}
  const subscription: Subscription | null = subscriptionResult.success
    ? subscriptionResult.data
    : null

  return (
    <div className="flex flex-col gap-6">
      <CredentialsCard account={account} emailInfo={emailInfo} />

      <SubscriptionCard subscription={subscription} />

      {/* <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <p className="text-md text-center">Пройдите быстрое обучение, чтобы использовать все возможности сервиса.</p>
        <Button asChild
          className="px-4 py-5 no-underline hover:bg-brand-primary!">
          <a
            href="https://guide.tender-grad.ru/auth"
            target="_blank"
            rel="noopener noreferrer"
          >
            Пройти обучение
          </a>
        </Button>
      </div> */}
    </div>
  )
}
