import { Filter } from 'lucide-react'

import { Skeleton } from '@/shared/ui/skeleton'

export const ContractsFilterSkeleton = () => {
  return (
    <aside className="w-full shrink-0 md:w-85">
      <div className="sticky top-21 z-10 rounded-xl border bg-primary-foreground p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Filter className="fill-brand-accent size-5 text-brand-accent" />
          <h2 className="text-base font-semibold">Фильтры</h2>
        </div>

        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full rounded-md" />

          <Skeleton className="h-10 w-full rounded-md" />

          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <Skeleton className="h-10 w-full rounded-md" />

          <div className="-mb-1.5 flex flex-wrap gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-1/4 rounded-md" />
            ))}
          </div>

          <Skeleton className="h-10 w-full rounded-md" />

          <Skeleton className="h-8 w-full rounded-md" />

          <Skeleton className="h-10 w-full rounded-md" />

          <Skeleton className="h-10 w-full -mt-1 rounded-md" />
        </div>
      </div>
    </aside>
  )
}
