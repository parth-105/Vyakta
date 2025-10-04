import { Metadata } from 'next';
import { Suspense } from 'react';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import Category from '@/models/Category';
import BlogGrid from '@/components/Blog/BlogGrid';
import Pagination from '@/components/UI/Pagination';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { SearchParams } from '@/types';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Site Claude';
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A production-ready, A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge. built with Next.js 14+ and MongoDB, designed to achieve maximum organic search traffic.';

export const metadata: Metadata = {
  title: `Blog | ${SITE_NAME}`,
  description: `Read the latest articles, tutorials, and expert guides on ${SITE_NAME}. Explore trending topics, practical how‑tos, and in‑depth insights updated regularly.`,
  keywords: 'blog posts, articles, latest posts, trending articles, blog content, ' + SITE_NAME,
  openGraph: {
    title: `Blog - Latest Articles | ${SITE_NAME}`,
    description: `Explore new articles, tutorials, and guides from ${SITE_NAME}. Stay up to date with trends, best practices, and actionable insights.`,
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Blog | ${SITE_NAME}`,
    description: `Fresh articles, tutorials, and deep dives from ${SITE_NAME}. Discover trends and practical tips.`,
  },
};

interface BlogPageProps {
  searchParams: SearchParams;
}

async function getBlogData(searchParams: SearchParams) {
  await connectDB();

  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '12');
  const category = searchParams.category;
  const tag = searchParams.tag;
  const search = searchParams.q;
  const sort = searchParams.sort || 'newest';

  const skip = (page - 1) * limit;

  // Build query
  const query: any = { status: 'published' };

  if (category) {
    const categoryDoc = await Category.findOne({ slug: category });
    if (categoryDoc) {
      query.categories = categoryDoc._id;
    }
  }

  if (tag) {
    query.tags = { $in: [tag] };
  }

  if (search) {
    query.$text = { $search: search };
  }

  // Build sort
  let sortQuery: any = {};
  switch (sort) {
    case 'oldest':
      sortQuery = { publishedAt: 1 };
      break;
    case 'popular':
      sortQuery = { views: -1 };
      break;
    case 'newest':
    default:
      sortQuery = { publishedAt: -1 };
      break;
  }

  // Execute queries
  const [posts, total, categories] = await Promise.all([
    BlogPost.find(query)
      .populate('author', 'name avatar bio')
      .populate('categories', 'name slug')
      .select('-content') // Exclude full content for listing
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean(),
    BlogPost.countDocuments(query),
    Category.find({ postCount: { $gt: 0 } })
      .sort({ postCount: -1 })
      .lean(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    posts: JSON.parse(JSON.stringify(posts)),
    categories: JSON.parse(JSON.stringify(categories)),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

function BlogFilters({ categories, searchParams }: { categories: any[]; searchParams: SearchParams }) {
  const currentCategory = searchParams.category;
  const currentSort = searchParams.sort || 'newest';

  return (
    <div className="mb-8 space-y-4">
      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          <a
            href="/blog"
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              !currentCategory
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </a>
          {categories.map((category) => (
            <a
              key={category._id}
              href={`/blog?category=${category.slug}`}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                currentCategory === category.slug
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.postCount})
            </a>
          ))}
        </div>
      </div>

      {/* Sort Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Sort by</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'newest', label: 'Newest' },
            { value: 'oldest', label: 'Oldest' },
            { value: 'popular', label: 'Most Popular' },
          ].map((option) => (
            <a
              key={option.value}
              href={`/blog?${new URLSearchParams({ ...searchParams, sort: option.value }).toString()}`}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                currentSort === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function BlogContent({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogContentInner searchParams={searchParams} />
    </Suspense>
  );
}

async function BlogContentInner({ searchParams }: { searchParams: SearchParams }) {
  const { posts, categories, pagination } = await getBlogData(searchParams);

  return (
    <>
      <BlogFilters categories={categories} searchParams={searchParams} />
      
      {posts.length > 0 ? (
        <>
          <BlogGrid posts={posts} variant="compact" />
          
          {pagination.totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                pagination={pagination}
                basePath="/blog"
                searchParams={new URLSearchParams(searchParams as any)}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search terms.
          </p>
          <a
            href="/blog"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            View All Posts
          </a>
        </div>
      )}
    </>
  );
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <>
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gray-50 py-16">
          <div className="container-custom">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Our Blog
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover insights, tutorials, and industry trends. Stay updated with 
                the latest in technology and development.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="py-16">
          <div className="container-custom">
            <BlogContent searchParams={searchParams} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

