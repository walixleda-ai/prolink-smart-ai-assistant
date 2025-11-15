import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { publishPost, uploadMedia, getUserAccessToken } from '@/lib/linkedin';
import { readFile } from 'fs/promises';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const accessToken = await getUserAccessToken(userId);

    if (!accessToken) {
      return NextResponse.json(
        { error: 'LinkedIn not connected. Please reconnect your account.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const postId = formData.get('postId') as string;
    const content = formData.get('content') as string;
    const mediaFile = formData.get('media') as File | null;

    let post;
    if (postId) {
      post = await prisma.post.findUnique({
        where: { id: postId, userId },
      });

      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
    }

    const postContent = content || post?.content || '';
    if (!postContent) {
      return NextResponse.json({ error: 'Post content is required' }, { status: 400 });
    }

    let mediaUrn: string | undefined;

    if (mediaFile || post?.mediaPath) {
      try {
        let imageBuffer: Buffer;
        let mimeType = 'image/jpeg';

        if (mediaFile) {
          const arrayBuffer = await mediaFile.arrayBuffer();
          imageBuffer = Buffer.from(arrayBuffer);
          mimeType = mediaFile.type || 'image/jpeg';
        } else if (post?.mediaPath) {
          imageBuffer = await readFile(post.mediaPath);
          // Determine mime type from file extension
          if (post.mediaPath.endsWith('.png')) {
            mimeType = 'image/png';
          }
        } else {
          throw new Error('No media file provided');
        }

        mediaUrn = await uploadMedia(accessToken, imageBuffer, mimeType);
      } catch (error) {
        console.error('Error uploading media:', error);
        // Continue without media if upload fails
      }
    }

    const result = await publishPost(accessToken, postContent, mediaUrn);

    // Update post status if it exists
    if (post) {
      await prisma.post.update({
        where: { id: post.id },
        data: {
          status: 'published',
          publishedAt: new Date(),
          linkedinPostId: result.id,
        },
      });
    } else {
      // Create a new post record
      await prisma.post.create({
        data: {
          userId,
          content: postContent,
          status: 'published',
          publishedAt: new Date(),
          linkedinPostId: result.id,
        },
      });
    }

    return NextResponse.json({ success: true, linkedinPostId: result.id });
  } catch (error) {
    console.error('Error publishing post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to publish post' },
      { status: 500 }
    );
  }
}

