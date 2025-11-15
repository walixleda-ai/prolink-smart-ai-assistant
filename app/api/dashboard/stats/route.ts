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

    const userId = session.user.id;

    const [drafts, scheduled, published] = await Promise.all([
      prisma.post.count({
        where: { userId, status: 'draft' },
      }),
      prisma.post.count({
        where: { userId, status: 'scheduled' },
      }),
      prisma.post.count({
        where: { userId, status: 'published' },
      }),
    ]);

    return NextResponse.json({ drafts, scheduled, published });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

