'use client'

import { useRef, useState } from 'react'

import { LogOut, UserCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { performLogout } from '@/features/auth/model'
import { useSearchStore, useTemplateStore } from '@/features/contracts-filter'
import userImg from '@/shared/assets/images/user.svg'
import { paths } from '@/shared/config/paths'
import { Button } from '@/shared/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover' // Твой путь к файлу
import { Separator } from '@/shared/ui/separator'

export const DesktopProfileMenu = () => {
  const { resetZFilters } = useSearchStore()
  const { resetStore } = useTemplateStore()

  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  const handleLogout = () => {
    resetZFilters()
    resetStore()

    performLogout()
  }

  return (
    <div
      className="hidden md:flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 cursor-pointer p-2 outline-none">
            <span className="text-sm font-medium">Личный кабинет</span>
            <div className="relative flex items-center justify-center w-8 h-8">
              <Image src={userImg} loading="eager" className="w-7 h-7" alt="Профиль" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-brand-accent rounded-full border border-white "></span>
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={6}
          className="w-56 p-1 gap-1.5"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start font-normal h-10 px-3 no-underline hover:text-brand-primary"
          >
            <Link href={paths.account()}>
              <UserCircle className="mr-2 h-5 w-5" />
              Личный кабинет
            </Link>
          </Button>

          <Separator />

          <Button
            variant="ghost"
            className="w-full justify-start font-normal h-10 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Выйти
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}
