'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useTemplateStore } from '@/features/contracts-filter'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'

import { NAV_ITEMS } from '../../config'

export const DesktopNav = () => {
  const pathname = usePathname()

  const { templateId } = useTemplateStore()

  return (
    <nav className="hidden md:flex items-center gap-5">
      {NAV_ITEMS.map((item) => {
        const isTemplates = item.label === 'Шаблоны'
        const isActive = pathname.startsWith(item.href)
        const targetHref = item.activeHref && templateId ? item.activeHref(templateId) : item.href
        const showBadge = isTemplates && !!templateId

        return (
          <div key={item.href} className="relative">
            <Button
              asChild
              className={cn(
                'h-10 rounded-none no-underline bg-transparent p-0 px-4 shadow-none hover:bg-transparent!',
                'font-semibold transition-all relative',
                'border-b-2',
                isActive ? 'text-brand-primary' : 'text-foreground hover:text-foreground/70',
                isActive ? 'border-b-brand-primary' : 'border-transparent',
              )}
            >
              <Link href={targetHref}>{item.label}</Link>
            </Button>

            {showBadge && (
              <span
                className={cn('absolute top-1.5 right-1.5 flex h-2 w-2', 'pointer-events-none')}
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
}
