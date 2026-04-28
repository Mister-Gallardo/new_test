import { Skeleton } from '@/shared/ui/skeleton'

export function ContractDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* ContractHeaderCard Skeleton */}
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <div className="flex flex-col sm:flex-row">
          {/* Left: основная информация */}
          <div className="flex-1 space-y-4 border-b p-4 sm:border-b-0 sm:border-r sm:p-5 md:flex-2">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-7 w-3/4 md:h-8" />
              <Skeleton className="hidden h-5 w-24 md:block" />
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <Skeleton className="mb-2 h-3 w-24" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <div>
                <Skeleton className="mb-2 h-3 w-28" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div>
                <Skeleton className="mb-2 h-3 w-32" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>

          {/* Right: цена, даты, ссылка */}
          <div className="space-y-4 p-4 sm:p-5 md:flex-1">
            <div className="border-b pb-4">
              <Skeleton className="mb-2 h-3 w-28" />
              <Skeleton className="h-7 w-32 md:h-8" />

              <div className="mt-4 flex gap-6">
                <div className="flex-1">
                  <Skeleton className="mb-2 h-3 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex-1">
                  <Skeleton className="mb-2 h-3 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Skeleton className="mb-2 h-3 w-36" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </div>
      </div>

      {/* Компания-победитель Skeleton */}
      <section className="rounded-xl border border-border/60 bg-card p-4 shadow-sm sm:p-5">
        <Skeleton className="mb-4 h-6 w-48 sm:text-lg" />

        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-start gap-4">
            <Skeleton className="mt-1 h-12 w-12 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3 sm:w-1/3" />
              <Skeleton className="h-4 w-1/2 sm:w-1/4" />
            </div>
          </div>

          <div className="my-4 border-t lg:hidden" />

          <div className="mt-4 flex flex-wrap gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex-1 min-w-[150px] space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 flex-1 min-w-[200px] rounded-lg" />
          ))}
        </div>
      </section>

      {/* Дополнительная информация Skeleton */}
      <section className="rounded-xl border border-border/60 bg-card p-4 shadow-sm sm:p-5">
        <Skeleton className="mb-4 h-6 w-56 sm:text-lg" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-lg border bg-muted/10 p-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </section>

      {/* Лоты Skeleton */}
      <section className="rounded-xl border border-border/60 bg-card p-4 shadow-sm sm:p-5">
        <Skeleton className="mb-4 h-6 w-24 sm:text-lg" />
        <div className="space-y-3">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
        </div>
      </section>
    </div>
  )
}
