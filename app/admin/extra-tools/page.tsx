'use client'

import { Cpu, Image, ScanLine } from 'lucide-react'
import Link from 'next/link'

export default function ExtraToolsPage() {
  const tools = {
    'Page Optimizer': {
      href: '/admin/extra-tools/optimizer',
      icon: <Cpu size={20} />,
    },
    'Component Linter': {
      href: '/admin/extra-tools/linter',
      icon: <ScanLine size={20} />,
    },
  }

  return (
    <div className="p-8 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Extra Tools</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(tools).map(([name, { href, icon }]) => (
          <Link
            key={name}
            href={href}
            className="px-4 py-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition flex items-center gap-2"
          >
            {icon}
            {name}
          </Link>
        ))}
      </div>
    </div>
  )
}
