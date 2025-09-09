import UserSidebar from '@/app/components/UserSidebar'
import { ReactNode } from 'react'

export default function BlogsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <UserSidebar />
      <main className="ml-16 w-full">
        {children}
      </main>
    </div>
  )
}
