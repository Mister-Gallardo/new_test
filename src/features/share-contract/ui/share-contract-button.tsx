'use client'

import { useRef, useState } from 'react'

import { Check, Copy, Share2 } from 'lucide-react'
import { toast } from 'sonner'

import { useSession } from '@/entities/user/model/session-provider'
import { paths } from '@/shared/config/paths'
import { Button } from '@/shared/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'

import { fetchShareLink } from '../api'

type ShareContractButtonProps = {
  contractId: string
  isCompact?: boolean
  isAuthorized?: boolean
}

export const ShareContractButton = ({
  contractId,
  isCompact = false,
}: ShareContractButtonProps) => {
  const { isAuth } = useSession()

  const [link, setLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const getLink = async () => {
    if (!isAuth) {
      return `${window.location.origin}${paths.contracts.detail(contractId)}`
    }

    const res = await fetchShareLink(contractId)

    if (!res.success) {
      throw new Error(res.error)
    }

    return res.data
  }

  const handleOpen = async (open: boolean) => {
    if (!open || link) return
    setLoading(true)
    try {
      setLink(await getLink())
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка получения ссылки.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!link) return
    try {
      await navigator.clipboard.writeText(link)

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      setCopied(true)
      toast.success('Ссылка скопирована!')

      timerRef.current = setTimeout(() => {
        setCopied(false)
        timerRef.current = null
      }, 2000)
    } catch {
      toast.error('Не удалось скопировать ссылку')
    }
  }

  return (
    <Popover onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button
          size="xs"
          className="gap-1 text-brand-accent bg-transparent hover:bg-transparent hover:text-brand-accent/80"
          aria-label="Поделиться закупкой"
        >
          {!isCompact && <span className="hidden text-xs sm:inline">Поделиться</span>}
          <Share2 className="size-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <p className="text-sm font-semibold">Поделиться закупкой</p>
        <p className="mb-2 text-xs">Скопируйте ссылку и отправьте её любым удобным способом.</p>
        {loading ? (
          <p className="text-xs text-muted-foreground">Генерация ссылки...</p>
        ) : link ? (
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={link}
              className="flex-1 rounded-md border bg-muted/50 px-2 py-1 text-xs"
            />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleCopy}
              aria-label="Копировать ссылку"
            >
              {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
            </Button>
          </div>
        ) : (
          <p className="text-xs text-destructive">Не удалось загрузить ссылку</p>
        )}
      </PopoverContent>
    </Popover>
  )
}
