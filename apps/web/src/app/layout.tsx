import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mobii - Personalized Chair Yoga & Calisthenics',
  description: 'AI-powered personalized workout plans for chair yoga and calisthenics. Get daily workouts tailored to your fitness level and goals.',
  keywords: 'chair yoga, calisthenics, workout, fitness, AI, personalized, exercise',
  authors: [{ name: 'Mobii Team' }],
  creator: 'Mobii',
  publisher: 'Mobii',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mobii.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mobii.app',
    title: 'Mobii - Personalized Chair Yoga & Calisthenics',
    description: 'AI-powered personalized workout plans for chair yoga and calisthenics.',
    siteName: 'Mobii',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mobii - Personalized Chair Yoga & Calisthenics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobii - Personalized Chair Yoga & Calisthenics',
    description: 'AI-powered personalized workout plans for chair yoga and calisthenics.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background-primary text-text-primary antialiased`}>
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
