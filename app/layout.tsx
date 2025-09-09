import './globals.css'
import Navbar from './components/navbar'
import Footer from "@/app/components/ui/footer"
import { DM_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast';
import LoadingScreen from '@/app/components/loadingScreen'

export const metadata = {
  title: 'Global Project Solutions',
  description: 'Global Project Solutions - Your all in one writing helper',
  icons: {
    icon: '/favicon.ico'
  }
}

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
   return (
    <html lang="en" className={dmSans.variable} data-scroll-behavior="smooth">
      <body className='font-sans flex flex-col min-h-screen'>
        <LoadingScreen />
        <Navbar />
        <Toaster position='bottom-right' />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
