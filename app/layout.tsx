import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Cairo } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/SessionProvider';
import { LanguageProvider } from '@/lib/language-context';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const cairo = Cairo({
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic'],
  display: 'swap',
});

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <LanguageProvider fonts={{ en: inter.className, ar: cairo.className }}>
            {children}
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}