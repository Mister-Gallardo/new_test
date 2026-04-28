import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { DEFAULT_FILTERS } from '../config'

import type { FilterFormValues } from './schema'

interface SearchStore {
  zFilters: FilterFormValues
  zPage: number
  _hasZHydrated: boolean
  setHasZHydrated: (state: boolean) => void
  setZFilters: (filters: Partial<FilterFormValues>) => void
  setZPage: (page: number) => void
  resetZFilters: () => void
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      zFilters: DEFAULT_FILTERS,

      zPage: 1,

      _hasZHydrated: false,

      setHasZHydrated: (state) => set({ _hasZHydrated: state }),

      setZFilters: (newZFilters) =>
        set((state) => ({
          zFilters: { ...state.zFilters, ...newZFilters },
          zPage: 1,
        })),

      setZPage: (zPage) => set({ zPage }),

      resetZFilters: () =>
        set({
          zFilters: DEFAULT_FILTERS,
          zPage: 1,
        }),
    }),
    {
      name: 'search-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        zFilters: state.zFilters,
        zPage: state.zPage,
      }),
      onRehydrateStorage: () => {
        return (state) => state?.setHasZHydrated(true)
      },
    },
  ),
)
