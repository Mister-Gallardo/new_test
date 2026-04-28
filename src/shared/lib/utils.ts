import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(value: number | string | null | undefined): string {
  if (value == null || value === '' || value === -1) return 'Нет данных'

  const normalizedValue = typeof value === 'string' ? value.replace(',', '.') : value
  const num = Number(normalizedValue)

  if (isNaN(num)) return String(value)

  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
    .format(num)
    .replace('руб.', '₽')
}

export function formatNumber(value: number | string | null | undefined): string {
  if (value == null || value === '') return ''

  const num = typeof value === 'string' ? Number(value.replace(/\s/g, '')) : value

  if (Number.isNaN(num)) return String(value)

  return num.toLocaleString('ru-RU', { maximumFractionDigits: 0 })
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return 'Нет данных'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' })
}

export function formatPhone(phone: string): string {
  return phone.replace(/^(\+\d)(\d{3})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5')
}

export const formatTimeMessage = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes > 0) {
    const word = minutes === 1 ? 'минуту' : minutes < 5 ? 'минуты' : 'минут'
    return `${minutes} ${word}`
  }

  const word = seconds === 1 ? 'секунду' : seconds < 5 ? 'секунды' : 'секунд'
  return `${seconds} ${word}`
}
