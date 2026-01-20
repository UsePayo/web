import type { Metadata } from 'next';
import { Kalam, Patrick_Hand } from 'next/font/google';
import './globals.css';
import { Web3Provider } from '@/components/providers/Web3Provider';
import { Header } from '@/components/layout/Header';

const kalam = Kalam({
  weight: ['700'],
  subsets: ['latin'],
  variable: '--font-kalam',
  display: 'swap',
});

const patrickHand = Patrick_Hand({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-patrick',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Payo - Send USDC to Anyone on Telegram',
  description:
    'Send USDC to anyone on Telegram. No wallet needed for recipients. Instant, low-fee payments powered by Arbitrum.',
  keywords: ['USDC', 'Telegram', 'crypto', 'payments', 'Arbitrum', 'stablecoin', 'send money'],
  authors: [{ name: 'Payo Team' }],
  icons: {
    icon: [
      { url: '/icons/favicon.ico', sizes: 'any' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/icons/site.webmanifest',
  openGraph: {
    title: 'Payo - Send USDC to Anyone on Telegram',
    description: 'Send USDC to anyone on Telegram. No wallet needed for recipients.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Payo - Send USDC to Anyone on Telegram',
    description: 'Send USDC to anyone on Telegram. No wallet needed for recipients.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${kalam.variable} ${patrickHand.variable}`}>
      <body className="font-body antialiased">
        <Web3Provider>
          <Header />
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
