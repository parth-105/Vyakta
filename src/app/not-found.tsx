'use client';

import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Site Claude';
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A production-ready, A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge. built with Next.js 14+ and MongoDB, designed to achieve maximum organic search traffic.';

export const metadata: Metadata = {
  title: `404 - Page Not Found | ${SITE_NAME}`,
  description: `The page you're looking for doesn't exist on ${SITE_NAME}. Explore our blog articles, categories, and trending content instead. ` + SITE_DESCRIPTION,
  keywords: '404, page not found, missing page, blog navigation, explore content, ' + SITE_NAME,
  robots: { index: false, follow: false },
  openGraph: {
    title: `404 - Page Not Found | ${SITE_NAME}`,
    description: `The page you're looking for doesn't exist on ${SITE_NAME}. Explore our blog articles, categories, and trending content instead.`,
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: `404 - Page Not Found | ${SITE_NAME}`,
    description: `The page you're looking for doesn't exist on ${SITE_NAME}. Explore our blog articles, categories, and trending content instead.`,
  },
};

export default function NotFound() {
  return (
    <>
      <Header />
      
      <main className="pt-16 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="mb-8">
            <FileQuestion className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
              Sorry, we couldn't find the page you're looking for. It might have been moved, 
              deleted, or you entered the wrong URL.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
            
            <div className="text-center">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Go Back
              </button>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages</h3>
            <div className="space-y-2">
              <Link
                href="/blog"
                className="block text-primary-600 hover:text-primary-700 transition-colors"
              >
                Browse All Posts
              </Link>
              <Link
                href="/categories"
                className="block text-primary-600 hover:text-primary-700 transition-colors"
              >
                Explore Categories
              </Link>
              <Link
                href="/about"
                className="block text-primary-600 hover:text-primary-700 transition-colors"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

