import { SquareArrowOutUpRight } from 'lucide-react'

import type { ContractDetail } from '@/entities/contract'
import { ShareContractButton } from '@/features/share-contract'
import { getTooltipType } from '@/shared/lib/get-tooltip-type'
import { formatDate, formatPrice } from '@/shared/lib/utils'
import { InfoBlock } from '@/shared/ui/info-block'

type ContractHeaderCardProps = {
  contract: ContractDetail
  isAuth: boolean
}

export function ContractHeader({ contract, isAuth }: ContractHeaderCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
      <div className="flex flex-col sm:flex-row">
        <div className="flex-1 space-y-4 border-b p-4 sm:border-b-0 sm:border-r sm:p-5 md:flex-2">
          <div className="flex items-start justify-between gap-3">
            <InfoBlock tooltip={getTooltipType(contract.number, isAuth)}>
              <h1 className="line-clamp-3 text-lg font-bold wrap-break-word md:text-2xl">
                {`Закупка №${contract.number ?? 'Нет данных'}`}
              </h1>
            </InfoBlock>

            <ShareContractButton contractId={contract.contractId} />
          </div>

          <InfoBlock label="Тип закупки" tooltip={getTooltipType(contract.law, isAuth)}>
            <p className="text-sm">{contract.law ?? 'Нет данных'}</p>
          </InfoBlock>

          <InfoBlock label="Объект закупки" tooltip={getTooltipType(contract.title, isAuth)}>
            <p className="text-sm">{contract.title ?? 'Нет данных'}</p>
          </InfoBlock>

          <InfoBlock
            label="Адрес поставки"
            tooltip={getTooltipType(contract.supplyLocation, isAuth)}
          >
            <p className="text-sm">{contract.supplyLocation ?? 'Нет данных'}</p>
          </InfoBlock>

          <InfoBlock
            label="Заказчик"
            tooltip={getTooltipType(contract.customerOrganization.name, isAuth)}
          >
            <p className="text-sm">{contract.customerOrganization.name ?? 'Нет данных'}</p>
          </InfoBlock>
        </div>

        <div className="space-y-4 p-4 sm:p-5 md:flex-1">
          <div className="border-b pb-4">
            <InfoBlock label="Начальная цена" tooltip={getTooltipType(contract.price, isAuth)}>
              <p className="text-xl font-semibold">
                {contract.price === -1
                  ? '░░░░░░░ ₽'
                  : contract.price
                    ? formatPrice(contract.price)
                    : 'Нет данных'}
              </p>
            </InfoBlock>

            <div className="mt-3 flex gap-6">
              <div className="flex-1 min-w-fit">
                <InfoBlock
                  label="Размещено"
                  tooltip={getTooltipType(formatDate(contract.datePosted), isAuth)}
                >
                  <p className="text-sm font-medium">
                    {formatDate(contract.datePosted) ?? 'Нет данных'}
                  </p>
                </InfoBlock>
              </div>

              <div className="flex-1 min-w-fit">
                <InfoBlock
                  label="Протокол вышел"
                  tooltip={getTooltipType(formatDate(contract.dateWinnerSelected), isAuth)}
                >
                  <p className="text-sm font-medium">
                    {formatDate(contract.dateWinnerSelected) ?? 'Нет данных'}
                  </p>
                </InfoBlock>
              </div>
            </div>
          </div>

          <InfoBlock label="Ссылка на площадку" tooltip={getTooltipType(contract.url, isAuth)}>
            <div className="flex gap-1.5 items-center text-brand-primary text-sm cursor-pointer hover:underline underline-offset-2">
              {contract.url && !contract.url.includes('░') ? (
                <a
                  href={contract.url}
                  className="flex gap-2 items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Посмотреть на ЭТП
                  <SquareArrowOutUpRight size={16} />
                </a>
              ) : (
                <p className="flex gap-2 items-center">
                  Посмотреть на ЭТП
                  <SquareArrowOutUpRight size={16} />
                </p>
              )}
            </div>
          </InfoBlock>
        </div>
      </div>
    </div>
  )
}
