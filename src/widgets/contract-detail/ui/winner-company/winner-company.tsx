import { MapPin, Trophy } from 'lucide-react'

import type { WinnerCompany } from '@/entities/contract'
import { getTooltipType } from '@/shared/lib/get-tooltip-type'
import { InfoBlock } from '@/shared/ui/info-block'

type WinnerCompanySectionProps = {
  company?: WinnerCompany
  isAuth: boolean
}

export function WinnerCompany({ company, isAuth }: WinnerCompanySectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Trophy className="stroke-brand-accent" size={36} />

        <div className="min-w-0 flex-1">
          <InfoBlock tooltip={getTooltipType(company?.name, isAuth)}>
            <p className="text-base font-semibold wrap-break-word">
              {company?.name ?? 'Нет данных'}
            </p>
          </InfoBlock>

          <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-xs">
            <InfoBlock label="ИНН" direction="row" tooltip={getTooltipType(company?.inn, isAuth)}>
              <p className="text-xs font-normal">{company?.inn ?? 'Нет данных'}</p>
            </InfoBlock>
            <InfoBlock label="КПП" direction="row" tooltip={getTooltipType(company?.kpp, isAuth)}>
              <p className="text-xs font-normal">{company?.kpp ?? 'Нет данных'}</p>
            </InfoBlock>
          </div>
        </div>
      </div>

      <p className="text-sm leading-5">
        <MapPin size={16} className="stroke-brand-accent inline-flex align-text-bottom mr-1" />
        Тут адрес
      </p>
    </div>
  )
}
