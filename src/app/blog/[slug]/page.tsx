import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User as UserIcon, Eye, ArrowLeft, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import User from '@/models/User';
import Category from '@/models/Category';
import { generateArticleStructuredData, generateBreadcrumbStructuredData } from '@/utils/seo';
import { BreadcrumbStructuredData } from '@/components/SEO/StructuredData';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import BlogGrid from '@/components/Blog/BlogGrid';
import ReadingProgress from '@/components/Blog/ReadingProgress';
import TableOfContents from '@/components/Blog/TableOfContents';
import TrendingSidebar from '@/components/Blog/TrendingSidebar';
import ImageLightbox from '@/components/Blog/ImageLightbox';
import ShareButtons from '@/components/Blog/ShareButtons';
import FloatingShare from '@/components/Blog/FloatingShare';

interface BlogPostPageProps {
  params: { slug: string };
}

async function getBlogPost(slug: string) {
  await connectDB();
  // Ensure the User model is registered before populate calls
  User;
  Category;

  const post = await BlogPost.findOne({ slug, status: 'published' })
    .populate('author', 'name avatar bio socialLinks')
    .populate('categories', 'name slug description')
    .lean();

  if (!post) {
    return null;
  }

  // Get related posts
  const relatedPosts = await BlogPost.find({
    _id: { $ne: (post as any)._id },
    status: 'published',
    $or: [
      { categories: { $in: ((post as any).categories as any[]).map((cat: any) => cat._id) } },
      { tags: { $in: (post as any).tags } },
    ],
  })
    .populate('author', 'name avatar')
    .populate('categories', 'name slug')
    .select('-content')
    .sort({ publishedAt: -1 })
    .limit(3)
    .lean();

  return {
    post: JSON.parse(JSON.stringify(post)),
    relatedPosts: JSON.parse(JSON.stringify(relatedPosts)),
  };
}

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Site Claude';
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A production-ready, A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge. built with Next.js 14+ and MongoDB, designed to achieve maximum organic search traffic.';

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const data = await getBlogPost(params.slug);
  if (!data) {
    return {
      title: 'Post Not Found',
      description: SITE_DESCRIPTION,
      robots: { index: false, follow: false },
    };
  }
  const { post } = data;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  // Generate comprehensive keywords
  const postKeywords = [
    ...(post.tags || []),
    ...(post.categories?.map((cat: any) => cat.name) || []),
    'blog post', 'article', 'content', 'reading', 'insights', 'tutorial', 'guide',
    post.author.name, SITE_NAME
  ].join(', ');

  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.metaDescription || post.excerpt || `Read ${post.title} — a practical, reader‑friendly guide covering ${post.tags?.join(', ') || 'key topics'} with actionable insights.`,
    keywords: postKeywords,
    authors: [{ name: post.author.name }],
    alternates: {
      canonical: post.canonicalUrl || `${siteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | ${SITE_NAME}`,
      description: post.metaDescription || post.excerpt || `Read ${post.title} — a practical guide covering ${post.tags?.join(', ') || 'key topics'} with actionable insights.`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: post.featuredImage?.url ? [
        {
          url: post.featuredImage.url,
          width: post.featuredImage.width,
          height: post.featuredImage.height,
          alt: post.featuredImage.alt || post.title,
        }
      ] : [],
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | ${SITE_NAME}`,
      description: post.metaDescription || post.excerpt || `Read ${post.title} — a practical guide covering ${post.tags?.join(', ') || 'key topics'} with actionable insights.`,
      images: post.featuredImage?.url ? [post.featuredImage.url] : [],
    },
  };
}

export async function generateStaticParams() {
  await connectDB();

  const posts = await BlogPost.find({ status: 'published' })
    .select('slug')
    .lean();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Enable ISR
export const revalidate = 3600; // Revalidate every hour

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const data = await getBlogPost(params.slug);

  if (!data) {
    notFound();
  }

  const { post, relatedPosts } = data;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const authorSlug = post.author?.name
    ? post.author.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    : 'author';

  // Generate structured data
  const articleStructuredData = generateArticleStructuredData(post, post.author);
  const breadcrumbItems = [
    { name: 'Home', url: siteUrl },
    { name: 'Blog', url: `${siteUrl}/blog` },
    { name: post.title, url: `${siteUrl}/blog/${post.slug}` },
  ];
  const breadcrumbStructuredData = generateBreadcrumbStructuredData(breadcrumbItems);
  const personStructuredData = post.author?.name
    ? {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: post.author.name,
      url: `${siteUrl}/author/${authorSlug}`,
      image: post.author.avatar || undefined,
      sameAs: Object.values(post.author.socialLinks || {}).filter(Boolean),
    }
    : undefined;

  // Fetch trending posts server-side for sidebar
  const trendingRes = await fetch(`${siteUrl}/api/posts/trending`, { cache: 'no-store' });
  const trendingData = trendingRes.ok ? await trendingRes.json() : { data: [] };
  const trendingPosts = trendingData.data || [];

  return (
    <>
      <Header />
      <ReadingProgress />
      <ImageLightbox />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      {personStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }}
        />
      )}
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <main className="pt-16">
        {/* Breadcrumb */}
        <nav className="bg-gray-50 py-4" aria-label="Breadcrumb">
          <div className="container-custom">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href="/blog" className="text-gray-500 hover:text-gray-700">
                  Blog
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium truncate">{post.title}</li>
            </ol>
          </div>
        </nav>

        {/* Article */}
        <article className="py-6">
          <div className="container-custom">

            {/* Back Button (above the grid) */}

            <Link
              href="/blog"
              className="mt-0 mb-3 inline-flex items-center text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8 max-w-6xl mx-auto">
              {/* Article Header */}
              <header className="mb-6">
                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.categories.map((category: any) => (
                      <Link
                        key={category._id}
                        href={`/blog/category/${category.slug}`}
                        className="inline-block px-3 py-1 text-sm font-medium text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {post.title}
                </h1>

                {/* Excerpt / Meta Description */}
                {(post.excerpt || post.metaDescription) && (
                  <p className="text-lg text-gray-600 mb-6">
                    {post.excerpt || post.metaDescription}
                  </p>
                )}

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                  <div className="flex items-center space-x-2">
                    {post.author.avatar && (
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <div className="flex items-center space-x-1">
                        <UserIcon className="w-4 h-4" />
                        <Link href={`/author/${authorSlug}`} className="font-medium hover:underline">
                          {post.author.name}
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.publishedAt}>
                      {format(new Date(post.publishedAt), 'MMMM dd, yyyy')}
                    </time>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readingTime} min read</span>
                  </div>

                  <div className="flex items-center space-x-1 text-gray-500">
                    <span>Last updated</span>
                    <time dateTime={post.updatedAt}>
                      {format(new Date(post.updatedAt), 'MMMM dd, yyyy')}
                    </time>
                  </div>

                  {post.views > 0 && (
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views.toLocaleString()} views</span>
                    </div>
                  )}
                </div>

                {/* Share Buttons */}
                <div className="flex items-center space-x-4 mb-8">
                  <ShareButtons 
                    url={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${post.slug}`}
                    title={post.title}
                    description={post.excerpt || post.metaDescription}
                  />
                </div>
              </header>

              {/* Featured Image */}
              {post.featuredImage?.url && (
                <div className="mb-8">
                  <Image
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt || post.title}
                    width={post.featuredImage.width || 1200}
                    height={post.featuredImage.height || 600}
                    className="w-full h-auto rounded-lg shadow-lg"
                    priority
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-lg prose-gray max-w-none mb-12">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <Link
                        key={tag}
                        href={`/blog/tag/${tag}`}
                        className="inline-block px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Bio */}
              {post.author.bio && (
                <div className="bg-gray-50 rounded-lg p-6 mb-12">
                  <div className="flex items-start space-x-4">
                    {post.author.avatar && (
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={64}
                        height={64}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        About {post.author.name}
                      </h3>
                      <p className="text-gray-600 mb-3">{post.author.bio}</p>
                      {/* {post.author.socialLinks && (
                        <div className="flex space-x-3">
                          {Object.entries(post.author.socialLinks).map(([platform, url]) =>
                            url ? (
                              <a
                                key={platform}
                                href={url as string}
                                className="text-primary-600 hover:text-primary-700 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {platform}
                              </a>
                            ) : null
                          )}
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              )}
              {/* Right Sidebar */}
              <div className="hidden xl:block space-y-6">
                <TableOfContents />
                <TrendingSidebar posts={trendingPosts} />
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container-custom">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Related Articles
              </h2>
              <BlogGrid posts={relatedPosts} />
            </div>
          </section>
        )}
      </main>

      {/* Floating Share Button */}
      <FloatingShare 
        url={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${post.slug}`}
        title={post.title}
        description={post.excerpt || post.metaDescription}
      />

      <Footer />
    </>
  );
}

