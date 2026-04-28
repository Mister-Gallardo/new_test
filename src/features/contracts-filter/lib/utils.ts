import { MAX_PRICE } from '../config'

export const sanitize = (value: unknown) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''

export const clampPrice = (value: string): number | '' => {
  const cleaned = value.replace(/\D/g, '')

  if (!cleaned.length) return ''

  const num = Number(cleaned)

  return Math.min(num, MAX_PRICE)
}
