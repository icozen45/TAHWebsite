import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, summary, content, tags, date } = body

    // Validate presence of fields
    if (!title || !summary || !content || !tags) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      )
    }

    // Validate content word count
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length
    if (wordCount < 120) {
      return NextResponse.json(
        { error: 'Content must be at least 120 words.' },
        { status: 400 }
      )
    }

    const newBlog = await prisma.blogPost.create({
      data: {
        title,
        summary,
        content,
        tags,
        date: date ? new Date(date) : new Date(),
      },
    })

    return NextResponse.json(newBlog, { status: 201 })
  } catch (err) {
    console.error('[BLOG CREATE ERROR]', err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
