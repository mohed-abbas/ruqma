'use client';

import { Skeleton } from '../Skeleton';

/**
 * Skeleton for a single product card
 */
function ProductCardSkeleton() {
  return (
    <div
      className="bg-white overflow-hidden relative rounded-[10px] shadow-[0px_4px_7.2px_0px_rgba(0,0,0,0.25)]
                 w-full max-w-[542px] mx-auto lg:mx-0
                 h-auto min-h-[400px] sm:min-h-[480px] lg:min-h-[552px] lg:h-[552px]"
    >
      <div className="p-4 sm:p-5 lg:absolute lg:left-1/2 lg:top-[26px] lg:-translate-x-1/2 lg:p-0 w-full lg:w-[492px]">
        {/* Image placeholder */}
        <Skeleton
          className="aspect-[492/266] w-full rounded-[10px]"
        />

        {/* Title placeholder */}
        <div className="mt-4">
          <Skeleton height={40} width="75%" variant="text" />
        </div>

        {/* Description placeholder */}
        <div className="mt-4 space-y-2">
          <Skeleton height={20} width="100%" variant="text" />
          <Skeleton height={20} width="90%" variant="text" />
          <Skeleton height={20} width="60%" variant="text" />
        </div>
      </div>

      {/* Arrow button skeleton */}
      <div className="absolute bottom-0 right-0 w-[48px] h-[48px] sm:w-[54px] sm:h-[54px] lg:w-[58px] lg:h-[58px]">
        <Skeleton className="w-full h-full rounded-tl-[15px] rounded-tr-[4px] rounded-br-[4px] rounded-bl-[4px]" />
      </div>
    </div>
  );
}

/**
 * Skeleton for the Products section
 * Matches the structure of the actual Products component
 */
export function ProductsSkeleton() {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24 bg-black"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header skeleton */}
        <div className="mb-12 lg:mb-16">
          <Skeleton
            width="50%"
            height={48}
            variant="text"
            className="max-w-md"
          />
        </div>

        {/* Products grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      </div>
    </section>
  );
}

export { ProductCardSkeleton };
export default ProductsSkeleton;
