'use client'

import { createContext, useContext } from 'react'

import type { Subscription } from '../api'

const SubscriptionContext = createContext<Subscription | null>(null)

export const SubscriptionProvider = ({
  children,
  subscription,
}: {
  children: React.ReactNode
  subscription: Subscription | null
}) => {
  return (
    <SubscriptionContext.Provider value={subscription}>{children}</SubscriptionContext.Provider>
  )
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext)

  return context || ({} as Partial<Subscription>)
}
