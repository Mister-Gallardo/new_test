'use client'

import { useState } from 'react'

import { Mail, Phone } from 'lucide-react'

import type { WinnerEmployee } from '@/entities/contract'
import { getTooltipType } from '@/shared/lib/get-tooltip-type'
import { formatPhone } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'

import { InfoBlock } from '../../../../shared/ui/info-block'

type WinnerContactsProps = {
  employees?: WinnerEmployee[]
  isAuth: boolean
}

export function WinnerContacts({ employees, isAuth }: WinnerContactsProps) {
  const employee = employees?.[0]

  const phones = employee?.phones?.length ? employee.phones : null
  const emails = employee?.emails?.length ? employee.emails : null

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 lg:gap-8">
      <ContactCard
        icon={<Phone size={16} className="stroke-muted-foreground" />}
        label="Возможные контакты"
        items={phones}
        emptyText="Актуальные не найдены"
        formatItem={formatPhone}
        countLabel={(n) => `Смотреть все телефоны (${n})`}
        isAuth={isAuth}
      />
      <ContactCard
        icon={<Mail size={16} className="stroke-muted-foreground" />}
        label="Возможные контакты"
        items={emails}
        emptyText="Актуальные не найдены"
        formatItem={(v) => v}
        countLabel={(n) => `Смотреть все контакты (${n})`}
        isAuth={isAuth}
      />
    </div>
  )
}

function ContactCard({
  icon,
  label,
  items,
  emptyText,
  formatItem,
  countLabel,
  isAuth,
}: {
  icon: React.ReactNode
  label: string
  items: string[] | null
  emptyText: string
  formatItem: (v: string) => string
  countLabel: (n: number) => string
  isAuth: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const displayItems = items ? (expanded ? items : items.slice(0, 1)) : null
  const hasMore = items && items.length > 1

  return (
    <div className="min-w-60 h-fit flex-1 rounded-lg border bg-card p-3">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>

      <div className="ml-6 space-y-1">
        {displayItems ? (
          displayItems.map((item, i) => (
            <InfoBlock key={`${item}-${i}`} tooltip={getTooltipType(formatItem(item), isAuth)}>
              <p className="select-text text-sm wrap-break-word tabular-nums animate-in fade-in duration-150">
                {formatItem(item)}
              </p>
            </InfoBlock>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        )}

        {hasMore && (
          <Button
            variant="ghost"
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-1 p-0 text-xs text-muted-foreground hover:bg-transparent"
          >
            {expanded ? 'Скрыть' : countLabel(items.length)}
          </Button>
        )}
      </div>
    </div>
  )
}
