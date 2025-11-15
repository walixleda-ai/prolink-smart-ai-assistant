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

    const settings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { defaultLanguage, defaultTone, postingFrequency, preferredIndustries, preferredRoles } = body;

    const settings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        defaultLanguage: defaultLanguage || 'en',
        defaultTone: defaultTone || 'professional',
        postingFrequency: postingFrequency || 3,
        preferredIndustries: preferredIndustries || null,
        preferredRoles: preferredRoles || null,
      },
      create: {
        userId: session.user.id,
        defaultLanguage: defaultLanguage || 'en',
        defaultTone: defaultTone || 'professional',
        postingFrequency: postingFrequency || 3,
        preferredIndustries: preferredIndustries || null,
        preferredRoles: preferredRoles || null,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

