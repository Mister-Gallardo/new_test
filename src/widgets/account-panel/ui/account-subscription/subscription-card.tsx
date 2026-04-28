import { Calendar, CreditCard, Star } from 'lucide-react'

import type { Subscription } from '@/entities/user'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'

import { formatEndDate } from '../../lib'

type SubscriptionCardProps = {
  subscription: Subscription | null
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const isActive = subscription?.isActive ?? false

  return (
    <Card className="py-6 px-2">
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 font-semibold">
            <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2">
              <Star className="size-5 text-primary stroke-3" />
            </div>
            Информация о подписке
          </CardTitle>

          <Badge
            color="success"
            className={cn(
              'w-fit py-3 px-4 self-end sm:self-center text-xs font-semibold text-white',
              isActive ? 'bg-green-500' : 'bg-red-500',
            )}
          >
            {isActive ? 'Активна' : 'Неактивна'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-background p-4 transition-all hover:shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <CreditCard className="size-4 text-primary stroke-2" />
              <p className="text-xs font-medium text-muted-foreground">
                {isActive ? 'Тариф' : 'Подписка неактивна'}
              </p>
            </div>
            <p className="font-medium">
              {isActive ? subscription?.tariffName : 'Вы вошли как Гость.'}
            </p>
          </div>

          <div className="rounded-lg border bg-background p-4 transition-all hover:shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <Calendar className="size-4 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">Действует до</p>
            </div>
            <p className="font-medium">
              {subscription?.endDate ? formatEndDate(subscription.endDate) : '—'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
