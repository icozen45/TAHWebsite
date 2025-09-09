// app/admin/analytics/StatCard.tsx
'use client'

import CountUp from 'react-countup'

type Props = {
  title: string
  value: number
  icon?: React.ReactNode
}

export default function StatCard({ title, value, icon }: Props) {
  return (
    <div className="flex items-center gap-3 min-w-[160px]">
      <div className="text-xl text-gray-600">{icon}</div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-600">{title}</span>
        <span className="text-xl font-semibold text-gray-600">
          <CountUp
            end={value}
            duration={1.2}
            decimals={title === 'Average Rating' ? 1 : 0}
          />
        </span>
      </div>
    </div>
  )
}
