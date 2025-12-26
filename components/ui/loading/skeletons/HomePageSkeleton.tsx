'use client';

import { HeroSkeleton } from './HeroSkeleton';
import { ProductsSkeleton } from './ProductsSkeleton';
import { TestimonialsSkeleton } from './TestimonialsSkeleton';

/**
 * Full Home Page Skeleton
 * Matches the structure of the actual home page
 */
export function HomePageSkeleton() {
  return (
    <main>
      <HeroSkeleton />
      <ProductsSkeleton />
      <TestimonialsSkeleton />
    </main>
  );
}

export default HomePageSkeleton;
