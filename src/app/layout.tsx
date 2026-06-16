import type { Metadata } from 'next';
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/server';
import { getSettings } from '@/lib/data';

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-display',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'XYZ Marketplace — Electronics & Audio Equipment',
  description:
    'Browse amplifiers, speakers and audio equipment from local vendors. Enquire on WhatsApp for pricing and availability.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const settings = await getSettings(supabase);

  return (
    <html lang="en">
      <body
        className={`${display.variable} ${sans.variable} ${mono.variable} font-sans flex flex-col min-h-screen`}
      >
        <Header settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
