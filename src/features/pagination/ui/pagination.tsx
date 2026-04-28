import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePageChange = (page: number) => {
    onPageChange(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPages = (siblings: number) => {
    const items: (number | 'ellipsis')[] = []
    const maxItemsBoundary = siblings === 0 ? 5 : 7

    if (totalPages <= maxItemsBoundary) {
      for (let i = 1; i <= totalPages; i++) items.push(i)
      return items
    }

    items.push(1)

    if (currentPage > 2 + siblings) items.push('ellipsis')

    const start = Math.max(2, currentPage - siblings)
    const end = Math.min(totalPages - 1, currentPage + siblings)

    for (let i = start; i <= end; i++) items.push(i)

    if (currentPage < totalPages - (1 + siblings)) items.push('ellipsis')

    items.push(totalPages)

    return items
  }

  const desktopPages = getPages(1)
  const mobilePages = getPages(0)

  if (totalPages <= 1) return null

  const renderItem = (page: number | 'ellipsis', idx: number, isMobile: boolean) => {
    const displayClass = isMobile ? 'flex sm:hidden' : 'hidden sm:flex'
    const keyPrefix = isMobile ? 'mobile' : 'desktop'

    if (page === 'ellipsis') {
      return (
        <span
          key={`${keyPrefix}-ellipsis-${idx}`}
          className={cn(
            displayClass,
            'size-8 shrink-0 items-center justify-center text-muted-foreground',
          )}
        >
          <MoreHorizontal className="size-4" />
        </span>
      )
    }

    return (
      <button
        key={`${keyPrefix}-${page}`}
        type="button"
        onClick={() => handlePageChange(page)}
        className={cn(
          displayClass,
          'size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer',
          page === currentPage
            ? 'bg-brand-accent text-white shadow-md shadow-brand-accent/30'
            : 'text-foreground hover:bg-brand-accent/10 hover:text-brand-accent',
        )}
        aria-current={page === currentPage ? 'page' : undefined}
        aria-label={`Страница ${page}`}
      >
        {page}
      </button>
    )
  }

  return (
    <nav aria-label="Пагинация" className="mt-6 flex justify-center">
      <div className="inline-flex min-w-max items-center gap-1 sm:gap-2 rounded-2xl bg-primary-foreground px-1 sm:px-3 py-2 shadow-sm">
        <button
          type="button"
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors',
            currentPage > 1
              ? 'hover:bg-brand-accent/10 hover:text-brand-accent cursor-pointer'
              : 'opacity-40 cursor-default',
          )}
          aria-label="Предыдущая страница"
        >
          <ChevronLeft className="size-4" />
        </button>

        {mobilePages.map((page, idx) => renderItem(page, idx, true))}
        {desktopPages.map((page, idx) => renderItem(page, idx, false))}

        <button
          type="button"
          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors',
            currentPage < totalPages
              ? 'hover:bg-brand-accent/10 hover:text-brand-accent cursor-pointer'
              : 'opacity-40 cursor-default',
          )}
          aria-label="Следующая страница"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  )
}
