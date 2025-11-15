import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const content = formData.get('content') as string;
    const language = formData.get('language') as string;
    const topic = formData.get('topic') as string;
    const tone = formData.get('tone') as string;
    const targetRole = formData.get('targetRole') as string;
    const industry = formData.get('industry') as string;
    const status = formData.get('status') as string;
    const scheduledAt = formData.get('scheduledAt') as string;
    const mediaFile = formData.get('media') as File | null;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    let mediaPath: string | null = null;
    let mediaUrl: string | null = null;

    if (mediaFile) {
      const uploadsDir = join(process.cwd(), 'public', 'uploads');
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }

      const bytes = await mediaFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${mediaFile.name}`;
      mediaPath = join(uploadsDir, fileName);
      await writeFile(mediaPath, buffer);
      mediaUrl = `/uploads/${fileName}`;
    }

    const post = await prisma.post.create({
      data: {
        userId: session.user.id,
        content,
        language: language || 'en',
        topic: topic || null,
        tone: tone || null,
        targetRole: targetRole || null,
        industry: industry || null,
        status: status || 'draft',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        mediaPath,
        mediaUrl,
      },
    });

    if (status === 'scheduled' && scheduledAt) {
      await prisma.schedule.create({
        data: {
          userId: session.user.id,
          postId: post.id,
          scheduledAt: new Date(scheduledAt),
          status: 'PENDING',
          withMedia: !!mediaFile,
          mediaPath,
        },
      });
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create post' },
      { status: 500 }
    );
  }
}

