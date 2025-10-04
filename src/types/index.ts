import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor';
  bio?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  metaDescription?: string;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  metaDescription: string;
  content: string;
  excerpt?: string;
  featuredImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  author: IUser['_id'];
  categories: ICategory['_id'][];
  tags: string[];
  status: 'draft' | 'published' | 'trash';
  publishedAt?: Date;
  readingTime: number;
  views: number;
  seoScore?: number;
  canonicalUrl?: string;
  focusKeyphrase?: string;
  trending?: {
    isTrending: boolean;
    trendingAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noindex?: boolean;
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  metaDescription: string;
  content: string;
  excerpt?: string;
  featuredImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  categories: string[];
  tags: string[];
  status: 'draft' | 'published';
  publishedAt?: Date;
  canonicalUrl?: string;
  focusKeyphrase?: string;
  trending?: {
    isTrending: boolean;
    trendingAt?: Date;
  };
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BlogListResponse {
  posts: IBlogPost[];
  pagination: PaginationData;
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalCategories: number;
  recentPosts: IBlogPost[];
}

export interface SearchParams {
  q?: string;
  category?: string;
  tag?: string;
  page?: string;
  limit?: string;
  sort?: 'newest' | 'oldest' | 'popular';
}

