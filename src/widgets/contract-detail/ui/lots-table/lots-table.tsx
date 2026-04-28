import type { Lot } from '@/entities/contract'
import { formatNumber } from '@/shared/lib/utils'

type LotsTableProps = {
  lots?: Lot[]
}

export function LotsTable({ lots }: LotsTableProps) {
  if (!lots?.length) return null

  return (
    <div className="rounded-xl bg-card p-4 shadow-sm sm:p-5">
      <h2 className="mb-4 text-sm font-semibold sm:text-lg">
        Закупаемые товары, работы, услуги
      </h2>

      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-2 pr-5 font-normal">Наименование</th>
              <th className="pb-2 px-5 text-right font-normal whitespace-nowrap">Цена, ₽</th>
              <th className="pb-2 px-5 text-right font-normal whitespace-nowrap">Количество, усл ед</th>
              {/* <th className="pb-2 pl-5 text-right font-normal whitespace-nowrap">Сумма, ₽</th> */}
            </tr>
          </thead>
          <tbody>
            {lots.map((lot, index) => (
              <tr key={`${lot.title}-${index}`} className="border-b border-border/40">
                <td className="py-2.5 pr-5 align-top">{lot.title}</td>
                <td className="py-2.5 px-5 text-right align-top whitespace-nowrap">
                  {formatNumber(lot.price)}
                </td>
                <td className="py-2.5 px-5 text-right align-top whitespace-nowrap">
                  {formatNumber(lot.quantity)} 
                </td>
                {/* <td className="py-2.5 pl-5 text-right align-top whitespace-nowrap">
                  {formatNumber(lot.price * lot.quantity)}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {lots.map((lot, index) => (
          <div
            key={`${lot.title}-${index}`}
            className="space-y-1.5 rounded-lg border bg-muted/30 p-3"
          >
            <p className="mb-3 text-sm font-medium">{lot.title}</p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Цена, ₽</span>
              <span>{formatNumber(lot.price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Количество, усл ед</span>
              <span>{formatNumber(lot.quantity)}</span>
            </div>
            {/* <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Сумма, ₽</span>
              <span>{formatNumber(lot.price * lot.quantity)} ₽</span>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  )
}
