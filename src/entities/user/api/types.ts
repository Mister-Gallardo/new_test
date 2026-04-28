export interface Subscription {
  isActive: boolean
  endDate?: string
  tariffName?: string
  // Доступно просмотров
  availableCardsViewsCount?: number
  // Юзер просмотрел
  usedCardsViewsCount?: number
  // Доступно дней подписки
  availableDaysCount?: number
  // Дней подписки прошло
  usedDaysCount?: number
}

export interface AccountInfo {
  phone?: string
}

export interface EmailInfo {
  confirmedEmail?: string
  newEmail?: string
}

export interface SendEmailResult {
  success: boolean
  error?: string
  timeUntilNextSendSeconds?: number
}
