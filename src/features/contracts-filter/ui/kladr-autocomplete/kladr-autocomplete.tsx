'use client'

import { useEffect, useRef, useState, useTransition } from 'react'

import { X } from 'lucide-react'

import { MAX_LENGTH_SMALL } from '@/shared/config/constants'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

import { fetchKladrs } from '../../api'
import type { KladrItem } from '../../model'

type KladrAutocompleteProps = {
  value: KladrItem[]
  onChange: (value: KladrItem[]) => void
}

export const KladrAutocomplete = ({ value, onChange }: KladrAutocompleteProps) => {
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState<KladrItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleSearch = (q: string) => {
    setQuery(q)
    if (q.trim().length < 1) {
      setOptions([])
      setIsOpen(false)
      return
    }

    startTransition(async () => {
      try {
        const res = await fetchKladrs(q)

        if (!res.success) {
          setOptions([])
          setIsOpen(true)
          return
        }

        const results = res.data

        setOptions(results)
        setIsOpen(true)
      } catch {
        setOptions([])
        setIsOpen(true)
      }
    })
  }

  const handleSelect = (item: KladrItem, isAlreadySelected: boolean) => {
    onChange(
      isAlreadySelected ? value.filter((value) => value.code !== item.code) : [...value, item],
    )
    setQuery('')
    setOptions([])
    setIsOpen(false)
  }

  const handleRemove = (code: string) => {
    onChange(value.filter((v) => v.code !== code))
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatLabel = (item: KladrItem) => {
    const parts = [item.name, item.shortObjectType]
    if (item.fullRegionName) parts.push(`(${item.fullRegionName})`)
    return parts.join(' ')
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      {value.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1">
          {value.map((item) => (
            <span
              key={item.code}
              className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
            >
              {formatLabel(item)}
              <Button
                variant="ghost"
                size="icon-xs"
                className="ml-0.5 w-fit rounded-sm text-muted-foreground hover:text-foreground"
                onClick={() => handleRemove(item.code)}
                aria-label="Удалить регион"
              >
                <X className="size-3" />
              </Button>
            </span>
          ))}
        </div>
      )}

      <Input
        placeholder="Регион поставки"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="text-base md:text-sm"
        maxLength={MAX_LENGTH_SMALL}
      />

      {isOpen && (
        <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-lg border bg-popover p-1 shadow-md">
          {isPending ? (
            <li className="px-3 py-2 text-xs text-muted-foreground">Поиск...</li>
          ) : options.length === 0 ? (
            <li className="px-3 py-2 text-xs text-muted-foreground">Ничего не найдено</li>
          ) : (
            options.map((item) => {
              const isAlreadySelected = value.some((value) => value.code === item.code)

              return (
                <li
                  key={item.code}
                  className={cn(
                    'cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-accent',
                    isAlreadySelected && 'bg-accent',
                  )}
                  onClick={() => handleSelect(item, isAlreadySelected)}
                >
                  {formatLabel(item)}
                </li>
              )
            })
          )}
        </ul>
      )}
    </div>
  )
}
