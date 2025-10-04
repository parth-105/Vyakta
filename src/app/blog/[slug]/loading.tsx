import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

export default function BlogPostLoading() {
  return (
    <>
      <Header />
      
      <main className="pt-16">
        {/* Breadcrumb Skeleton */}
        <nav className="bg-gray-50 py-4">
          <div className="container-custom">
            <div className="flex items-center space-x-2 text-sm">
              <div className="skeleton h-4 w-12"></div>
              <div className="text-gray-400">/</div>
              <div className="skeleton h-4 w-8"></div>
              <div className="text-gray-400">/</div>
              <div className="skeleton h-4 w-32"></div>
            </div>
          </div>
        </nav>

        {/* Article Skeleton */}
        <article className="py-12">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              {/* Back Button Skeleton */}
              <div className="skeleton h-6 w-24 mb-8"></div>

              {/* Header Skeleton */}
              <header className="mb-8">
                {/* Categories */}
                <div className="flex gap-2 mb-4">
                  <div className="skeleton h-6 w-20 rounded-full"></div>
                  <div className="skeleton h-6 w-16 rounded-full"></div>
                </div>

                {/* Title */}
                <div className="skeleton h-12 w-full mb-6"></div>
                <div className="skeleton h-12 w-3/4 mb-6"></div>

                {/* Meta Information */}
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="skeleton h-8 w-32"></div>
                  <div className="skeleton h-8 w-24"></div>
                  <div className="skeleton h-8 w-20"></div>
                </div>

                {/* Share Button */}
                <div className="skeleton h-10 w-20"></div>
              </header>

              {/* Featured Image Skeleton */}
              <div className="skeleton h-64 lg:h-96 w-full rounded-lg mb-8"></div>

              {/* Content Skeleton */}
              <div className="space-y-4 mb-12">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="skeleton h-4 w-full"></div>
                ))}
                <div className="skeleton h-4 w-3/4"></div>
              </div>

              {/* Tags Skeleton */}
              <div className="mb-8">
                <div className="skeleton h-6 w-16 mb-3"></div>
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton h-6 w-16 rounded-full"></div>
                  ))}
                </div>
              </div>

              {/* Author Bio Skeleton */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="skeleton w-16 h-16 rounded-full"></div>
                  <div className="flex-1">
                    <div className="skeleton h-6 w-32 mb-2"></div>
                    <div className="skeleton h-4 w-full mb-2"></div>
                    <div className="skeleton h-4 w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}

