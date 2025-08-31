import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MobileNavigation } from '../components/mobile/mobile-navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mobii - AI-Powered Fitness Revolution',
  description: 'The future of fitness with AI-powered personal training, movement analysis, and YouTube video summarization.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MobileNavigation />
        <div className="lg:pt-0">
          {children}
        </div>
      </body>
    </html>
  );
}
