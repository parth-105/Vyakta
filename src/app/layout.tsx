import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WebsiteStructuredData, OrganizationStructuredData } from '@/components/SEO/StructuredData';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Site Claude';
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A production-ready, A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge. built with Next.js 14+ and MongoDB, designed to achieve maximum organic search traffic.';

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge.`,
    template: `%s`,
  },
  description: SITE_DESCRIPTION,
  keywords: 'blog, articles, content, writing, news, insights, tutorials, tips, guides, ' + SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/rss.xml', title: 'RSS Feed' }],
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: `${SITE_NAME} - A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge.`,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge.`,
    description: SITE_DESCRIPTION,
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
    google: process.env.GOOGLE_SEARCH_CONSOLE_ID,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <WebsiteStructuredData />
        <OrganizationStructuredData />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-white">
          {children}
        </div>
        {/* Vercel Analytics */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}