'use client';

import { useSession } from 'next-auth/react';
import { useLanguageContext } from '@/lib/language-context';
import { getTranslations } from '@/lib/i18n';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ComposerPage() {
  const { data: session } = useSession();
  const { language: currentLang } = useLanguageContext();
  const t = getTranslations(currentLang);
  const router = useRouter();

  const [formData, setFormData] = useState({
    language: currentLang,
    topic: '',
    tone: 'professional',
    targetRole: '',
    industry: '',
    content: '',
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/openai/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: formData.language,
          topic: formData.topic,
          tone: formData.tone,
          targetRole: formData.targetRole,
          industry: formData.industry,
          userProfile: {
            name: session?.user?.name,
            headline: session?.user?.headline,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to generate post');

      const data = await response.json();
      setFormData(prev => ({ ...prev, content: data.content }));
    } catch (error) {
      console.error('Error generating post:', error);
      alert(t.common.error);
    } finally {
      setGenerating(false);
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('content', formData.content);
      formDataToSend.append('language', formData.language);
      formDataToSend.append('topic', formData.topic);
      formDataToSend.append('tone', formData.tone);
      formDataToSend.append('targetRole', formData.targetRole);
      formDataToSend.append('industry', formData.industry);
      formDataToSend.append('status', 'draft');
      if (mediaFile) {
        formDataToSend.append('media', mediaFile);
      }

      const response = await fetch('/api/posts/create', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to save draft');

      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert(t.common.error);
    } finally {
      setSaving(false);
    }
  };

  const handleSchedule = async () => {
    if (!scheduledAt) {
      alert(currentLang === 'ar' ? 'يرجى اختيار التاريخ والوقت' : 'Please select date and time');
      return;
    }

    setSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('content', formData.content);
      formDataToSend.append('language', formData.language);
      formDataToSend.append('topic', formData.topic);
      formDataToSend.append('tone', formData.tone);
      formDataToSend.append('targetRole', formData.targetRole);
      formDataToSend.append('industry', formData.industry);
      formDataToSend.append('status', 'scheduled');
      formDataToSend.append('scheduledAt', scheduledAt);
      if (mediaFile) {
        formDataToSend.append('media', mediaFile);
      }

      const response = await fetch('/api/posts/create', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to schedule post');

      router.push('/dashboard');
    } catch (error) {
      console.error('Error scheduling post:', error);
      alert(t.common.error);
    } finally {
      setSaving(false);
    }
  };

  const handlePublishNow = async () => {
    setSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('content', formData.content);
      formDataToSend.append('language', formData.language);
      if (mediaFile) {
        formDataToSend.append('media', mediaFile);
      }

      const response = await fetch('/api/linkedin/publish-post', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to publish post');
      }

      alert(t.common.success);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error publishing post:', error);
      alert(error instanceof Error ? error.message : t.common.error);
    } finally {
      setSaving(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout>
      <div dir={formData.language === 'ar' ? 'rtl' : 'ltr'}>
        <h1 className="text-4xl font-bold mb-6">{t.composer.title}</h1>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold">{t.composer.language}</label>
            <select
              value={formData.language}
              onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value as 'ar' | 'en' }))}
              className="w-full p-2 border rounded"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">{t.composer.topic}</label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
              placeholder={t.composer.topicPlaceholder}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">{t.composer.tone}</label>
            <select
              value={formData.tone}
              onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
              className="w-full p-2 border rounded"
            >
              <option value="professional">{t.composer.toneOptions.professional}</option>
              <option value="storytelling">{t.composer.toneOptions.storytelling}</option>
              <option value="technical">{t.composer.toneOptions.technical}</option>
              <option value="casual">{t.composer.toneOptions.casual}</option>
              <option value="inspirational">{t.composer.toneOptions.inspirational}</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">{t.composer.targetRole}</label>
            <input
              type="text"
              value={formData.targetRole}
              onChange={(e) => setFormData(prev => ({ ...prev, targetRole: e.target.value }))}
              placeholder={t.composer.targetRolePlaceholder}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">{t.composer.industry}</label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              placeholder={t.composer.industryPlaceholder}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {generating ? t.composer.generating : t.composer.generate}
            </button>
          </div>

          <div>
            <label className="block mb-2 font-semibold">{t.composer.content}</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder={t.composer.contentPlaceholder}
              rows={10}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">{t.composer.mediaUpload}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleMediaChange}
              className="w-full p-2 border rounded"
            />
            {mediaPreview && (
              <div className="mt-4">
                <img src={mediaPreview} alt="Preview" className="max-w-md rounded" />
                <button
                  onClick={() => {
                    setMediaFile(null);
                    setMediaPreview(null);
                  }}
                  className="mt-2 text-red-600 hover:underline"
                >
                  {t.composer.removeImage}
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSaveDraft}
              disabled={saving || !formData.content}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
            >
              {t.composer.saveDraft}
            </button>
            <div className="flex items-center gap-2">
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="p-2 border rounded"
              />
              <button
                onClick={handleSchedule}
                disabled={saving || !formData.content || !scheduledAt}
                className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
              >
                {t.composer.schedule}
              </button>
            </div>
            <button
              onClick={handlePublishNow}
              disabled={saving || !formData.content}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {t.composer.publishNow}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

