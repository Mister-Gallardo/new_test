type DocumentsInTextItem = {
  parentFiles: string[]
  fileName: string
  highlightedContent: string[]
}

export type ContractItem = {
  number: string
  title: string
  winnerCompany: {
    name: string
  }
  dateWinnerSelected?: string
  contractId: string
  isViewed: boolean
  // Юзер с тестовым доступом уже открыл карточку (+1 к usedCardsViewsCount)
  isAvailableForView?: boolean
  price: number
  law: string
  documentsInText: DocumentsInTextItem[]
  highlightedLotNames: string[]
}

export type PurchaseResponse = {
  items: ContractItem[]
  total: number
  pageNumber: number
}

// --- Contract Detail ---

export type AuctionType = {
  id: number
  sourceName: string
}

export type WinnerEmployee = {
  phones?: string[]
  emails?: string[]
}

export type WinnerCompany = {
  name?: string
  inn?: string
  kpp?: string
  employees?: WinnerEmployee[]
}

export type Lot = {
  title: string
  price: number
  quantity: number
}

export type ContractDetail = {
  contractId: string
  title?: string
  number?: string
  law?: string
  supplyLocation?: string
  customerOrganization: { name: string; inn: string; kpp: string }
  price: number
  datePosted?: string
  dateWinnerSelected?: string
  url?: string
  provisionContract?: number
  provisionRequest?: number
  provisionWarranty?: number
  auctionType?: AuctionType
  region?: string
  winnerCompany?: WinnerCompany
  lots?: Lot[]
}

// --- Finance ---

export type FinanceItem = {
  year: string | number
  revenue: number | null
  profit: number | null
}

export type FinancePage = {
  items: FinanceItem[]
  pageNumber: number
  totalPages: number
}

// --- Arbitration ---

export type ArbitrParticipant = {
  name: string
  address: string | null
  inn: string | null
  type: string
}

export type ArbitrCase = {
  retrievedAtUtc: string
  date: string
  caseNumber: string
  typeTitle: string
  url: string
  participants: ArbitrParticipant[]
}

export type ArbitrPage = {
  items: ArbitrCase[]
  pageNumber: number
  totalPages: number
}
