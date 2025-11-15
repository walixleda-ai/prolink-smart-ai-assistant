'use client';

import Link from 'next/link';
import { useLanguageContext } from '@/lib/language-context';
import { getTranslations } from '@/lib/i18n';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const { language } = useLanguageContext();
  const t = getTranslations(language);

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 text-blue-600">
              {t.landing.title}
            </h1>
            <h2 className="text-2xl mb-8 text-gray-700">
              {t.landing.subtitle}
            </h2>
            <p className="text-lg mb-12 text-gray-600 leading-relaxed">
              {t.landing.description}
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/auth/signin"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
              >
                {t.landing.signIn}
              </Link>
              <Link
                href="/auth/signin"
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition"
              >
                {t.landing.getStarted}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

