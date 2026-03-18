import type { Metadata } from 'next';
import { Cairo, Amiri } from 'next/font/google';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
});

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
});

export const metadata: Metadata = {
  title: 'بطاعتي أسمو',
  description: 'تطبيق سحب رمضان - بطاعتي أسمو',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} ${amiri.variable} min-h-screen bg-emerald-950 text-emerald-50`}>
        {children}
      </body>
    </html>
  );
}
