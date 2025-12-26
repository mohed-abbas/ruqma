'use client';

import { Skeleton } from '../Skeleton';

/**
 * Skeleton for a single testimonial card
 */
function TestimonialCardSkeleton({ size = 'compact' }: { size?: 'compact' | 'tall' | 'wide' }) {
  const heights = {
    compact: 'h-[200px]',
    tall: 'h-[400px] sm:row-span-2',
    wide: 'h-[200px] sm:col-span-2',
  };

  return (
    <div className={`bg-white rounded-[16px] p-6 ${heights[size]} shadow-[0px_4px_20px_rgba(157,175,181,0.25)]`}>
      {/* Stars skeleton */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} width={16} height={16} variant="circle" />
        ))}
      </div>

      {/* Quote skeleton */}
      <div className="space-y-2 mb-4">
        <Skeleton height={16} width="100%" variant="text" />
        <Skeleton height={16} width="95%" variant="text" />
        <Skeleton height={16} width="80%" variant="text" />
        {size === 'tall' && (
          <>
            <Skeleton height={16} width="90%" variant="text" />
            <Skeleton height={16} width="70%" variant="text" />
          </>
        )}
      </div>

      {/* Author skeleton */}
      <div className="flex items-center gap-3 mt-auto">
        <Skeleton width={40} height={40} variant="circle" />
        <div className="space-y-1">
          <Skeleton height={14} width={80} variant="text" />
          <Skeleton height={12} width={60} variant="text" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for the Testimonials section
 * Matches the bento grid structure
 */
export function TestimonialsSkeleton() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#f9fafb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header skeleton */}
        <div className="text-center mb-12 lg:mb-16">
          <Skeleton
            width={300}
            height={48}
            variant="text"
            className="mx-auto mb-4"
          />
          <Skeleton
            width={400}
            height={24}
            variant="text"
            className="mx-auto"
          />
        </div>

        {/* Bento grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <TestimonialCardSkeleton size="tall" />
          <TestimonialCardSkeleton size="wide" />
          <TestimonialCardSkeleton size="compact" />
          <TestimonialCardSkeleton size="compact" />
          <TestimonialCardSkeleton size="compact" />
          <TestimonialCardSkeleton size="wide" />
        </div>
      </div>
    </section>
  );
}

export { TestimonialCardSkeleton };
export default TestimonialsSkeleton;
