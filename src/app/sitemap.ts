import type { MetadataRoute } from 'next'

import { SEO } from '@/shared/config/seo.config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SEO.baseUrl

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/contracts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    }
  ]
  // TODO: Добавить динамическую генерацию URL для конкретных закупок
  // когда появится эндпоинт для получения списка всех ID закупок

  // 2. Делаем запрос на бэкенд за списком ID контрактов
  // (Представим, что у нас есть такая функция)
  // const response = await fetch('https://api.tender-grad.ru/v1/contracts/sitemap')
  // const contracts = await response.json() 
  // contracts - это массив, например: [{ id: '69cb0...', updatedAt: '2026-03-31' }, ...]
  const contracts: { id: string; updatedAt: string }[] = [] /* Заглушка, пока нет API */
  // 3. Превращаем данные с бэкенда в формат для Sitemap
  const dynamicRoutes: MetadataRoute.Sitemap = contracts.map((contract) => ({
    url: `${baseUrl}/contracts/${contract.id}`,       // Формируем ссылку
    lastModified: new Date(contract.updatedAt),       // Когда закупка обновилась
    changeFrequency: 'weekly',                        // Как часто может меняться
    priority: 0.8,                                    // Важность (0.8 - хорошо для контента)
  }))
  // 4. Склеиваем статические и динамические ссылки в один массив и отдаем
  return [...staticRoutes, ...dynamicRoutes]
}
