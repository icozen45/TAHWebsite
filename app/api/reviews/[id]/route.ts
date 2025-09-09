import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

// GET /api/reviews/[id]
export async function GET(
    req: NextRequest,
    context: { params: { id: string } }
) {
  const { id } = context.params

  try {
    const review = await prisma.review.findUnique({
      where: { id },
    })

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error('❌ Error fetching review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch review' },
      { status: 500 }
    )
  }
}

// PUT /api/reviews/[id]
export async function PUT(
    req: NextRequest,
    context: { params: { id: string } }
) {
  const { id } = context.params

  try {
    const body = await req.json()
    const { content, rating } = body

    const updated = await prisma.review.update({
      where: { id },
      data: {
        content,
        rating,
      },
    })

    return NextResponse.json({ success: true, review: updated })
  } catch (error) {
    console.error('❌ Error updating review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

// DELETE /api/reviews/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params

  try {
    // 1. Fetch the review
    const review = await prisma.review.findUnique({ where: { id } })

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      )
    }

    // 2. Delete associated images if any
    const images = review.images as string[] | null

    if (images && images.length > 0) {
      images.forEach((imgPath) => {
        const fullPath = path.join(process.cwd(), 'public', imgPath)

        try {
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath)
            console.log('🗑️ Deleted image:', fullPath)
          }
        } catch (err) {
          console.error('⚠️ Failed to delete image:', imgPath, err)
        }
      })
    }

    // 3. Delete the review itself
    await prisma.review.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Error deleting review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}
