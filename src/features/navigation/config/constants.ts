import { Bookmark, Search } from 'lucide-react'

import { paths } from '@/shared/config/paths'

export const NAV_ITEMS = [
  { label: 'Закупки', href: paths.contracts.root(), icon: Search },
  {
    label: 'Шаблоны',
    href: paths.templates.root(),
    activeHref: (templateId: string) => paths.templates.detail(templateId),
    icon: Bookmark,
  },
]
