import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Request body:', body);

    const { email } = body;

    if (!email) {
      console.log('Missing email');
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    console.log('Existing subscriber:', existing);

    if (existing) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 400 });
    }

    await prisma.subscriber.create({ data: { email } });
    console.log('Subscriber created');

    await sendWelcomeEmail(email);
    console.log('Email sent');

    return NextResponse.json({ message: 'Subscribed and email sent!' });
  } catch (err) {
    console.error('Error in POST handler:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
