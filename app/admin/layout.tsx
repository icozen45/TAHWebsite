import AdminSidebar from '@/app/components/AdminSidebar';
import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-16 pt-20 w-full">
        {children}
      </main>
    </div>
  )
}
