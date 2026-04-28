'use client'

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

const MOBILE_AUTO_HIDE_MS = 2500

type AppTooltipProps = {
  children: ReactNode
  content: ReactNode
  enabled?: boolean
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  autoHideDelay?: number
  onMobileTouch?: () => void
}

export function AppTooltip({
  children,
  content,
  enabled = true,
  side = 'bottom',
  className,
  autoHideDelay = MOBILE_AUTO_HIDE_MS,
  onMobileTouch,
}: AppTooltipProps) {
  const [open, setOpen] = useState(false)
  const isTouchRef = useRef(false)

  useEffect(() => {
    if (!open || !isTouchRef.current) return

    const id = setTimeout(() => {
      isTouchRef.current = false
      setOpen(false)
    }, autoHideDelay)

    return () => clearTimeout(id)
  }, [open, autoHideDelay])

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (isTouchRef.current) return
    setOpen(newOpen)
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isTouchRef.current = e.pointerType === 'touch'
  }, [])

  const handleClick = useCallback(() => {
    if (!isTouchRef.current) return
    if (onMobileTouch) {
      onMobileTouch()
      return
    }
    setOpen((prev) => !prev)
  }, [onMobileTouch])

  if (!enabled) {
    return <>{children}</>
  }

  return (
    <Tooltip delayDuration={200} open={open} onOpenChange={handleOpenChange}>
      <TooltipTrigger
        asChild
        className={className}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
