'use client'

import { useState } from 'react'

import { LogOut, User, UserCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { performLogout } from '@/features/auth/model'
import { useSearchStore, useTemplateStore } from '@/features/contracts-filter'
import { paths } from '@/shared/config/paths'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { Separator } from '@/shared/ui/separator'

import { NAV_ITEMS } from '../../config'

export const BottomNav = () => {
  const pathname = usePathname()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const { resetZFilters } = useSearchStore()
  const { templateId, resetStore } = useTemplateStore()

  const handleLogout = () => {
    resetZFilters()
    resetStore()

    setIsProfileOpen(false)
    performLogout()
  }

  const isProfileActive = pathname.startsWith(paths.account()) || isProfileOpen

  return (
    <nav className="flex items-center justify-around h-16 px-1">
      {NAV_ITEMS.map((item) => {
        const isTemplates = item.label === 'Шаблоны'
        const isActive = pathname.startsWith(item.href)
        const Icon = item.icon
        const targetHref = item.activeHref && templateId ? item.activeHref(templateId) : item.href
        const showBadge = isTemplates && !!templateId

        return (
          <div key={item.href} className="relative">
            <Link
              key={item.href}
              href={targetHref}
              className={cn(
                'flex flex-col items-center justify-center h-full gap-1 transition-all duration-200',
                isActive ? 'text-brand-primary' : 'text-muted-foreground',
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center transition-all duration-200',
                  isActive ? 'scale-[1.05]' : 'scale-100',
                )}
              >
                <Icon className={cn('size-6', isActive && 'stroke-[2.5]')} />
              </div>
              <span
                className={cn(
                  'text-xs transition-all duration-200',
                  isActive ? 'font-semibold' : 'font-medium',
                )}
              >
                {item.label}
              </span>
            </Link>

            {showBadge && (
              <span className={cn('absolute top-0 right-0 flex h-2 w-2', 'pointer-events-none')}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
              </span>
            )}
          </div>
        )
      })}

      <Popover open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'flex flex-col items-center justify-center h-full gap-1 transition-all duration-200 bg-transparent!',
              isProfileActive ? 'text-brand-primary!' : 'text-muted-foreground',
            )}
          >
            <div
              className={cn(
                'flex items-center justify-center transition-all duration-200',
                isProfileActive ? 'scale-[1.05]' : 'scale-100',
              )}
            >
              <User className={cn('size-6', isProfileActive && 'stroke-[2.5]')} />
            </div>
            <span
              className={cn(
                'text-xs transition-all duration-200',
                isProfileActive ? 'font-semibold' : 'font-medium',
              )}
            >
              Профиль
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" align="end" sideOffset={12} className="w-60 p-1.5 mr-2">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start font-normal h-12 px-3 no-underline hover:text-brand-primary "
            onClick={() => setIsProfileOpen(false)}
          >
            <Link href={paths.account()}>
              <UserCircle className="mr-2 size-5.5" />
              Личный кабинет
            </Link>
          </Button>

          <Separator />

          <Button
            variant="ghost"
            className="w-full justify-start font-normal h-12 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 size-5.5" />
            Выйти
          </Button>
        </PopoverContent>
      </Popover>
    </nav>
  )
}
