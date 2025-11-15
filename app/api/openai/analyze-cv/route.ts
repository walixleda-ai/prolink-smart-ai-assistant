import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { analyzeCV } from '@/lib/openai';
import { extractTextFromPDF } from '@/lib/pdf-parser';

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

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file || file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Invalid file. Please upload a PDF file.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const cvText = await extractTextFromPDF(buffer);
    
    if (!cvText || cvText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF. Please ensure the PDF contains text.' },
        { status: 400 }
      );
    }

    const analysis = await analyzeCV(cvText, 'en'); // Default to English for analysis

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing CV:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze CV' },
      { status: 500 }
    );
  }
}

