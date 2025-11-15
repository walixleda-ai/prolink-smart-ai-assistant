'use client';

import { useSession } from 'next-auth/react';
import { useLanguageContext } from '@/lib/language-context';
import { getTranslations } from '@/lib/i18n';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';

interface Settings {
  defaultLanguage: string;
  defaultTone: string;
  postingFrequency: number;
  preferredIndustries: string;
  preferredRoles: string;
}

interface Status {
  openai: boolean;
  linkedin: boolean;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const { language } = useLanguageContext();
  const t = getTranslations(language);
  const [settings, setSettings] = useState<Settings>({
    defaultLanguage: 'en',
    defaultTone: 'professional',
    postingFrequency: 3,
    preferredIndustries: '',
    preferredRoles: '',
  });
  const [status, setStatus] = useState<Status>({ openai: false, linkedin: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchStatus();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setSettings({
            defaultLanguage: data.defaultLanguage || 'en',
            defaultTone: data.defaultTone || 'professional',
            postingFrequency: data.postingFrequency || 3,
            preferredIndustries: data.preferredIndustries || '',
            preferredRoles: data.preferredRoles || '',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/settings/status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert(t.settings.saved);
      } else {
        alert(t.common.error);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(t.common.error);
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من قطع الاتصال؟' : 'Are you sure you want to disconnect?')) {
      return;
    }

    try {
      const response = await fetch('/api/linkedin/disconnect', { method: 'POST' });
      if (response.ok) {
        signOut({ callbackUrl: '/' });
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
      alert(t.common.error);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <h1 className="text-4xl font-bold mb-6">{t.settings.title}</h1>

        <div className="space-y-8">
          <section className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t.settings.openaiStatus}:</span>
                <span className={status.openai ? 'text-green-600' : 'text-red-600'}>
                  {status.openai ? t.settings.openaiSet : t.settings.openaiNotSet}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t.settings.linkedinStatus}:</span>
                <span className={status.linkedin ? 'text-green-600' : 'text-red-600'}>
                  {status.linkedin ? t.settings.linkedinConnected : t.settings.linkedinNotConnected}
                </span>
              </div>
              {status.linkedin && (
                <button
                  onClick={handleDisconnect}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  {t.settings.disconnect}
                </button>
              )}
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">{t.settings.preferences}</h2>
            {loading ? (
              <p>{t.common.loading}</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-semibold">{t.settings.defaultLanguage}</label>
                  <select
                    value={settings.defaultLanguage}
                    onChange={(e) => setSettings(prev => ({ ...prev, defaultLanguage: e.target.value }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold">{t.settings.defaultTone}</label>
                  <select
                    value={settings.defaultTone}
                    onChange={(e) => setSettings(prev => ({ ...prev, defaultTone: e.target.value }))}
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
                  <label className="block mb-2 font-semibold">{t.settings.postingFrequency}</label>
                  <input
                    type="number"
                    value={settings.postingFrequency}
                    onChange={(e) => setSettings(prev => ({ ...prev, postingFrequency: parseInt(e.target.value) || 3 }))}
                    className="w-full p-2 border rounded"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">{t.settings.preferredIndustries}</label>
                  <input
                    type="text"
                    value={settings.preferredIndustries}
                    onChange={(e) => setSettings(prev => ({ ...prev, preferredIndustries: e.target.value }))}
                    placeholder="e.g., Engineering, IT, Marketing"
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">{t.settings.preferredRoles}</label>
                  <input
                    type="text"
                    value={settings.preferredRoles}
                    onChange={(e) => setSettings(prev => ({ ...prev, preferredRoles: e.target.value }))}
                    placeholder="e.g., Software Engineer, HR Manager"
                    className="w-full p-2 border rounded"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? t.common.loading : t.settings.save}
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

