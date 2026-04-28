import { defaultShouldDehydrateQuery, QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        // Проверка, что мы на клиенте, так как toast на сервере не сработает
        if (typeof window !== 'undefined') {
          toast.error(error.message || 'Произошла ошибка при загрузке данных')
        }
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
      },
      dehydrate: {
        // Это важно для Next.js: говорит, какие запросы передавать на клиент
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  })
}
