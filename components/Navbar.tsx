'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useLanguageContext } from '@/lib/language-context';
import { getTranslations } from '@/lib/i18n';

export function Navbar() {
  const { data: session } = useSession();
  const { language, toggleLanguage } = useLanguageContext();
  const t = getTranslations(language);

  return (
    <nav className="bg-blue-600 text-white shadow-lg" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            {t.appName}
          </Link>
          
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/dashboard" className="hover:underline">
                  {t.nav.dashboard}
                </Link>
                <Link href="/composer" className="hover:underline">
                  {t.nav.composer}
                </Link>
                <Link href="/cv-assistant" className="hover:underline">
                  {t.nav.cvAssistant}
                </Link>
                <Link href="/settings" className="hover:underline">
                  {t.nav.settings}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="hover:underline"
                >
                  {t.nav.signOut}
                </button>
              </>
            ) : (
              <Link href="/auth/signin" className="hover:underline">
                {t.auth.signIn}
              </Link>
            )}
            
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-800"
            >
              {language === 'en' ? 'AR' : 'EN'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

