'use client';

import { Skeleton } from '../Skeleton';

/**
 * Skeleton for the Hero section
 * Matches the structure of the actual Hero component
 */
export function HeroSkeleton() {
  return (
    <section className="relative w-full h-screen bg-black flex items-center justify-center">
      <div className="text-center max-w-4xl px-4 flex flex-col items-center">
        {/* Title skeleton */}
        <Skeleton
          className="mb-6"
          width="80%"
          height="clamp(80px, 12vw, 120px)"
          variant="text"
        />

        {/* Subtitle skeleton */}
        <Skeleton
          className="mb-12"
          width="60%"
          height="clamp(40px, 6vw, 60px)"
          variant="text"
        />

        {/* CTA Button skeleton */}
        <Skeleton
          width={180}
          height={48}
          className="rounded-[52px]"
        />
      </div>
    </section>
  );
}

export default HeroSkeleton;
