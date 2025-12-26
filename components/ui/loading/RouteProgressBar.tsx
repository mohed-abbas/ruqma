'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface RouteProgressBarProps {
  /** Color of the progress bar (defaults to primary gold) */
  color?: string;
  /** Height in pixels */
  height?: number;
  /** Show shadow under the bar */
  showShadow?: boolean;
  /** Z-index for layering */
  zIndex?: number;
  /** Minimum time to show the progress bar (ms) */
  minDisplayTime?: number;
}

/**
 * Premium route progress bar for page navigation
 *
 * Features:
 * - Thin gold line at viewport top
 * - Elegant easing animation
 * - Automatic route change detection
 * - Minimum display time for visibility
 * - Respects reduced-motion preferences
 */
export function RouteProgressBar({
  color = '#d4af37',
  height = 3,
  showShadow = true,
  zIndex = 9999,
  minDisplayTime = 400,
}: RouteProgressBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start loading animation
  const startLoading = useCallback(() => {
    startTimeRef.current = Date.now();
    setIsVisible(true);
    setIsLoading(true);
    setProgress(0);

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Simulate progress with elegant easing
    let currentProgress = 0;
    intervalRef.current = setInterval(() => {
      // Slow down as we approach completion
      const increment = (85 - currentProgress) * 0.08;
      currentProgress = Math.min(currentProgress + increment, 85);
      setProgress(currentProgress);

      if (currentProgress >= 84.9) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }, 50);
  }, []);

  // Complete loading animation
  const completeLoading = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Ensure minimum display time for visibility
    const elapsed = Date.now() - startTimeRef.current;
    const remainingTime = Math.max(0, minDisplayTime - elapsed);

    setTimeout(() => {
      setProgress(100);
      setIsLoading(false);

      // Hide after animation completes
      setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 200);
    }, remainingTime);
  }, [minDisplayTime]);

  // Track route changes
  useEffect(() => {
    // Complete any existing loading state when route changes
    if (isLoading) {
      completeLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Listen for navigation start (click on links)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor) {
        const href = anchor.getAttribute('href');

        // Check if it's an internal navigation
        if (href && href.startsWith('/') && !href.startsWith('//')) {
          // Don't trigger for same-page anchors or current page
          if (!href.startsWith('#') && href !== pathname) {
            startLoading();
          }
        }
      }
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, [pathname, startLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 pointer-events-none',
        'transition-opacity duration-200',
        isLoading ? 'opacity-100' : 'opacity-0'
      )}
      style={{ zIndex }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page loading progress"
    >
      {/* Progress bar */}
      <div
        className="origin-left transition-transform duration-150 ease-out motion-reduce:transition-none"
        style={{
          height: `${height}px`,
          backgroundColor: color,
          transform: `scaleX(${progress / 100})`,
          boxShadow: showShadow
            ? `0 0 12px ${color}, 0 0 6px ${color}, 0 2px 4px rgba(0,0,0,0.2)`
            : undefined,
        }}
      />
    </div>
  );
}

export default RouteProgressBar;
