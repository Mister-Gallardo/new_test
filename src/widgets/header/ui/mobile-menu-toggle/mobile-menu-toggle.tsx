'use client'

import { useState } from 'react'

import { Menu, X } from 'lucide-react'

import { Button } from '@/shared/ui/button'

export const MobileMenuToggle = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden flex items-center">
      <Button
        variant="ghost"
        size="icon-lg"
        className="text-foreground"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="size-7" /> : <Menu className="size-7" />}
      </Button>
    </div>
  )
}
