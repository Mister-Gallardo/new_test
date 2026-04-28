export type TemplateRawResponse = {
  name: string
  id: string
  keywords: string[]
  ignoreKeywords: string[]
  priceFrom: number
  priceTo: number
  kladrCodes: string[]
  laws: string[]
  searchInDocuments: boolean
  searchInLots: boolean
}

export type MailingStatusResponse = {
  templateId: string
  isActive: boolean
  countSent: number
  countSentTenders: number
  maxCountSendPurchase: number
  sendFormat: string[]
}
