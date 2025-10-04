import { IBlogPost, ICategory, SEOData } from '@/types';

export function generateSEOData(
  title: string,
  description: string,
  options: {
    keywords?: string;
    ogImage?: string;
    canonicalUrl?: string;
    noindex?: boolean;
    type?: 'website' | 'article';
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  } = {}
): SEOData {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Site Claude';
  
  return {
    title: `${title} | ${siteName}`,
    description,
    keywords: options.keywords,
    ogImage: options.ogImage || `${siteUrl}/api/og?title=${encodeURIComponent(title)}`,
    canonicalUrl: options.canonicalUrl,
    noindex: options.noindex,
  };
}

export function generateBlogPostSEO(post: IBlogPost, author?: any): SEOData {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
  
  return generateSEOData(post.title, post.metaDescription, {
    keywords: post.tags.join(', '),
    ogImage: post.featuredImage?.url,
    canonicalUrl: post.canonicalUrl || canonicalUrl,
    type: 'article',
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    author: author?.name,
    tags: post.tags,
  });
}

export function generateCategorySEO(category: ICategory): SEOData {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonicalUrl = `${siteUrl}/blog/category/${category.slug}`;
  
  return generateSEOData(
    `${category.name} Articles`,
    category.metaDescription || `Read the latest articles about ${category.name}. ${category.description || ''}`,
    {
      canonicalUrl,
      keywords: category.name,
    }
  );
}

export function generateStructuredData(type: string, data: any) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  return {
    ...baseData,
    ...data,
  };
}

export function generateArticleStructuredData(post: IBlogPost, author?: any) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Site Claude';
  
  return generateStructuredData('Article', {
    headline: post.title,
    description: post.metaDescription,
    image: post.featuredImage?.url ? [post.featuredImage.url] : [],
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: new Date(post.updatedAt).toISOString(),
    author: author ? {
      '@type': 'Person',
      name: author.name,
      url: author.socialLinks?.website,
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
    keywords: post.tags.join(', '),
    wordCount: post.content.split(/\s+/).length,
    timeRequired: `PT${post.readingTime}M`,
  });
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return generateStructuredData('BreadcrumbList', {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

export function generateWebsiteStructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Site Claude';
  const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A production-ready, A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge.';
  
  return generateStructuredData('WebSite', {
    name: siteName,
    description: siteDescription,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  });
}

export function calculateSEOScore(post: Partial<IBlogPost>): number {
  let score = 0;
  const maxScore = 100;

  // Title optimization (20 points)
  if (post.title) {
    const titleLength = post.title.length;
    if (titleLength >= 30 && titleLength <= 60) {
      score += 20;
    } else if (titleLength >= 20 && titleLength <= 70) {
      score += 15;
    } else if (titleLength >= 10) {
      score += 10;
    }
  }

  // Meta description (20 points)
  if (post.metaDescription) {
    const metaLength = post.metaDescription.length;
    if (metaLength >= 120 && metaLength <= 160) {
      score += 20;
    } else if (metaLength >= 100 && metaLength <= 180) {
      score += 15;
    } else if (metaLength >= 50) {
      score += 10;
    }
  }

  // Content length (15 points)
  if (post.content) {
    const wordCount = post.content.split(/\s+/).length;
    if (wordCount >= 1500) {
      score += 15;
    } else if (wordCount >= 1000) {
      score += 12;
    } else if (wordCount >= 500) {
      score += 8;
    } else if (wordCount >= 300) {
      score += 5;
    }
  }

  // Featured image (10 points)
  if (post.featuredImage?.url && post.featuredImage?.alt) {
    score += 10;
  } else if (post.featuredImage?.url) {
    score += 5;
  }

  // Tags (10 points)
  if (post.tags && post.tags.length > 0) {
    if (post.tags.length >= 3 && post.tags.length <= 8) {
      score += 10;
    } else if (post.tags.length >= 1 && post.tags.length <= 10) {
      score += 7;
    }
  }

  // Categories (10 points)
  if (post.categories && post.categories.length > 0) {
    if (post.categories.length >= 1 && post.categories.length <= 3) {
      score += 10;
    } else if (post.categories.length <= 5) {
      score += 7;
    }
  }

  // Focus keyphrase (10 points)
  if (post.focusKeyphrase) {
    score += 5;
    // Check if keyphrase appears in title
    if (post.title && post.title.toLowerCase().includes(post.focusKeyphrase.toLowerCase())) {
      score += 3;
    }
    // Check if keyphrase appears in meta description
    if (post.metaDescription && post.metaDescription.toLowerCase().includes(post.focusKeyphrase.toLowerCase())) {
      score += 2;
    }
  }

  // Slug optimization (5 points)
  if (post.slug) {
    const slugWords = post.slug.split('-');
    if (slugWords.length >= 2 && slugWords.length <= 6) {
      score += 5;
    } else if (slugWords.length >= 1 && slugWords.length <= 8) {
      score += 3;
    }
  }

  return Math.min(score, maxScore);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

export function extractKeywords(content: string, limit: number = 10): string[] {
  // Simple keyword extraction - remove common words and get most frequent
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
  ]);

  const words = content
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word));

  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([word]) => word);
}

