import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'daily'

  if (type === 'daily') {
    const sales = await prisma.sale.findMany()
    const grouped: Record<string, number> = {}

    for (const sale of sales) {
      const key = format(sale.createdAt, 'yyyy-MM-dd')
      grouped[key] = (grouped[key] || 0) + sale.amount
    }

    const formatted = Object.entries(grouped).map(([date, total]) => ({
      date,
      total,
    }))

    return NextResponse.json(formatted)
  }

  if (type === 'monthly') {
    const sales = await prisma.sale.findMany()
    const grouped: Record<string, number> = {}

    for (const sale of sales) {
      const key = format(sale.createdAt, 'yyyy-MM')
      grouped[key] = (grouped[key] || 0) + sale.amount
    }

    const formatted = Object.entries(grouped).map(([date, total]) => ({
      date,
      total,
    }))

    return NextResponse.json(formatted)
  }

  if (type === 'merged') {
    const sales = await prisma.sale.findMany()
    const dailyGroup: Record<string, number> = {}
    const monthlyGroup: Record<string, number> = {}

    for (const sale of sales) {
      const day = format(sale.createdAt, 'yyyy-MM-dd')
      const month = format(sale.createdAt, 'yyyy-MM')
      dailyGroup[day] = (dailyGroup[day] || 0) + sale.amount
      monthlyGroup[month] = (monthlyGroup[month] || 0) + sale.amount
    }

    const allKeys = new Set([
      ...Object.keys(dailyGroup),
      ...Object.keys(monthlyGroup),
    ])

    const merged = Array.from(allKeys).sort().map((key) => ({
      date: key,
      daily: dailyGroup[key] || 0,
      monthly: monthlyGroup[key] || 0,
    }))

    return NextResponse.json(merged)
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}
