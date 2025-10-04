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
        <p className="text-gray-500 text-lg">No blog posts found.</p>
      </div>
    );
  }

  if (featured) {
    // Featured layout: First post is large, others are smaller
    const [featuredPost, ...otherPosts] = posts;

    return (
      <div className="space-y-8">
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <BlogCard post={featuredPost} featured={true} />
          </div>
        )}

        {/* Other Posts Grid */}
        {otherPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((post) => (
              <BlogCard key={post._id.toString()} post={post} variant={variant} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Regular grid layout
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post._id.toString()} post={post} variant={variant} />
      ))}
    </div>
  );
}

