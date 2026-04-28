import { Info } from 'lucide-react'

interface TableEmptyProps {
  text: string
  dataState?: 'empty' | 'data'
}

export const TableEmpty = ({ text, dataState = 'empty' }: TableEmptyProps) => (
  <div
    data-state={dataState}
    className="w-full flex lg:flex-1 items-center justify-center gap-2 px-4 py-3 rounded-lg border bg-primary-foreground text-muted-foreground"
  >
    <Info className="mr-2 size-4" />
    <span className="text-sm">{text}</span>
  </div>
)
