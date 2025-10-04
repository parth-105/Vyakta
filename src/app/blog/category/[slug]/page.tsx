import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import Category from '@/models/Category';
import User from '@/models/User';
import BlogGrid from '@/components/Blog/BlogGrid';
import Pagination from '@/components/UI/Pagination';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { BreadcrumbStructuredData } from '@/components/SEO/StructuredData';
import { SearchParams } from '@/types';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Site Claude';
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A production-ready, A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge. built with Next.js 14+ and MongoDB, designed to achieve maximum organic search traffic.';

interface CategoryPageProps {
  params: { slug: string };
  searchParams: SearchParams;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  await connectDB();
  const category = await Category.findOne({ slug: params.slug }).lean() as any;
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: SITE_DESCRIPTION,
      robots: { index: false, follow: false },
    };
  }

  // Generate comprehensive keywords for category
  const categoryKeywords = [
    category.name,
    `${category.name} articles`,
    `${category.name} blog posts`,
    `${category.name} content`,
    `${category.name} tutorials`,
    `${category.name} guides`,
    'blog category',
    'articles by topic',
    'content browsing',
    SITE_NAME
  ].join(', ');

  return {
    title: `${category.name} Articles & Blog Posts | ${SITE_NAME}`,
    description: category.metaDescription || `Explore all ${category.name} articles and blog posts. Discover comprehensive content, tutorials, and insights about ${category.name.toLowerCase()}. ` + SITE_DESCRIPTION,
    keywords: categoryKeywords,
    openGraph: {
      title: `${category.name} Articles & Blog Posts | ${SITE_NAME}`,
      description: category.metaDescription || `Explore all ${category.name} articles and blog posts. Discover comprehensive content, tutorials, and insights about ${category.name.toLowerCase()}.`,
      type: 'website',
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} Articles & Blog Posts | ${SITE_NAME}`,
      description: category.metaDescription || `Explore all ${category.name} articles and blog posts. Discover comprehensive content, tutorials, and insights about ${category.name.toLowerCase()}.`,
    },
  };
}

async function getCategoryData(slug: string, searchParams: SearchParams) {
  await connectDB();
  // Ensure User model is registered for any populate that references author
  User;

  const category = await Category.findOne({ slug }).lean() as any;
  if (!category) {
    return null;
  }

  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '12');
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    BlogPost.find({ 
      status: 'published',
      categories: category._id 
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
      categories: category._id 
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    category: JSON.parse(JSON.stringify(category)),
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

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const data = await getCategoryData(params.slug, searchParams);

  if (!data) {
    notFound();
  }

  const { category, posts, pagination } = data;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const breadcrumbItems = [
    { name: 'Home', url: siteUrl },
    { name: 'Blog', url: `${siteUrl}/blog` },
    { name: category.name, url: `${siteUrl}/blog/category/${category.slug}` },
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
                {category.name}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {category.description || `Explore all articles in the ${category.name} category.`}
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
                      basePath={`/blog/category/${category.slug}`}
                      searchParams={new URLSearchParams(searchParams as any)}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-4">
                  There are no published articles in this category yet.
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
