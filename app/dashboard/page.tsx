'use client';

import { useSession } from 'next-auth/react';
import { useLanguageContext } from '@/lib/language-context';
import { getTranslations } from '@/lib/i18n';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  drafts: number;
  scheduled: number;
  published: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { language } = useLanguageContext();
  const t = getTranslations(language);
  const [stats, setStats] = useState<DashboardStats>({ drafts: 0, scheduled: 0, published: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/dashboard/stats')
        .then(res => res.json())
        .then(data => {
          setStats(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching stats:', err);
          setLoading(false);
        });
    }
  }, [session]);

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <h1 className="text-4xl font-bold mb-6">{t.dashboard.title}</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t.dashboard.welcome}, {session.user?.name || 'User'}
          </h2>
          {session.user?.headline && (
            <p className="text-gray-600">{session.user.headline}</p>
          )}
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{t.dashboard.overview}</h3>
          {loading ? (
            <p>{t.common.loading}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">{t.dashboard.drafts}</h4>
                <p className="text-3xl font-bold text-blue-600">{stats.drafts}</p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">{t.dashboard.scheduled}</h4>
                <p className="text-3xl font-bold text-yellow-600">{stats.scheduled}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">{t.dashboard.published}</h4>
                <p className="text-3xl font-bold text-green-600">{stats.published}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href="/composer"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-block"
          >
            {t.composer.title}
          </Link>
          <Link
            href="/calendar"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition inline-block"
          >
            {t.calendar.title}
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

