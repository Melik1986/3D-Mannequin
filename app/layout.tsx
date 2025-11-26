import './globals.css'
import { Cinzel, Inter } from 'next/font/google'

const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="font-sans bg-[#050505] text-white">{children}</body>
    </html>
  )
}
