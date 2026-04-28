'use client'

import { useEffect, useRef, useState } from 'react'

import { X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'

import { LAW_OPTIONS } from '../../config'

type LawsMultiSelectProps = {
  value: string[]
  onChange: (value: string[]) => void
}

export const LawsMultiSelect = ({ value, onChange }: LawsMultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const selectedOptions = LAW_OPTIONS.filter((opt) => value.includes(opt.value))

  const toggleOption = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue))
    } else {
      onChange([...value, optValue])
    }
  }

  const handleRemove = (optValue: string) => {
    onChange(value.filter((v) => v !== optValue))
  }

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Selected chips */}
      {selectedOptions.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1">
          {selectedOptions.map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
            >
              {opt.label}
              <Button
                variant="ghost"
                size="icon-xs"
                className="ml-0.5 w-fit rounded-sm text-muted-foreground hover:text-foreground"
                onClick={() => handleRemove(opt.value)}
                aria-label="Удалить закон"
              >
                <X className="size-3" />
              </Button>
            </span>
          ))}
        </div>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm',
          !selectedOptions.length && 'text-muted-foreground',
        )}
      >
        <span className="text-base md:text-sm">
          {selectedOptions.length ? `Выбрано: ${selectedOptions.length}` : 'Тип торгов'}
        </span>
        <svg
          className={cn(
            'size-4 text-muted-foreground transition-transform',
            isOpen && 'rotate-180',
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul className="absolute z-50 mt-1 w-full overflow-auto rounded-lg border bg-popover p-1 shadow-md">
          {LAW_OPTIONS.map((opt) => (
            <li
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
              onClick={() => toggleOption(opt.value)}
            >
              <span
                className={cn(
                  'flex size-4 shrink-0 items-center justify-center rounded border transition-colors',
                  value.includes(opt.value)
                    ? 'border-brand-primary bg-brand-primary text-white'
                    : 'border-input',
                )}
              >
                {value.includes(opt.value) && (
                  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </span>
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
