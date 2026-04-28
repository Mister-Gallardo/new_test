import Link from 'next/link'

import { Card, CardContent } from '@/shared/ui/card'

import type { Template } from '../model/types'

type TemplateCardProps = {
  item: Template
}

export const TemplateCard = ({ item }: TemplateCardProps) => {
  return (
    <Link href={`/templates/${item.id}`} className="no-underline">
      <Card className="px-3 py-2 outline outline-brand-primary hover:bg-brand-primary/10 hover:-translate-y-0.5 transition-all duration-200">
        <CardContent className="flex justify-center items-center">
          <h3 className="font-medium">{item.name}</h3>
        </CardContent>
      </Card>
    </Link>
  )
}
