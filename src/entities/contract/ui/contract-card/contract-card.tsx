'use client'

import { FileText, Package } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { useSession } from '@/entities/user/model/session-provider'
import { useSubscription } from '@/entities/user/model/subscription-provider'
import { paths } from '@/shared/config/paths'
import { getTooltipType } from '@/shared/lib/get-tooltip-type'
import { cn, formatDate, formatPrice } from '@/shared/lib/utils'
import { InfoBlock } from '@/shared/ui/info-block'
import { Separator } from '@/shared/ui/separator'

import type { ContractItem } from '../../model/types'

type ContractCardVariant = 'default' | 'compact'

type ContractCardProps = {
  data: ContractItem
  variant?: ContractCardVariant
  href: string
  actions?: React.ReactNode
  className?: string
}

const EM_HIGHLIGHT_CLASSES =
  '[&_em]:bg-brand-accent/30 [&_em]:text-foreground [&_em]:not-italic [&_em]:px-0.5 [&_em]:rounded-xs'

// TODO: Удалить после тестирования
// const MOCK_DOCUMENTS_IN_TEXT = [
//   {
//     parentFiles: [],
//     fileName: 'Приложение № 4 к ДоЗ - Формы документов заявки (любой участник) (пр27.12.2024).docx',
//     highlightedContent: [
//       'Представляем для участия в закупке на право заключения <em>договора</em> ____________________ [указать <em>предмет</em>',
//       '<em>Предмет</em> <em>договора</em>:\n________________________________________.',
//       '<em>Предмет</em> <em>договора</em>:\n________________________________________.\n№\nп/п\nНаименование продукции\n(<em>предмет</em> <em>договора</em>',
//     ],
//   },
//   {
//     parentFiles: [],
//     fileName: 'ДоЗ_19.1 Запрос предложений.docx',
//     highlightedContent: [
//       '<em>Предмет</em> закупки / <em>предмет</em> <em>договора</em> – конкретная продукция, которую предполагается закупить в объеме и',
//       '<em>Предмет</em> <em>Договора</em>\n(в том числе номер лота):\nЛот № 1901-ТПИР ОНМ-2026-ПЭ: \nОКПД 2 27.11.43.000 Комплектные',
//       'Требования к Участникам установлены с учетом <em>предмета</em> <em>договора</em>, Технических требований (Приложение №',
//       'по <em>предмету</em> настоящей закупки.',
//     ],
//   },
//   {
//     parentFiles: [],
//     fileName: 'Приложение № 2 к ДоЗ _Проект договора.docx',
//     highlightedContent: [
//       '<em>Предмет</em> <em>Договора</em>\nПоставщик обязуется в порядке и сроки, установленные <em>Договором</em>, передать в собственность',
//       '<em>Договора</em> (исполнения <em>Договора</em>).',
//     ],
//   },
// ]

// const MOCK_HIGHLIGHTED_LOT_NAMES = [
//   'Лот № 1901-ТПИР ОНМ-2026-ПЭ: Поставка <em>комплектных</em> <em>трансформаторных</em> подстанций для нужд филиалов ПАО «Россети»',
//   ' .; Какао - порошок натуральный; <em>Молоко</em> сгущенное; Напиток кофейный; Томатная паста; Чай листовой',
//   'Оказание услуг по <em>техническому</em> <em>обслуживанию</em> и ремонту оборудования систем вентиляции и кондиционирования',
// ]

export const ContractCard = ({
  data,
  variant = 'default',
  href,
  actions,
  className,
}: ContractCardProps) => {
  const { isAuth } = useSession()
  const { tariffName, availableCardsViewsCount = 0, usedCardsViewsCount = 0 } = useSubscription()

  const isUserTester = tariffName === 'Тестовый доступxxx'
  // const isUserTester = true
  // const availableCardsViewsCount = 10
  // const usedCardsViewsCount = 0

  const testerTooltip =
    isUserTester &&
    (availableCardsViewsCount > usedCardsViewsCount ? (
      <>Бесплатных просмотров на сегодня: {availableCardsViewsCount - usedCardsViewsCount}.</>
    ) : (
      <>
        Лимит бесплатных просмотров на сегодня достигнут ({usedCardsViewsCount}/
        {availableCardsViewsCount}). <Link href={paths.auth()}>Подключите тариф</Link> для полного
        доступа или попробуйте завтра.
      </>
    ))

  const isCompact = variant === 'compact'

  const hasDocumentsInText = data.documentsInText?.length > 0
  const hasLotNames = data.highlightedLotNames?.length > 0

  return (
    <article
      className={cn(
        'relative flex flex-col rounded-xl border border-border/60 bg-primary-foreground p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md',
        data.isViewed && 'bg-muted/50',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <InfoBlock
          tooltip={getTooltipType(data.number, isAuth, isUserTester)}
          testerTooltip={testerTooltip}
          onMobileTouch={testerTooltip ? () => toast.info(testerTooltip) : undefined}
        >
          <Link
            href={href}
            className={cn(
              'line-clamp-2 text-sm font-semibold wrap-break-word no-underline transition-colors hover:underline',
              data.isViewed ? 'text-purple-400' : 'text-brand-primary',
              isCompact && 'line-clamp-3',
            )}
          >
            {`Закупка №${data.number}`}
          </Link>
        </InfoBlock>

        {actions && <div className="shrink-0">{actions}</div>}
      </div>

      <InfoBlock
        label="Тип закупки:"
        direction="row"
        className="mt-1"
        tooltip={getTooltipType(data.law, isAuth, isUserTester)}
        testerTooltip={testerTooltip}
      >
        <p className="text-xs text-muted-foreground">{data.law ?? 'Нет данных'}</p>
      </InfoBlock>

      <p
        className={cn('mt-2 line-clamp-3 text-sm text-muted-foreground', EM_HIGHLIGHT_CLASSES)}
        dangerouslySetInnerHTML={{ __html: data.title }}
      />

      <div className="mt-auto py-3">
        <Separator />
      </div>

      <div
        className={cn(
          'flex gap-4',
          isCompact ? 'flex-col gap-3' : 'flex-col items-start justify-between sm:flex-row',
        )}
      >
        <div className="flex flex-col gap-4">
          <InfoBlock
            label="Победитель:"
            tooltip={getTooltipType(data?.winnerCompany?.name, isAuth, isUserTester, true)}
            defaultTooltip={data?.winnerCompany?.name ?? 'Нет данных'}
            testerTooltip={testerTooltip}
          >
            <p
              className={cn(
                'text-xs text-muted-foreground line-clamp-1 wrap-break-word',
                data.isViewed ? 'text-muted-foreground' : 'text-foreground/80',
              )}
            >
              {data?.winnerCompany?.name ?? 'Нет данных'}
            </p>
          </InfoBlock>

          <InfoBlock
            label="Протокол вышел"
            tooltip={getTooltipType(formatDate(data?.dateWinnerSelected), isAuth, isUserTester)}
            testerTooltip={testerTooltip}
          >
            <p
              className={cn(
                'text-xs text-muted-foreground',
                data.isViewed ? 'text-muted-foreground' : 'text-foreground/80',
              )}
            >
              {formatDate(data?.dateWinnerSelected) ?? 'Нет данных'}
            </p>
          </InfoBlock>
        </div>

        <div className="flex flex-col gap-4">
          <InfoBlock
            label="Начальная цена:"
            className={cn('shrink-0 whitespace-nowrap', !isCompact && 'sm:text-right')}
            tooltip={getTooltipType(formatPrice(data.price), isAuth, isUserTester)}
            testerTooltip={testerTooltip}
          >
            <p
              className={cn(
                'text-xs font-semibold text-muted-foreground',
                data.isViewed ? 'text-muted-foreground' : 'text-foreground/80',
              )}
            >
              {formatPrice(data.price) ?? 'Нет данных'}
            </p>
          </InfoBlock>
        </div>
      </div>

      {(hasDocumentsInText || hasLotNames) && (
        <>
          <div className="mt-auto py-3">
            <Separator />
          </div>

          <div className="flex flex-col gap-3">
            {hasDocumentsInText && (
              <div>
                <p className="mb-1.5 text-xs text-muted-foreground">Найдено в документах:</p>
                <ul className="flex flex-col gap-1.5">
                  {data.documentsInText.map((doc, docIdx) => (
                    <li key={docIdx} className="flex flex-col gap-0.5">
                      <p className="flex items-center gap-1 text-xs font-medium text-foreground/70">
                        <FileText className="size-3 shrink-0 text-muted-foreground/70" />
                        {doc.fileName}
                      </p>
                      {doc.highlightedContent.map((content, contentIdx) => (
                        <p
                          key={contentIdx}
                          className={cn('text-xs text-muted-foreground', EM_HIGHLIGHT_CLASSES)}
                          dangerouslySetInnerHTML={{ __html: `…\u00A0${content}\u00A0…` }}
                        />
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {hasLotNames && (
              <div>
                <p className="mb-1.5 text-xs text-muted-foreground">Найдено в лотах:</p>
                <ul className="flex flex-col gap-1">
                  {data.highlightedLotNames.map((lotName, idx) => (
                    <li key={idx} className="flex gap-1">
                      <Package className="mt-0.5. size-3 shrink-0 text-muted-foreground/70" />
                      <p
                        className={cn('text-xs text-muted-foreground', EM_HIGHLIGHT_CLASSES)}
                        dangerouslySetInnerHTML={{ __html: `…\u00A0${lotName}\u00A0…` }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </article>
  )
}
