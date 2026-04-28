import Image from 'next/image'

import emptyImg from '@/shared/assets/images/empty.svg'

interface AppListEmptyProps {
  contentText: string
}

export const AppListEmpty = ({ contentText }: AppListEmptyProps) => (
  <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
    <Image
      src={emptyImg}
      alt="Ничего не найдено"
      loading="eager"
      className="mb-6 h-48 w-auto opacity-80"
    />
    <h3 className="mb-2 text-lg font-medium text-foreground">Ничего не найдено</h3>
    <p className="max-w-sm text-sm text-muted-foreground">{contentText}</p>
  </div>
)
