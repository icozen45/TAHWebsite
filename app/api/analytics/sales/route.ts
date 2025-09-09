// app/api/analytics/sales/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

export async function GET() {
  try {
    // Fetch all sales from DB
    const sales = await prisma.sale.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Group sales by day
    const grouped = sales.reduce((acc, sale) => {
      const day = format(new Date(sale.createdAt), 'yyyy-MM-dd')
      if (!acc[day]) {
        acc[day] = { amount: 0, totalRevenue: 0 }
      }
      acc[day].amount += 1 // Each row = 1 sale
      acc[day].totalRevenue += Number(sale.amount) || 0
      return acc
    }, {} as Record<string, { amount: number; totalRevenue: number }>)

    // Convert to array
    const result = Object.entries(grouped).map(([date, values]) => ({
      date,
      ...values,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('[SALES_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
