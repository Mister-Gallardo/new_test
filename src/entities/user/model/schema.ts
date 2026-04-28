import z from 'zod'

export const EmailFormSchema = z.object({
  email: z.email('Введите корректный адрес почты'),
  agree: z.boolean().refine((val) => val === true, {
    message: 'Необходимо согласие',
  }),
})

export type EmailForm = z.infer<typeof EmailFormSchema>
