import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { SkeletonGrid } from '@/components/UI/LoadingSpinner';

export default function BlogLoading() {
  return (
    <>
      <Header />
      
      <main className="pt-16">
        {/* Hero Section Skeleton */}
        <section className="bg-gray-50 py-16">
          <div className="container-custom">
            <div className="text-center">
              <div className="skeleton h-12 w-48 mx-auto mb-4"></div>
              <div className="skeleton h-6 w-96 mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Blog Content Skeleton */}
        <section className="py-16">
          <div className="container-custom">
            {/* Filters Skeleton */}
            <div className="mb-8 space-y-4">
              <div>
                <div className="skeleton h-5 w-20 mb-3"></div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton h-8 w-20 rounded-full"></div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="skeleton h-5 w-16 mb-3"></div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="skeleton h-8 w-24 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Posts Grid Skeleton */}
            <SkeletonGrid count={9} />
            
            {/* Pagination Skeleton */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                <div className="skeleton h-10 w-20"></div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skeleton h-10 w-10"></div>
                ))}
                <div className="skeleton h-10 w-16"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

