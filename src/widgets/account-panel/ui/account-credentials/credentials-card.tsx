import { Phone, UserRoundPen } from 'lucide-react'

import type { AccountInfo, EmailInfo } from '@/entities/user'
import { formatPhone } from '@/shared/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'

import { EmailFormGroup } from './email-form-group'

type CredentialsCardProps = {
  account: AccountInfo
  emailInfo: EmailInfo
}

export function CredentialsCard({ account, emailInfo }: CredentialsCardProps) {
  return (
    <Card className="py-6 px-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-semibold">
          <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2">
            <UserRoundPen className="size-5 text-primary stroke-3" />
          </div>
          Учётные данные
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-background p-4 transition-all hover:shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <Phone className="size-4 text-primary stroke-2" />
              <p className="text-xs font-medium text-muted-foreground">Телефон</p>
            </div>
            <p className="font-medium">
              {account.phone ? formatPhone(account.phone) : 'Не указан'}
            </p>
          </div>

          <EmailFormGroup emailInfo={emailInfo} />
        </div>
      </CardContent>
    </Card>
  )
}
