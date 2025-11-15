'use client';

import { signIn } from 'next-auth/react';
import { useLanguageContext } from '@/lib/language-context';
import { getTranslations } from '@/lib/i18n';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useState } from 'react';

export default function SignInPage() {
  const { language } = useLanguageContext();
  const t = getTranslations(language);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn('linkedin', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
            {t.auth.signIn}
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            {language === 'ar' 
              ? 'سجل الدخول باستخدام حساب LinkedIn الخاص بك للبدء'
              : 'Sign in with your LinkedIn account to get started'}
          </p>
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? t.auth.signingIn : t.auth.signIn}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

