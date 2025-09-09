import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('⏳ Start fetching reviews');

    const reviews = await prisma.review.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('✅ Reviews fetched:', reviews.length);

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('❌ Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
