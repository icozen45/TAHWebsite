import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const rating = parseFloat(formData.get('rating') as string);
    const files = formData.getAll('images') as File[];

    const imagePaths: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${file.name}`;
      const uploadPath = path.join(process.cwd(), 'public/uploads', fileName);

      // Write file to disk
      await writeFile(uploadPath, buffer);

      imagePaths.push(`/uploads/${fileName}`);
    }

    const review = await prisma.review.create({
      data: {
        title,
        content,
        rating,
        images: imagePaths, // Prisma schema must support this as String[]
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Error saving review:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
