'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Book, Calculator, MessageSquareQuote } from 'lucide-react'
import { Tooltip } from 'react-tooltip'

const tabs = [
  { name: '/blogs', icon: <Book size={24} />, label: 'Blogs' },
  { name: '/services/calculator', icon: <Calculator size={24} />, label: 'Calculator' },
  { name: '/services/quote-generator', icon: <MessageSquareQuote size={24} />, label: 'Quote Generator' },
]

export default function UserSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 w-16 h-screen bg-white border-r border-gray-200 flex flex-col items-center pt-24 gap-8 z-50">
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.name)

        return (
          <div key={tab.name}>
            <Link
              href={tab.name}
              className={`text-gray-600 hover:text-blue-500 transition-colors ${
                isActive ? 'text-blue-500' : ''
              }`}
              data-tooltip-id={`tooltip-${tab.name}`}
              data-tooltip-content={tab.label}
            >
              {tab.icon}
            </Link>
            <Tooltip id={`tooltip-${tab.name}`} place="right" />
          </div>
        )
      })}
    </div>
  )
}
