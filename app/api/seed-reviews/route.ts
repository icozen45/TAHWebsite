import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // make sure this path is correct

const getRandomRating = () => {
  const num = Math.random() * 5
  return Math.round(num * 10) / 10 // 1 decimal
}

export async function GET() {
  const fakeContent = 'This is a sample review content. Very insightful and informative.'

  try {
    const reviewData = Array.from({ length: 30 }).map((_, i) => ({
      id: crypto.randomUUID(),
      name: `User ${i + 1}`,
      title: `Review Title ${i + 1}`,
      content: fakeContent,
      rating: getRandomRating(),
      createdAt: new Date(),
    }))

    await prisma.review.createMany({
      data: reviewData,
    })

    return NextResponse.json({ success: true, message: 'Seeded 30 fake reviews.' })
  } catch (err) {
    console.error('SEED ERROR:', err)
    return NextResponse.json({ success: false, error: err }, { status: 500 })
  }
}
