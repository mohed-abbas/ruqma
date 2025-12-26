'use client';

import { useState, useCallback } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { Skeleton } from './Skeleton';

interface ImageWithSkeletonProps extends Omit<ImageProps, 'onLoad' | 'onLoadingComplete'> {
  /** Additional container classes */
  containerClassName?: string;
  /** Skeleton variant */
  skeletonVariant?: 'rectangle' | 'circle';
  /** Whether to show blur-to-sharp transition */
  blurTransition?: boolean;
}

/**
 * Image component with integrated skeleton loading state
 *
 * Features:
 * - Shows golden shimmer skeleton while loading
 * - Smooth blur-to-sharp transition on load
 * - Respects reduced-motion preferences
 * - Works with next/image optimization
 */
export function ImageWithSkeleton({
  src,
  alt,
  fill,
  width,
  height,
  className,
  containerClassName,
  skeletonVariant = 'rectangle',
  blurTransition = true,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
  }, []);

  // Container needs relative positioning for fill images
  const containerStyles = fill
    ? cn('relative', containerClassName)
    : containerClassName;

  return (
    <div className={containerStyles}>
      {/* Skeleton placeholder - hidden when loaded */}
      {!isLoaded && (
        <Skeleton
          className={cn(
            'absolute inset-0',
            skeletonVariant === 'circle' ? 'rounded-full' : ''
          )}
          variant={skeletonVariant}
          animate={true}
        />
      )}

      {/* Actual image with transition */}
      {!hasError && (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          className={cn(
            className,
            'transition-all duration-500 ease-out',
            blurTransition && !isLoaded && 'opacity-0 scale-[1.02]',
            blurTransition && isLoaded && 'opacity-100 scale-100',
            !blurTransition && !isLoaded && 'opacity-0',
            !blurTransition && isLoaded && 'opacity-100'
          )}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'bg-skeleton rounded-[10px]',
            'text-[var(--color-primary)]'
          )}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="opacity-40"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default ImageWithSkeleton;
