'use client';

import { useSession } from 'next-auth/react';
import { useLanguageContext } from '@/lib/language-context';
import { getTranslations } from '@/lib/i18n';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';

interface Post {
  id: string;
  content: string;
  status: string;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
}

export default function CalendarPage() {
  const { data: session } = useSession();
  const { language } = useLanguageContext();
  const t = getTranslations(language);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningScheduler, setRunningScheduler] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts/list');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const response = await fetch(`/api/linkedin/publish-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id }),
      });

      if (response.ok) {
        alert(t.common.success);
        fetchPosts();
      } else {
        const error = await response.json();
        alert(error.message || t.common.error);
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      alert(t.common.error);
    }
  };

  const handleRunScheduler = async () => {
    setRunningScheduler(true);
    try {
      const response = await fetch('/api/scheduler/run', { method: 'POST' });
      const data = await response.json();
      alert(data.message || t.common.success);
      fetchPosts();
    } catch (error) {
      console.error('Error running scheduler:', error);
      alert(t.common.error);
    } finally {
      setRunningScheduler(false);
    }
  };

  if (!session) {
    return null;
  }

  const scheduled = posts.filter(p => p.status === 'scheduled');
  const drafts = posts.filter(p => p.status === 'draft');
  const published = posts.filter(p => p.status === 'published');

  return (
    <DashboardLayout>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">{t.calendar.title}</h1>
          <button
            onClick={handleRunScheduler}
            disabled={runningScheduler}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {runningScheduler ? t.common.loading : t.calendar.runScheduler}
          </button>
        </div>

        <p className="mb-6 text-gray-600 italic">{t.calendar.schedulerNote}</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t.calendar.upcoming}</h2>
            {scheduled.length === 0 ? (
              <p className="text-gray-500">{t.calendar.noScheduled}</p>
            ) : (
              <div className="space-y-4">
                {scheduled.map(post => (
                  <div key={post.id} className="bg-yellow-50 p-4 rounded border">
                    <p className="mb-2">{post.content.substring(0, 200)}...</p>
                    <p className="text-sm text-gray-600">
                      {t.composer.schedule}: {post.scheduledAt ? new Date(post.scheduledAt).toLocaleString() : ''}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handlePublish(post.id)}
                        className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700"
                      >
                        {t.calendar.publish}
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700"
                      >
                        {t.calendar.delete}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t.calendar.drafts}</h2>
            {drafts.length === 0 ? (
              <p className="text-gray-500">{t.calendar.noDrafts}</p>
            ) : (
              <div className="space-y-4">
                {drafts.map(post => (
                  <div key={post.id} className="bg-gray-50 p-4 rounded border">
                    <p className="mb-2">{post.content.substring(0, 200)}...</p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handlePublish(post.id)}
                        className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700"
                      >
                        {t.calendar.publish}
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700"
                      >
                        {t.calendar.delete}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t.calendar.published}</h2>
            {published.length === 0 ? (
              <p className="text-gray-500">{t.calendar.noPublished}</p>
            ) : (
              <div className="space-y-4">
                {published.map(post => (
                  <div key={post.id} className="bg-green-50 p-4 rounded border">
                    <p className="mb-2">{post.content.substring(0, 200)}...</p>
                    <p className="text-sm text-gray-600">
                      {t.dashboard.published}: {post.publishedAt ? new Date(post.publishedAt).toLocaleString() : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

