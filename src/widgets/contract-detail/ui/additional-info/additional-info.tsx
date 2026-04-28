import Link from 'next/link'

import type { ContractDetail } from '@/entities/contract'
import { paths } from '@/shared/config/paths'
import { getTooltipType } from '@/shared/lib/get-tooltip-type'
import { cn, formatPrice } from '@/shared/lib/utils'
import { AppTooltip } from '@/shared/ui/app-tooltip'

type AdditionalInfoSectionProps = {
  contract: ContractDetail
  isAuth: boolean
}

export function AdditionalInfo({ contract, isAuth }: AdditionalInfoSectionProps) {
  return (
    <section className="rounded-xl bg-card p-4 shadow-sm sm:p-5">
      <h2 className="mb-4 text-sm font-semibold sm:text-lg">Дополнительная информация</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <div className="space-y-3">
          <InfoRow label="Регионы" value={contract.region} isAuth={isAuth} />
          <InfoRow label="Тип закупки" value={contract.law} isAuth={isAuth} />
          <InfoRow
            label="Способ проведения закупки"
            value={contract.auctionType?.sourceName}
            isMultiLine
            isAuth={isAuth}
          />
        </div>

        <div className="space-y-3">
          <InfoRow
            label="Обеспечение заявки"
            value={formatPrice(contract.provisionContract)}
            isAuth={isAuth}
          />
          <InfoRow
            label="Обеспечение контракта"
            value={formatPrice(contract.provisionRequest)}
            isAuth={isAuth}
          />
          <InfoRow
            label="Обеспечение гарантии"
            value={formatPrice(contract.provisionWarranty)}
            isAuth={isAuth}
          />
        </div>
      </div>
    </section>
  )
}

export function InfoRow({
  label,
  value,
  isMultiLine = false,
  isAuth,
}: {
  label: string
  value?: string | number | null
  isMultiLine?: boolean
  isAuth: boolean
}) {
  const displayValue = value != null ? String(value) : 'Нет данных'
  const tooltipType = getTooltipType(displayValue, isAuth)

  const valueContent = (
    <p className={cn('text-sm', !value && 'text-muted-foreground')}>{displayValue}</p>
  )

  const wrappedValue =
    tooltipType === 'auth' ? (
      <AppTooltip
        content={
          <p>
            <Link href={paths.auth()}>Авторизуйтесь</Link> и узнайте информацию о закупке.
          </p>
        }
      >
        {valueContent}
      </AppTooltip>
    ) : tooltipType === 'subscription' ? (
      <AppTooltip
        content={
          <>
            <Link href={paths.auth()}>Подключите тариф</Link> для полного доступа.
          </>
        }
      >
        {valueContent}
      </AppTooltip>
    ) : (
      valueContent
    )

  if (isMultiLine) {
    return (
      <div>
        <p className="mb-1 text-sm text-muted-foreground">{label}</p>
        {wrappedValue}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-0.5 sm:flex-row sm:items-end">
      <p className="shrink-0 text-sm text-muted-foreground">{label}</p>
      <div className="hidden flex-1 border-b border-dotted border-border sm:block" />
      {wrappedValue}
    </div>
  )
}
