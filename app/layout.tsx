import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/language-context';
import { SessionProvider } from '@/components/SessionProvider';

const inter = Inter({ subsets: ['latin', 'arabic'] });

export const metadata: Metadata = {
  title: 'LinkedIn Smart Assistant – Developed by Walid Reyad',
  description: 'Your personal assistant to manage your LinkedIn account with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

