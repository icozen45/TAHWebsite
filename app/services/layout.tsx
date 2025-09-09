import UserSidebar from '@/app/components/UserSidebar'
import { ReactNode } from 'react'

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <UserSidebar />
      <main className="w-full">
        {children}
      </main>
    </div>
  )
}
