'use client'

import { useEffect, useState } from 'react'

import { ArrowUp } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

import { Button } from './button'

interface ScrollToTopButtonProps {
  className?: string
  threshold?: number
}

export const ScrollToTopButton = ({ className, threshold = 100 }: ScrollToTopButtonProps) => {
  const [showScroll, setShowScroll] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > threshold)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Button
      variant="default"
      size="icon-lg"
      onClick={scrollToTop}
      aria-label="Наверх"
      className={cn(
        'fixed z-50 rounded-full bg-brand-accent text-white shadow-lg transition-all duration-300',
        'bottom-20 right-6 md:bottom-8 md:right-8',
        'size-12',
        showScroll ? 'translate-y-0 opacity-100 visible' : 'translate-y-8 opacity-0 invisible',
        className,
      )}
    >
      <ArrowUp className="size-5 stroke-3" />
    </Button>
  )
}
