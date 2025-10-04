import Link from 'next/link';
import Image from 'next/image';

interface TrendingPost {
  _id: string;
  title: string;
  slug: string;
  featuredImage?: { url?: string; width?: number; height?: number; alt?: string };
  publishedAt?: string;
}

export default function TrendingSidebar({ posts }: { posts: TrendingPost[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <aside className="mt-8 xl:mt-0">
      <div className="p-4 border border-gray-100 rounded-2xl shadow-soft bg-white">
        <h3 className="text-sm font-semibold text-neutral-700 mb-3">Trending</h3>
        <ul className="space-y-3">
          {posts.slice(0, 6).map((post) => (
            <li key={post._id} className="group flex items-center gap-3">
              {post.featuredImage?.url && (
                <div className="relative w-14 h-14 overflow-hidden rounded-lg flex-shrink-0">
                  <Image
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt || post.title}
                    fill
                    sizes="56px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="min-w-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="block text-sm text-gray-800 hover:text-primary-600 transition-colors line-clamp-2"
                >
                  {post.title}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}


