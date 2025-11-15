import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export async function generatePost(params: {
  language: 'ar' | 'en';
  topic?: string;
  tone?: string;
  targetRole?: string;
  industry?: string;
  userProfile?: {
    name?: string;
    headline?: string;
  };
}): Promise<string> {
  const { language, topic, tone, targetRole, industry, userProfile } = params;

  const systemPrompt = language === 'ar' 
    ? 'أنت مساعد محترف لإنشاء منشورات LinkedIn. أنشئ منشورات احترافية وجذابة باللغة العربية.'
    : 'You are a professional LinkedIn post assistant. Create professional and engaging LinkedIn posts in English.';

  const userPrompt = language === 'ar'
    ? `أنشئ منشور LinkedIn احترافي:
${topic ? `الموضوع: ${topic}` : ''}
${tone ? `النبرة: ${tone}` : ''}
${targetRole ? `الجمهور المستهدف: ${targetRole}` : ''}
${industry ? `المجال: ${industry}` : ''}
${userProfile?.headline ? `خلفية المستخدم: ${userProfile.headline}` : ''}

أنشئ منشوراً احترافياً وجذاباً (150-300 كلمة).`
    : `Create a professional LinkedIn post:
${topic ? `Topic: ${topic}` : ''}
${tone ? `Tone: ${tone}` : ''}
${targetRole ? `Target audience: ${targetRole}` : ''}
${industry ? `Industry: ${industry}` : ''}
${userProfile?.headline ? `User background: ${userProfile.headline}` : ''}

Create a professional and engaging post (150-300 words).`;

  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || '';
}

export async function analyzeCV(cvText: string, language: 'ar' | 'en'): Promise<{
  generalFeedback: string;
  improvedSummary: string;
  improvedBullets: string;
}> {
  const systemPrompt = language === 'ar'
    ? 'أنت خبير في تحليل السير الذاتية. قدم تحليلاً شاملاً واقتراحات تحسين باللغة العربية والإنجليزية.'
    : 'You are a CV analysis expert. Provide comprehensive analysis and improvement suggestions in both Arabic and English.';

  const userPrompt = language === 'ar'
    ? `حلل السيرة الذاتية التالية وقدم:
1. ملاحظات عامة عن الهيكل والمحتوى (بالعربية والإنجليزية)
2. ملخص محسّن (بالعربية والإنجليزية)
3. نقاط محسّنة لدورين رئيسيين (بالعربية والإنجليزية)

السيرة الذاتية:
${cvText}`
    : `Analyze the following CV and provide:
1. General feedback on structure and content (in Arabic and English)
2. Improved summary (in Arabic and English)
3. Improved bullet points for 1-2 key roles (in Arabic and English)

CV:
${cvText}`;

  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.5,
  });

  const content = response.choices[0]?.message?.content || '';
  
  // Parse the response into structured format
  const sections = content.split(/\d+\./).filter(s => s.trim());
  
  return {
    generalFeedback: sections[0]?.trim() || content,
    improvedSummary: sections[1]?.trim() || '',
    improvedBullets: sections[2]?.trim() || '',
  };
}

