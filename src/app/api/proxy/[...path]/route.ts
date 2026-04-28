import { env } from '@/shared/config/env'

import type { NextRequest } from 'next/server'

import { apiFetch } from '@/shared/api/api'

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const pathArray = (await params).path || []
  const path = pathArray.join('/')
  const url = new URL(`${env.NEXT_PUBLIC_API_URI}/api/${path}`)

  // Копируем query-параметры (search string)
  url.search = req.nextUrl.search

  const options: RequestInit = {
    method: req.method,
    headers: new Headers(),
  }

  // Оставляем только нужные заголовки, например Content-Type
  const contentType = req.headers.get('content-type')
  if (contentType) {
    (options.headers as Headers).set('Content-Type', contentType)
  }

  // Передаём тело запроса для мутаций
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    options.body = await req.arrayBuffer()
  }

  // apiFetch сам достанет access_token из cookies,
  // прикрепит его и обработает 401 Unauthorized рефрешем
  const response = await apiFetch(url.toString(), options)

  // Возвращаем ответ клиенту как есть
  return response
}

export { handler as DELETE, handler as GET, handler as PATCH, handler as POST, handler as PUT }
