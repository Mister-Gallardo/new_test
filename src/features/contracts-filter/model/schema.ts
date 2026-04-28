import z from 'zod'

export const kladrItemSchema = z.object({
  name: z.string(),
  shortObjectType: z.string(),
  fullRegionName: z.string(),
  code: z.string(),
})

export type KladrItem = z.infer<typeof kladrItemSchema>

export const filterFormValuesSchema = z.object({
  keywords: z.string(),
  ignoreKeywords: z.string(),
  priceFrom: z.coerce.number().or(z.literal('')),
  priceTo: z.coerce.number().or(z.literal('')),
  kladrItems: z.array(kladrItemSchema).default([]),
  laws: z.array(z.string()).default([]),
  searchInDocuments: z.boolean(),
  searchInLots: z.boolean(),
})

export type FilterFormValues = z.infer<typeof filterFormValuesSchema>

export type ContractsSearchParams = z.infer<typeof filterFormValuesSchema> & {
  page: number
}