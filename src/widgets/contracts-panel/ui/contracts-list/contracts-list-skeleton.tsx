import { Skeleton } from '@/shared/ui/skeleton'

export const ContractsListSkeleton = () => (
  <div className="flex flex-1 flex-col gap-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="rounded-xl border p-4">
        <Skeleton className="mb-2 h-5 w-3/4" />
        <Skeleton className="mb-3 h-4 w-1/2" />
        <Skeleton className="mb-3 h-12 w-full" />
        <Skeleton className="mb-3 h-px w-full" />
        <div className="flex justify-between">
          <div>
            <Skeleton className="mb-1 h-3 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="text-right">
            <Skeleton className="mb-1 h-3 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
)
