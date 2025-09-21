/**
 * Testimonials Component Barrel Exports
 * Phase 1: Foundation & TypeScript Architecture
 *
 * This file provides clean imports for all testimonials-related components,
 * types, and utilities following the established project pattern.
 */

// Core Types and Interfaces
export type {
  Testimonial,
  TestimonialCardType,
  TestimonialWeight,
  PlacementAlgorithm,
  GridLayout,
  GridCell,
  ResponsiveConfig,
  AnimationConfig,
  AccessibilityConfig,
  TestimonialsGridConfig,
  SanityTestimonial,
  LayoutCalculation,
  TestimonialCardProps,
  TestimonialsGridProps,
  PerformanceMetrics,
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from './types';

// Import types for constants
import type {
  ResponsiveConfig,
  AnimationConfig,
  AccessibilityConfig,
  PlacementAlgorithm,
} from './types';

// Component exports - Phase 2: StarRating Component
export { default as StarRating } from './StarRating';
export type { StarRatingProps } from './StarRating';

// Component exports - Phase 3: Basic Card Components
export { default as TallTestimonial } from './TallTestimonial';
export { default as WideTestimonial } from './WideTestimonial';
export { default as CompactTestimonial } from './CompactTestimonial';
export type { TallTestimonialProps } from './TallTestimonial';
export type { WideTestimonialProps } from './WideTestimonial';
export type { CompactTestimonialProps } from './CompactTestimonial';

// Smart Card Router - Phase 3
export { default as TestimonialCard } from './TestimonialCard';

// Future component exports
// export { TestimonialsGrid } from './TestimonialsGrid';

// Utility exports will be added in future phases
// export { IntelligentPlacement } from './utils/IntelligentPlacement';
// export { calculateTestimonialWeight } from './utils/calculateWeight';
// export { validateTestimonialData } from './utils/validation';
// export { responsiveConfigDefaults } from './utils/defaults';

// Constants and default configurations
export const TESTIMONIAL_CARD_TYPES = ['tall', 'wide', 'compact'] as const;

export const DEFAULT_RESPONSIVE_CONFIG: ResponsiveConfig = {
  mobile: {
    columns: 1,
    maxWidth: '100%',
    cardSpacing: '1rem',
  },
  tablet: {
    columns: 2,
    maxWidth: '100%',
    cardSpacing: '1.5rem',
  },
  desktop: {
    columns: 4,
    maxWidth: '1200px',
    cardSpacing: '2rem',
  },
};

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  enabled: true,
  duration: 300,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  stagger: 100,
};

export const DEFAULT_ACCESSIBILITY_CONFIG: AccessibilityConfig = {
  announceChanges: true,
  keyboardNavigation: true,
  screenReaderOptimized: true,
  highContrastMode: false,
};

export const DEFAULT_PLACEMENT_ALGORITHM: PlacementAlgorithm = {
  balanceRows: true,
  preventClustering: true,
  maintainReadingFlow: true,
  prioritizeHighValue: true,
};

/**
 * Visual weight constants for different card types
 * Used by the intelligent placement algorithm
 */
export const VISUAL_WEIGHTS = {
  tall: 3,
  wide: 2.5,
  compact: 1,
} as const;

/**
 * Grid size configurations for different breakpoints
 */
export const GRID_CONFIGURATIONS = {
  mobile: {
    columns: 1,
    minCardHeight: 200,
    maxCardHeight: 400,
  },
  tablet: {
    columns: 2,
    minCardHeight: 220,
    maxCardHeight: 350,
  },
  desktop: {
    columns: 4,
    minCardHeight: 240,
    maxCardHeight: 430,
  },
} as const;

/**
 * Performance thresholds for monitoring
 */
export const PERFORMANCE_THRESHOLDS = {
  renderTime: 100, // milliseconds
  layoutCalculation: 50, // milliseconds
  maxTestimonials: 50, // recommended maximum
  complexityWarning: 0.8, // grid complexity score
} as const;