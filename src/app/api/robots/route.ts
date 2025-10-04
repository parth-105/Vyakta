import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const robots = `User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /admin
Disallow: /api/

# Allow specific API routes for SEO
Allow: /api/sitemap
Allow: /api/robots
Allow: /api/rss

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

