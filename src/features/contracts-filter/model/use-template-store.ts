import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { DEFAULT_FILTERS } from '../config'

import type { FilterFormValues } from './schema'

interface TemplateFilterState {
  zFilters: FilterFormValues
  zPage: number
  templateId: string | null
  _hasZHydrated: boolean
  setHasZHydrated: (state: boolean) => void
  setZFilters: (filters: Partial<FilterFormValues>) => void
  setZPage: (page: number) => void
  setTemplateId: (id: string | null) => void
  resetZFilters: () => void
  resetStore: () => void
}

export const useTemplateStore = create<TemplateFilterState>()(
  persist(
    (set) => ({
      zFilters: DEFAULT_FILTERS,

      zPage: 1,

      templateId: null,

      _hasZHydrated: false,

      setHasZHydrated: (state) => set({ _hasZHydrated: state }),

      setZFilters: (newZFilters) =>
        set((state) => ({
          zFilters: { ...state.zFilters, ...newZFilters },
          zPage: 1,
        })),

      setZPage: (zPage) => set({ zPage }),

      setTemplateId: (templateId) => set({ templateId }),

      resetZFilters: () =>
        set({
          zFilters: DEFAULT_FILTERS,
          zPage: 1,
        }),

      resetStore: () =>
        set({
          zFilters: DEFAULT_FILTERS,
          zPage: 1,
          templateId: null,
        }),
    }),
    {
      name: 'template-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        zFilters: state.zFilters,
        zPage: state.zPage,
        templateId: state.templateId,
      }),
      onRehydrateStorage: () => {
        return (state) => state?.setHasZHydrated(true)
      },
    },
  ),
)
