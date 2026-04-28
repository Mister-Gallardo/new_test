import Link from 'next/link'

import { paths } from '@/shared/config/paths'
import { cn } from '@/shared/lib/utils'
import { AppTooltip } from '@/shared/ui/app-tooltip'

type InfoBlockBase = {
  label?: string
  direction?: 'row' | 'column'
  className?: string
  children: React.ReactNode
  onMobileTouch?: () => void
}

type TooltipNone = {
  tooltip?: undefined
}

type TooltipAuthSub = {
  tooltip: 'auth' | 'subscription'
}

type TooltipDefault = {
  tooltip: 'default'
  defaultTooltip: string
}

type TooltipTester = {
  tooltip: 'tester'
  testerTooltip: React.ReactNode
}

type InfoBlockProps = InfoBlockBase &
  (TooltipNone | TooltipAuthSub | TooltipDefault | TooltipTester)

export const InfoBlock = ({
  label,
  direction = 'column',
  className,
  children,
  onMobileTouch,
  ...props
}: InfoBlockProps) => {
  const tooltipContent =
    // Для неавторизованного юзера
    props.tooltip === 'auth' ? (
      <>
        <Link href={paths.auth()}>Авторизуйтесь</Link> и узнайте информацию о закупке.
      </>
    ) : // Для неоплаченного тарифа
    props.tooltip === 'subscription' ? (
      <>
        <Link href={paths.auth()}>Подключите тариф</Link> для полного доступа.
      </>
    ) : // Для тестера
    props.tooltip === 'tester' ? (
      props.testerTooltip
    ) : // Для остальных
    props.tooltip === 'default' ? (
      <>{props.defaultTooltip}</>
    ) : null

  return (
    <div className={cn('w-fit flex gap-x-2', direction === 'column' && 'flex-col', className)}>
      {label && <p className="mb-0.5 text-xs text-muted-foreground">{label}</p>}
      <AppTooltip
        enabled={!!props.tooltip}
        content={<p>{tooltipContent}</p>}
        onMobileTouch={onMobileTouch}
      >
        {children}
      </AppTooltip>
    </div>
  )
}
