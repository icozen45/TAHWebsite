import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Missing blog ID' },
        { status: 400 }
      )
    }

    // Check if blog exists before deletion
    const existing = await prisma.blogPost.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    await prisma.blogPost.delete({ where: { id } })

    return NextResponse.json({ message: 'Blog deleted' }, { status: 200 })
  } catch (err) {
    console.error('[BLOG DELETE ERROR]', err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
