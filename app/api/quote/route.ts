// app/api/quote/route.ts

export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a wise quote generator. Always return a short, punchy, original quote.',
        },
        {
          role: 'user',
          content: 'Give me a motivational quote.',
        },
      ],
      temperature: 0.9,
      max_tokens: 60,
    });

    const quote = completion.choices[0].message.content;
    return NextResponse.json({ quote });
  } catch (error) {
    console.error('Quote generation error:', error);
    return NextResponse.json({ quote: 'Something went wrong.' }, { status: 500 });
  }
}
