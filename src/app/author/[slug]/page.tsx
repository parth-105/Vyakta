import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import BlogPost from '@/models/BlogPost';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import BlogGrid from '@/components/Blog/BlogGrid';

interface AuthorPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Site Claude';
  const author = await getAuthor(params.slug);
  if (!author) {
    return { title: `Author Not Found | ${siteName}`, robots: { index: false, follow: false } };
  }
  const title = `${author.name} — Author at ${siteName}`;
  const description = author.bio || `Read articles written by ${author.name} at ${siteName}.`;
  return {
    title,
    description,
    openGraph: { title, description, type: 'profile' },
    twitter: { title, description, card: 'summary' },
  };
}

async function getAuthor(slug: string) {
  await connectDB();
  const name = decodeURIComponent(slug).replace(/-/g, ' ');
  const author = await User.findOne({ name: new RegExp(`^${name}$`, 'i') }).lean();
  return author ? JSON.parse(JSON.stringify(author)) : null;
}

async function getAuthorPosts(authorId: string) {
  await connectDB();
  const posts = await BlogPost.find({ author: authorId, status: 'published' })
    .populate('author', 'name avatar')
    .populate('categories', 'name slug')
    .select('-content')
    .sort({ publishedAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(posts));
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const author = await getAuthor(params.slug);
  if (!author) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Author not found</h1>
          <p className="text-gray-600 mt-2">The author you are looking for does not exist.</p>
          <Link href="/blog" className="text-primary-600 hover:underline mt-4 inline-block">Go to Blog</Link>
        </div>
      </main>
    );
  }

  const posts = await getAuthorPosts(author._id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const personStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: `${siteUrl}/author/${params.slug}`,
    image: author.avatar || undefined,
    sameAs: Object.values(author.socialLinks || {}).filter(Boolean),
  };

  return (
    <>
      <Header />
      <main className="pt-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }} />

        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="flex items-center space-x-4">
              {author.avatar && (
                <Image src={author.avatar} alt={author.name} width={72} height={72} className="rounded-full" />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{author.name}</h1>
                {author.bio && <p className="text-gray-600 mt-2">{author.bio}</p>}
              </div>
            </div>
          </div>
        </section>

        {posts.length > 0 && (
          <section className="py-12">
            <div className="container-custom">
              <h2 className="text-2xl font-semibold mb-6">Articles by {author.name}</h2>
              <BlogGrid posts={posts} />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}


