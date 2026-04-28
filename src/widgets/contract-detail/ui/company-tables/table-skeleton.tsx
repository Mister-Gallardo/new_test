import { Loader2 } from 'lucide-react'

interface TableSkeletonProps {
  text: string
}

export const TableSkeleton = ({ text }: TableSkeletonProps) => (
  <div
    data-state="data"
    className="w-full lg:flex-1 flex items-center justify-center gap-2 text-muted-foreground"
  >
    <Loader2 className="mr-2 size-4 animate-spin" />
    <span className="text-sm">{text}</span>
  </div>
)
