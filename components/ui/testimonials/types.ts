/**
 * TypeScript interfaces for the intelligent testimonials bento grid system
 * Phase 1: Foundation & TypeScript Architecture
 */

export type TestimonialCardType = 'tall' | 'wide' | 'compact';

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  rating: number; // 1-5 stars
  text: string;
  avatar: string;
  cardType: TestimonialCardType;
  priority: number; // 1-10 business priority for intelligent placement
}

/**
 * Enhanced types for intelligent placement algorithm
 */
export interface TestimonialWeight {
  priority: number;        // 1-10 (business priority)
  contentLength: number;   // Auto-calculated character count
  visualWeight: number;    // tall=3, wide=2.5, compact=1
  readabilityScore: number; // Content complexity for reading flow
}

export interface PlacementAlgorithm {
  balanceRows: boolean;           // Distribute content across rows evenly
  preventClustering: boolean;     // Avoid grouping similar card types
  maintainReadingFlow: boolean;   // Optimize for left-to-right, top-to-bottom reading
  prioritizeHighValue: boolean;   // Place high-priority testimonials prominently
}

export interface GridLayout {
  rows: number;
  columns: number;
  cells: GridCell[];
  totalVisualWeight: number;
  balanceScore: number; // 0-1, higher is better balanced
}

export interface GridCell {
  id: string;
  testimonialId: string;
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colEnd: number;
  cardType: TestimonialCardType;
  visualWeight: number;
  position: {
    x: number;
    y: number;
  };
}

/**
 * Responsive breakpoint configuration
 */
export interface ResponsiveConfig {
  mobile: {
    columns: number;
    maxWidth: string;
    cardSpacing: string;
  };
  tablet: {
    columns: number;
    maxWidth: string;
    cardSpacing: string;
  };
  desktop: {
    columns: number;
    maxWidth: string;
    cardSpacing: string;
  };
}

/**
 * Animation and transition settings
 */
export interface AnimationConfig {
  enabled: boolean;
  duration: number; // in milliseconds
  easing: string;
  stagger: number; // delay between card animations
}

/**
 * Accessibility configuration
 */
export interface AccessibilityConfig {
  announceChanges: boolean;
  keyboardNavigation: boolean;
  screenReaderOptimized: boolean;
  highContrastMode: boolean;
}

/**
 * Complete testimonials grid configuration
 */
export interface TestimonialsGridConfig {
  testimonials: Testimonial[];
  placement: PlacementAlgorithm;
  responsive: ResponsiveConfig;
  animation: AnimationConfig;
  accessibility: AccessibilityConfig;
  className?: string;
}

/**
 * Future-ready Sanity CMS integration types
 */
export interface SanityTestimonial extends Testimonial {
  _id?: string;
  _type?: 'testimonial';
  _createdAt?: string;
  _updatedAt?: string;
  featured?: boolean;           // Algorithm priority boost
  seasonality?: string[];       // Holiday-specific display
  productCategory?: string[];   // Filtering capability
  autoCardType?: boolean;       // Let algorithm choose type
  tags?: string[];             // Content categorization
  publishedAt?: string;        // Content scheduling
}

/**
 * Layout calculation results for intelligent placement
 */
export interface LayoutCalculation {
  success: boolean;
  layout: GridLayout;
  metrics: {
    balanceScore: number;
    readabilityScore: number;
    visualHarmony: number;
    performanceScore: number;
  };
  warnings: string[];
  recommendations: string[];
}

/**
 * Component props interfaces
 */
export interface TestimonialCardProps {
  testimonial: Testimonial;
  cardType: TestimonialCardType;
  className?: string;
  priority?: 'high' | 'medium' | 'low';
  animated?: boolean;
  onClick?: (testimonial: Testimonial) => void;
}

export interface TestimonialsGridProps {
  testimonials: Testimonial[];
  config?: Partial<TestimonialsGridConfig>;
  className?: string;
  onLayoutChange?: (layout: GridLayout) => void;
  onTestimonialClick?: (testimonial: Testimonial) => void;
}

/**
 * Performance monitoring types
 */
export interface PerformanceMetrics {
  renderTime: number;
  layoutCalculationTime: number;
  totalTestimonials: number;
  gridComplexity: number;
  memoryUsage?: number;
}

/**
 * Error handling and validation types
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'critical' | 'error' | 'warning';
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}