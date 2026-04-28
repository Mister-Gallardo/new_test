import { Skeleton } from '@/shared/ui/skeleton'

export const TemplatesSkeleton = () => {
  return (
    <div className="flex flex-col gap-12 w-full">
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-5">
        <Skeleton className="h-10 w-full md:w-100 rounded-lg" />
        <Skeleton className="h-10 w-full md:w-58 rounded-lg" />
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-4 w-full">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="w-40 h-10 rounded-lg" />
        ))}
      </div>
    </div>
  )
}
