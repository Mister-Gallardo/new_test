# Стейдж 1: Базовый образ и настройка pnpm
FROM node:20-alpine AS base
# Включаем встроенный pnpm
RUN corepack enable pnpm

# Стейдж 2: Установка зависимостей
FROM base AS deps
# Устанавливаем libc6-compat, часто требуется для бинарников под Alpine (например, для SWC/Turbopack)
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

# Стейдж 3: Сборка
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Прокидываем build-time переменные (в Next.js NEXT_PUBLIC_* вшиваются в код на этапе сборки)
ARG NEXT_PUBLIC_IDENTITY_BASEURL
ARG NEXT_PUBLIC_IDENTITY_CLIENT_ID
ARG NEXT_PUBLIC_IDENTITY_REDIRECT_URI
ARG NEXT_PUBLIC_IDENTITY_SCOPE
ARG NEXT_PUBLIC_IDENTITY_CLIENT_SECRET
ARG NEXT_PUBLIC_API_URI
ARG NEXT_PUBLIC_KLADR_URI

ENV NEXT_PUBLIC_IDENTITY_BASEURL=$NEXT_PUBLIC_IDENTITY_BASEURL
ENV NEXT_PUBLIC_IDENTITY_CLIENT_ID=$NEXT_PUBLIC_IDENTITY_CLIENT_ID
ENV NEXT_PUBLIC_IDENTITY_REDIRECT_URI=$NEXT_PUBLIC_IDENTITY_REDIRECT_URI
ENV NEXT_PUBLIC_IDENTITY_SCOPE=$NEXT_PUBLIC_IDENTITY_SCOPE
ENV NEXT_PUBLIC_IDENTITY_CLIENT_SECRET=$NEXT_PUBLIC_IDENTITY_CLIENT_SECRET
ENV NEXT_PUBLIC_API_URI=$NEXT_PUBLIC_API_URI
ENV NEXT_PUBLIC_KLADR_URI=$NEXT_PUBLIC_KLADR_URI

# Запускаем сборку
RUN pnpm run build

# Стейдж 4: Продакшен сервер (минимальный вес)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Next.js телеметрия обычно не нужна на сервере
ENV NEXT_TELEMETRY_DISABLED=1 
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Создаем пользователя без root-прав для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем статику
COPY --from=builder /app/public ./public

# Копируем standalone сборку и статические ассеты Next.js
# Выставляем правильного владельца файлов
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Переключаемся на non-root пользователя
USER nextjs

EXPOSE 3000

# Standalone сборка генерирует server.js, запускаем его (client/server.js)
CMD ["node", "server.js"]