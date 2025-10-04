import { Metadata } from 'next';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Site Claude';
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A production-ready, A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge. built with Next.js 14+ and MongoDB, designed to achieve maximum organic search traffic.';

export const metadata: Metadata = {
  title: `Admin Dashboard | ${SITE_NAME}`,
  description: `Admin dashboard for ${SITE_NAME}. Manage your blog, posts, and categories. ` + SITE_DESCRIPTION,
  keywords: 'admin, dashboard, management, ' + SITE_NAME,
  openGraph: {
    title: `Admin Dashboard | ${SITE_NAME}`,
    description: `Admin dashboard for ${SITE_NAME}. Manage your blog, posts, and categories. ` + SITE_DESCRIPTION,
    type: 'website',
    siteName: SITE_NAME,
  },
  robots: { index: false, follow: false },
  twitter: {
    card: 'summary_large_image',
    title: `Admin Dashboard | ${SITE_NAME}`,
    description: `Admin dashboard for ${SITE_NAME}. Manage your blog, posts, and categories. ` + SITE_DESCRIPTION,
  },
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
