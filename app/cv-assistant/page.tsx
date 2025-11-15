'use client';

import { useSession } from 'next-auth/react';
import { useLanguageContext } from '@/lib/language-context';
import { getTranslations } from '@/lib/i18n';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useState } from 'react';

interface AnalysisResult {
  generalFeedback: string;
  improvedSummary: string;
  improvedBullets: string;
}

export default function CVAssistantPage() {
  const { data: session } = useSession();
  const { language } = useLanguageContext();
  const t = getTranslations(language);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert(language === 'ar' ? 'يرجى اختيار ملف PDF' : 'Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/openai/analyze-cv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze CV');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error analyzing CV:', error);
      alert(t.common.error);
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(t.cvAssistant.copied);
  };

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <h1 className="text-4xl font-bold mb-6">{t.cvAssistant.title}</h1>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="mb-4">{t.cvAssistant.uploadPrompt}</p>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="mb-4"
            />
            {file && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'الملف المحدد:' : 'Selected file:'} {file.name}
                </p>
              </div>
            )}
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? t.cvAssistant.analyzing : t.cvAssistant.upload}
            </button>
          </div>

          {analysis && (
            <div className="space-y-6">
              <section className="bg-white p-6 rounded-lg border">
                <h2 className="text-2xl font-semibold mb-4">{t.cvAssistant.generalFeedback}</h2>
                <div className="whitespace-pre-wrap text-gray-700">{analysis.generalFeedback}</div>
              </section>

              <section className="bg-white p-6 rounded-lg border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">{t.cvAssistant.improvedSummary}</h2>
                  <button
                    onClick={() => copyToClipboard(analysis.improvedSummary)}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    {t.cvAssistant.copySummary}
                  </button>
                </div>
                <div className="whitespace-pre-wrap text-gray-700">{analysis.improvedSummary}</div>
              </section>

              <section className="bg-white p-6 rounded-lg border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">{t.cvAssistant.improvedBullets}</h2>
                  <button
                    onClick={() => copyToClipboard(analysis.improvedBullets)}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    {t.cvAssistant.copyBullets}
                  </button>
                </div>
                <div className="whitespace-pre-wrap text-gray-700">{analysis.improvedBullets}</div>
              </section>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

