/**
 * Server-side utility to ensure minimum loading time for better UX
 *
 * This prevents the "flash" of loading state when data loads too quickly,
 * providing a consistent, polished loading experience.
 *
 * Use in Server Components with async/await pattern.
 *
 * @example
 * const data = await withMinimumLoadingTime(fetchData(), 400);
 */
export async function withMinimumLoadingTime<T>(
  promise: Promise<T>,
  minimumMs: number = 400
): Promise<T> {
  const [result] = await Promise.all([
    promise,
    new Promise(resolve => setTimeout(resolve, minimumMs)),
  ]);
  return result;
}

export default withMinimumLoadingTime;
