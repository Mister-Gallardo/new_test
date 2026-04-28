import { z } from 'zod'

const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_URI: z.string().trim().min(1),
  NEXT_PUBLIC_KLADR_URI: z.string().trim().min(1),

  NEXT_PUBLIC_IDENTITY_BASEURL: z.string().trim().min(1),
  NEXT_PUBLIC_IDENTITY_CLIENT_ID: z.string().trim().min(1),
  NEXT_PUBLIC_IDENTITY_REDIRECT_URI: z.string().trim().min(1),
  NEXT_PUBLIC_IDENTITY_SCOPE: z.string().trim().min(1),
  NEXT_PUBLIC_IDENTITY_CLIENT_SECRET: z.string().trim().min(1),
})

// const serverEnvSchema = z.object({
//   IDENTITY_BASEURL: z.string().trim().min(1),
//   IDENTITY_CLIENT_ID: z.string().trim().min(1),
//   IDENTITY_REDIRECT_URI: z.string().trim().min(1),
//   IDENTITY_SCOPE: z.string().trim().min(1),
//   IDENTITY_CLIENT_SECRET: z.string().trim().min(1),
// })

const publicParsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_API_URI: process.env.NEXT_PUBLIC_API_URI,
  NEXT_PUBLIC_KLADR_URI: process.env.NEXT_PUBLIC_KLADR_URI,

  NEXT_PUBLIC_IDENTITY_BASEURL: process.env.NEXT_PUBLIC_IDENTITY_BASEURL,
  NEXT_PUBLIC_IDENTITY_CLIENT_ID: process.env.NEXT_PUBLIC_IDENTITY_CLIENT_ID,
  NEXT_PUBLIC_IDENTITY_REDIRECT_URI: process.env.NEXT_PUBLIC_IDENTITY_REDIRECT_URI,
  NEXT_PUBLIC_IDENTITY_SCOPE: process.env.NEXT_PUBLIC_IDENTITY_SCOPE,
  NEXT_PUBLIC_IDENTITY_CLIENT_SECRET: process.env.NEXT_PUBLIC_IDENTITY_CLIENT_SECRET,
})

if (!publicParsed.success) {
  throw new Error(
    `❌ Ошибка в публичных переменных окружения:\n${JSON.stringify(z.formatError(publicParsed.error), null, 2)}`,
  )
}

export const env = publicParsed.data

// export function getServerEnv() {
//   if (typeof window !== 'undefined') {
//     throw new Error('getServerEnv() вызван на клиенте.')
//   }

//   const parsed = serverEnvSchema.safeParse({
//     IDENTITY_BASEURL: process.env.IDENTITY_BASEURL,
//     IDENTITY_CLIENT_ID: process.env.IDENTITY_CLIENT_ID,
//     IDENTITY_REDIRECT_URI: process.env.IDENTITY_REDIRECT_URI,
//     IDENTITY_SCOPE: process.env.IDENTITY_SCOPE,
//     IDENTITY_CLIENT_SECRET: process.env.IDENTITY_CLIENT_SECRET,
//   })

//   if (!parsed.success) {
//     throw new Error(
//       `❌ Ошибка в серверных переменных окружения:\n${JSON.stringify(z.treeifyError(parsed.error), null, 2)}`,
//     )
//   }

//   return parsed.data
// }
