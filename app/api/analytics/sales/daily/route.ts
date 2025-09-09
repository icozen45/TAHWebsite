// app/api/analytics/daily/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: { createdAt: 'asc' },
    })

    // Aggregate daily sales
    const dailySales = sales.reduce((acc, sale) => {
      const day = sale.createdAt.toISOString().slice(0, 10) // yyyy-mm-dd
      acc[day] = (acc[day] || 0) + sale.amount
      return acc
    }, {} as Record<string, number>)

    const dailyArray = Object.entries(dailySales).map(([date, total]) => ({
      date,
      total,
    }))

    return NextResponse.json(dailyArray)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch daily sales' }, { status: 500 })
  }
}
