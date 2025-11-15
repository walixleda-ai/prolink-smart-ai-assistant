import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { linkedinAccessToken: true },
    });

    return NextResponse.json({
      openai: !!process.env.OPENAI_API_KEY,
      linkedin: !!user?.linkedinAccessToken,
    });
  } catch (error) {
    console.error('Error fetching status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

