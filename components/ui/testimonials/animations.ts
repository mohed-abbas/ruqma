import type { Variants } from 'framer-motion';

/**
 * Shared animation variants for testimonials section
 * Follows the same patterns as ProductsClient.tsx for consistency
 */

// Easing curves matching the product animations
export const EASING = {
  expoOut: [0.16, 1, 0.3, 1] as const,
  smooth: [0.4, 0, 0.2, 1] as const,
};

// Duration constants
export const DURATION = {
  entrance: 0.5,
  stagger: 0.08,
  hover: 0.2,
  fast: 0.01, // For reduced motion
};

/**
 * Section header animation - fade up from below
 */
export const headerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.entrance,
      ease: EASING.expoOut,
    },
  },
};

/**
 * Container variants for staggered children
 */
export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: DURATION.stagger,
      delayChildren: 0.1,
    },
  },
};

/**
 * Card entrance animation - fade + slide up + subtle scale
 */
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATION.entrance,
      ease: EASING.expoOut,
    },
  },
};

/**
 * Hover animation for cards - lift with enhanced shadow
 */
export const cardHover = {
  y: -4,
  transition: {
    duration: DURATION.hover,
    ease: EASING.smooth,
  },
};

/**
 * Get reduced motion variants (instant animations)
 */
export function getReducedMotionVariants(baseVariants: Variants): Variants {
  const reduced: Variants = {};

  for (const [key, value] of Object.entries(baseVariants)) {
    if (typeof value === 'object' && value !== null) {
      reduced[key] = {
        ...value,
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: DURATION.fast },
      };
    }
  }

  return reduced;
}
