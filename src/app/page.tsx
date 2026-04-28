import { redirect } from 'next/navigation'

import { paths } from '@/shared/config/paths'

export default function Page() {
  redirect(paths.contracts.root())
}