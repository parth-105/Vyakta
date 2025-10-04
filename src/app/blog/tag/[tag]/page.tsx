import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import User from '@/models/User';
import BlogGrid from '@/components/Blog/BlogGrid';
import Pagination from '@/components/UI/Pagination';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { BreadcrumbStructuredData } from '@/components/SEO/StructuredData';
import { SearchParams } from '@/types';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Site Claude';
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A production-ready, A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge. built with Next.js 14+ and MongoDB, designed to achieve maximum organic search traffic.';

interface TagPageProps {
  params: { tag: string };
  searchParams: SearchParams;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tagName = decodeURIComponent(params.tag);
  
  // Generate comprehensive keywords for tag
  const tagKeywords = [
    tagName,
    `${tagName} articles`,
    `${tagName} blog posts`,
    `${tagName} content`,
    `${tagName} tutorials`,
    `${tagName} guides`,
    'tagged articles',
    'blog tags',
    'content by tag',
    'tag browsing',
    SITE_NAME
  ].join(', ');

  return {
    title: `#${tagName} Articles & Blog Posts | ${SITE_NAME}`,
    description: `Discover all articles and blog posts tagged with ${tagName}. Find comprehensive content, tutorials, and insights about ${tagName.toLowerCase()}. ` + SITE_DESCRIPTION,
    keywords: tagKeywords,
    openGraph: {
      title: `#${tagName} Articles & Blog Posts | ${SITE_NAME}`,
      description: `Discover all articles and blog posts tagged with ${tagName}. Find comprehensive content, tutorials, and insights about ${tagName.toLowerCase()}.`,
      type: 'website',
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title: `#${tagName} Articles & Blog Posts | ${SITE_NAME}`,
      description: `Discover all articles and blog posts tagged with ${tagName}. Find comprehensive content, tutorials, and insights about ${tagName.toLowerCase()}.`,
    },
  };
}

async function getTagData(tag: string, searchParams: SearchParams) {
  await connectDB();
  // Ensure User model is registered for any author population
  User;

  const tagName = decodeURIComponent(tag);
  
  // Check if any posts exist with this tag
  const postCount = await BlogPost.countDocuments({ 
    status: 'published',
    tags: { $in: [tagName] }
  });

  if (postCount === 0) {
    return null;
  }

  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '12');
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    BlogPost.find({ 
      status: 'published',
      tags: { $in: [tagName] }
    })
      .populate('author', 'name avatar bio')
      .populate('categories', 'name slug')
      .select('-content')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    BlogPost.countDocuments({ 
      status: 'published',
      tags: { $in: [tagName] }
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    tag: tagName,
    posts: JSON.parse(JSON.stringify(posts)),
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

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const data = await getTagData(params.tag, searchParams);

  if (!data) {
    notFound();
  }

  const { tag, posts, pagination } = data;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const breadcrumbItems = [
    { name: 'Home', url: siteUrl },
    { name: 'Blog', url: `${siteUrl}/blog` },
    { name: `#${tag}`, url: `${siteUrl}/blog/tag/${encodeURIComponent(tag)}` },
  ];

  return (
    <>
      <Header />
      
      <main className="pt-16">
        <BreadcrumbStructuredData items={breadcrumbItems} />
        {/* Hero Section */}
        <section className="bg-gray-50 py-16">
          <div className="container-custom">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                #{tag}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Browse all articles tagged with {tag}
              </p>
              <div className="mt-4 text-sm text-gray-500">
                {pagination.total} {pagination.total === 1 ? 'article' : 'articles'}
              </div>
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="py-16">
          <div className="container-custom">
            {posts.length > 0 ? (
              <>
                <BlogGrid posts={posts} variant="compact" />
                
                {pagination.totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      pagination={pagination}
                      basePath={`/blog/tag/${encodeURIComponent(tag)}`}
                      searchParams={new URLSearchParams(searchParams as any)}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-4">
                  There are no published articles with this tag yet.
                </p>
                <a
                  href="/blog"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  View All Posts
                </a>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
