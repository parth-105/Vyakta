'use client';

import { IBlogPost } from '@/types';
import BlogCard from './BlogCard';

interface BlogGridProps {
  posts: IBlogPost[];
  featured?: boolean;
  variant?: 'standard' | 'compact';
}

export default function BlogGrid({ posts, featured = false, variant = 'standard' }: BlogGridProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No posts found.</p>
      </div>
    );
  }

  if (featured && posts.length > 0) {
    const featuredPost = posts[0];
    const otherPosts = posts.slice(1);

    return (
      <div className="space-y-8">
        {/* Featured Post */}
        <div className="lg:col-span-2">
          <BlogCard post={featuredPost} featured={true} />
        </div>

        {/* Other Posts Grid */}
        {otherPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((post) => (
              <BlogCard key={(post._id as any).toString()} post={post} variant={variant} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={(post._id as any).toString()} post={post} variant={variant} />
      ))}
    </div>
  );
}