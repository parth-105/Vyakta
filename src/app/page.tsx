import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Users, BookOpen } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import Category from '@/models/Category';
import User from '@/models/User';
import BlogGrid from '@/components/Blog/BlogGrid';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Site Claude';
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A production-ready, A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge. built with Next.js 14+ and MongoDB, designed to achieve maximum organic search traffic.';

export const metadata: Metadata = {
  title: `${SITE_NAME} - A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge.`,
  description: SITE_DESCRIPTION,
  keywords: 'blog, articles, content, writing, news, insights, tutorials, tips, guides, trending, featured, ' + SITE_NAME,
  openGraph: {
    title: `${SITE_NAME} - A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge.`,
    description: SITE_DESCRIPTION,
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge.`,
    description: SITE_DESCRIPTION,
  },
};

async function getHomePageData() {
  await connectDB();
  
  // Ensure all models are registered
  User; // This ensures the User model is loaded
  
  const [featuredPosts, categories, stats] = await Promise.all([
    BlogPost.find({ status: 'published' })
      .populate('author', 'name avatar')
      .populate('categories', 'name slug')
      .sort({ views: -1, publishedAt: -1 })
      .limit(6)
      .lean(),
    Category.find({ postCount: { $gt: 0 } })
      .sort({ postCount: -1 })
      .limit(6)
      .lean(),
    BlogPost.aggregate([
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalViews: { $sum: '$views' },
          publishedPosts: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
          }
        }
      }
    ])
  ]);

  return {
    featuredPosts: JSON.parse(JSON.stringify(featuredPosts)),
    categories: JSON.parse(JSON.stringify(categories)),
    stats: stats[0] || { totalPosts: 0, totalViews: 0, publishedPosts: 0 }
  };
}

async function getTrendingBlogs() {
  // Query DB directly to avoid production base URL/env issues
  await connectDB();
  const now = new Date();
  const since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const posts = await BlogPost.find({
    status: 'published',
    'trending.isTrending': true,
    'trending.trendingAt': { $gte: since },
  })
    .populate('author', 'name avatar bio')
    .populate('categories', 'name slug')
    .sort({ 'trending.trendingAt': -1 })
    .lean();
  return JSON.parse(JSON.stringify(posts));
}

export default async function HomePage() {
  const { featuredPosts, categories, stats } = await getHomePageData();
  const trendingBlogs = await getTrendingBlogs();

  const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Site Claude';
  const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A production-ready, A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge. built with Next.js 14+ and MongoDB, designed to achieve maximum organic search traffic.';

  return (
    <>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-primary text-white py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in">
                Welcome to {SITE_NAME}
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-white/90 animate-slide-up text-balance">
                {SITE_DESCRIPTION}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                <Link
                  href="/blog"
                  className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Explore Blog
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative accents */}
          <div className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-accent-500/20 blur-2xl animate-float" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-primary-500/20 blur-2xl animate-float" />
        </section>

        {/* Trending Section */}
        <section className="py-16 bg-yellow-50">
          <div className="container-custom text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trending Blogs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Check out the hottest blogs trending right now!
            </p>
            {trendingBlogs.length > 0 ? (
              <BlogGrid posts={trendingBlogs} />
            ) : (
              <div className="col-span-full text-gray-500">No trending blogs right now.</div>
            )}
          </div>
        </section>

        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <section className="py-16">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Featured Articles
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Discover our most popular and trending articles covering the latest 
                  insights and best practices.
                </p>
        </div>
              
              <BlogGrid posts={featuredPosts} featured={true} />
              
              <div className="text-center mt-12">
                <Link
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  View All Posts
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Explore Categories
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Browse articles by category to find exactly what you're looking for.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category: any) => (
                  <Link
                    key={category._id.toString()}
                    href={`/blog/category/${category.slug}`}
                    className="card card-hover p-6 text-center group"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {category.description || `Explore ${category.name.toLowerCase()} articles`}
                    </p>
                    <div className="text-sm text-primary-600 font-medium">
                      {category.postCount} {category.postCount === 1 ? 'article' : 'articles'}
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link
                  href="/categories"
                  className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-600 hover:text-white transition-colors"
                >
                  View All Categories
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest articles delivered 
              straight to your inbox.
            </p>
            
            <div className="max-w-md mx-auto">
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  required
                />
                <button 
                  type="submit"
                  className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-r-lg hover:bg-gray-100 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-sm text-primary-200 mt-2">
                No spam, unsubscribe at any time.
              </p>
            </div>
    </div>
        </section>
      </main>

      <Footer />
    </>
  );
}