import type { Metadata } from 'next';
import { Kalam, Patrick_Hand } from 'next/font/google';
import './globals.css';

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
  title: 'Payo - Send USDC to Anyone',
  description:
    'Send USDC to anyone on Telegram. No wallet needed for recipients.',
  keywords: ['USDC', 'Telegram', 'crypto', 'payments', 'Arbitrum'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${kalam.variable} ${patrickHand.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
