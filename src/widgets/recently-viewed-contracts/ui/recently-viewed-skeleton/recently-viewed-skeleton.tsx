import { cn } from '@/shared/lib/utils'
import { Skeleton } from '@/shared/ui/skeleton'

export const RecentlyViewedSkeleton = ({ columns }: { columns: 3 | 4 }) => {
  return (
    <section className="flex flex-col gap-3">
      <Skeleton className="h-6 w-48" />
      <div
        className={cn(
          'grid gap-3',
          columns === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-4',
        )}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="rounded-xl border p-4">
            <Skeleton className="mb-2 h-5 w-3/4" />
            <Skeleton className="mb-1 h-3 w-1/2" />
            <Skeleton className="mb-3 h-14 w-full" />
            <Skeleton className="mb-3 h-px w-full" />
            <Skeleton className="mb-1 h-3 w-16" />
            <Skeleton className="mb-3 h-3 w-32" />
            <Skeleton className="mb-1 h-3 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </section>
  )
}
