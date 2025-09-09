// app/api/analytics/monthly/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: { createdAt: 'asc' },
    })

    // Aggregate monthly sales
    const monthlySales = sales.reduce((acc, sale) => {
      const date = sale.createdAt
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` // e.g. "2025-07"
      acc[month] = (acc[month] || 0) + sale.amount
      return acc
    }, {} as Record<string, number>)

    const monthlyArray = Object.entries(monthlySales).map(([date, total]) => ({
      date,
      total,
    }))

    return NextResponse.json(monthlyArray)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch monthly sales' }, { status: 500 })
  }
}
