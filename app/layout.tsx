import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pax Brain',
  description: 'Living dashboard of Pax system composition and operating workflow',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <body className='antialiased'>{children}</body>
    </html>
  )
}
