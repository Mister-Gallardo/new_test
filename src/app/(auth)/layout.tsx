import { Footer } from '@/widgets/footer'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex grow mt-10">{children}</main>
      <Footer className='mt-20' />
    </div>
  )
}
