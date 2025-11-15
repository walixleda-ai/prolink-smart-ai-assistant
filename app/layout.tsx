import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Noto_Kufi_Arabic } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/language-context';
import { SessionProvider } from '@/components/SessionProvider';

// English font
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

// Arabic font
const kufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700'],
});

// Helper function selects font based on language
export function getFontClass(lang: string) {
  return lang === 'ar' ? kufi.className : inter.className;
}

export const metadata: Metadata = {
  title: 'ProLink Smart AI Assistant – By Walid Reyad',
  description:
    'Automating LinkedIn content creation, scheduling, publishing, and CV analysis.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        <SessionProvider>
          <LanguageProvider fontSelector={getFontClass}>
            {children}
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
