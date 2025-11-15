import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { publishPost, uploadMedia, getUserAccessToken } from '@/lib/linkedin';
import { readFile } from 'fs/promises';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const accessToken = await getUserAccessToken(userId);

    if (!accessToken) {
      return NextResponse.json(
        { error: 'LinkedIn not connected' },
        { status: 401 }
      );
    }

    const now = new Date();
    const dueSchedules = await prisma.schedule.findMany({
      where: {
        userId,
        status: 'PENDING',
        scheduledAt: { lte: now },
      },
      include: {
        post: true,
      },
    });

    let successCount = 0;
    let failCount = 0;

    for (const schedule of dueSchedules) {
      try {
        let mediaUrn: string | undefined;

        if (schedule.withMedia && schedule.mediaPath) {
          try {
            const imageBuffer = await readFile(schedule.mediaPath);
            const mimeType = schedule.mediaPath.endsWith('.png') ? 'image/png' : 'image/jpeg';
            mediaUrn = await uploadMedia(accessToken, imageBuffer, mimeType);
          } catch (error) {
            console.error('Error uploading media for schedule:', error);
            // Continue without media
          }
        }

        const result = await publishPost(accessToken, schedule.post.content, mediaUrn);

        await prisma.schedule.update({
          where: { id: schedule.id },
          data: { status: 'SENT' },
        });

        await prisma.post.update({
          where: { id: schedule.postId },
          data: {
            status: 'published',
            publishedAt: new Date(),
            linkedinPostId: result.id,
          },
        });

        successCount++;
      } catch (error) {
        console.error(`Error processing schedule ${schedule.id}:`, error);
        
        await prisma.schedule.update({
          where: { id: schedule.id },
          data: { status: 'FAILED' },
        });

        failCount++;
      }
    }

    return NextResponse.json({
      message: `Processed ${dueSchedules.length} schedules. ${successCount} succeeded, ${failCount} failed.`,
      successCount,
      failCount,
    });
  } catch (error) {
    console.error('Error running scheduler:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to run scheduler' },
      { status: 500 }
    );
  }
}

