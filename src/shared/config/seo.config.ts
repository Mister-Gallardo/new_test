import { env } from "./env";

export const SEO = {
  siteName: 'Тендерград',
  baseUrl: env.NEXT_PUBLIC_API_URI,
  defaultTitle: 'Тендерград — субподряд на поставку товаров, работ и услуг у победителей закупок',
  defaultDescription:
    'Найдем безопасный подряд у победителей коммерческих тендеров и госзакупок: подберем объекты, проверим заказчика и договоримся о встрече за вас.',
  ogImage: '/opengraph-image.png', 
  themeColor: '#1771f1',
  keywords: [
    'субподряд',
    'тендеры',
    'госзакупки',
    'поставка товаров',
    'поиск закупок',
    'победители закупок',
    'коммерческие тендеры',
    'подряд',
    'закупки',
    'поставка работ',
    'поставка услуг',
    'тендерная площадка',
    'поиск тендеров',
    'государственные закупки',
    'субподрядчик',
    'генподрядчик',
    'проверка заказчика',
    'тендерград',
  ],
  // TODO: Заполнить реальными ссылками на соцсети
  socialLinks: {
    telegram: '', // например: 'https://t.me/tendergrad'
    vk: '', // например: 'https://vk.com/tendergrad'
  },
  // TODO: Получить код верификации в Яндекс Вебмастер (https://webmaster.yandex.ru)
  // и вставить сюда
  yandexVerification: '',
} as const

import type { Metadata } from 'next'

export const getOpenGraph = (
  override?: Metadata['openGraph']
): Metadata['openGraph'] => {
  return {
    type: 'website',
    locale: 'ru_RU',
    url: SEO.baseUrl,
    siteName: SEO.siteName,
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    images: [
      {
        url: new URL(SEO.ogImage, SEO.baseUrl).toString(),
        width: 1200,
        height: 630,
        alt: `${SEO.siteName} — платформа субподряда`,
      },
    ],
    ...override,
  }
}
