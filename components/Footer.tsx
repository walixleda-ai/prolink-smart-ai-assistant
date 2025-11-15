'use client';

import { useLanguageContext } from '@/lib/language-context';
import { getTranslations } from '@/lib/i18n';

export function Footer() {
  const { language } = useLanguageContext();
  const t = getTranslations(language);

  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 text-center">
        <p className="mb-2">{t.footer.rights}</p>
        <a
          href="https://www.linkedin.com/in/walidreyad"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          {t.footer.linkedin}
        </a>
      </div>
    </footer>
  );
}

