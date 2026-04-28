'use client'

import { createContext, useContext } from 'react'

const SessionContext = createContext<{ isAuth: boolean }>({ isAuth: false })

export const SessionProvider = ({
  children,
  isAuth,
}: {
  children: React.ReactNode
  isAuth: boolean
}) => {
  return <SessionContext.Provider value={{ isAuth }}>{children}</SessionContext.Provider>
}

export const useSession = () => useContext(SessionContext)
