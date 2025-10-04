import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Folder, ArrowRight } from 'lucide-react';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Site Claude';
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A production-ready, A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge. built with Next.js 14+ and MongoDB, designed to achieve maximum organic search traffic.';

export const metadata: Metadata = {
  title: `Categories | ${SITE_NAME}`,
  description: `Browse all categories on ${SITE_NAME} to discover organized collections of articles, tutorials, and guides by topic. Find exactly what you need, faster.`,
  keywords: 'blog categories, topics, browse articles, content topics, ' + SITE_NAME,
  openGraph: {
    title: `Categories | ${SITE_NAME}`,
    description: `Explore categories at ${SITE_NAME} and jump into curated sets of articles and tutorials for every topic.`,
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Categories | ${SITE_NAME}`,
    description: `Discover categories on ${SITE_NAME} and find curated content by topic.`,
  },
};

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/categories`, {
    // SSR fetch: no-cache to always get fresh data
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.categories || [];
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-primary text-white py-20">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Browse Categories
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Explore our content organized by topics. Find exactly what you're looking for 
                by browsing through our carefully curated categories.
              </p>
            </div>
          </div>
        </section>
        {/* Categories Grid */}
        <section className="py-16">
          <div className="container-custom">
            {categories.length > 0 ? (
              <>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
                  </h2>
                  <p className="text-xl text-gray-600">
                    Discover articles across various topics and interests
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categories.map((category: any) => (
                    <Link
                      key={category._id}
                      href={`/blog/category/${category.slug}`}
                      className="group card card-hover p-6 block"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                            <Folder className="w-6 h-6 text-primary-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {category.description || `Explore articles about ${category.name.toLowerCase()}`}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-primary-600 font-medium">
                              {category.postCount} {category.postCount === 1 ? 'article' : 'articles'}
                            </span>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {/* Popular Categories */}
                {categories.length > 3 && (
                  <div className="mt-16">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                      Most Popular Categories
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {categories.slice(0, 3).map((category: any, index: number) => (
                        <Link
                          key={category._id}
                          href={`/blog/category/${category.slug}`}
                          className="group bg-gray-50 hover:bg-primary-50 p-6 rounded-lg transition-colors"
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="text-2xl font-bold text-primary-600">
                              #{index + 1}
                            </span>
                            <h4 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                              {category.name}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {category.postCount} articles
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {category.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Folder className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">No Categories Yet</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Categories will appear here once articles are published and organized by topic.
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Browse All Articles
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            )}
          </div>
        </section>
        {/* CTA Section */}
        {categories.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container-custom text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Can't find what you're looking for?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Browse all our articles or use the search functionality to find specific content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  View All Articles
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-600 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
