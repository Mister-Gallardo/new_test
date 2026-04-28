'use client'

import { useEffect } from 'react'

type UseInfiniteScrollOptions = {
  /** Ref на sentinel-элемент, при пересечении которого подгружаются данные */
  loadMoreRef: React.RefObject<HTMLElement | null>
  /** Есть ли ещё страницы для загрузки */
  hasNextPage: boolean | undefined
  /** Функция загрузки следующей страницы */
  fetchNextPage: () => void
  /** Идёт ли загрузка следующей страницы прямо сейчас */
  isFetchingNextPage: boolean
  /** Ref на scroll-контейнер (root для IntersectionObserver) */
  rootRef?: React.RefObject<HTMLElement | null>
  /** Отступ для срабатывания (по умолчанию '0px') */
  rootMargin?: string
}

export function useInfiniteScroll({
  loadMoreRef,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  rootRef,
  rootMargin = '10px',
}: UseInfiniteScrollOptions) {
  useEffect(() => {
    const el = loadMoreRef.current
    if (!el || !hasNextPage || isFetchingNextPage) return

    // Если передан rootRef, дожидаемся его инициализации
    if (rootRef && !rootRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage()
        }
      },
      {
        root: rootRef?.current ?? null,
        rootMargin,
        threshold: 0,
      },
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [loadMoreRef, hasNextPage, fetchNextPage, isFetchingNextPage, rootRef, rootMargin])
}
