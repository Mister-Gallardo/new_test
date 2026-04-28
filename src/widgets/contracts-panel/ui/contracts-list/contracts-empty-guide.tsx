import Image from 'next/image'

import getProblemsImg from '@/shared/assets/images/get-problems.svg'

const HELP_EMAIL = 'help_search@tender-grad.ru'

const tips = [
  {
    title: 'Скорректируйте ключевые слова',
    before: 'Окна',
    after: 'Поставка окон',
  },
  {
    title: 'Измените диапазон стоимости',
    before: '1 000 000 - 1 500 000',
    after: '1 000 000 - 5 000 000',
  },
  {
    title: 'Добавьте исключение',
    before: 'Исключить слова',
    after: 'Монтаж',
  },
  {
    title: 'Расширьте варианты типа закупок',
    before: '44-ФЗ',
    after: '44-ФЗ + 223-ФЗ + 615 ПП + Коммерция',
  },
] as const

export const ContractsEmptyGuide = () => (
  <div className="flex flex-1 flex-col items-center px-4 pb-10">
    <Image src={getProblemsImg} alt="Ничего не найдено" loading="eager" className="size-40" />

    <h3 className="mb-2 text-center text-lg font-semibold text-foreground">Ничего не найдено?</h3>

    <p className="mb-10 text-center text-sm text-muted-foreground">
      Попробуйте изменить параметры поиска. Например:
    </p>

    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
      {tips.map((tip) => (
        <div key={tip.title} className="space-y-1.5">
          <p className="text-sm font-medium text-foreground">
            <span className="mr-1.5 inline-block size-1.5 rounded-full bg-foreground align-middle" />
            {tip.title}
          </p>

          <div className="pl-4 text-sm text-muted-foreground">
            <span className="line-through">{tip.before}</span>
            <br />
            <span className="font-semibold text-foreground">{tip.after}</span>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-10 text-center sm:mt-12">
      <p className="mb-2 text-sm font-medium text-foreground">Нужна помощь в настройке?</p>
      <p className="text-sm text-muted-foreground">
        Отправьте запрос нашему тендерному специалисту на{' '}
        <a
          href={`mailto:${HELP_EMAIL}`}
          rel="noopener noreferrer"
          className="font-semibold whitespace-nowrap"
        >
          {HELP_EMAIL}
        </a>
      </p>
    </div>
  </div>
)
