'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Book, MessageSquare, BarChart2, Wrench } from 'lucide-react'
import { Tooltip } from 'react-tooltip'

const tabs = [
  { match: '/admin/admin-blogs', href: '/admin/admin-blogs', icon: <Book size={24} />, label: 'Blogs' },
  { match: '/admin/admin-reviews', href: '/admin/admin-reviews', icon: <MessageSquare size={24} />, label: 'Reviews' },
  { match: '/admin/analytics', href: '/admin/analytics', icon: <BarChart2 size={24} />, label: 'Analytics' },
  { match: '/admin/extra-tools', href: '/admin/extra-tools', icon: <Wrench size={24} />, label: 'Extra Tools' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed top-0 left-0 w-16 h-screen bg-white border-r border-gray-200 flex flex-col items-center pt-24 gap-8 z-50">
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.match)

        return (
          <div key={tab.href}>
            <Link
              href={tab.href}
              className={`text-gray-600 hover:text-blue-500 transition-colors ${isActive ? 'text-blue-500' : ''}`}
              data-tooltip-id={`tooltip-${tab.label}`}
              data-tooltip-content={tab.label}
            >
              {tab.icon}
            </Link>
            <Tooltip id={`tooltip-${tab.label}`} place="right" />
          </div>
        )
      })}
    </div>
  )
}
