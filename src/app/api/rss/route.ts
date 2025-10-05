import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Normalize base URL to avoid double slashes
    const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const siteUrl = rawSiteUrl.replace(/\/$/, '');
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Site Claude';
    const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A production-ready, A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge.';

    // Get latest 20 published posts
    const posts = await BlogPost.find({ status: 'published' })
      .populate('author', 'name')
      .select('title slug metaDescription publishedAt updatedAt author')
      .sort({ publishedAt: -1 })
      .limit(20)
      .lean();

    // Generate RSS feed
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName}</title>
    <description><![CDATA[${siteDescription}]]></description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator><![CDATA[Next.js ${siteDescription}]]></generator>
    
    ${posts.map(post => {
      const published = post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date(post.updatedAt || Date.now()).toUTCString();
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.metaDescription}]]></description>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${published}</pubDate>
      <author>${post.author?.name || 'Anonymous'}</author>
    </item>`;
    }).join('')}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('RSS generation error:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}

