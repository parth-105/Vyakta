import { Metadata } from 'next';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Site Claude';
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A production-ready, A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge. built with Next.js 14+ and MongoDB, designed to achieve maximum organic search traffic.';

export const metadata: Metadata = {
  title: `Contact | ${SITE_NAME}`,
  description: `Contact ${SITE_NAME}. Ask questions, suggest topics, or partner with us. We respond quickly and love hearing from our readers.`,
  keywords: 'contact us, get in touch, support, help, blog contact, ' + SITE_NAME,
  openGraph: {
    title: `Contact | ${SITE_NAME}`,
    description: `Reach out to ${SITE_NAME} with questions, feedback, or partnership ideas.`,
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Contact | ${SITE_NAME}`,
    description: `Contact ${SITE_NAME} with inquiries or feedback.`,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
