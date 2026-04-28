'use client'

import { createContext, useContext } from 'react'

type EmailStatus = 'none' | 'confirmed' | 'verifying'

const EmailContext = createContext<{ status: EmailStatus }>({
  status: 'none',
})

export const EmailProvider = ({
  children,
  status,
}: {
  children: React.ReactNode
  status: EmailStatus
}) => {
  return <EmailContext.Provider value={{ status }}>{children}</EmailContext.Provider>
}

export const useEmail = () => useContext(EmailContext)
