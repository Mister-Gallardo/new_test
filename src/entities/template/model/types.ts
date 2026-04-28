export type Template = {
  id: string
  name: string
}

export type TemplatesResponse = {
  items: Template[]
  total: number
}

export type TemplateMailing = {
  templateId: string
  isActive: boolean
}
