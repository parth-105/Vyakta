'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, Eye, Share2 } from 'lucide-react';
import { IBlogPost } from '@/types';
import { format } from 'date-fns';

interface BlogCardProps {
  post: IBlogPost;
  featured?: boolean;
  variant?: 'standard' | 'compact';
}

export default function BlogCard({ post, featured = false, variant = 'standard' }: BlogCardProps) {
  const cardClasses = featured
    ? 'card card-hover overflow-hidden lg:col-span-2 group'
    : 'card card-hover overflow-hidden group';

  const imageClasses = featured
    ? 'w-full h-64 lg:h-80 object-cover'
    : variant === 'compact' ? 'w-full h-40 object-cover' : 'w-full h-48 object-cover';

  return (
    <article className={cardClasses}>
      {/* Featured Image */}
      {post.featuredImage?.url && (
        <div className="relative overflow-hidden">
          <Link href={`/blog/${post.slug}`}>
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              width={post.featuredImage.width || 800}
              height={post.featuredImage.height || 600}
              className={`${imageClasses} transition-transform duration-500 group-hover:scale-105`}
              priority={featured}
            />
          </Link>
          {/* Overlay gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-900/40 via-neutral-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge */}
          {post.categories && post.categories.length > 0 && (
            <div className="absolute top-4 left-4">
              <Link
                href={`/blog/category/${(post.categories[0] as any).slug}`}
                className="inline-block px-3 py-1 text-xs font-medium text-white bg-primary-600/90 rounded-full hover:bg-primary-700 transition-colors shadow-soft"
              >
                {(post.categories[0] as any).name}
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Meta Information */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          {post.author && (
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{(post.author as any).name}</span>
            </div>
          )}
          
          {post.publishedAt && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.publishedAt.toString()}>
                {format(new Date(post.publishedAt), 'MMM dd, yyyy')}
              </time>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{post.readingTime} min read</span>
          </div>
          
          {post.views > 0 && (
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{post.views.toLocaleString()} views</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className={featured ? 'text-2xl font-bold mb-3' : 'text-xl font-bold mb-2'}>
          <Link
            href={`/blog/${post.slug}`}
            className="text-gray-900 hover:text-primary-600 transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        {variant !== 'compact' && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-accent-50 text-accent-700 hover:bg-accent-100 transition-colors"
              >
                #{tag}
              </Link>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
          >
            Read more
            <svg
              className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          {/* Share Button */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                const url = `${window.location.origin}/blog/${post.slug}`;
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: url,
                  });
                } else {
                  navigator.clipboard.writeText(url);
                  // You could add a toast notification here
                }
              }
            }}
            className="inline-flex items-center text-gray-500 hover:text-primary-600 transition-colors"
            title="Share this article"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

