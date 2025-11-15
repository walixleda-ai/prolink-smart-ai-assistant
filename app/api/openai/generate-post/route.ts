import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { generatePost } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { language, topic, tone, targetRole, industry, userProfile } = body;

    const content = await generatePost({
      language: language || 'en',
      topic,
      tone,
      targetRole,
      industry,
      userProfile,
    });

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error generating post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate post' },
      { status: 500 }
    );
  }
}

