'use client';

import { useState, useEffect, useTransition } from 'react';

/**
 * Client-side hook to ensure a minimum loading time for better UX
 *
 * This prevents the "flash" of loading state when data loads too quickly,
 * providing a consistent, polished loading experience.
 *
 * @param isReady - Whether the actual data/content is ready
 * @param minimumMs - Minimum time to show loading state (default: 400ms)
 * @returns boolean - Whether to show loading state (true = still loading)
 *
 * @example
 * const isLoading = useMinimumLoadingTime(dataReady, 400);
 * if (isLoading) return <Skeleton />;
 */
export function useMinimumLoadingTime(
  isReady: boolean,
  minimumMs: number = 400
): boolean {
  const [minimumTimePassed, setMinimumTimePassed] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setMinimumTimePassed(true);
      });
    }, minimumMs);

    return () => clearTimeout(timer);
  }, [minimumMs]);

  // Show loading if either:
  // 1. Minimum time hasn't passed yet, OR
  // 2. Data isn't ready yet
  return !minimumTimePassed || !isReady;
}

export default useMinimumLoadingTime;
