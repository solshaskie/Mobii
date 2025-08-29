import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '../components/ui/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mobii - Personalized Chair Yoga & Calisthenics',
  description: 'AI-powered personalized workout plans for chair yoga and calisthenics. Get daily workouts tailored to your fitness level and goals.',
  keywords: 'chair yoga, calisthenics, fitness, AI workouts, personalized training, mobility, strength',
  authors: [{ name: 'Mobii Team' }],
  creator: 'Mobii',
  publisher: 'Mobii',
  metadataBase: new URL('https://mobii.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Mobii - Personalized Chair Yoga & Calisthenics',
    description: 'AI-powered personalized workout plans for chair yoga and calisthenics.',
    url: 'https://mobii.app',
    siteName: 'Mobii',
    images: [
      {
        url: '/images/mobii_app_icon.svg',
        width: 1024,
        height: 1024,
        alt: 'Mobii App Icon',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobii - Personalized Chair Yoga & Calisthenics',
    description: 'AI-powered personalized workout plans for chair yoga and calisthenics.',
    images: ['/images/mobii_app_icon.svg'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/images/mobii_app_icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/images/mobii_app_icon.svg',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-background-primary text-text-primary antialiased`}>
        <Navigation />
        <div className="lg:ml-64">
          {children}
        </div>
      </body>
    </html>
  );
}
