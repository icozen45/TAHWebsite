import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, context: any) {
  const id = context.params.id
  try {
    const blog = await prisma.blogPost.findUnique({ where: { id } })
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }
    return NextResponse.json(blog)
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, context: any) {
  const id = context.params.id
  const body = await req.json()
  try {
    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title: body.title,
        summary: body.summary,
        content: body.content,
        tags: body.tags,
      },
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: any) {
  const id = context.params.id
  try {
    await prisma.blogPost.delete({ where: { id } })
    return NextResponse.json({ message: 'Blog deleted' })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 })
  }
}
