'use client';

import { Skeleton } from '../Skeleton';

/**
 * Skeleton for the Product Hero section
 */
function ProductHeroSkeleton() {
  return (
    <section className="relative min-h-screen bg-[#151715] flex items-center">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[60px] xl:px-[100px] py-24 lg:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text content */}
          <div className="space-y-6">
            {/* Title */}
            <Skeleton
              height="clamp(60px, 10vw, 100px)"
              width="80%"
              variant="text"
            />

            {/* Description */}
            <div className="space-y-3">
              <Skeleton height={24} width="100%" variant="text" />
              <Skeleton height={24} width="95%" variant="text" />
              <Skeleton height={24} width="70%" variant="text" />
            </div>
          </div>

          {/* Product image */}
          <div className="relative aspect-square max-w-[500px] mx-auto lg:mx-0">
            <Skeleton className="w-full h-full rounded-[20px]" />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Skeleton for the Product Details section
 */
function ProductDetailsSkeleton() {
  return (
    <section className="bg-[#151715] py-20 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[60px] xl:px-[100px]">
        {/* Section title */}
        <Skeleton
          height={50}
          width={250}
          variant="text"
          className="mb-10 lg:mb-16"
        />

        {/* Details content */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Skeleton height={20} width="100%" variant="text" />
            <Skeleton height={20} width="95%" variant="text" />
            <Skeleton height={20} width="90%" variant="text" />
            <Skeleton height={20} width="85%" variant="text" />
          </div>
          <div className="space-y-4">
            <Skeleton height={20} width="100%" variant="text" />
            <Skeleton height={20} width="90%" variant="text" />
            <Skeleton height={20} width="95%" variant="text" />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Skeleton for the Product Gallery section
 */
function ProductGallerySkeleton() {
  return (
    <section className="bg-[#151715] py-20 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[60px] xl:px-[100px]">
        {/* Section title */}
        <Skeleton
          height={50}
          width={300}
          variant="text"
          className="mb-10 lg:mb-16"
        />

        {/* Gallery grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {/* Varied sizes for masonry effect */}
          <Skeleton className="col-span-2 aspect-[2/1] rounded-[10px]" />
          <Skeleton className="aspect-square rounded-[36px]" />
          <Skeleton className="aspect-square rounded-[10px]" />
          <Skeleton className="aspect-square rounded-none" />
          <Skeleton className="row-span-2 aspect-[1/2] rounded-[10px]" />
          <Skeleton className="col-span-2 aspect-[2/1] rounded-[10px]" />
          <Skeleton className="aspect-square rounded-[12px]" />
          <Skeleton className="aspect-square rounded-[12px]" />
          <Skeleton className="aspect-square rounded-[10px]" />
        </div>
      </div>
    </section>
  );
}

/**
 * Skeleton for the CTA section
 */
function CTASkeleton() {
  return (
    <section className="bg-[#151715] py-16 lg:py-20">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-[60px] xl:px-[100px]">
        <div className="text-center">
          <Skeleton
            height={40}
            width={400}
            variant="text"
            className="mx-auto mb-6"
          />
          <Skeleton
            height={48}
            width={200}
            className="mx-auto rounded-[52px]"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Full Product Page Skeleton
 */
export function ProductPageSkeleton() {
  return (
    <main className="bg-[#151715] min-h-screen">
      <ProductHeroSkeleton />
      <ProductDetailsSkeleton />
      <ProductGallerySkeleton />
      <CTASkeleton />
    </main>
  );
}

export { ProductHeroSkeleton, ProductDetailsSkeleton, ProductGallerySkeleton, CTASkeleton };
export default ProductPageSkeleton;
