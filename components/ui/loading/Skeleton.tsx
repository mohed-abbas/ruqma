'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  /** Shape variant */
  variant?: 'rectangle' | 'circle' | 'text';
  /** Width - accepts any CSS width value */
  width?: string | number;
  /** Height - accepts any CSS height value */
  height?: string | number;
  /** Whether to show the shimmer animation */
  animate?: boolean;
}

/**
 * Premium skeleton loader with golden shimmer effect
 *
 * Features:
 * - Gold-tinted gradient matching Ruqma brand
 * - Smooth shimmer animation
 * - Respects reduced-motion preferences
 * - Multiple shape variants
 */
export function Skeleton({
  className,
  variant = 'rectangle',
  width,
  height,
  animate = true,
}: SkeletonProps) {
  const variantStyles = {
    rectangle: 'rounded-[10px]',
    circle: 'rounded-full',
    text: 'rounded-[4px]',
  };

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'bg-[rgba(212,175,55,0.1)]',
        variantStyles[variant],
        className
      )}
      style={style}
      role="status"
      aria-label="Loading..."
    >
      {/* Shimmer overlay */}
      {animate && (
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.2) 20%, rgba(212,175,55,0.35) 50%, rgba(212,175,55,0.2) 80%, transparent 100%)',
          }}
        />
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Skeleton for product card images
 */
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-white overflow-hidden relative rounded-[10px] shadow-[0px_4px_7.2px_0px_rgba(0,0,0,0.25)]',
        'w-full max-w-[542px] mx-auto lg:mx-0',
        'h-auto min-h-[400px] sm:min-h-[480px] lg:min-h-[552px] lg:h-[552px]',
        className
      )}
    >
      {/* Image placeholder */}
      <div className="p-4 sm:p-5 lg:absolute lg:left-1/2 lg:top-[26px] lg:-translate-x-1/2 lg:p-0 w-full lg:w-[492px]">
        <Skeleton
          className="aspect-[492/266] w-full"
          variant="rectangle"
        />

        {/* Title placeholder */}
        <div className="mt-4 space-y-2">
          <Skeleton height={40} width="75%" variant="text" />
        </div>

        {/* Description placeholder */}
        <div className="mt-4 space-y-2">
          <Skeleton height={20} width="100%" variant="text" />
          <Skeleton height={20} width="90%" variant="text" />
          <Skeleton height={20} width="60%" variant="text" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for gallery images
 */
export function GalleryImageSkeleton({
  className,
  cols = 1,
  rows = 1,
}: {
  className?: string;
  cols?: number;
  rows?: number;
}) {
  const colSpanClass = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
  }[cols] || 'col-span-1';

  const rowSpanClass = {
    1: 'row-span-1',
    2: 'row-span-2',
  }[rows] || 'row-span-1';

  return (
    <Skeleton
      className={cn(
        colSpanClass,
        rowSpanClass,
        'rounded-[10px]',
        className
      )}
    />
  );
}

export default Skeleton;
